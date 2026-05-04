import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import type { CourseType, ScheduleSessionItem } from "@/types/crm";
import { COURSE_STAGE_MAP } from "@/types/crm";
import { readStorage, writeStorage } from "@/services/storage";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || typeof window === "undefined") return null;
  return createBrowserClient<Database>(url, key);
}

export type LessonDuration = 60 | 90 | 120;

export interface TeacherCourseRate {
  id: string;
  course: CourseType;
  durationMinutes: LessonDuration;
  priceEgp: number;
  isActive: boolean;
  notes: string | null;
  updatedAt: string | null;
}

export interface TeacherFinanceConfig {
  teacherId: string;
  rates: TeacherCourseRate[];
  notes: string | null;
  updatedAt: string | null;
}

export interface TeacherFinanceLineItem {
  sessionId: string;
  className: string;
  course: CourseType;
  durationMinutes: LessonDuration;
  payout: number;
  matched: boolean;
}

export interface TeacherFinanceSummary {
  linkedSessions: number;
  weeklyEstimated: number;
  monthlyEstimated: number;
  averagePerSession: number;
  lines: TeacherFinanceLineItem[];
}

const LOCAL_KEY = "skidy.crm.teacher-finance";
const PRICED_COURSES: CourseType[] = [
  "scratch",
  "app_inventor",
  "robotics_basic",
  "ai_intro",
  "python",
  "godot",
  "robotics_iot",
  "fastapi",
  "html_css",
  "javascript_tailwind",
  "front_end",
  "ai_ml",
  "data_science",
  "back_end",
  "raspberry_pi",
];
const DURATIONS: LessonDuration[] = [60, 90, 120];

type LegacyDbRow = Database["public"]["Tables"]["teacher_finance_config"]["Row"];
type RateDbRow = Database["public"]["Tables"]["teacher_course_rates"]["Row"];

function defaultConfig(teacherId: string): TeacherFinanceConfig {
  return {
    teacherId,
    rates: [],
    notes: null,
    updatedAt: null,
  };
}

function safe(value: number | null | undefined, fallback: number): number {
  return Number.isFinite(value) ? Number(value) : fallback;
}

function safeMoney(value: number | null | undefined, fallback: number): number {
  return Math.max(0, safe(value, fallback));
}

function normalizeDuration(value: number | null | undefined): LessonDuration {
  if (!Number.isFinite(value)) return 60;
  if (Number(value) <= 60) return 60;
  if (Number(value) <= 90) return 90;
  return 120;
}

function resolveDurationBucket(minutes: number): LessonDuration {
  if (minutes <= 60) return 60;
  if (minutes <= 90) return 90;
  return 120;
}

function isPricedCourse(value: string | null | undefined): value is CourseType {
  return PRICED_COURSES.includes(value as CourseType);
}

function uniqueRateKey(course: CourseType, durationMinutes: LessonDuration): string {
  return course + "__" + String(durationMinutes);
}

function sortRates(rows: TeacherCourseRate[]): TeacherCourseRate[] {
  return [...rows].sort(
    (a, b) =>
      PRICED_COURSES.indexOf(a.course) - PRICED_COURSES.indexOf(b.course) ||
      a.durationMinutes - b.durationMinutes,
  );
}

function readLocal(teacherId: string): TeacherFinanceConfig | null {
  const all = readStorage<Record<string, TeacherFinanceConfig>>(LOCAL_KEY, {});
  return all[teacherId] ?? null;
}

function writeLocal(config: TeacherFinanceConfig): void {
  const all = readStorage<Record<string, TeacherFinanceConfig>>(LOCAL_KEY, {});
  all[config.teacherId] = config;
  writeStorage(LOCAL_KEY, all);
}

function mapRateRow(row: RateDbRow): TeacherCourseRate {
  return {
    id: row.id,
    course: isPricedCourse(row.course_type) ? row.course_type : "scratch",
    durationMinutes: normalizeDuration(row.duration_minutes),
    priceEgp: safeMoney(row.price_egp, 0),
    isActive: row.is_active ?? true,
    notes: row.notes ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

function getLegacyBaseRate(durationMinutes: LessonDuration, row: LegacyDbRow): number {
  if (durationMinutes === 60) return safeMoney(row.session_rate_60, 120);
  if (durationMinutes === 90) return safeMoney(row.session_rate_90, 180);
  return safeMoney(row.session_rate_120, 240);
}

function getLegacyStageAdjustment(course: CourseType, row: LegacyDbRow): number {
  const stage = COURSE_STAGE_MAP[course] ?? "foundation";

  if (stage === "foundation") return safeMoney(row.adj_scratch, 0);
  if (stage === "practical") return safeMoney(row.adj_python, 20);
  if (stage === "web_apps") return safeMoney(row.adj_web, 30);
  return safeMoney(row.adj_ai, 40);
}

function buildLegacyRates(teacherId: string, row: LegacyDbRow): TeacherCourseRate[] {
  return sortRates(
    PRICED_COURSES.flatMap((course) =>
      DURATIONS.map((durationMinutes) => ({
        id: "legacy-" + teacherId + "-" + course + "-" + String(durationMinutes),
        course,
        durationMinutes,
        priceEgp: getLegacyBaseRate(durationMinutes, row) + getLegacyStageAdjustment(course, row),
        isActive: true,
        notes: null,
        updatedAt: row.updated_at ?? null,
      })),
    ),
  );
}

function normalizeRateInput(
  rows: Array<Pick<TeacherCourseRate, "course" | "durationMinutes" | "priceEgp"> & Partial<TeacherCourseRate>>,
): TeacherCourseRate[] {
  const seen = new Set<string>();

  return sortRates(
    rows.map((row) => {
      const course = isPricedCourse(row.course) ? row.course : "scratch";
      const durationMinutes = normalizeDuration(row.durationMinutes);
      const priceEgp = safeMoney(row.priceEgp, 0);
      const key = uniqueRateKey(course, durationMinutes);

      if (seen.has(key)) {
        throw new Error("Duplicate teacher rate detected for the same course and lesson duration.");
      }

      seen.add(key);

      return {
        id: row.id ?? crypto.randomUUID(),
        course,
        durationMinutes,
        priceEgp,
        isActive: row.isActive ?? true,
        notes: row.notes ?? null,
        updatedAt: row.updatedAt ?? null,
      } satisfies TeacherCourseRate;
    }),
  );
}

export async function getTeacherFinanceConfig(teacherId: string): Promise<TeacherFinanceConfig> {
  const base = defaultConfig(teacherId);
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data: rateRows, error: rateError } = await supabase
        .from("teacher_course_rates")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("course_type", { ascending: true })
        .order("duration_minutes", { ascending: true });

      if (!rateError && rateRows && rateRows.length > 0) {
        const config: TeacherFinanceConfig = {
          teacherId,
          rates: sortRates(rateRows.map(mapRateRow).filter((row) => row.isActive)),
          notes: null,
          updatedAt: rateRows[0]?.updated_at ?? null,
        };
        writeLocal(config);
        return config;
      }

      const { data: legacyRow, error: legacyError } = await supabase
        .from("teacher_finance_config")
        .select("*")
        .eq("teacher_id", teacherId)
        .maybeSingle();

      if (!legacyError && legacyRow) {
        const config: TeacherFinanceConfig = {
          teacherId,
          rates: buildLegacyRates(teacherId, legacyRow),
          notes: legacyRow.notes ?? null,
          updatedAt: legacyRow.updated_at ?? null,
        };
        writeLocal(config);
        return config;
      }
    } catch (error) {
      console.warn("[teacher-finance] Supabase read failed", error);
    }
  }

  const cached = readLocal(teacherId);
  if (cached) {
    return {
      ...base,
      rates: sortRates(
        normalizeRateInput(
          cached.rates.map((row) => ({
            id: row.id,
            course: row.course,
            durationMinutes: row.durationMinutes,
            priceEgp: row.priceEgp,
            isActive: row.isActive,
            notes: row.notes,
            updatedAt: row.updatedAt,
          })),
        ),
      ),
      notes: cached.notes ?? null,
      updatedAt: cached.updatedAt ?? null,
    };
  }

  return base;
}

export async function saveTeacherFinanceConfig(input: {
  teacherId: string;
  rates: Array<Pick<TeacherCourseRate, "course" | "durationMinutes" | "priceEgp"> & Partial<TeacherCourseRate>>;
  notes?: string | null;
}): Promise<TeacherFinanceConfig> {
  const normalizedRates = normalizeRateInput(input.rates);

  if (normalizedRates.length === 0) {
    throw new Error("At least one teacher course rate is required.");
  }

  if (normalizedRates.some((row) => row.priceEgp <= 0)) {
    throw new Error("Every teacher course rate must be greater than zero.");
  }

  const config: TeacherFinanceConfig = {
    teacherId: input.teacherId,
    rates: normalizedRates,
    notes: input.notes?.trim() || null,
    updatedAt: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { error: deleteError } = await supabase
      .from("teacher_course_rates")
      .delete()
      .eq("teacher_id", input.teacherId);

    if (deleteError) {
      console.error("[teacher-finance] delete old rates failed", deleteError);
      throw new Error(deleteError.message || "Failed to replace existing teacher rates");
    }

    const rowsToInsert: Database["public"]["Tables"]["teacher_course_rates"]["Insert"][] = config.rates.map((row) => ({
      teacher_id: input.teacherId,
      course_type: row.course,
      duration_minutes: row.durationMinutes,
      price_egp: row.priceEgp,
      is_active: row.isActive,
      notes: row.notes,
    }));

    const { error: insertError } = await supabase.from("teacher_course_rates").insert(rowsToInsert);

    if (insertError) {
      console.error("[teacher-finance] save rates failed", insertError);
      throw new Error(insertError.message || "Failed to save teacher course rates");
    }
  }

  writeLocal(config);
  return config;
}

function toMinutes(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  if ([sh, sm, eh, em].some((value) => !Number.isFinite(value))) return 60;

  const start = sh * 60 + sm;
  let end = eh * 60 + em;

  if (end <= start) end += 1440;

  return Math.max(30, end - start);
}

export function computeTeacherFinanceSummary(
  sessions: ScheduleSessionItem[],
  config: TeacherFinanceConfig,
): TeacherFinanceSummary {
  void config;

  const lines = sessions.map((session) => {
    const durationMinutes = resolveDurationBucket(
      session.teacherSessionDurationMinutes ?? toMinutes(session.startTime, session.endTime),
    );
    const manualRate = session.teacherSessionRate;
    const hasManualRate = typeof manualRate === "number" && Number.isFinite(manualRate) && manualRate > 0;

    return {
      sessionId: session.id,
      className: session.className,
      course: session.course,
      durationMinutes,
      payout: hasManualRate ? manualRate : 0,
      matched: hasManualRate,
    } satisfies TeacherFinanceLineItem;
  });

  const weeklyEstimated = lines.reduce((sum, line) => sum + line.payout, 0);

  return {
    linkedSessions: lines.length,
    weeklyEstimated,
    monthlyEstimated: Math.round(weeklyEstimated * 4.33),
    averagePerSession: lines.length > 0 ? Math.round(weeklyEstimated / lines.length) : 0,
    lines,
  };
}
