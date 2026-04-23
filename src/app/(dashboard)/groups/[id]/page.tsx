"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckSquare,
  ClipboardList,
  PlusCircle,
  Save,
  Trash2,
  Users,
  MessageSquare,
  Power,
} from "lucide-react";
import StudentNotesInline from "@/components/groups/student-notes-inline";
import GroupTasksPanel from "@/components/groups/group-tasks-panel";
import { useUIStore } from "@/stores/ui-store";
import { useCurrentUser } from "@/providers/user-provider";
import { canAccessTeachersForUser } from "@/config/roles";
import { formatCourseLabel } from "@/lib/formatters";
import { t } from "@/lib/locale";
import {
  addStudentsToGroup,
  getGroupDetails,
  removeStudentFromGroup,
  saveGroupNotes,
  saveSessionAttendanceBulk,
  saveSessionOperationsChecklist,
  updateGroupStatus,
} from "@/services/group-operations.service";
import { listStudents } from "@/services/students.service";
import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import type { AttendanceStatus, GroupDetails, StudentListItem } from "@/types/crm";

interface SessionDraft {
  attendanceTaken: boolean;
  materialsUploaded: boolean;
  recordingUploaded: boolean;
  telegramPosted: boolean;
  homeworkShared: boolean;
  operationsNotes: string;
}

interface AttendanceDraft {
  status: AttendanceStatus | null;
  notes: string;
}

function createDraft(session: GroupDetails["sessions"][number]): SessionDraft {
  return {
    attendanceTaken: session.operations?.attendanceTaken ?? false,
    materialsUploaded: session.operations?.materialsUploaded ?? false,
    recordingUploaded: session.operations?.recordingUploaded ?? false,
    telegramPosted: session.operations?.telegramPosted ?? false,
    homeworkShared: session.operations?.homeworkShared ?? false,
    operationsNotes: session.operations?.operationsNotes ?? "",
  };
}

function createAttendanceDrafts(session: GroupDetails["sessions"][number]): Record<string, AttendanceDraft> {
  return Object.fromEntries(
    session.attendanceEntries.map((entry) => [
      entry.studentId,
      {
        status: entry.status,
        notes: entry.notes ?? "",
      },
    ]),
  );
}

export default function GroupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const user = useCurrentUser();
  const canAccess = canAccessTeachersForUser(user);

  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [allStudents, setAllStudents] = useState<StudentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busySessionId, setBusySessionId] = useState<string | null>(null);
  const [busyAttendanceSessionId, setBusyAttendanceSessionId] = useState<string | null>(null);
  const [busyStudentId, setBusyStudentId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [groupNotes, setGroupNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, SessionDraft>>({});
  const [attendanceDrafts, setAttendanceDrafts] = useState<Record<string, Record<string, AttendanceDraft>>>({});

  async function load() {
    setLoading(true);

    const [groupData, studentRows] = await Promise.all([getGroupDetails(id), listStudents()]);
    setGroup(groupData);
    setAllStudents(studentRows);

    if (groupData) {
      setGroupNotes(groupData.groupNotes ?? "");
      const nextDrafts = Object.fromEntries(
        groupData.sessions.map((session) => [session.id, createDraft(session)]),
      );
      setDrafts(nextDrafts);

      const nextAttendanceDrafts = Object.fromEntries(
        groupData.sessions.map((session) => [session.id, createAttendanceDrafts(session)]),
      );
      setAttendanceDrafts(nextAttendanceDrafts);
    }

    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;

    if (!canAccess) {
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    (async () => {
      const [groupData, studentRows] = await Promise.all([getGroupDetails(id), listStudents()]);
      if (!mounted) return;

      setGroup(groupData);
      setAllStudents(studentRows);

      if (groupData) {
        const nextDrafts = Object.fromEntries(
          groupData.sessions.map((session) => [session.id, createDraft(session)]),
        );
        setDrafts(nextDrafts);

        const nextAttendanceDrafts = Object.fromEntries(
          groupData.sessions.map((session) => [session.id, createAttendanceDrafts(session)]),
        );
        setAttendanceDrafts(nextAttendanceDrafts);
      }

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [id, canAccess]);

  const completedSessions = useMemo(() => {
    if (!group) return 0;

    return group.sessions.filter((session) => {
      const operations = session.operations;
      return (
        operations?.attendanceTaken &&
        operations?.materialsUploaded &&
        operations?.recordingUploaded &&
        operations?.telegramPosted &&
        operations?.homeworkShared
      );
    }).length;
  }, [group]);

  const availableStudents = useMemo(() => {
    if (!group) return [];

    const linkedIds = new Set(group.linkedStudents.map((student) => student.id));
    return allStudents.filter((student) => !linkedIds.has(student.id));
  }, [allStudents, group]);

  function updateDraft(sessionId: string, patch: Partial<SessionDraft>) {
    setDrafts((prev) => ({
      ...prev,
      [sessionId]: {
        ...prev[sessionId],
        ...patch,
      },
    }));
  }

  function updateAttendanceDraft(
    sessionId: string,
    studentId: string,
    patch: Partial<AttendanceDraft>,
  ) {
    setAttendanceDrafts((prev) => ({
      ...prev,
      [sessionId]: {
        ...(prev[sessionId] ?? {}),
        [studentId]: {
          ...(prev[sessionId]?.[studentId] ?? { status: null, notes: "" }),
          ...patch,
        },
      },
    }));
  }

  async function handleAddStudent() {
    if (!group || !selectedStudentId) return;

    setBusyStudentId(selectedStudentId);

    try {
      await addStudentsToGroup(group.id, group.course, [selectedStudentId]);
      toast.success(t(locale, "تمت إضافة الطالب إلى الجروب", "Student added to the group"));
      setSelectedStudentId("");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر إضافة الطالب", "Could not add student"));
    } finally {
      setBusyStudentId(null);
    }
  }

  async function handleRemoveStudent(studentId: string) {
    if (!group) return;

    const confirmed = window.confirm(
      t(locale, "هل تريد حذف هذا الطالب من الجروب؟", "Remove this student from the group?"),
    );
    if (!confirmed) return;

    setBusyStudentId(studentId);

    try {
      await removeStudentFromGroup(group.id, studentId);
      toast.success(t(locale, "تم حذف الطالب من الجروب", "Student removed from the group"));
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر حذف الطالب", "Could not remove student"));
    } finally {
      setBusyStudentId(null);
    }
  }

  async function handleSaveAttendance(sessionId: string) {
    if (!group) return;

    const session = group.sessions.find((item) => item.id === sessionId);
    if (!session) return;

    const sessionDrafts = attendanceDrafts[sessionId] ?? {};

    setBusyAttendanceSessionId(sessionId);

    try {
      await saveSessionAttendanceBulk({
        sessionId,
        entries: session.attendanceEntries.map((entry) => ({
          studentId: entry.studentId,
          status: sessionDrafts[entry.studentId]?.status ?? entry.status ?? null,
          notes: sessionDrafts[entry.studentId]?.notes ?? entry.notes ?? "",
        })),
      });

      toast.success(t(locale, "تم حفظ حضور الحصة بنجاح", "Session attendance saved successfully"));
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر حفظ الحضور", "Could not save attendance"));
    } finally {
      setBusyAttendanceSessionId(null);
    }
  }

  async function handleSaveSession(sessionId: string) {
    if (!group) return;

    const session = group.sessions.find((item) => item.id === sessionId);
    const draft = drafts[sessionId];

    if (!session || !draft) return;

    if (!session.classId || !session.teacherId) {
      toast.error(
        t(
          locale,
          "لا يمكن حفظ checklist لهذه الحصة لأن بيانات الربط غير مكتملة.",
          "Cannot save this checklist because the session linkage data is incomplete.",
        ),
      );
      return;
    }

    setBusySessionId(sessionId);

    try {
      await saveSessionOperationsChecklist({
        sessionId: session.id,
        classId: session.classId,
        teacherId: session.teacherId,
        attendanceTaken: draft.attendanceTaken,
        materialsUploaded: draft.materialsUploaded,
        recordingUploaded: draft.recordingUploaded,
        telegramPosted: draft.telegramPosted,
        homeworkShared: draft.homeworkShared,
        operationsNotes: draft.operationsNotes,
      });

      toast.success(
        t(
          locale,
          "تم حفظ checklist التشغيل للحصة بنجاح",
          "Session operations checklist saved successfully",
        ),
      );

      await load();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t(locale, "تعذر حفظ checklist الحصة", "Could not save session checklist"),
      );
    } finally {
      setBusySessionId(null);
    }
  }

  if (!canAccess) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="هذا القسم خاص بتشغيل المدرسين"
        titleEn="This section is restricted to teacher operations"
        descriptionAr="تفاصيل الجروبات وتشغيل الحصص متاحة فقط للمستخدم المسؤول عن تشغيل المدرسين."
        descriptionEn="Group details and session operations are restricted to the assigned teacher operations owner."
        actionHref="/"
        actionLabelAr="العودة إلى لوحة التحكم"
        actionLabelEn="Back to dashboard"
      />
    );
  }

  if (loading) {
    return (
      <LoadingState
        titleAr="جارِ تحميل تفاصيل الجروب"
        titleEn="Loading group details"
        descriptionAr="يتم الآن تجهيز الطلاب والحصص وبيانات التشغيل الخاصة بالجروب."
        descriptionEn="Preparing students, sessions, and operational group data."
      />
    );
  }

  if (!group) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="الجروب غير موجود"
        titleEn="Group not found"
        descriptionAr="قد يكون هذا الجروب محذوفًا أو الرابط غير صحيح."
        descriptionEn="This group may have been removed or the link is incorrect."
        actionHref="/groups"
        actionLabelAr="العودة إلى الجروبات"
        actionLabelEn="Back to groups"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/groups" className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
              {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{group.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {group.teacherName} • {formatCourseLabel(group.course, locale)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              {formatCourseLabel(group.course, locale)}
            </span>
            {!group.isActive ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                {t(locale, "غير نشط", "Inactive")}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Metric label={t(locale, "الطلاب", "Students")} value={group.studentsCount} />
        <Metric label={t(locale, "الحصص", "Sessions")} value={group.sessionsCount} />
        <Metric label={t(locale, "الـ checklist المكتملة", "Completed checklists")} value={completedSessions} />
        <Metric label={t(locale, "أقرب حصة", "Next session")} value={group.nextSessionStartTime ?? "—"} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <Users size={18} className="text-brand-600" />
            {t(locale, "الطلاب داخل الجروب", "Students inside the group")}
          </h2>

          <div className="mb-4 rounded-2xl border border-dashed border-border bg-muted/20 p-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              {t(locale, "إضافة طالب إلى الجروب", "Add a student to the group")}
            </label>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
              <select
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              >
                <option value="">{t(locale, "اختر طالبًا", "Choose a student")}</option>
                {availableStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.fullName} — {student.parentName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddStudent}
                disabled={!selectedStudentId || busyStudentId !== null}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                <PlusCircle size={16} />
                {t(locale, "إضافة الطالب", "Add student")}
              </button>
            </div>
          </div>

          {group.linkedStudents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {t(locale, "لا يوجد طلاب مرتبطون بهذا الجروب بعد", "No students are linked to this group yet")}
            </div>
          ) : (
            <div className="space-y-3">
              {group.linkedStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4"
                >
                  <Link href={"/students/" + student.id} className="min-w-0 flex-1 transition-colors hover:text-brand-700">
                    <p className="truncate font-semibold text-foreground">{student.fullName}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {student.parentName} • {student.parentPhone}
                    </p>
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                      {student.sessionsAttended} {t(locale, "حصة", "sessions")}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(student.id)}
                      disabled={busyStudentId !== null}
                      className="inline-flex items-center gap-1 rounded-xl border border-danger-300 bg-danger-50 px-3 py-2 text-xs font-semibold text-danger-700 transition-colors hover:bg-danger-100 disabled:opacity-50 dark:border-danger-800 dark:bg-danger-950/30 dark:text-danger-300"
                    >
                      <Trash2 size={14} />
                      {busyStudentId === student.id ? t(locale, "جارٍ الحذف...", "Removing...") : t(locale, "حذف", "Remove")}
                    </button>
                  </div>
                  <StudentNotesInline groupId={id} studentId={student.id} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <BookOpen size={18} className="text-brand-600" />
            {t(locale, "ملخص الجروب", "Group summary")}
          </h2>

          <div className="space-y-3">
            <InfoRow label={t(locale, "اسم الجروب", "Group name")} value={group.name} />
            <InfoRow label={t(locale, "المدرس", "Teacher")} value={group.teacherName} />
            <InfoRow label={t(locale, "الكورس", "Course")} value={formatCourseLabel(group.course, locale)} />
            <InfoRow label={t(locale, "تاريخ البداية", "Start date")} value={group.startDate} />
            <InfoRow label={t(locale, "عدد الطلاب", "Students count")} value={String(group.studentsCount)} />
            <InfoRow label={t(locale, "عدد الحصص", "Sessions count")} value={String(group.sessionsCount)} />
            <InfoRow
              label={t(locale, "أقرب حصة", "Next session")}
              value={
                group.nextSessionDate
                  ? group.nextSessionDate + (group.nextSessionStartTime ? " • " + group.nextSessionStartTime : "")
                  : t(locale, "لا توجد حصة قادمة", "No upcoming session")
              }
            />
          </div>
        </div>
      </div>

      {/* ── Group Notes & Status ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
            <MessageSquare size={18} className="text-brand-600" />
            {t(locale, "ملاحظات الجروب", "Group Notes")}
          </h2>
          <textarea
            value={groupNotes}
            onChange={(event) => setGroupNotes(event.target.value)}
            rows={4}
            placeholder={t(locale, "ملاحظات تشغيلية، feedback، أو تعليمات خاصة بالجروب...", "Operational notes, feedback, or group-specific instructions...")}
            className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={async () => {
              setSavingNotes(true);
              try {
                await saveGroupNotes(group.id, groupNotes);
                toast.success(t(locale, "تم حفظ الملاحظات", "Notes saved"));
              } catch (err) {
                toast.error(err instanceof Error ? err.message : t(locale, "تعذر الحفظ", "Could not save"));
              } finally {
                setSavingNotes(false);
              }
            }}
            disabled={savingNotes}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
          >
            <Save size={16} />
            {savingNotes ? t(locale, "جارِ الحفظ...", "Saving...") : t(locale, "حفظ الملاحظات", "Save notes")}
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
            <Power size={18} className="text-brand-600" />
            {t(locale, "حالة الجروب", "Group Status")}
          </h2>
          <div className="mb-3 flex items-center gap-3">
            <span className={"inline-flex rounded-full px-3 py-1 text-xs font-semibold " + (group.groupStatus === "active" ? "bg-success-50 text-success-600 dark:bg-success-950 dark:text-success-300" : group.groupStatus === "planned" ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300")}>
              {group.groupStatus === "active" ? t(locale, "نشط", "Active") : group.groupStatus === "planned" ? t(locale, "مخطط", "Planned") : t(locale, "مكتمل", "Completed")}
            </span>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            {group.groupStatus === "completed"
              ? t(locale, "هذا الجروب مكتمل. يمكنك إعادة تفعيله.", "This group is completed. You can reactivate it.")
              : t(locale, "يمكنك إنهاء الجروب عند اكتمال الكورس.", "You can mark the group as completed when the course is done.")}
          </p>
          <button
            type="button"
            onClick={async () => {
              const next = !group.isActive;
              const msg = next
                ? t(locale, "هل تريد إعادة تفعيل الجروب؟", "Reactivate this group?")
                : t(locale, "هل تريد إنهاء هذا الجروب؟", "Mark this group as completed?");
              if (!window.confirm(msg)) return;
              setTogglingStatus(true);
              try {
                await updateGroupStatus(group.id, next);
                toast.success(t(locale, "تم تحديث حالة الجروب", "Group status updated"));
                await load();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : t(locale, "تعذر التحديث", "Could not update"));
              } finally {
                setTogglingStatus(false);
              }
            }}
            disabled={togglingStatus}
            className={"inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 " + (group.isActive ? "border border-danger-300 bg-danger-50 text-danger-700 hover:bg-danger-100 dark:border-danger-800 dark:bg-danger-950/30 dark:text-danger-300" : "bg-success-600 text-white hover:bg-success-500")}
          >
            <Power size={16} />
            {group.isActive ? t(locale, "إنهاء الجروب", "Complete group") : t(locale, "إعادة تفعيل", "Reactivate")}
          </button>
        </div>
      </div>

            {/* ─── Group Tasks ─── */}
      <GroupTasksPanel groupId={id} />

<div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
          <ClipboardList size={18} className="text-brand-600" />
          {t(locale, "تشغيل الحصص", "Session operations")}
        </h2>

        {group.sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t(locale, "لا توجد حصص مرتبطة بهذا الجروب بعد", "No sessions are linked to this group yet")}
          </div>
        ) : (
          <div className="space-y-4">
            {group.sessions.map((session) => {
              const draft = drafts[session.id] ?? createDraft(session);
              const isSaving = busySessionId === session.id;
              const isSavingAttendance = busyAttendanceSessionId === session.id;

              return (
                <div key={session.id} className="rounded-2xl border border-border bg-background p-4">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{session.className}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {session.sessionDate ?? "—"} • {session.startTime} - {session.endTime}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                        {t(locale, "حضور", "Present")}: {session.attendanceSummary.present}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                        {t(locale, "غياب", "Absent")}: {session.attendanceSummary.absent}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                        {t(locale, "تأخير", "Late")}: {session.attendanceSummary.late}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                        {t(locale, "معذور", "Excused")}: {session.attendanceSummary.excused}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 rounded-2xl border border-border bg-card p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-foreground">
                        {t(locale, "جدول الحضور والغياب", "Attendance table")}
                      </h3>

                      <button
                        type="button"
                        onClick={() => handleSaveAttendance(session.id)}
                        disabled={isSavingAttendance}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                      >
                        <Save size={16} />
                        {isSavingAttendance
                          ? t(locale, "جارِ حفظ الحضور...", "Saving attendance...")
                          : t(locale, "حفظ الحضور", "Save attendance")}
                      </button>
                    </div>

                    {session.attendanceEntries.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                        {t(locale, "لا يوجد طلاب داخل هذه الحصة بعد", "No students are attached to this session yet")}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {session.attendanceEntries.map((entry) => {
                          const current = attendanceDrafts[session.id]?.[entry.studentId] ?? {
                            status: entry.status,
                            notes: entry.notes ?? "",
                          };

                          return (
                            <div
                              key={entry.studentId}
                              className="grid grid-cols-1 gap-3 rounded-2xl border border-border p-4 lg:grid-cols-[1.2fr_0.7fr_1fr]"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-foreground">{entry.studentName}</p>
                                <p className="mt-1 truncate text-xs text-muted-foreground">{entry.parentName}</p>
                              </div>

                              <select
                                value={current.status ?? ""}
                                onChange={(event) =>
                                  updateAttendanceDraft(session.id, entry.studentId, {
                                    status: event.target.value ? (event.target.value as AttendanceStatus) : null,
                                  })
                                }
                                className="rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
                              >
                                <option value="">{t(locale, "غير محدد", "Unmarked")}</option>
                                <option value="present">{t(locale, "حضور", "Present")}</option>
                                <option value="absent">{t(locale, "غياب", "Absent")}</option>
                                <option value="late">{t(locale, "تأخير", "Late")}</option>
                                <option value="excused">{t(locale, "معذور", "Excused")}</option>
                              </select>

                              <input
                                value={current.notes}
                                onChange={(event) =>
                                  updateAttendanceDraft(session.id, entry.studentId, {
                                    notes: event.target.value,
                                  })
                                }
                                placeholder={t(locale, "ملاحظة اختيارية", "Optional note")}
                                className="rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <CheckItem
                      label={t(locale, "تم تسجيل الحضور", "Attendance taken")}
                      checked={draft.attendanceTaken}
                      onChange={(checked) => updateDraft(session.id, { attendanceTaken: checked })}
                    />
                    <CheckItem
                      label={t(locale, "تم رفع المادة التعليمية", "Materials uploaded")}
                      checked={draft.materialsUploaded}
                      onChange={(checked) => updateDraft(session.id, { materialsUploaded: checked })}
                    />
                    <CheckItem
                      label={t(locale, "تم رفع التسجيل", "Recording uploaded")}
                      checked={draft.recordingUploaded}
                      onChange={(checked) => updateDraft(session.id, { recordingUploaded: checked })}
                    />
                    <CheckItem
                      label={t(locale, "تم النشر على Telegram", "Posted to Telegram")}
                      checked={draft.telegramPosted}
                      onChange={(checked) => updateDraft(session.id, { telegramPosted: checked })}
                    />
                    <CheckItem
                      label={t(locale, "تم إرسال الواجب", "Homework shared")}
                      checked={draft.homeworkShared}
                      onChange={(checked) => updateDraft(session.id, { homeworkShared: checked })}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      {t(locale, "ملاحظات تشغيلية", "Operations notes")}
                    </label>
                    <textarea
                      value={draft.operationsNotes}
                      onChange={(event) => updateDraft(session.id, { operationsNotes: event.target.value })}
                      rows={3}
                      className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSession(session.id)}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {isSaving
                        ? t(locale, "جارِ الحفظ...", "Saving...")
                        : t(locale, "حفظ checklist الحصة", "Save session checklist")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground">
      <CheckSquare size={16} className={checked ? "text-brand-600" : "text-muted-foreground"} />
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-input"
      />
      <span>{label}</span>
    </label>
  );
}
