"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, CalendarDays, Calculator, FileText, Layers3, Mail, Phone, PlusCircle, Save, Trash2, Users } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useCurrentUser } from "@/providers/user-provider";
import { canAccessTeachersForUser, canManageTeacherFinanceForUser, canManageTeachersForUser } from "@/config/roles";
import { formatCourseLabel, formatCurrency, formatDate } from "@/lib/formatters";
import { getEmploymentTypeLabel, t } from "@/lib/locale";
import { getTeacherDetails } from "@/services/relations.service";
import { getTeacherEvaluation, saveTeacherEvaluation, computeAverageRating, type EvaluationAxes } from "@/services/teacher-evaluations.service";
import { computeTeacherFinanceSummary, getTeacherFinanceConfig, saveTeacherFinanceConfig, type LessonDuration, type TeacherCourseRate } from "@/services/teacher-finance.service";
import { reassignTeacherRelations } from "@/services/teacher-reassignment.service";
import { deleteTeacher, listTeachers } from "@/services/teachers.service";
import { updateTeacherSpecialization } from "@/services/teacher-specialization.service";
import { buildStudentReportSnapshot } from "@/services/student-report.service";
import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import type { CourseType, TeacherDetails, TeacherListItem } from "@/types/crm";
import { COURSE_STAGE_LABELS, COURSE_STAGE_MAP } from "@/types/crm";

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

const STAGE_ORDER = ["foundation", "practical", "web_apps", "ai_data"] as const;

const COURSE_OPTIONS_BY_STAGE = STAGE_ORDER.map((stage) => ({
  stage,
  courses: PRICED_COURSES.filter((course) => COURSE_STAGE_MAP[course] === stage),
}));

function sortRateRows(rows: TeacherCourseRate[]): TeacherCourseRate[] {
  return [...rows].sort(
    (a, b) =>
      PRICED_COURSES.indexOf(a.course) - PRICED_COURSES.indexOf(b.course) ||
      a.durationMinutes - b.durationMinutes,
  );
}

function createRateRow(
  course: CourseType = "scratch",
  durationMinutes: LessonDuration = 60,
  priceEgp = 120,
): TeacherCourseRate {
  return {
    id: crypto.randomUUID(),
    course,
    durationMinutes,
    priceEgp,
    isActive: true,
    notes: null,
    updatedAt: null,
  };
}

export default function TeacherDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const user = useCurrentUser();
  const canAccess = canAccessTeachersForUser(user);
  const canManage = canManageTeachersForUser(user);
  const canManageFinance = canManageTeacherFinanceForUser(user);

  const [teacher, setTeacher] = useState<TeacherDetails | null>(null);
  const [alternatives, setAlternatives] = useState<TeacherListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [replacementId, setReplacementId] = useState("");
  const [rating, setRating] = useState("3");
  const [notes, setNotes] = useState("");
  const [rateRows, setRateRows] = useState<TeacherCourseRate[]>([]);
  const [axes, setAxes] = useState<EvaluationAxes>({
    punctuality: null,
    materialPrep: null,
    communication: null,
    studentEngagement: null,
    reportReadiness: null,
  });
  const [draftCourse, setDraftCourse] = useState<CourseType>("scratch");
  const [draftDuration, setDraftDuration] = useState<LessonDuration>(60);
  const [draftPrice, setDraftPrice] = useState("120");
  const [specializationOpen, setSpecializationOpen] = useState(false);
  const [specializationDraft, setSpecializationDraft] = useState<CourseType[]>([]);

  async function load() {
    setLoading(true);

    const [data, teachers] = await Promise.all([getTeacherDetails(id), listTeachers()]);
    setTeacher(data);
    setAlternatives(teachers.filter((item) => item.id !== id));

    if (data) {
      const evaluation = getTeacherEvaluation(id);
      const finance = await getTeacherFinanceConfig(id);

      setRating(evaluation?.rating ? String(evaluation.rating) : "3");
      if (evaluation?.axes) setAxes(evaluation.axes);
      setNotes(evaluation?.notes ?? "");
      setRateRows(finance.rates.length > 0 ? sortRateRows(finance.rates) : [createRateRow()]);
      setSpecializationDraft(data.specialization);
      setReplacementId((prev) => prev || teachers.find((item) => item.id !== id)?.id || "");
    }

    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;

    if (canAccess) {
      (async () => {
        if (mounted) await load();
      })();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, canAccess]);

  const financeSummary = useMemo(() => {
    if (!teacher) return null;

    return computeTeacherFinanceSummary(teacher.linkedSessions, {
      teacherId: teacher.id,
      rates: sortRateRows(
        rateRows.map((row) => ({
          ...row,
          priceEgp: Number(row.priceEgp) || 0,
        })),
      ),
      notes: null,
      updatedAt: null,
    });
  }, [teacher, rateRows]);

  const missingRateCount = useMemo(
    () => financeSummary?.lines.filter((line) => !line.matched).length ?? 0,
    [financeSummary],
  );

  const reportSummary = useMemo(() => {
    if (!teacher) return { ready: 0, needsAttention: 0 };
    const snapshots = teacher.linkedStudents.map((student) => buildStudentReportSnapshot(student));
    return {
      ready: snapshots.filter((snapshot) => snapshot.ready).length,
      needsAttention: snapshots.filter((snapshot) => !snapshot.ready).length,
    };
  }, [teacher]);

  const linkedGroups = useMemo(() => {
    if (!teacher) return [];

    const seen = new Set<string>();

    return teacher.linkedSessions.flatMap((session) => {
      const groupId =
        typeof (session as { classId?: unknown }).classId === "string"
          ? (((session as { classId?: string | null }).classId ?? "").trim() || null)
          : null;

      if (!groupId || seen.has(groupId)) return [];

      seen.add(groupId);

      return [{
        id: groupId,
        name: session.className,
        course: session.course,
      }];
    });
  }, [teacher]);

  const uncoveredActiveCourses = useMemo(() => {
    if (!teacher) return [];

    return teacher.activeCourses.filter((course) => !specializationDraft.includes(course));
  }, [specializationDraft, teacher]);

  function toggleSpecializationCourse(course: CourseType) {
    setSpecializationDraft((prev) =>
      prev.includes(course)
        ? prev.filter((item) => item !== course)
        : [...prev, course],
    );
  }

  async function handleSaveSpecialization() {
    if (!teacher) return;

    if (specializationDraft.length === 0) {
      toast.error(t(locale, "اختر تخصصًا واحدًا على الأقل", "Choose at least one specialization"));
      return;
    }

    if (uncoveredActiveCourses.length > 0) {
      const confirmed = window.confirm(
        t(
          locale,
          "توجد كورسات نشطة خارج التخصصات المختارة. هل تريد الحفظ؟",
          "Some active courses are outside the selected specializations. Save anyway?",
        ),
      );

      if (!confirmed) return;
    }

    setBusy("specialization");

    try {
      await updateTeacherSpecialization(teacher.id, specializationDraft);
      toast.success(t(locale, "تم تحديث تخصصات المدرس", "Teacher specializations updated"));
      await load();
      setSpecializationOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر تحديث التخصصات", "Could not update specializations"));
    } finally {
      setBusy(null);
    }
  }

  function handleAddRateRow() {
    const price = Number(draftPrice);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error(t(locale, "أدخل سعرًا صحيحًا أكبر من صفر", "Enter a valid rate greater than zero"));
      return;
    }

    const duplicate = rateRows.some(
      (row) => row.course === draftCourse && row.durationMinutes === draftDuration,
    );

    if (duplicate) {
      toast.error(
        t(
          locale,
          "هناك سعر مسجل بالفعل لنفس الكورس ومدة الحصة",
          "A rate already exists for this course and lesson duration",
        ),
      );
      return;
    }

    setRateRows((prev) => sortRateRows([...prev, createRateRow(draftCourse, draftDuration, price)]));
  }

  function updateRateRow(rowId: string, patch: Partial<TeacherCourseRate>) {
    setRateRows((prev) =>
      sortRateRows(prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row))),
    );
  }

  function removeRateRow(rowId: string) {
    setRateRows((prev) => prev.filter((row) => row.id !== rowId));
  }

  async function handleSaveEvaluation() {
    if (!teacher) return;

    setBusy("evaluation");
    try {
      saveTeacherEvaluation({
        teacherId: teacher.id,
        rating: Number(rating) || null,
        notes,
        axes,
      });
      toast.success(t(locale, "تم حفظ تقييم المدرس", "Teacher evaluation saved"));
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر حفظ التقييم", "Could not save evaluation"));
    } finally {
      setBusy(null);
    }
  }

  async function handleSaveFinance() {
    if (!teacher) return;

    const normalizedRows = rateRows.map((row) => ({
      ...row,
      priceEgp: Number(row.priceEgp) || 0,
    }));

    if (normalizedRows.length === 0) {
      toast.error(
        t(
          locale,
          "أضف سعرًا واحدًا على الأقل قبل الحفظ",
          "Add at least one course rate before saving",
        ),
      );
      return;
    }

    if (normalizedRows.some((row) => row.priceEgp <= 0)) {
      toast.error(
        t(
          locale,
          "كل سعر يجب أن يكون أكبر من صفر",
          "Every rate must be greater than zero",
        ),
      );
      return;
    }

    setBusy("finance");
    try {
      await saveTeacherFinanceConfig({
        teacherId: teacher.id,
        rates: normalizedRows,
      });

      toast.success(t(locale, "تم حفظ أسعار الكورسات للمدرس", "Teacher course rates saved"));
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر حفظ أسعار الكورسات", "Could not save teacher course rates"));
    } finally {
      setBusy(null);
    }
  }

  async function handleReassign() {
    if (!teacher || !replacementId) return;

    setBusy("reassign");
    try {
      const result = await reassignTeacherRelations(teacher.id, replacementId);
      toast.success(
        t(
          locale,
          "تم نقل " + result.sessionsUpdated + " حصص و " + result.classesUpdated + " كلاسات",
          "Moved " + result.sessionsUpdated + " sessions and " + result.classesUpdated + " classes",
        ),
      );
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر نقل الحصص", "Could not reassign sessions"));
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    if (!teacher) return;

    if (teacher.linkedSessions.length > 0) {
      toast.error(t(locale, "انقل الحصص أولاً قبل حذف المدرس", "Reassign sessions before deleting"));
      return;
    }

    const confirmed = window.confirm(
      t(locale, "هل تريد حذف هذا المدرس نهائياً؟", "Delete this teacher permanently?"),
    );
    if (!confirmed) return;

    setBusy("delete");
    try {
      const deleted = await deleteTeacher(teacher.id);
      if (!deleted) throw new Error("Delete failed");

      toast.success(t(locale, "تم حذف المدرس", "Teacher deleted"));
      router.push("/teachers");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر حذف المدرس", "Could not delete teacher"));
    } finally {
      setBusy(null);
    }
  }

  const hasSessions = teacher !== null && teacher.linkedSessions.length > 0;

  if (!canAccess) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="هذا الملف خاص بمسؤول تشغيل المدرسين"
        titleEn="This profile is restricted to teacher operations"
        descriptionAr="ملف المدرس والإجراءات المرتبطة به متاحة فقط للمستخدم المسؤول عن تشغيل المدرسين."
        descriptionEn="Teacher profiles and related actions are restricted to the assigned teacher operations owner."
        actionHref="/"
        actionLabelAr="العودة إلى لوحة التحكم"
        actionLabelEn="Back to dashboard"
      />
    );
  }

  if (loading) {
    return (
      <LoadingState
        titleAr="جارٍ تحميل بيانات المدرس"
        titleEn="Loading teacher details"
        descriptionAr="يتم الآن تجهيز ملف المدرس وربط الجلسات والطلاب."
        descriptionEn="Preparing the teacher profile with linked sessions and students."
      />
    );
  }

  if (!teacher) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="المدرس غير موجود"
        titleEn="Teacher not found"
        descriptionAr="قد يكون هذا الملف محذوفاً أو الرابط غير صحيح."
        descriptionEn="This teacher profile may have been removed or the link is incorrect."
        actionHref="/teachers"
        actionLabelAr="العودة إلى المدرسين"
        actionLabelEn="Back to teachers"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/teachers" className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
            {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{teacher.fullName}</h1>
            <p className="text-sm text-muted-foreground">{getEmploymentTypeLabel(teacher.employment, locale)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={"/teachers/" + teacher.id + "/edit"} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            {t(locale, "تعديل البيانات", "Edit data")}
          </Link>
          {canManage ? (
            <Link href={"/schedule/new?teacherId=" + teacher.id} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
              <PlusCircle size={16} />
              {t(locale, "إضافة حصة", "Add session")}
            </Link>
          ) : null}
          {canManageFinance ? (
            <Link href="/teachers/finance" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
              <Calculator size={16} />
              {t(locale, "حسابات المدرسين", "Teacher accounts")}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Metric label={t(locale, "الكلاسات", "Classes")} value={teacher.classesCount.toString()} />
        <Metric label={t(locale, "الطلاب", "Students")} value={teacher.studentsCount.toString()} />
        <Metric label={t(locale, "تقارير جاهزة", "Reports ready")} value={String(reportSummary.ready)} />
        <Metric label={t(locale, "يحتاج متابعة", "Need follow-up")} value={String(reportSummary.needsAttention)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <BookOpen size={20} className="text-brand-600" />
            {t(locale, "التخصصات والدورات", "Specializations & courses")}
          </h2>
          <div className="mb-6 flex flex-wrap gap-2">
            {teacher.specialization.map((course) => (
              <span key={course} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {formatCourseLabel(course, locale)}
              </span>
            ))}
          </div>

          {/* BATCH13_SPECIALIZATION_EDITOR */}
          {canManage ? (
            <div className="mb-6 rounded-2xl border border-dashed border-border bg-muted/20 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-foreground">
                    {t(locale, "تعديل تخصصات المدرس", "Edit teacher specializations")}
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    {t(
                      locale,
                      "تغيير التخصص لا ينقل الجروبات أو الحصص تلقائيًا.",
                      "Changing specializations does not move groups or sessions automatically.",
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSpecializationDraft(teacher.specialization);
                    setSpecializationOpen((value) => !value);
                  }}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  {specializationOpen
                    ? t(locale, "إغلاق", "Close")
                    : t(locale, "تعديل التخصصات", "Edit specializations")}
                </button>
              </div>

              {specializationOpen ? (
                <div className="mt-4 space-y-4">
                  {uncoveredActiveCourses.length > 0 ? (
                    <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                      {t(
                        locale,
                        "تنبيه: توجد كورسات نشطة خارج التخصصات المختارة.",
                        "Warning: some active courses are outside the selected specializations.",
                      )}
                    </p>
                  ) : null}

                  <div className="space-y-4">
                    {COURSE_OPTIONS_BY_STAGE.map((group) => (
                      <div key={group.stage} className="rounded-xl border border-border bg-background p-3">
                        <p className="mb-3 text-xs font-bold text-muted-foreground">
                          {COURSE_STAGE_LABELS[group.stage][locale]}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {group.courses.map((course) => {
                            const checked = specializationDraft.includes(course);
                            const active = teacher.activeCourses.includes(course);

                            return (
                              <button
                                key={course}
                                type="button"
                                onClick={() => toggleSpecializationCourse(course)}
                                className={
                                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors " +
                                  (checked
                                    ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300"
                                    : "border-border bg-card text-muted-foreground hover:bg-muted")
                                }
                                title={
                                  active
                                    ? t(locale, "كورس نشط مع هذا المدرس", "Active course for this teacher")
                                    : undefined
                                }
                              >
                                {formatCourseLabel(course, locale)}
                                {active ? " •" : ""}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleSaveSpecialization}
                      disabled={busy === "specialization" || specializationDraft.length === 0}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {busy === "specialization"
                        ? t(locale, "جارٍ الحفظ...", "Saving...")
                        : t(locale, "حفظ التخصصات", "Save specializations")}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSpecializationDraft(teacher.specialization);
                        setSpecializationOpen(false);
                      }}
                      className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      {t(locale, "إلغاء", "Cancel")}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-bold text-foreground">{t(locale, "الدورات المفعلة", "Active courses")}</h3>
              <div className="flex flex-wrap gap-2">
                {teacher.activeCourses.length === 0 ? (
                  <span className="text-sm text-muted-foreground">{t(locale, "لا توجد كلاسات بعد", "No classes yet")}</span>
                ) : (
                  teacher.activeCourses.map((course) => (
                    <span key={course} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                      {formatCourseLabel(course, locale)}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Info icon={Phone} label={t(locale, "الهاتف", "Phone")} value={teacher.phone} href={"tel:" + teacher.phone} ltr />
              <Info icon={Mail} label={t(locale, "البريد", "Email")} value={teacher.email ?? t(locale, "غير متوفر", "N/A")} href={teacher.email ? "mailto:" + teacher.email : undefined} />
              <Info icon={BookOpen} label={t(locale, "الحالة", "Status")} value={teacher.isActive ? t(locale, "نشط", "Active") : t(locale, "غير نشط", "Inactive")} />
            </div>
          </div>
        </div>

        {canManage ? (
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground">
              <FileText size={18} className="text-brand-600" />
              {t(locale, "التقييم التشغيلي", "Operational Evaluation")}
            </h3>

            {/* Average rating display */}
            {(() => {
              const avg = computeAverageRating(axes);
              return avg !== null ? (
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-brand-50/60 px-4 py-3 dark:bg-brand-950/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-lg font-bold text-white">
                    {avg}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-700 dark:text-brand-300">{t(locale, "المتوسط العام", "Overall Average")}</p>
                    <p className="text-xs text-muted-foreground">{t(locale, "من 5 — محسوب من المحاور أدناه", "out of 5 — computed from axes below")}</p>
                  </div>
                </div>
              ) : null;
            })()}

            <div className="space-y-2.5">
              <AxisRating label={t(locale, "الالتزام بالمواعيد", "Punctuality")} value={axes.punctuality} onChange={(v) => setAxes((prev) => ({ ...prev, punctuality: v }))} />
              <AxisRating label={t(locale, "تجهيز المواد", "Material Preparation")} value={axes.materialPrep} onChange={(v) => setAxes((prev) => ({ ...prev, materialPrep: v }))} />
              <AxisRating label={t(locale, "التواصل", "Communication")} value={axes.communication} onChange={(v) => setAxes((prev) => ({ ...prev, communication: v }))} />
              <AxisRating label={t(locale, "تفاعل الطلاب", "Student Engagement")} value={axes.studentEngagement} onChange={(v) => setAxes((prev) => ({ ...prev, studentEngagement: v }))} />
              <AxisRating label={t(locale, "جاهزية التقارير", "Report Readiness")} value={axes.reportReadiness} onChange={(v) => setAxes((prev) => ({ ...prev, reportReadiness: v }))} />
            </div>

            <div className="mt-3">
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "ملاحظات", "Notes")}</label>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring" />
            </div>

            {teacher.evaluationUpdatedAt ? (
              <p className="mt-2 text-xs text-muted-foreground">
                {t(locale, "آخر تحديث", "Last updated")}: {formatDate(teacher.evaluationUpdatedAt, locale)}
              </p>
            ) : null}

            <button onClick={handleSaveEvaluation} disabled={busy !== null} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50">
              <Save size={16} />
              {t(locale, "حفظ التقييم", "Save evaluation")}
            </button>
          </div>
        ) : null}
      </div>

      {canManageFinance ? (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-foreground">
            <Calculator size={18} className="text-brand-600" />
            {t(locale, "تسعير المدرس حسب الكورس ومدة الدرس", "Teacher pricing by course and lesson duration")}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {t(
              locale,
              "أضف سعرًا محددًا لكل تركيبة من مدة الحصة واسم الكورس الحقيقي.",
              "Add an explicit price for each real combination of course and lesson duration.",
            )}
          </p>

          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-dashed border-border bg-muted/20 p-4 lg:grid-cols-[1fr_180px_160px_auto]">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">{t(locale, "الكورس", "Course")}</label>
              <select value={draftCourse} onChange={(event) => setDraftCourse(event.target.value as CourseType)} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                {COURSE_OPTIONS_BY_STAGE.map((group) => (
                  <optgroup key={group.stage} label={isAr ? COURSE_STAGE_LABELS[group.stage].ar : COURSE_STAGE_LABELS[group.stage].en}>
                    {group.courses.map((course) => (
                      <option key={course} value={course}>
                        {formatCourseLabel(course, locale)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">{t(locale, "مدة الحصة", "Lesson duration")}</label>
              <select value={String(draftDuration)} onChange={(event) => setDraftDuration(Number(event.target.value) as LessonDuration)} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                <option value="60">60 min</option>
                <option value="90">90 min</option>
                <option value="120">120 min</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">{t(locale, "السعر بالجنيه", "Price (EGP)")}</label>
              <input inputMode="numeric" value={draftPrice} onChange={(event) => setDraftPrice(event.target.value)} className="w-full rounded-xl border border-input bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring" />
            </div>

            <div className="flex items-end">
              <button type="button" onClick={handleAddRateRow} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
                <PlusCircle size={16} />
                {t(locale, "إضافة سعر", "Add rate")}
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {rateRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                {t(locale, "لم يتم إضافة أي أسعار بعد", "No course rates have been added yet")}
              </div>
            ) : (
              rateRows.map((row) => (
                <div key={row.id} className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-background p-4 lg:grid-cols-[1fr_180px_160px_auto]">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">{t(locale, "الكورس", "Course")}</label>
                    <select value={row.course} onChange={(event) => updateRateRow(row.id, { course: event.target.value as CourseType })} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                      {COURSE_OPTIONS_BY_STAGE.map((group) => (
                        <optgroup key={group.stage} label={isAr ? COURSE_STAGE_LABELS[group.stage].ar : COURSE_STAGE_LABELS[group.stage].en}>
                          {group.courses.map((course) => (
                            <option key={course} value={course}>
                              {formatCourseLabel(course, locale)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">{t(locale, "مدة الحصة", "Lesson duration")}</label>
                    <select value={String(row.durationMinutes)} onChange={(event) => updateRateRow(row.id, { durationMinutes: Number(event.target.value) as LessonDuration })} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                      <option value="60">60 min</option>
                      <option value="90">90 min</option>
                      <option value="120">120 min</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">{t(locale, "السعر بالجنيه", "Price (EGP)")}</label>
                    <input inputMode="numeric" value={String(row.priceEgp)} onChange={(event) => updateRateRow(row.id, { priceEgp: Number(event.target.value) || 0 })} className="w-full rounded-xl border border-input bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring" />
                  </div>

                  <div className="flex items-end">
                    <button type="button" onClick={() => removeRateRow(row.id)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-danger-300 bg-danger-50 px-4 py-2.5 text-sm font-semibold text-danger-700 transition-colors hover:bg-danger-100 dark:border-danger-800 dark:bg-danger-950/30 dark:text-danger-300">
                      <Trash2 size={16} />
                      {t(locale, "حذف", "Remove")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button onClick={handleSaveFinance} disabled={busy !== null} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50">
            <Save size={16} />
            {t(locale, "حفظ أسعار المدرس", "Save teacher rates")}
          </button>
        </div>
      ) : null}

      {financeSummary ? (
        <div className="rounded-2xl border border-border bg-muted/30 p-5">
          <h3 className="mb-3 text-sm font-bold text-muted-foreground">{t(locale, "الملخص المالي المحسوب", "Computed Finance Summary")}</h3>

          {missingRateCount > 0 ? (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
              {t(
                locale,
                "هناك " + missingRateCount + " حصة بدون سعر مطابق. راجع سعر الكورس ومدة الدرس.",
                missingRateCount + " sessions do not have a matching course rate yet. Review course and duration pricing.",
              )}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Metric label={t(locale, "أسبوعي", "Weekly")} value={formatCurrency(financeSummary.weeklyEstimated, locale)} compact />
            <Metric label={t(locale, "شهري", "Monthly")} value={formatCurrency(financeSummary.monthlyEstimated, locale)} compact />
            <Metric label={t(locale, "متوسط الحصة", "Avg/session")} value={formatCurrency(financeSummary.averagePerSession, locale)} compact />
            <Metric label={t(locale, "الحصص", "Sessions")} value={String(financeSummary.linkedSessions)} compact />
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
          <CalendarDays size={18} className="text-brand-600" />
          {t(locale, "الجلسات المرتبطة", "Linked sessions")}
        </h3>
        {teacher.linkedSessions.length === 0 ? (
          <EmptyCopy locale={locale} ar="لا توجد جلسات مرتبطة حالياً" en="No linked sessions yet" />
        ) : (
          <div className="space-y-3">
            {teacher.linkedSessions.map((session) => (
              <Link key={session.id} href={"/schedule/" + session.id} className="block rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted/40">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{session.className}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{session.startTime} → {session.endTime}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{formatCourseLabel(session.course, locale)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
          <Layers3 size={18} className="text-brand-600" />
          {t(locale, "الجروبات المرتبطة", "Linked groups")}
        </h3>
        {linkedGroups.length === 0 ? (
          <EmptyCopy locale={locale} ar="لا توجد جروبات مرتبطة بهذا المدرس حتى الآن" en="No groups are linked to this teacher yet" />
        ) : (
          <div className="space-y-3">
            {linkedGroups.map((group) => (
              <Link key={group.id} href={"/groups/" + group.id} className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-foreground">{group.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatCourseLabel(group.course, locale)}</p>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {t(locale, "فتح الجروب", "Open group")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
          <Users size={18} className="text-brand-600" />
          {t(locale, "الطلاب المرتبطون", "Linked students")}
        </h3>
        {teacher.linkedStudents.length === 0 ? (
          <EmptyCopy locale={locale} ar="لا يوجد طلاب مرتبطون حتى الآن" en="No linked students yet" />
        ) : (
          <div className="space-y-3">
            {teacher.linkedStudents.map((student) => {
              const snapshot = buildStudentReportSnapshot(student);
              return (
                <Link key={student.id} href={"/students/" + student.id} className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{student.fullName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{student.className ?? t(locale, "غير مسجل", "Unassigned")} • {student.parentName}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                      {snapshot.ready ? t(locale, "تقرير جاهز", "Report ready") : t(locale, "متابعة", "Follow-up")}
                    </span>
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {t(locale, "المتبقي", "Remaining")}: {snapshot.sessionsUntilNext}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {canManage ? (
        <div className="rounded-2xl border-2 border-danger-200 bg-danger-50/30 p-5 dark:border-danger-800 dark:bg-danger-950/20">
          <h3 className="mb-1 flex items-center gap-2 font-bold text-danger-700 dark:text-danger-400">
            <AlertTriangle size={18} />
            {t(locale, "منطقة خطرة", "Danger Zone")}
          </h3>
          <p className="mb-4 text-xs text-danger-600/70 dark:text-danger-400/70">
            {t(locale, "إجراءات لا يمكن التراجع عنها. تأكد قبل المتابعة.", "Irreversible actions. Confirm before proceeding.")}
          </p>

          {hasSessions ? (
            <div className="mb-4 rounded-xl border border-danger-200 bg-white p-4 dark:border-danger-800 dark:bg-card">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t(locale, "نقل الحصص إلى مدرس بديل", "Move sessions to replacement teacher")}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select value={replacementId} onChange={(event) => setReplacementId(event.target.value)} className="flex-1 rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                  <option value="">{t(locale, "اختر مدرساً", "Choose teacher")}</option>
                  {alternatives.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.fullName}
                    </option>
                  ))}
                </select>
                <button onClick={handleReassign} disabled={!replacementId || busy !== null} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50">
                  <CalendarDays size={16} />
                  {t(locale, "نقل الحصص", "Move sessions")}
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {t(
                  locale,
                  "هذا المدرس مرتبط بـ " + teacher.linkedSessions.length + " حصة. انقلها أولاً لتتمكن من الحذف.",
                  "This teacher has " + teacher.linkedSessions.length + " sessions. Move them first to enable deletion.",
                )}
              </p>
            </div>
          ) : null}

          <button onClick={handleDelete} disabled={busy !== null || hasSessions} className="inline-flex items-center gap-2 rounded-xl bg-danger-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-danger-600 disabled:opacity-50">
            <Trash2 size={16} />
            {t(locale, "حذف المدرس نهائياً", "Delete teacher permanently")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function AxisRating({ label, value, onChange }: { label: string; value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={"flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors " + (value !== null && n <= value ? "bg-brand-700 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80")}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={"rounded-xl bg-muted/40 " + (compact ? "p-3 text-center" : "p-4 text-center")}>
      <p className={(compact ? "text-[11px]" : "text-xs") + " text-muted-foreground"}>{label}</p>
      <p className={"mt-1 " + (compact ? "text-base" : "text-2xl") + " font-bold text-foreground"}>{value}</p>
    </div>
  );
}

function Info({ icon: Icon, label, value, href, ltr }: { icon: typeof Phone; label: string; value: string; href?: string; ltr?: boolean }) {
  const content = (
    <div className="rounded-xl bg-muted/40 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon size={14} />
        {label}
      </div>
      <p className="mt-1 font-semibold text-foreground" dir={ltr ? "ltr" : undefined}>
        {value}
      </p>
    </div>
  );
  return href ? (
    <a href={href} className="block transition-opacity hover:opacity-85">
      {content}
    </a>
  ) : (
    content
  );
}

function EmptyCopy({ locale, ar, en }: { locale: "ar" | "en"; ar: string; en: string }) {
  return <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{t(locale, ar, en)}</div>;
}
