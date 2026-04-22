"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, CalendarDays, Calculator, FileText, Layers3, Mail, Phone, PlusCircle, Save, Trash2, Users } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useCurrentUser } from "@/providers/user-provider";
import { canAccessTeachersForUser, canManageTeacherFinanceForUser, canManageTeachersForUser } from "@/config/roles";
import { formatCourseLabel, formatCurrencyEgp, formatDate } from "@/lib/formatters";
import { getEmploymentTypeLabel, t } from "@/lib/locale";
import { getTeacherDetails } from "@/services/relations.service";
import { getTeacherEvaluation, saveTeacherEvaluation } from "@/services/teacher-evaluations.service";
import { computeTeacherFinanceSummary, getTeacherFinanceConfig, saveTeacherFinanceConfig, type LessonDuration, type TeacherCourseRate } from "@/services/teacher-finance.service";
import { reassignTeacherRelations } from "@/services/teacher-reassignment.service";
import { deleteTeacher, listTeachers } from "@/services/teachers.service";
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
  const [draftCourse, setDraftCourse] = useState<CourseType>("scratch");
  const [draftDuration, setDraftDuration] = useState<LessonDuration>(60);
  const [draftPrice, setDraftPrice] = useState("120");

  async function load() {
    setLoading(true);

    const [data, teachers] = await Promise.all([getTeacherDetails(id), listTeachers()]);
    setTeacher(data);
    setAlternatives(teachers.filter((item) => item.id !== id));

    if (data) {
      const evaluation = getTeacherEvaluation(id);
      const finance = await getTeacherFinanceConfig(id);

      setRating(evaluation?.rating ? String(evaluation.rating) : "3");
      setNotes(evaluation?.notes ?? "");
      setRateRows(finance.rates.length > 0 ? sortRateRows(finance.rates) : [createRateRow()]);
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

  function handleAddRateRow() {
    const price = Number(draftPrice);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error(t(locale, "\u0623\u062f\u062e\u0644 \u0633\u0639\u0631\u064b\u0627 \u0635\u062d\u064a\u062d\u064b\u0627 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631", "Enter a valid rate greater than zero"));
      return;
    }

    const duplicate = rateRows.some(
      (row) => row.course === draftCourse && row.durationMinutes === draftDuration,
    );

    if (duplicate) {
      toast.error(
        t(
          locale,
          "\u0647\u0646\u0627\u0643 \u0633\u0639\u0631 \u0645\u0633\u062c\u0644 \u0628\u0627\u0644\u0641\u0639\u0644 \u0644\u0646\u0641\u0633 \u0627\u0644\u0643\u0648\u0631\u0633 \u0648\u0645\u062f\u0629 \u0627\u0644\u062d\u0635\u0629",
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
      });
      toast.success(t(locale, "\u062a\u0645 \u062d\u0641\u0638 \u062a\u0642\u064a\u064a\u0645 \u0627\u0644\u0645\u062f\u0631\u0633", "Teacher evaluation saved"));
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "\u062a\u0639\u0630\u0631 \u062d\u0641\u0638 \u0627\u0644\u062a\u0642\u064a\u064a\u0645", "Could not save evaluation"));
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
          "\u0623\u0636\u0641 \u0633\u0639\u0631\u064b\u0627 \u0648\u0627\u062d\u062f\u064b\u0627 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u0642\u0628\u0644 \u0627\u0644\u062d\u0641\u0638",
          "Add at least one course rate before saving",
        ),
      );
      return;
    }

    if (normalizedRows.some((row) => row.priceEgp <= 0)) {
      toast.error(
        t(
          locale,
          "\u0643\u0644 \u0633\u0639\u0631 \u064a\u062c\u0628 \u0623\u0646 \u064a\u0643\u0648\u0646 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631",
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

      toast.success(t(locale, "\u062a\u0645 \u062d\u0641\u0638 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0643\u0648\u0631\u0633\u0627\u062a \u0644\u0644\u0645\u062f\u0631\u0633", "Teacher course rates saved"));
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "\u062a\u0639\u0630\u0631 \u062d\u0641\u0638 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0643\u0648\u0631\u0633\u0627\u062a", "Could not save teacher course rates"));
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
          "\u062a\u0645 \u0646\u0642\u0644 " + result.sessionsUpdated + " \u062d\u0635\u0635 \u0648 " + result.classesUpdated + " \u0643\u0644\u0627\u0633\u0627\u062a",
          "Moved " + result.sessionsUpdated + " sessions and " + result.classesUpdated + " classes",
        ),
      );
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "\u062a\u0639\u0630\u0631 \u0646\u0642\u0644 \u0627\u0644\u062d\u0635\u0635", "Could not reassign sessions"));
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    if (!teacher) return;

    if (teacher.linkedSessions.length > 0) {
      toast.error(t(locale, "\u0627\u0646\u0642\u0644 \u0627\u0644\u062d\u0635\u0635 \u0623\u0648\u0644\u0627\u064b \u0642\u0628\u0644 \u062d\u0630\u0641 \u0627\u0644\u0645\u062f\u0631\u0633", "Reassign sessions before deleting"));
      return;
    }

    const confirmed = window.confirm(
      t(locale, "\u0647\u0644 \u062a\u0631\u064a\u062f \u062d\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0645\u062f\u0631\u0633 \u0646\u0647\u0627\u0626\u064a\u0627\u064b\u061f", "Delete this teacher permanently?"),
    );
    if (!confirmed) return;

    setBusy("delete");
    try {
      const deleted = await deleteTeacher(teacher.id);
      if (!deleted) throw new Error("Delete failed");

      toast.success(t(locale, "\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u0645\u062f\u0631\u0633", "Teacher deleted"));
      router.push("/teachers");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "\u062a\u0639\u0630\u0631 \u062d\u0630\u0641 \u0627\u0644\u0645\u062f\u0631\u0633", "Could not delete teacher"));
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
        titleAr="\u062c\u0627\u0631\u064d \u062a\u062d\u0645\u064a\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0645\u062f\u0631\u0633"
        titleEn="Loading teacher details"
        descriptionAr="\u064a\u062a\u0645 \u0627\u0644\u0622\u0646 \u062a\u062c\u0647\u064a\u0632 \u0645\u0644\u0641 \u0627\u0644\u0645\u062f\u0631\u0633 \u0648\u0631\u0628\u0637 \u0627\u0644\u062c\u0644\u0633\u0627\u062a \u0648\u0627\u0644\u0637\u0644\u0627\u0628."
        descriptionEn="Preparing the teacher profile with linked sessions and students."
      />
    );
  }

  if (!teacher) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="\u0627\u0644\u0645\u062f\u0631\u0633 \u063a\u064a\u0631 \u0645\u0648\u062c\u0648\u062f"
        titleEn="Teacher not found"
        descriptionAr="\u0642\u062f \u064a\u0643\u0648\u0646 \u0647\u0630\u0627 \u0627\u0644\u0645\u0644\u0641 \u0645\u062d\u0630\u0648\u0641\u0627\u064b \u0623\u0648 \u0627\u0644\u0631\u0627\u0628\u0637 \u063a\u064a\u0631 \u0635\u062d\u064a\u062d."
        descriptionEn="This teacher profile may have been removed or the link is incorrect."
        actionHref="/teachers"
        actionLabelAr="\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0646"
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
          {canManage ? (
            <Link href={"/schedule/new?teacherId=" + teacher.id} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
              <PlusCircle size={16} />
              {t(locale, "\u0625\u0636\u0627\u0641\u0629 \u062d\u0635\u0629", "Add session")}
            </Link>
          ) : null}
          {canManageFinance ? (
            <Link href="/teachers/finance" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
              <Calculator size={16} />
              {t(locale, "\u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0646", "Teacher accounts")}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Metric label={t(locale, "\u0627\u0644\u0643\u0644\u0627\u0633\u0627\u062a", "Classes")} value={teacher.classesCount.toString()} />
        <Metric label={t(locale, "\u0627\u0644\u0637\u0644\u0627\u0628", "Students")} value={teacher.studentsCount.toString()} />
        <Metric label={t(locale, "\u062a\u0642\u0627\u0631\u064a\u0631 \u062c\u0627\u0647\u0632\u0629", "Reports ready")} value={String(reportSummary.ready)} />
        <Metric label={t(locale, "\u064a\u062d\u062a\u0627\u062c \u0645\u062a\u0627\u0628\u0639\u0629", "Need follow-up")} value={String(reportSummary.needsAttention)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <BookOpen size={20} className="text-brand-600" />
            {t(locale, "\u0627\u0644\u062a\u062e\u0635\u0635\u0627\u062a \u0648\u0627\u0644\u062f\u0648\u0631\u0627\u062a", "Specializations & courses")}
          </h2>
          <div className="mb-6 flex flex-wrap gap-2">
            {teacher.specialization.map((course) => (
              <span key={course} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {formatCourseLabel(course, locale)}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-bold text-foreground">{t(locale, "\u0627\u0644\u062f\u0648\u0631\u0627\u062a \u0627\u0644\u0645\u0641\u0639\u0644\u0629", "Active courses")}</h3>
              <div className="flex flex-wrap gap-2">
                {teacher.activeCourses.length === 0 ? (
                  <span className="text-sm text-muted-foreground">{t(locale, "\u0644\u0627 \u062a\u0648\u062c\u062f \u0643\u0644\u0627\u0633\u0627\u062a \u0628\u0639\u062f", "No classes yet")}</span>
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
              <Info icon={Phone} label={t(locale, "\u0627\u0644\u0647\u0627\u062a\u0641", "Phone")} value={teacher.phone} href={"tel:" + teacher.phone} ltr />
              <Info icon={Mail} label={t(locale, "\u0627\u0644\u0628\u0631\u064a\u062f", "Email")} value={teacher.email ?? t(locale, "\u063a\u064a\u0631 \u0645\u062a\u0648\u0641\u0631", "N/A")} href={teacher.email ? "mailto:" + teacher.email : undefined} />
              <Info icon={BookOpen} label={t(locale, "\u0627\u0644\u062d\u0627\u0644\u0629", "Status")} value={teacher.isActive ? t(locale, "\u0646\u0634\u0637", "Active") : t(locale, "\u063a\u064a\u0631 \u0646\u0634\u0637", "Inactive")} />
            </div>
          </div>
        </div>

        {canManage ? (
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground">
              <FileText size={18} className="text-brand-600" />
              {t(locale, "\u0627\u0644\u062a\u0642\u064a\u064a\u0645", "Evaluation")}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "\u0627\u0644\u062a\u0642\u064a\u064a\u0645 \u0645\u0646 5", "Rating / 5")}</label>
                <select value={rating} onChange={(event) => setRating(event.target.value)} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "\u0645\u0644\u0627\u062d\u0638\u0627\u062a", "Notes")}</label>
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring" />
              </div>
              {teacher.evaluationUpdatedAt ? (
                <p className="text-xs text-muted-foreground">
                  {t(locale, "\u0622\u062e\u0631 \u062a\u062d\u062f\u064a\u062b", "Last updated")}: {formatDate(teacher.evaluationUpdatedAt, locale)}
                </p>
              ) : null}
              <button onClick={handleSaveEvaluation} disabled={busy !== null} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50">
                <Save size={16} />
                {t(locale, "\u062d\u0641\u0638 \u0627\u0644\u062a\u0642\u064a\u064a\u0645", "Save evaluation")}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {canManageFinance ? (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-foreground">
            <Calculator size={18} className="text-brand-600" />
            {t(locale, "\u062a\u0633\u0639\u064a\u0631 \u0627\u0644\u0645\u062f\u0631\u0633 \u062d\u0633\u0628 \u0627\u0644\u0643\u0648\u0631\u0633 \u0648\u0645\u062f\u0629 \u0627\u0644\u062f\u0631\u0633", "Teacher pricing by course and lesson duration")}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {t(
              locale,
              "\u0623\u0636\u0641 \u0633\u0639\u0631\u064b\u0627 \u0645\u062d\u062f\u062f\u064b\u0627 \u0644\u0643\u0644 \u062a\u0631\u0643\u064a\u0628\u0629 \u0645\u0646 \u0645\u062f\u0629 \u0627\u0644\u062d\u0635\u0629 \u0648\u0627\u0633\u0645 \u0627\u0644\u0643\u0648\u0631\u0633 \u0627\u0644\u062d\u0642\u064a\u0642\u064a.",
              "Add an explicit price for each real combination of course and lesson duration.",
            )}
          </p>

          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-dashed border-border bg-muted/20 p-4 lg:grid-cols-[1fr_180px_160px_auto]">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">{t(locale, "\u0627\u0644\u0643\u0648\u0631\u0633", "Course")}</label>
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
              <label className="mb-1.5 block text-xs font-medium text-foreground">{t(locale, "\u0645\u062f\u0629 \u0627\u0644\u062d\u0635\u0629", "Lesson duration")}</label>
              <select value={String(draftDuration)} onChange={(event) => setDraftDuration(Number(event.target.value) as LessonDuration)} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                <option value="60">60 min</option>
                <option value="90">90 min</option>
                <option value="120">120 min</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">{t(locale, "\u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u062c\u0646\u064a\u0647", "Price (EGP)")}</label>
              <input inputMode="numeric" value={draftPrice} onChange={(event) => setDraftPrice(event.target.value)} className="w-full rounded-xl border border-input bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring" />
            </div>

            <div className="flex items-end">
              <button type="button" onClick={handleAddRateRow} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
                <PlusCircle size={16} />
                {t(locale, "\u0625\u0636\u0627\u0641\u0629 \u0633\u0639\u0631", "Add rate")}
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {rateRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                {t(locale, "\u0644\u0645 \u064a\u062a\u0645 \u0625\u0636\u0627\u0641\u0629 \u0623\u064a \u0623\u0633\u0639\u0627\u0631 \u0628\u0639\u062f", "No course rates have been added yet")}
              </div>
            ) : (
              rateRows.map((row) => (
                <div key={row.id} className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-background p-4 lg:grid-cols-[1fr_180px_160px_auto]">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">{t(locale, "\u0627\u0644\u0643\u0648\u0631\u0633", "Course")}</label>
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
                    <label className="mb-1.5 block text-xs font-medium text-foreground">{t(locale, "\u0645\u062f\u0629 \u0627\u0644\u062d\u0635\u0629", "Lesson duration")}</label>
                    <select value={String(row.durationMinutes)} onChange={(event) => updateRateRow(row.id, { durationMinutes: Number(event.target.value) as LessonDuration })} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                      <option value="60">60 min</option>
                      <option value="90">90 min</option>
                      <option value="120">120 min</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">{t(locale, "\u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u062c\u0646\u064a\u0647", "Price (EGP)")}</label>
                    <input inputMode="numeric" value={String(row.priceEgp)} onChange={(event) => updateRateRow(row.id, { priceEgp: Number(event.target.value) || 0 })} className="w-full rounded-xl border border-input bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring" />
                  </div>

                  <div className="flex items-end">
                    <button type="button" onClick={() => removeRateRow(row.id)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-danger-300 bg-danger-50 px-4 py-2.5 text-sm font-semibold text-danger-700 transition-colors hover:bg-danger-100 dark:border-danger-800 dark:bg-danger-950/30 dark:text-danger-300">
                      <Trash2 size={16} />
                      {t(locale, "\u062d\u0630\u0641", "Remove")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button onClick={handleSaveFinance} disabled={busy !== null} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50">
            <Save size={16} />
            {t(locale, "\u062d\u0641\u0638 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0645\u062f\u0631\u0633", "Save teacher rates")}
          </button>
        </div>
      ) : null}

      {financeSummary ? (
        <div className="rounded-2xl border border-border bg-muted/30 p-5">
          <h3 className="mb-3 text-sm font-bold text-muted-foreground">{t(locale, "\u0627\u0644\u0645\u0644\u062e\u0635 \u0627\u0644\u0645\u0627\u0644\u064a \u0627\u0644\u0645\u062d\u0633\u0648\u0628", "Computed Finance Summary")}</h3>

          {missingRateCount > 0 ? (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
              {t(
                locale,
                "\u0647\u0646\u0627\u0643 " + missingRateCount + " \u062d\u0635\u0629 \u0628\u062f\u0648\u0646 \u0633\u0639\u0631 \u0645\u0637\u0627\u0628\u0642. \u0631\u0627\u062c\u0639 \u0633\u0639\u0631 \u0627\u0644\u0643\u0648\u0631\u0633 \u0648\u0645\u062f\u0629 \u0627\u0644\u062f\u0631\u0633.",
                missingRateCount + " sessions do not have a matching course rate yet. Review course and duration pricing.",
              )}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Metric label={t(locale, "\u0623\u0633\u0628\u0648\u0639\u064a", "Weekly")} value={formatCurrencyEgp(financeSummary.weeklyEstimated, locale)} compact />
            <Metric label={t(locale, "\u0634\u0647\u0631\u064a", "Monthly")} value={formatCurrencyEgp(financeSummary.monthlyEstimated, locale)} compact />
            <Metric label={t(locale, "\u0645\u062a\u0648\u0633\u0637 \u0627\u0644\u062d\u0635\u0629", "Avg/session")} value={formatCurrencyEgp(financeSummary.averagePerSession, locale)} compact />
            <Metric label={t(locale, "\u0627\u0644\u062d\u0635\u0635", "Sessions")} value={String(financeSummary.linkedSessions)} compact />
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
          <CalendarDays size={18} className="text-brand-600" />
          {t(locale, "\u0627\u0644\u062c\u0644\u0633\u0627\u062a \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u0629", "Linked sessions")}
        </h3>
        {teacher.linkedSessions.length === 0 ? (
          <EmptyCopy locale={locale} ar="\u0644\u0627 \u062a\u0648\u062c\u062f \u062c\u0644\u0633\u0627\u062a \u0645\u0631\u062a\u0628\u0637\u0629 \u062d\u0627\u0644\u064a\u0627\u064b" en="No linked sessions yet" />
        ) : (
          <div className="space-y-3">
            {teacher.linkedSessions.map((session) => (
              <Link key={session.id} href={"/schedule/" + session.id} className="block rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted/40">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{session.className}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{session.startTime} \u2192 {session.endTime}</p>
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
          {t(locale, "\u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u0648\u0646", "Linked students")}
        </h3>
        {teacher.linkedStudents.length === 0 ? (
          <EmptyCopy locale={locale} ar="\u0644\u0627 \u064a\u0648\u062c\u062f \u0637\u0644\u0627\u0628 \u0645\u0631\u062a\u0628\u0637\u0648\u0646 \u062d\u062a\u0649 \u0627\u0644\u0622\u0646" en="No linked students yet" />
        ) : (
          <div className="space-y-3">
            {teacher.linkedStudents.map((student) => {
              const snapshot = buildStudentReportSnapshot(student);
              return (
                <Link key={student.id} href={"/students/" + student.id} className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{student.fullName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{student.className ?? t(locale, "\u063a\u064a\u0631 \u0645\u0633\u062c\u0644", "Unassigned")} \u2022 {student.parentName}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                      {snapshot.ready ? t(locale, "\u062a\u0642\u0631\u064a\u0631 \u062c\u0627\u0647\u0632", "Report ready") : t(locale, "\u0645\u062a\u0627\u0628\u0639\u0629", "Follow-up")}
                    </span>
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {t(locale, "\u0627\u0644\u0645\u062a\u0628\u0642\u064a", "Remaining")}: {snapshot.sessionsUntilNext}
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
            {t(locale, "\u0645\u0646\u0637\u0642\u0629 \u062e\u0637\u0631\u0629", "Danger Zone")}
          </h3>
          <p className="mb-4 text-xs text-danger-600/70 dark:text-danger-400/70">
            {t(locale, "\u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0644\u0627 \u064a\u0645\u0643\u0646 \u0627\u0644\u062a\u0631\u0627\u062c\u0639 \u0639\u0646\u0647\u0627. \u062a\u0623\u0643\u062f \u0642\u0628\u0644 \u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629.", "Irreversible actions. Confirm before proceeding.")}
          </p>

          {hasSessions ? (
            <div className="mb-4 rounded-xl border border-danger-200 bg-white p-4 dark:border-danger-800 dark:bg-card">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t(locale, "\u0646\u0642\u0644 \u0627\u0644\u062d\u0635\u0635 \u0625\u0644\u0649 \u0645\u062f\u0631\u0633 \u0628\u062f\u064a\u0644", "Move sessions to replacement teacher")}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select value={replacementId} onChange={(event) => setReplacementId(event.target.value)} className="flex-1 rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                  <option value="">{t(locale, "\u0627\u062e\u062a\u0631 \u0645\u062f\u0631\u0633\u0627\u064b", "Choose teacher")}</option>
                  {alternatives.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.fullName}
                    </option>
                  ))}
                </select>
                <button onClick={handleReassign} disabled={!replacementId || busy !== null} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50">
                  <CalendarDays size={16} />
                  {t(locale, "\u0646\u0642\u0644 \u0627\u0644\u062d\u0635\u0635", "Move sessions")}
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {t(
                  locale,
                  "\u0647\u0630\u0627 \u0627\u0644\u0645\u062f\u0631\u0633 \u0645\u0631\u062a\u0628\u0637 \u0628\u0640 " + teacher.linkedSessions.length + " \u062d\u0635\u0629. \u0627\u0646\u0642\u0644\u0647\u0627 \u0623\u0648\u0644\u0627\u064b \u0644\u062a\u062a\u0645\u0643\u0646 \u0645\u0646 \u0627\u0644\u062d\u0630\u0641.",
                  "This teacher has " + teacher.linkedSessions.length + " sessions. Move them first to enable deletion.",
                )}
              </p>
            </div>
          ) : null}

          <button onClick={handleDelete} disabled={busy !== null || hasSessions} className="inline-flex items-center gap-2 rounded-xl bg-danger-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-danger-600 disabled:opacity-50">
            <Trash2 size={16} />
            {t(locale, "\u062d\u0630\u0641 \u0627\u0644\u0645\u062f\u0631\u0633 \u0646\u0647\u0627\u0626\u064a\u0627\u064b", "Delete teacher permanently")}
          </button>
        </div>
      ) : null}
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
