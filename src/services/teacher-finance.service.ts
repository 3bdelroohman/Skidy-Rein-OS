import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import type { CourseType, CourseStage, ScheduleSessionItem } from "@/types/crm";
import { COURSE_STAGE_MAP } from "@/types/crm";
import { readStorage, writeStorage } from "@/services/storage";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || typeof window === "undefined") return null;
  return createBrowserClient<Database>(url, key);
}

export interface TeacherFinanceConfig {
  teacherId: string;
  sessionRate60: number;
  sessionRate90: number;
  sessionRate120: number;
  stageAdjustments: Record<CourseStage, number>;
  notes: string | null;
  updatedAt: string | null;
}

export interface TeacherFinanceLineItem {
  sessionId: string;
  className: string;
  course: CourseType;
  stage: CourseStage;
  minutes: number;
  payout: number;
}

export interface TeacherFinanceSummary {
  linkedSessions: number;
  weeklyEstimated: number;
  monthlyEstimated: number;
  averagePerSession: number;
  lines: TeacherFinanceLineItem[];
}

const LOCAL_KEY = "skidy.crm.teacher-finance";

const DEFAULT_STAGE_ADJ: Record<CourseStage, number> = { foundation: 0, practical: 20, web_apps: 30, ai_data: 40 };

function defaultConfig(teacherId: string): TeacherFinanceConfig {
  return { teacherId, sessionRate60: 120, sessionRate90: 180, sessionRate120: 240, stageAdjustments: { ...DEFAULT_STAGE_ADJ }, notes: null, updatedAt: null };
}

function safe(value: number | null | undefined, fallback: number): number {
  return Number.isFinite(value) ? Number(value) : fallback;
}

type DbRow = Database["public"]["Tables"]["teacher_finance_config"]["Row"];

function rowToConfig(teacherId: string, row: DbRow): TeacherFinanceConfig {
  return {
    teacherId,
    sessionRate60: safe(row.session_rate_60, 120),
    sessionRate90: safe(row.session_rate_90, 180),
    sessionRate120: safe(row.session_rate_120, 240),
    stageAdjustments: { foundation: safe(row.adj_scratch, 0), practical: safe(row.adj_python, 20), web_apps: safe(row.adj_web, 30), ai_data: safe(row.adj_ai, 40) },
    notes: row.notes ?? null,
    updatedAt: row.updated_at ?? null,
  };
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

export async function getTeacherFinanceConfig(teacherId: string): Promise<TeacherFinanceConfig> {
  const base = defaultConfig(teacherId);
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("teacher_finance_config").select("*").eq("teacher_id", teacherId).maybeSingle();
      if (!error && data) { const config = rowToConfig(teacherId, data); writeLocal(config); return config; }
    } catch (err) { console.warn("[teacher-finance] Supabase read failed", err); }
  }
  const cached = readLocal(teacherId);
  if (cached) {
    return { ...base, sessionRate60: safe(cached.sessionRate60, base.sessionRate60), sessionRate90: safe(cached.sessionRate90, base.sessionRate90), sessionRate120: safe(cached.sessionRate120, base.sessionRate120),
      stageAdjustments: { foundation: safe(cached.stageAdjustments?.foundation, 0), practical: safe(cached.stageAdjustments?.practical, 20), web_apps: safe(cached.stageAdjustments?.web_apps, 30), ai_data: safe(cached.stageAdjustments?.ai_data, 40) },
      notes: cached.notes ?? null, updatedAt: cached.updatedAt ?? null };
  }
  return base;
}

export async function saveTeacherFinanceConfig(input: {
  teacherId: string; sessionRate60: number; sessionRate90: number; sessionRate120: number;
  stageAdjustments: Record<CourseStage, number>; notes?: string | null;
}): Promise<TeacherFinanceConfig> {
  const config: TeacherFinanceConfig = {
    teacherId: input.teacherId, sessionRate60: safe(input.sessionRate60, 120), sessionRate90: safe(input.sessionRate90, 180), sessionRate120: safe(input.sessionRate120, 240),
    stageAdjustments: { foundation: safe(input.stageAdjustments.foundation, 0), practical: safe(input.stageAdjustments.practical, 20), web_apps: safe(input.stageAdjustments.web_apps, 30), ai_data: safe(input.stageAdjustments.ai_data, 40) },
    notes: input.notes?.trim() || null, updatedAt: new Date().toISOString(),
  };
  writeLocal(config);
  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("teacher_finance_config").upsert({
      teacher_id: input.teacherId, session_rate_60: config.sessionRate60, session_rate_90: config.sessionRate90, session_rate_120: config.sessionRate120,
      adj_scratch: config.stageAdjustments.foundation, adj_python: config.stageAdjustments.practical, adj_web: config.stageAdjustments.web_apps, adj_ai: config.stageAdjustments.ai_data, notes: config.notes,
    }, { onConflict: "teacher_id" });
    if (error) { console.error("[teacher-finance] save failed", error); throw new Error(error.message); }
  }
  return config;
}

function toMinutes(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  if ([sh, sm, eh, em].some((v) => !Number.isFinite(v))) return 60;
  const start = sh * 60 + sm; let end = eh * 60 + em;
  if (end <= start) end += 1440;
  return Math.max(30, end - start);
}

function getBaseRate(minutes: number, config: TeacherFinanceConfig): number {
  if (minutes <= 60) return config.sessionRate60;
  if (minutes <= 90) return config.sessionRate90;
  if (minutes <= 120) return config.sessionRate120;
  return config.sessionRate120 + Math.ceil((minutes - 120) / 30) * (config.sessionRate60 / 2);
}

export function computeTeacherFinanceSummary(sessions: ScheduleSessionItem[], config: TeacherFinanceConfig): TeacherFinanceSummary {
  const lines = sessions.map((s) => {
    const minutes = toMinutes(s.startTime, s.endTime);
    const stage = COURSE_STAGE_MAP[s.course] ?? "foundation";
    const payout = getBaseRate(minutes, config) + (config.stageAdjustments[stage] ?? 0);
    return { sessionId: s.id, className: s.className, course: s.course, stage, minutes, payout };
  });
  const weeklyEstimated = lines.reduce((sum, l) => sum + l.payout, 0);
  return { linkedSessions: lines.length, weeklyEstimated, monthlyEstimated: Math.round(weeklyEstimated * 4.33), averagePerSession: lines.length > 0 ? Math.round(weeklyEstimated / lines.length) : 0, lines };
}
