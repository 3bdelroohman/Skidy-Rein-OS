const fs = require("fs");
const path = require("path");

const filePath = path.join("src", "app", "(dashboard)", "teachers", "[id]", "page.tsx");

const content = `"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Calculator, FileText, Mail, Phone, PlusCircle, Save, Trash2, Users } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { formatCourseLabel, formatCurrencyEgp, formatDate } from "@/lib/formatters";
import { getEmploymentTypeLabel, t } from "@/lib/locale";
import { getTeacherDetails } from "@/services/relations.service";
import { getTeacherEvaluation, saveTeacherEvaluation } from "@/services/teacher-evaluations.service";
import { computeTeacherFinanceSummary, getTeacherFinanceConfig, saveTeacherFinanceConfig } from "@/services/teacher-finance.service";
import { reassignTeacherRelations } from "@/services/teacher-reassignment.service";
import { deleteTeacher, listTeachers } from "@/services/teachers.service";
import { buildStudentReportSnapshot } from "@/services/student-report.service";
import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import type { CourseFamily, TeacherDetails, TeacherListItem } from "@/types/crm";
import { COURSE_FAMILY_LABELS } from "@/types/crm";

const FAMILIES: CourseFamily[] = ["junior", "intermediate", "advanced", "specialized"];

export default function TeacherDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const [teacher, setTeacher] = useState<TeacherDetails | null>(null);
  const [alternatives, setAlternatives] = useState<TeacherListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [replacementId, setReplacementId] = useState("");
  const [rating, setRating] = useState("3");
  const [notes, setNotes] = useState("");
  const [sessionRate60, setSessionRate60] = useState("120");
  const [sessionRate90, setSessionRate90] = useState("180");
  const [sessionRate120, setSessionRate120] = useState("240");
  const [familyAdjustments, setFamilyAdjustments] = useState<Record<CourseFamily, string>>({ junior: "0", intermediate: "20", advanced: "30", specialized: "40" });
  const [financeNotes, setFinanceNotes] = useState("");

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
      setSessionRate60(String(finance.sessionRate60));
      setSessionRate90(String(finance.sessionRate90));
      setSessionRate120(String(finance.sessionRate120));
      setFamilyAdjustments({
        junior: String(finance.familyAdjustments.junior ?? 0),
        intermediate: String(finance.familyAdjustments.intermediate ?? 20),
        advanced: String(finance.familyAdjustments.advanced ?? 30),
        specialized: String(finance.familyAdjustments.specialized ?? 40),
      });
      setFinanceNotes(finance.notes ?? "");
      setReplacementId((prev) => prev || teachers.find((item) => item.id !== id)?.id || "");
    }
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await load();
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const financeSummary = useMemo(() => {
    if (!teacher) return null;
    return computeTeacherFinanceSummary(teacher.linkedSessions, {
      teacherId: teacher.id,
      sessionRate60: Number(sessionRate60) || 120,
      sessionRate90: Number(sessionRate90) || 180,
      sessionRate120: Number(sessionRate120) || 240,
      familyAdjustments: {
        junior: Number(familyAdjustments.junior) || 0,
        intermediate: Number(familyAdjustments.intermediate) || 0,
        advanced: Number(familyAdjustments.advanced) || 0,
        specialized: Number(familyAdjustments.specialized) || 0,
      },
      notes: financeNotes.trim() || null,
      updatedAt: null,
    });
  }, [teacher, sessionRate60, sessionRate90, sessionRate120, familyAdjustments, financeNotes]);

  const reportSummary = useMemo(() => {
    if (!teacher) return { ready: 0, needsAttention: 0 };
    const snapshots = teacher.linkedStudents.map((student) => buildStudentReportSnapshot(student));
    return {
      ready: snapshots.filter((item) => item.ready).length,
      needsAttention: snapshots.filter((item) => !item.ready).length,
    };
  }, [teacher]);

  async function handleSaveEvaluation() {
    if (!teacher) return;
    setBusy("evaluation");
    try {
      saveTeacherEvaluation({ teacherId: teacher.id, rating: Number(rating) || null, notes });
      toast.success(t(locale, "\\u062a\\u0645 \\u062d\\u0641\\u0638 \\u062a\\u0642\\u064a\\u064a\\u0645 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633", "Teacher evaluation saved"));
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "\\u062a\\u0639\\u0630\\u0631 \\u062d\\u0641\\u0638 \\u0627\\u0644\\u062a\\u0642\\u064a\\u064a\\u0645", "Could not save evaluation"));
    } finally {
      setBusy(null);
    }
  }

  async function handleSaveFinance() {
    if (!teacher) return;
    setBusy("finance");
    try {
      await saveTeacherFinanceConfig({
        teacherId: teacher.id,
        sessionRate60: Number(sessionRate60) || 120,
        sessionRate90: Number(sessionRate90) || 180,
        sessionRate120: Number(sessionRate120) || 240,
        familyAdjustments: {
          junior: Number(familyAdjustments.junior) || 0,
          intermediate: Number(familyAdjustments.intermediate) || 0,
          advanced: Number(familyAdjustments.advanced) || 0,
          specialized: Number(familyAdjustments.specialized) || 0,
        },
        notes: financeNotes,
      });
      toast.success(t(locale, "\\u062a\\u0645 \\u062d\\u0641\\u0638 \\u0627\\u0644\\u0625\\u0639\\u062f\\u0627\\u062f\\u0627\\u062a \\u0627\\u0644\\u0645\\u0627\\u0644\\u064a\\u0629", "Finance settings saved"));
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "\\u062a\\u0639\\u0630\\u0631 \\u062d\\u0641\\u0638 \\u0627\\u0644\\u0625\\u0639\\u062f\\u0627\\u062f\\u0627\\u062a \\u0627\\u0644\\u0645\\u0627\\u0644\\u064a\\u0629", "Could not save finance settings"));
    } finally {
      setBusy(null);
    }
  }

  async function handleReassign() {
    if (!teacher || !replacementId) return;
    setBusy("reassign");
    try {
      const result = await reassignTeacherRelations(teacher.id, replacementId);
      toast.success(t(locale, \`\\u062a\\u0645 \\u0646\\u0642\\u0644 \${result.sessionsUpdated} \\u062d\\u0635\\u0635 \\u0648 \${result.classesUpdated} \\u0643\\u0644\\u0627\\u0633\\u0627\\u062a\`, \`Moved \${result.sessionsUpdated} sessions and \${result.classesUpdated} classes\`));
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "\\u062a\\u0639\\u0630\\u0631 \\u0646\\u0642\\u0644 \\u0627\\u0644\\u062d\\u0635\\u0635", "Could not reassign sessions"));
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    if (!teacher) return;
    if (teacher.linkedSessions.length > 0) {
      toast.error(t(locale, "\\u0627\\u0646\\u0642\\u0644 \\u0627\\u0644\\u062d\\u0635\\u0635 \\u0623\\u0648\\u0644\\u0627\\u064b \\u0642\\u0628\\u0644 \\u062d\\u0630\\u0641 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633", "Reassign the sessions before deleting this teacher"));
      return;
    }
    const confirmed = window.confirm(t(locale, "\\u0647\\u0644 \\u062a\\u0631\\u064a\\u062f \\u062d\\u0630\\u0641 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633 \\u0646\\u0647\\u0627\\u0626\\u064a\\u0627\\u064b\\u061f", "Delete this teacher permanently?"));
    if (!confirmed) return;
    setBusy("delete");
    try {
      const deleted = await deleteTeacher(teacher.id);
      if (!deleted) throw new Error(t(locale, "\\u062a\\u0639\\u0630\\u0631 \\u062d\\u0630\\u0641 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633", "Could not delete teacher"));
      toast.success(t(locale, "\\u062a\\u0645 \\u062d\\u0630\\u0641 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633", "Teacher deleted"));
      router.push("/teachers");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "\\u062a\\u0639\\u0630\\u0631 \\u062d\\u0630\\u0641 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633", "Could not delete teacher"));
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <LoadingState
        titleAr="\\u062c\\u0627\\u0631\\u064d \\u062a\\u062d\\u0645\\u064a\\u0644 \\u0628\\u064a\\u0627\\u0646\\u0627\\u062a \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633"
        titleEn="Loading teacher details"
        descriptionAr="\\u064a\\u062a\\u0645 \\u0627\\u0644\\u0622\\u0646 \\u062a\\u062c\\u0647\\u064a\\u0632 \\u0645\\u0644\\u0641 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633 \\u0648\\u0631\\u0628\\u0637 \\u0627\\u0644\\u062c\\u0644\\u0633\\u0627\\u062a \\u0648\\u0627\\u0644\\u0637\\u0644\\u0627\\u0628 \\u0627\\u0644\\u0645\\u0631\\u062a\\u0628\\u0637\\u064a\\u0646 \\u0628\\u0647."
        descriptionEn="Preparing the teacher profile with linked sessions and students."
      />
    );
  }

  if (!teacher) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="\\u0627\\u0644\\u0645\\u062f\\u0631\\u0633 \\u063a\\u064a\\u0631 \\u0645\\u0648\\u062c\\u0648\\u062f"
        titleEn="Teacher not found"
        descriptionAr="\\u0642\\u062f \\u064a\\u0643\\u0648\\u0646 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0645\\u0644\\u0641 \\u0645\\u062d\\u0630\\u0648\\u0641\\u0627\\u064b \\u0623\\u0648 \\u0623\\u0646 \\u0627\\u0644\\u0631\\u0627\\u0628\\u0637 \\u063a\\u064a\\u0631 \\u0635\\u062d\\u064a\\u062d. \\u0627\\u0631\\u062c\\u0639 \\u0625\\u0644\\u0649 \\u0642\\u0627\\u0626\\u0645\\u0629 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633\\u064a\\u0646 \\u062b\\u0645 \\u0627\\u0641\\u062a\\u062d \\u0627\\u0644\\u0645\\u0644\\u0641 \\u0627\\u0644\\u0635\\u062d\\u064a\\u062d."
        descriptionEn="This teacher profile may have been removed or the link is incorrect. Go back to the teachers list and open the correct record."
        actionHref="/teachers"
        actionLabelAr="\\u0627\\u0644\\u0639\\u0648\\u062f\\u0629 \\u0625\\u0644\\u0649 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633\\u064a\\u0646"
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
          <Link href={\`/schedule/new?teacherId=\${teacher.id}\`} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            <PlusCircle size={16} />{t(locale, "\\u0625\\u0636\\u0627\\u0641\\u0629 \\u062d\\u0635\\u0629 \\u0644\\u0647\\u0630\\u0627 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633", "Add session for this teacher")}
          </Link>
          <Link href="/teachers/finance" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            <Calculator size={16} />{t(locale, "\\u062d\\u0633\\u0627\\u0628\\u0627\\u062a \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633\\u064a\\u0646", "Teacher accounts")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Metric label={t(locale, "\\u0627\\u0644\\u0643\\u0644\\u0627\\u0633\\u0627\\u062a \\u0627\\u0644\\u062d\\u0627\\u0644\\u064a\\u0629", "Current classes")} value={teacher.classesCount.toString()} />
        <Metric label={t(locale, "\\u0625\\u062c\\u0645\\u0627\\u0644\\u064a \\u0627\\u0644\\u0637\\u0644\\u0627\\u0628", "Total students")} value={teacher.studentsCount.toString()} />
        <Metric label={t(locale, "\\u062a\\u0642\\u0627\\u0631\\u064a\\u0631 \\u062c\\u0627\\u0647\\u0632\\u0629", "Reports ready")} value={String(reportSummary.ready)} />
        <Metric label={t(locale, "\\u064a\\u062d\\u062a\\u0627\\u062c \\u0645\\u062a\\u0627\\u0628\\u0639\\u0629", "Need follow-up")} value={String(reportSummary.needsAttention)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground"><BookOpen size={20} className="text-brand-600" />{t(locale, "\\u0627\\u0644\\u062a\\u062e\\u0635\\u0635\\u0627\\u062a \\u0648\\u0627\\u0644\\u062f\\u0648\\u0631\\u0627\\u062a", "Specializations and courses")}</h2>
          <div className="mb-6 flex flex-wrap gap-2">
            {teacher.specialization.map((item) => <span key={item} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">{formatCourseLabel(item, locale)}</span>)}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-bold text-foreground">{t(locale, "\\u0627\\u0644\\u062f\\u0648\\u0631\\u0627\\u062a \\u0627\\u0644\\u0645\\u0641\\u0639\\u0644\\u0629 \\u062d\\u0627\\u0644\\u064a\\u0627\\u064b", "Currently active courses")}</h3>
              <div className="flex flex-wrap gap-2">
                {teacher.activeCourses.length === 0 ? (
                  <span className="text-sm text-muted-foreground">{t(locale, "\\u0644\\u0627 \\u062a\\u0648\\u062c\\u062f \\u0643\\u0644\\u0627\\u0633\\u0627\\u062a \\u0645\\u0631\\u0628\\u0648\\u0637\\u0629 \\u0628\\u0639\\u062f", "No linked classes yet")}</span>
                ) : (
                  teacher.activeCourses.map((course) => (
                    <span key={course} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">{formatCourseLabel(course, locale)}</span>
                  ))
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Info icon={Phone} label={t(locale, "\\u0627\\u0644\\u0647\\u0627\\u062a\\u0641", "Phone")} value={teacher.phone} href={\`tel:\${teacher.phone}\`} ltr />
              <Info icon={Mail} label={t(locale, "\\u0627\\u0644\\u0628\\u0631\\u064a\\u062f", "Email")} value={teacher.email ?? t(locale, "\\u063a\\u064a\\u0631 \\u0645\\u062a\\u0648\\u0641\\u0631", "N/A")} href={teacher.email ? \`mailto:\${teacher.email}\` : undefined} />
              <Info icon={BookOpen} label={t(locale, "\\u0627\\u0644\\u062d\\u0627\\u0644\\u0629", "Status")} value={teacher.isActive ? t(locale, "\\u0646\\u0634\\u0637", "Active") : t(locale, "\\u063a\\u064a\\u0631 \\u0646\\u0634\\u0637", "Inactive")} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground"><FileText size={18} className="text-brand-600" />{t(locale, "\\u0627\\u0644\\u062a\\u0642\\u064a\\u064a\\u0645", "Evaluation")}</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "\\u0627\\u0644\\u062a\\u0642\\u064a\\u064a\\u0645 \\u0645\\u0646 5", "Rating out of 5")}</label>
              <select value={rating} onChange={(event) => setRating(event.target.value)} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                {[1,2,3,4,5].map((item) => <option key={item} value={String(item)}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "\\u0645\\u0644\\u0627\\u062d\\u0638\\u0627\\u062a", "Notes")}</label>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring" />
            </div>
            {teacher.evaluationUpdatedAt ? <p className="text-xs text-muted-foreground">{t(locale, "\\u0622\\u062e\\u0631 \\u062a\\u062d\\u062f\\u064a\\u062b", "Last updated")}: {formatDate(teacher.evaluationUpdatedAt, locale)}</p> : null}
            <button onClick={handleSaveEvaluation} disabled={busy !== null} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"><Save size={16} />{t(locale, "\\u062d\\u0641\\u0638 \\u0627\\u0644\\u062a\\u0642\\u064a\\u064a\\u0645", "Save evaluation")}</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground"><Calculator size={18} className="text-brand-600" />{t(locale, "\\u0627\\u0644\\u062c\\u0632\\u0621 \\u0627\\u0644\\u0645\\u0627\\u0644\\u064a", "Finance")}</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MoneyField label={t(locale, "\\u0633\\u0639\\u0631 60 \\u062f\\u0642\\u064a\\u0642\\u0629", "60 min rate")} value={sessionRate60} onChange={setSessionRate60} />
            <MoneyField label={t(locale, "\\u0633\\u0639\\u0631 90 \\u062f\\u0642\\u064a\\u0642\\u0629", "90 min rate")} value={sessionRate90} onChange={setSessionRate90} />
            <MoneyField label={t(locale, "\\u0633\\u0639\\u0631 120 \\u062f\\u0642\\u064a\\u0642\\u0629", "120 min rate")} value={sessionRate120} onChange={setSessionRate120} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {FAMILIES.map((fam) => (
              <MoneyField key={fam} label={isAr ? COURSE_FAMILY_LABELS[fam].ar : COURSE_FAMILY_LABELS[fam].en} value={familyAdjustments[fam]} onChange={(value) => setFamilyAdjustments((prev) => ({ ...prev, [fam]: value }))} />
            ))}
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "\\u0645\\u0644\\u0627\\u062d\\u0638\\u0627\\u062a \\u0645\\u0627\\u0644\\u064a\\u0629", "Finance notes")}</label>
            <textarea value={financeNotes} onChange={(event) => setFinanceNotes(event.target.value)} rows={3} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring" />
          </div>
          {financeSummary ? (
            <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
              <Metric label={t(locale, "\\u0623\\u0633\\u0628\\u0648\\u0639\\u064a", "Weekly")} value={formatCurrencyEgp(financeSummary.weeklyEstimated, locale)} compact />
              <Metric label={t(locale, "\\u0634\\u0647\\u0631\\u064a", "Monthly")} value={formatCurrencyEgp(financeSummary.monthlyEstimated, locale)} compact />
              <Metric label={t(locale, "\\u0645\\u062a\\u0648\\u0633\\u0637 \\u0627\\u0644\\u062d\\u0635\\u0629", "Avg session")} value={formatCurrencyEgp(financeSummary.averagePerSession, locale)} compact />
              <Metric label={t(locale, "\\u0627\\u0644\\u062d\\u0635\\u0635", "Sessions")} value={String(financeSummary.linkedSessions)} compact />
            </div>
          ) : null}
          <button onClick={handleSaveFinance} disabled={busy !== null} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"><Save size={16} />{t(locale, "\\u062d\\u0641\\u0638 \\u0627\\u0644\\u0625\\u0639\\u062f\\u0627\\u062f\\u0627\\u062a \\u0627\\u0644\\u0645\\u0627\\u0644\\u064a\\u0629", "Save finance settings")}</button>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground"><CalendarDays size={18} className="text-brand-600" />{t(locale, "\\u0625\\u0639\\u0627\\u062f\\u0629 \\u062a\\u0639\\u064a\\u064a\\u0646 \\u0642\\u0628\\u0644 \\u0627\\u0644\\u062d\\u0630\\u0641", "Reassign before deletion")}</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "\\u0645\\u062f\\u0631\\u0633 \\u0628\\u062f\\u064a\\u0644", "Replacement teacher")}</label>
                <select value={replacementId} onChange={(event) => setReplacementId(event.target.value)} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                  <option value="">{t(locale, "\\u0627\\u062e\\u062a\\u0631 \\u0645\\u062f\\u0631\\u0633\\u0627\\u064b", "Choose teacher")}</option>
                  {alternatives.map((item) => <option key={item.id} value={item.id}>{item.fullName}</option>)}
                </select>
              </div>
              <p className="text-xs text-muted-foreground">{t(locale, "\\u0625\\u0630\\u0627 \\u0643\\u0627\\u0646 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633 \\u0645\\u0631\\u062a\\u0628\\u0637\\u0627\\u064b \\u0628\\u062d\\u0635\\u0635\\u060c \\u0627\\u0646\\u0642\\u0644\\u0647\\u0627 \\u0623\\u0648\\u0644\\u0627\\u064b \\u062b\\u0645 \\u0627\\u062d\\u0630\\u0641 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633 \\u0628\\u0623\\u0645\\u0627\\u0646.", "If the teacher is linked to sessions, move them first, then delete the teacher safely.")}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleReassign} disabled={!replacementId || busy !== null || teacher.linkedSessions.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50">
                  <CalendarDays size={16} />{t(locale, "\\u0646\\u0642\\u0644 \\u0627\\u0644\\u062d\\u0635\\u0635 \\u0648\\u0627\\u0644\\u0643\\u0644\\u0627\\u0633\\u0627\\u062a", "Move sessions and classes")}
                </button>
                <button onClick={handleDelete} disabled={busy !== null || teacher.linkedSessions.length > 0} className="inline-flex items-center gap-2 rounded-xl bg-danger-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-danger-600 disabled:opacity-50">
                  <Trash2 size={16} />{t(locale, "\\u062d\\u0630\\u0641 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633", "Delete teacher")}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground"><CalendarDays size={18} className="text-brand-600" />{t(locale, "\\u0627\\u0644\\u062c\\u0644\\u0633\\u0627\\u062a \\u0627\\u0644\\u0645\\u0631\\u062a\\u0628\\u0637\\u0629", "Linked sessions")}</h3>
            {teacher.linkedSessions.length === 0 ? (
              <EmptyCopy locale={locale} ar="\\u0644\\u0627 \\u062a\\u0648\\u062c\\u062f \\u062c\\u0644\\u0633\\u0627\\u062a \\u0645\\u0631\\u062a\\u0628\\u0637\\u0629 \\u0628\\u0647\\u0630\\u0627 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633 \\u062d\\u0627\\u0644\\u064a\\u0627\\u064b" en="No sessions are linked to this teacher yet" />
            ) : (
              <div className="space-y-3">
                {teacher.linkedSessions.map((session) => (
                  <Link key={session.id} href={\`/schedule/\${session.id}\`} className="block rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted/40">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{session.className}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{session.startTime} \\u2192 {session.endTime}</p>
                      </div>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{formatCourseLabel(session.course, locale)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground"><Users size={18} className="text-brand-600" />{t(locale, "\\u0627\\u0644\\u0637\\u0644\\u0627\\u0628 \\u0627\\u0644\\u0645\\u0631\\u062a\\u0628\\u0637\\u0648\\u0646", "Linked students")}</h3>
        {teacher.linkedStudents.length === 0 ? (
          <EmptyCopy locale={locale} ar="\\u0644\\u0627 \\u064a\\u0648\\u062c\\u062f \\u0637\\u0644\\u0627\\u0628 \\u0645\\u0631\\u062a\\u0628\\u0637\\u0648\\u0646 \\u0628\\u0647\\u0630\\u0627 \\u0627\\u0644\\u0645\\u062f\\u0631\\u0633 \\u062d\\u062a\\u0649 \\u0627\\u0644\\u0622\\u0646" en="No students are linked to this teacher yet" />
        ) : (
          <div className="space-y-3">
            {teacher.linkedStudents.map((student) => {
              const snapshot = buildStudentReportSnapshot(student);
              return (
                <Link key={student.id} href={\`/students/\${student.id}\`} className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{student.fullName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{student.className ?? t(locale, "\\u063a\\u064a\\u0631 \\u0645\\u0633\\u062c\\u0644", "Not assigned")} \\u2022 {student.parentName}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">{snapshot.ready ? t(locale, "\\u062a\\u0642\\u0631\\u064a\\u0631 \\u062c\\u0627\\u0647\\u0632", "Report ready") : t(locale, "\\u0645\\u062a\\u0627\\u0628\\u0639\\u0629", "Follow-up")}</span>
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700 dark:bg-brand-950 dark:text-brand-300">{t(locale, "\\u0627\\u0644\\u0645\\u062a\\u0628\\u0642\\u064a", "Remaining")}: {snapshot.sessionsUntilNext}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return <div className={\`rounded-xl bg-muted/40 \${compact ? "p-3 text-center" : "p-4 text-center"}\`}><p className={\`\${compact ? "text-[11px]" : "text-xs"} text-muted-foreground\`}>{label}</p><p className={\`mt-1 \${compact ? "text-base" : "text-2xl"} font-bold text-foreground\`}>{value}</p></div>;
}

function Info({ icon: Icon, label, value, href, ltr }: { icon: typeof Phone; label: string; value: string; href?: string; ltr?: boolean }) {
  const content = <div className="rounded-xl bg-muted/40 p-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon size={14} />{label}</div><p className="mt-1 font-semibold text-foreground" dir={ltr ? "ltr" : undefined}>{value}</p></div>;
  if (!href) return content;
  return <a href={href} className="block transition-opacity hover:opacity-85">{content}</a>;
}

function EmptyCopy({ locale, ar, en }: { locale: "ar" | "en"; ar: string; en: string }) {
  return <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{t(locale, ar, en)}</div>;
}

function MoneyField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div><label className="mb-1.5 block text-xs font-medium text-foreground">{label}</label><input inputMode="numeric" value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-input bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring" /></div>;
}
`;

fs.writeFileSync(filePath, content, "utf8");
console.log("OK teachers/[id]/page.tsx rewritten");
