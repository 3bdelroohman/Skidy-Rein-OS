import { createBrowserClient } from "@supabase/ssr";
import { t } from "@/lib/locale";
import { isBrowser } from "@/services/storage";
import type { Database } from "@/types/database.types";
import type { ActionCenterData, ActionCenterItem, ActionCenterMetric } from "@/types/crm";

interface StudentQualityRow {
  id: string;
  full_name: string | null;
  lead_id: string | null;
  current_class_id: string | null;
}

interface LeadQualityRow {
  id: string;
  stage: string | null;
  child_name: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  suggested_course: string | null;
  created_at: string | null;
}

interface ClassEnrollmentQualityRow {
  student_id: string | null;
  class_id: string | null;
  is_active: boolean | null;
}

interface ClassQualityRow {
  id: string;
}

type DataQualitySlice = Pick<ActionCenterData, "metrics" | "critical" | "mediumPriority" | "informational">;

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || !isBrowser()) return null;

  return createBrowserClient<Database>(url, key);
}

function emptyDataQualitySlice(): DataQualitySlice {
  return {
    metrics: [],
    critical: [],
    mediumPriority: [],
    informational: [],
  };
}

function makeMetric(input: {
  label: string;
  value: string;
  tone: ActionCenterMetric["tone"];
}): ActionCenterMetric {
  return {
    label: input.label,
    value: input.value,
    tone: input.tone,
  };
}

function makeIssue(input: {
  id: string;
  title: string;
  description: string;
  href: string;
  priority: ActionCenterItem["priority"];
  meta?: string;
}): ActionCenterItem {
  return {
    id: input.id,
    title: input.title,
    description: input.description,
    href: input.href,
    category: "data_quality",
    priority: input.priority,
    meta: input.meta,
  };
}

export async function getDataQualityActionCenterData(locale: "ar" | "en"): Promise<DataQualitySlice> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return emptyDataQualitySlice();
  }

  const [studentsRes, leadsRes, enrollmentsRes, classesRes] = await Promise.all([
    supabase
      .from("students")
      .select("id, full_name, lead_id, current_class_id"),
    supabase
      .from("leads")
      .select("id, stage, child_name, parent_name, parent_phone, suggested_course, created_at"),
    supabase
      .from("class_enrollments")
      .select("student_id, class_id, is_active"),
    supabase
      .from("classes")
      .select("id"),
  ]);

  if (studentsRes.error || leadsRes.error || enrollmentsRes.error || classesRes.error) {
    console.error("[data-quality] failed to load action center data", {
      studentsError: studentsRes.error,
      leadsError: leadsRes.error,
      enrollmentsError: enrollmentsRes.error,
      classesError: classesRes.error,
    });

    return {
      metrics: [
        makeMetric({
          label: t(locale, "فحص جودة البيانات", "Data quality check"),
          value: t(locale, "خطأ", "Error"),
          tone: "danger",
        }),
      ],
      critical: [
        makeIssue({
          id: "data-quality-load-error",
          title: t(locale, "تعذر فحص جودة البيانات", "Could not check data quality"),
          description: t(
            locale,
            "تعذر تحميل بيانات الطلاب والعملاء المحتملين للفحص. راجع الاتصال أو صلاحيات قاعدة البيانات.",
            "Could not load students and leads for data-quality checks. Review database connection or permissions.",
          ),
          href: "/action-center",
          priority: "critical",
        }),
      ],
      mediumPriority: [],
      informational: [],
    };
  }

  const students = (studentsRes.data ?? []) as StudentQualityRow[];
  const leads = (leadsRes.data ?? []) as LeadQualityRow[];
  const enrollments = (enrollmentsRes.data ?? []) as ClassEnrollmentQualityRow[];
  const classes = (classesRes.data ?? []) as ClassQualityRow[];

  const leadIds = new Set(leads.map((lead) => lead.id));
  const classIds = new Set(classes.map((item) => item.id));
  const activeEnrollmentKeys = new Set(
    enrollments
      .filter((item) => item.is_active && item.student_id && item.class_id)
      .map((item) => `${item.student_id}:${item.class_id}`),
  );

  const studentsWithLeadId = students.filter((student) => student.lead_id);
  const leadCountByStudentLink = new Map<string, number>();

  for (const student of studentsWithLeadId) {
    if (!student.lead_id) continue;
    leadCountByStudentLink.set(student.lead_id, (leadCountByStudentLink.get(student.lead_id) ?? 0) + 1);
  }

  const duplicateStudentsPerLead = [...leadCountByStudentLink.values()].filter((count) => count > 1).length;

  const orphanLeadLinks = studentsWithLeadId.filter((student) => {
    return student.lead_id ? !leadIds.has(student.lead_id) : false;
  }).length;

  const brokenClassEnrollments = students.filter((student) => {
    if (!student.current_class_id) return false;
    if (!classIds.has(student.current_class_id)) return false;
    return !activeEnrollmentKeys.has(`${student.id}:${student.current_class_id}`);
  }).length;

  const wonLeadsWithoutStudent = leads
    .filter((lead) => lead.stage === "won")
    .filter((lead) => !leadCountByStudentLink.has(lead.id))
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));

  const issues: ActionCenterItem[] = [];

  if (wonLeadsWithoutStudent.length > 0) {
    const lead = wonLeadsWithoutStudent[0];

    issues.push(
      makeIssue({
        id: "dq-won-leads-without-student",
        title: t(locale, "عملاء فائزون يحتاجون ربط طالب", "Won leads need student linking"),
        description: t(
          locale,
          `يوجد ${wonLeadsWithoutStudent.length} عميل فائز بدون طالب مربوط عبر lead_id. راجع أول حالة يدويًا قبل أي تحويل إضافي.`,
          `${wonLeadsWithoutStudent.length} won lead(s) have no student linked through lead_id. Review the first case manually before any further conversion.`,
        ),
        href: `/leads/${lead.id}`,
        priority: wonLeadsWithoutStudent.length > 1 ? "high" : "medium",
        meta: lead.suggested_course ? `${lead.suggested_course}` : undefined,
      }),
    );
  }

  if (duplicateStudentsPerLead > 0) {
    issues.push(
      makeIssue({
        id: "dq-duplicate-students-per-lead",
        title: t(locale, "تكرار طلاب لنفس العميل", "Duplicate students per lead"),
        description: t(
          locale,
          `يوجد ${duplicateStudentsPerLead} lead مربوط بأكثر من طالب. يحتاج مراجعة قبل التقارير والتحويلات.`,
          `${duplicateStudentsPerLead} lead(s) are linked to more than one student. Review before reporting or conversion work.`,
        ),
        href: "/students",
        priority: "critical",
      }),
    );
  }

  if (orphanLeadLinks > 0) {
    issues.push(
      makeIssue({
        id: "dq-orphan-lead-links",
        title: t(locale, "طلاب مربوطون بعملاء غير موجودين", "Students linked to missing leads"),
        description: t(
          locale,
          `يوجد ${orphanLeadLinks} طالب لديه lead_id لا يشير إلى عميل موجود.`,
          `${orphanLeadLinks} student(s) have lead_id values that do not point to existing leads.`,
        ),
        href: "/students",
        priority: "critical",
      }),
    );
  }

  if (brokenClassEnrollments > 0) {
    issues.push(
      makeIssue({
        id: "dq-broken-class-enrollments",
        title: t(locale, "طلاب بجروب حالي بدون تسجيل نشط", "Students have current class without active enrollment"),
        description: t(
          locale,
          `يوجد ${brokenClassEnrollments} طالب لديه current_class_id بدون class_enrollment نشط.`,
          `${brokenClassEnrollments} student(s) have current_class_id without an active class_enrollment.`,
        ),
        href: "/students",
        priority: "high",
      }),
    );
  }

  const critical = issues.filter((item) => item.priority === "critical");
  const mediumPriority = issues.filter((item) => item.priority === "high" || item.priority === "medium");
  const informational = issues.filter((item) => item.priority === "info");

  return {
    metrics: [
      makeMetric({
        label: t(locale, "طلاب مربوطون بعملاء", "Students linked to leads"),
        value: String(studentsWithLeadId.length),
        tone: "success",
      }),
      makeMetric({
        label: t(locale, "Won leads للمراجعة", "Won leads to review"),
        value: String(wonLeadsWithoutStudent.length),
        tone: wonLeadsWithoutStudent.length > 0 ? "warning" : "success",
      }),
      makeMetric({
        label: t(locale, "تكرار Lead/Student", "Lead/student duplicates"),
        value: String(duplicateStudentsPerLead),
        tone: duplicateStudentsPerLead > 0 ? "danger" : "success",
      }),
      makeMetric({
        label: t(locale, "كسر ربط الجروبات", "Broken enrollments"),
        value: String(brokenClassEnrollments),
        tone: brokenClassEnrollments > 0 ? "danger" : "success",
      }),
    ],
    critical,
    mediumPriority,
    informational,
  };
}