const fs = require("fs");
const path = require("path");

// ============================================================
// 1) common.types.ts — add CourseFamily, CourseTrack, keep CourseType
// ============================================================
const commonPath = path.join("src", "types", "common.types.ts");
let common = fs.readFileSync(commonPath, "utf8");

const courseFamilyBlock = `
/** Course family — 4 business-level categories for finance/reporting */
export type CourseFamily = "junior" | "intermediate" | "advanced" | "specialized";

/** Course track — maps each course to its family */
export const COURSE_TRACK: Record<CourseType, CourseFamily> = {
  scratch: "junior",
  app_inventor: "junior",
  robotics_basic: "junior",
  ai_intro: "junior",
  python: "intermediate",
  godot: "intermediate",
  robotics_iot: "intermediate",
  fastapi: "intermediate",
  html_css: "advanced",
  javascript_tailwind: "advanced",
  front_end: "advanced",
  ai_ml: "specialized",
  data_science: "specialized",
  back_end: "specialized",
  raspberry_pi: "junior",
  web: "advanced",
  ai: "specialized",
};

/** Labels for CourseFamily */
export const COURSE_FAMILY_LABELS: Record<CourseFamily, { ar: string; en: string }> = {
  junior: { ar: "\u0645\u0628\u062a\u062f\u0626", en: "Junior" },
  intermediate: { ar: "\u0645\u062a\u0648\u0633\u0637", en: "Intermediate" },
  advanced: { ar: "\u0645\u062a\u0642\u062f\u0645", en: "Advanced" },
  specialized: { ar: "\u0645\u062a\u062e\u0635\u0635", en: "Specialized" },
};
`;

// Insert after the CourseType definition
const courseTypeEnd = common.indexOf("/** Generic API response wrapper */");
if (courseTypeEnd === -1) {
  console.error("Could not find insertion point in common.types.ts");
  process.exit(1);
}
common = common.slice(0, courseTypeEnd) + courseFamilyBlock + "\n" + common.slice(courseTypeEnd);
fs.writeFileSync(commonPath, common, "utf8");
console.log("OK common.types.ts");

// ============================================================
// 2) crm.ts — re-export CourseFamily, COURSE_TRACK, COURSE_FAMILY_LABELS
// ============================================================
const crmPath = path.join("src", "types", "crm.ts");
let crm = fs.readFileSync(crmPath, "utf8");

// Update the re-export line to include new types
const oldReexport = `export type { CourseType, StudentStatus, EmploymentType, PaymentStatus, PaymentMethod, LeadSource, LeadStage, LeadTemperature, LossReason, Priority, FollowUpType, CommChannel, UserRole } from "@/types/common.types";`;
const newReexport = `export type { CourseType, CourseFamily, StudentStatus, EmploymentType, PaymentStatus, PaymentMethod, LeadSource, LeadStage, LeadTemperature, LossReason, Priority, FollowUpType, CommChannel, UserRole } from "@/types/common.types";
export { COURSE_TRACK, COURSE_FAMILY_LABELS } from "@/types/common.types";`;

if (!crm.includes(oldReexport)) {
  console.error("Could not find re-export line in crm.ts");
  process.exit(1);
}
crm = crm.replace(oldReexport, newReexport);
fs.writeFileSync(crmPath, crm, "utf8");
console.log("OK crm.ts");

// ============================================================
// 3) teacher-finance.service.ts — use CourseFamily instead of per-course
// ============================================================
const finSvcPath = path.join("src", "services", "teacher-finance.service.ts");
const finSvc = `import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import type { CourseType, CourseFamily, ScheduleSessionItem } from "@/types/crm";
import { COURSE_TRACK } from "@/types/crm";
import { readStorage, writeStorage } from "@/services/storage";

/* ------------------------------------------------------------------ */
/*  Supabase client                                                    */
/* ------------------------------------------------------------------ */
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || typeof window === "undefined") return null;
  return createBrowserClient<Database>(url, key);
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export interface TeacherFinanceConfig {
  teacherId: string;
  sessionRate60: number;
  sessionRate90: number;
  sessionRate120: number;
  familyAdjustments: Record<CourseFamily, number>;
  notes: string | null;
  updatedAt: string | null;
}

export interface TeacherFinanceLineItem {
  sessionId: string;
  className: string;
  course: CourseType;
  family: CourseFamily;
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

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */
const LOCAL_KEY = "skidy.crm.teacher-finance";

const DEFAULT_FAMILY_ADJ: Record<CourseFamily, number> = {
  junior: 0,
  intermediate: 20,
  advanced: 30,
  specialized: 40,
};

function defaultConfig(teacherId: string): TeacherFinanceConfig {
  return {
    teacherId,
    sessionRate60: 120,
    sessionRate90: 180,
    sessionRate120: 240,
    familyAdjustments: { ...DEFAULT_FAMILY_ADJ },
    notes: null,
    updatedAt: null,
  };
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
    familyAdjustments: {
      junior: safe(row.adj_scratch, 0),
      intermediate: safe(row.adj_python, 20),
      advanced: safe(row.adj_web, 30),
      specialized: safe(row.adj_ai, 40),
    },
    notes: row.notes ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

/* localStorage cache */
function readLocal(teacherId: string): TeacherFinanceConfig | null {
  const all = readStorage<Record<string, TeacherFinanceConfig>>(LOCAL_KEY, {});
  return all[teacherId] ?? null;
}

function writeLocal(config: TeacherFinanceConfig): void {
  const all = readStorage<Record<string, TeacherFinanceConfig>>(LOCAL_KEY, {});
  all[config.teacherId] = config;
  writeStorage(LOCAL_KEY, all);
}

/* ------------------------------------------------------------------ */
/*  GET config                                                         */
/* ------------------------------------------------------------------ */
export async function getTeacherFinanceConfig(
  teacherId: string,
): Promise<TeacherFinanceConfig> {
  const base = defaultConfig(teacherId);
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("teacher_finance_config")
        .select("*")
        .eq("teacher_id", teacherId)
        .maybeSingle();

      if (!error && data) {
        const config = rowToConfig(teacherId, data);
        writeLocal(config);
        return config;
      }
    } catch (err) {
      console.warn("[teacher-finance] Supabase read failed, using cache", err);
    }
  }

  const cached = readLocal(teacherId);
  if (cached) {
    return {
      ...base,
      sessionRate60: safe(cached.sessionRate60, base.sessionRate60),
      sessionRate90: safe(cached.sessionRate90, base.sessionRate90),
      sessionRate120: safe(cached.sessionRate120, base.sessionRate120),
      familyAdjustments: {
        junior: safe(cached.familyAdjustments?.junior, base.familyAdjustments.junior),
        intermediate: safe(cached.familyAdjustments?.intermediate, base.familyAdjustments.intermediate),
        advanced: safe(cached.familyAdjustments?.advanced, base.familyAdjustments.advanced),
        specialized: safe(cached.familyAdjustments?.specialized, base.familyAdjustments.specialized),
      },
      notes: cached.notes ?? null,
      updatedAt: cached.updatedAt ?? null,
    };
  }

  return base;
}

/* ------------------------------------------------------------------ */
/*  SAVE config                                                        */
/* ------------------------------------------------------------------ */
export async function saveTeacherFinanceConfig(input: {
  teacherId: string;
  sessionRate60: number;
  sessionRate90: number;
  sessionRate120: number;
  familyAdjustments: Record<CourseFamily, number>;
  notes?: string | null;
}): Promise<TeacherFinanceConfig> {
  const config: TeacherFinanceConfig = {
    teacherId: input.teacherId,
    sessionRate60: safe(input.sessionRate60, 120),
    sessionRate90: safe(input.sessionRate90, 180),
    sessionRate120: safe(input.sessionRate120, 240),
    familyAdjustments: {
      junior: safe(input.familyAdjustments.junior, 0),
      intermediate: safe(input.familyAdjustments.intermediate, 20),
      advanced: safe(input.familyAdjustments.advanced, 30),
      specialized: safe(input.familyAdjustments.specialized, 40),
    },
    notes: input.notes?.trim() || null,
    updatedAt: new Date().toISOString(),
  };

  writeLocal(config);

  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase
      .from("teacher_finance_config")
      .upsert(
        {
          teacher_id: input.teacherId,
          session_rate_60: config.sessionRate60,
          session_rate_90: config.sessionRate90,
          session_rate_120: config.sessionRate120,
          adj_scratch: config.familyAdjustments.junior,
          adj_python: config.familyAdjustments.intermediate,
          adj_web: config.familyAdjustments.advanced,
          adj_ai: config.familyAdjustments.specialized,
          notes: config.notes,
        },
        { onConflict: "teacher_id" },
      );

    if (error) {
      console.error("[teacher-finance] Supabase save failed", error);
      throw new Error(error.message);
    }
  }

  return config;
}

/* ------------------------------------------------------------------ */
/*  Compute summary                                                    */
/* ------------------------------------------------------------------ */
function toMinutes(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  if ([sh, sm, eh, em].some((v) => !Number.isFinite(v))) return 60;
  const start = sh * 60 + sm;
  let end = eh * 60 + em;
  if (end <= start) end += 1440;
  return Math.max(30, end - start);
}

function getBaseRate(minutes: number, config: TeacherFinanceConfig): number {
  if (minutes <= 60) return config.sessionRate60;
  if (minutes <= 90) return config.sessionRate90;
  if (minutes <= 120) return config.sessionRate120;
  const extra = minutes - 120;
  return config.sessionRate120 + Math.ceil(extra / 30) * (config.sessionRate60 / 2);
}

export function computeTeacherFinanceSummary(
  sessions: ScheduleSessionItem[],
  config: TeacherFinanceConfig,
): TeacherFinanceSummary {
  const lines = sessions.map((s) => {
    const minutes = toMinutes(s.startTime, s.endTime);
    const family = COURSE_TRACK[s.course] ?? "junior";
    const payout = getBaseRate(minutes, config) + (config.familyAdjustments[family] ?? 0);
    return { sessionId: s.id, className: s.className, course: s.course, family, minutes, payout };
  });

  const weeklyEstimated = lines.reduce((sum, l) => sum + l.payout, 0);
  const monthlyEstimated = Math.round(weeklyEstimated * 4.33);

  return {
    linkedSessions: lines.length,
    weeklyEstimated,
    monthlyEstimated,
    averagePerSession: lines.length > 0 ? Math.round(weeklyEstimated / lines.length) : 0,
    lines,
  };
}
`;
fs.writeFileSync(finSvcPath, finSvc, "utf8");
console.log("OK teacher-finance.service.ts");

// ============================================================
// 4) teachers/[id]/page.tsx — replace 15 track fields with 4 family fields
// ============================================================
const detailPath = path.join("src", "app", "(dashboard)", "teachers", "[id]", "page.tsx");
let detail = fs.readFileSync(detailPath, "utf8");

// 4a) Fix imports — add CourseFamily, COURSE_FAMILY_LABELS; remove TRACKS const
detail = detail.replace(
  `import type { CourseType, TeacherDetails, TeacherListItem } from "@/types/crm";`,
  `import type { CourseType, CourseFamily, TeacherDetails, TeacherListItem } from "@/types/crm";
import { COURSE_FAMILY_LABELS } from "@/types/crm";`
);

// Remove old TRACKS const
detail = detail.replace(
  /const TRACKS: CourseType\[$$ = $$.*?$$;\n/s,
  `const FAMILIES: CourseFamily[] = ["junior", "intermediate", "advanced", "specialized"];\n`
);

// 4b) Replace trackAdjustments state with familyAdjustments state
detail = detail.replace(
  /const $$trackAdjustments, setTrackAdjustments$$ = useState<Record<CourseType, string>>\(\{[^}]+\}\);/s,
  `const [familyAdjustments, setFamilyAdjustments] = useState<Record<CourseFamily, string>>({ junior: "0", intermediate: "20", advanced: "30", specialized: "40" });`
);

// 4c) Replace load() track assignments
detail = detail.replace(
  /setTrackAdjustments\(\{[^}]+\}\);/s,
  `setFamilyAdjustments({
        junior: String(finance.familyAdjustments.junior ?? 0),
        intermediate: String(finance.familyAdjustments.intermediate ?? 20),
        advanced: String(finance.familyAdjustments.advanced ?? 30),
        specialized: String(finance.familyAdjustments.specialized ?? 40),
      });`
);

// 4d) Replace financeSummary computation — trackAdjustments -> familyAdjustments
detail = detail.replace(
  /trackAdjustments: \{\s*\.\.\.Object\.fromEntries\(Object\.entries\(trackAdjustments\)\.map\(\($$k, v$$\) => $$k, Number\(v\) \|\| 0$$\)\) as Record<CourseType, number>,\s*\},/g,
  `familyAdjustments: {
        junior: Number(familyAdjustments.junior) || 0,
        intermediate: Number(familyAdjustments.intermediate) || 0,
        advanced: Number(familyAdjustments.advanced) || 0,
        specialized: Number(familyAdjustments.specialized) || 0,
      },`
);

// 4e) Fix useMemo deps
detail = detail.replace(
  /$$teacher, sessionRate60, sessionRate90, sessionRate120, trackAdjustments, financeNotes$$/,
  `[teacher, sessionRate60, sessionRate90, sessionRate120, familyAdjustments, financeNotes]`
);

// 4f) Replace handleSaveFinance trackAdjustments
detail = detail.replace(
  /trackAdjustments: \{\s*\.\.\.Object\.fromEntries\(Object\.entries\(trackAdjustments\)\.map\(\($$k, v$$\) => $$k, Number\(v\) \|\| 0$$\)\) as Record<CourseType, number>,\s*\},/g,
  `familyAdjustments: {
          junior: Number(familyAdjustments.junior) || 0,
          intermediate: Number(familyAdjustments.intermediate) || 0,
          advanced: Number(familyAdjustments.advanced) || 0,
          specialized: Number(familyAdjustments.specialized) || 0,
        },`
);

// 4g) Replace the track grid in JSX with family grid
const oldTrackGrid = `<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {TRACKS.map((track) => (
              <MoneyField key={track} label={formatCourseLabel(track, locale)} value={trackAdjustments[track]} onChange={(value) => setTrackAdjustments((prev) => ({ ...prev, [track]: value }))} />
            ))}
          </div>`;
const newFamilyGrid = `<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {FAMILIES.map((fam) => (
              <MoneyField key={fam} label={isAr ? COURSE_FAMILY_LABELS[fam].ar : COURSE_FAMILY_LABELS[fam].en} value={familyAdjustments[fam]} onChange={(value) => setFamilyAdjustments((prev) => ({ ...prev, [fam]: value }))} />
            ))}
          </div>`;
detail = detail.replace(oldTrackGrid, newFamilyGrid);

fs.writeFileSync(detailPath, detail, "utf8");
console.log("OK teachers/[id]/page.tsx");

console.log("\\nAll Batch 2 files written successfully.");
