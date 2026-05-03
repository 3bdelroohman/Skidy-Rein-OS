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
  FileText,
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
  completeGroupSessionSeries,
  createGroupSessionSeries,
  deleteGroupPermanently,
  getGroupDetails,
  listGroups,
  moveStudentToGroup,
  removeStudentFromGroup,
  saveGroupNotes,
  saveSessionAttendanceBulk,
  saveSessionOperationsChecklist,
  updateGroupSessionSchedule,
  updateGroupStatus,
} from "@/services/group-operations.service";
import { listStudents } from "@/services/students.service";
import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import type { AttendanceStatus, GroupDetails, GroupListItem, StudentListItem } from "@/types/crm";


type GroupSeriesRecurrenceMode = "weekly" | "twice_weekly" | "custom";

interface CreateGroupSeriesDraft {
  firstSessionDate: string;
  startTime: string;
  endTime: string;
  targetCount: number;
  recurrenceMode: GroupSeriesRecurrenceMode;
  selectedWeekdays: number[];
}

const GROUP_SERIES_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

function getLocalDateInput(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekdayFromDateInput(dateValue: string): number {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function getGroupSeriesDayLabel(day: number, locale: "ar" | "en"): string {
  const labels = locale === "ar"
    ? ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return labels[day] ?? String(day);
}

function toggleNumber(list: number[], value: number): number[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value].sort((a, b) => a - b);
}

function createDefaultGroupSeriesDraft(): CreateGroupSeriesDraft {
  const today = getLocalDateInput();
  return {
    firstSessionDate: today,
    startTime: "16:00",
    endTime: "17:00",
    targetCount: 8,
    recurrenceMode: "weekly",
    selectedWeekdays: [getWeekdayFromDateInput(today)],
  };
}

function resolveGroupSeriesWeekdays(input: {
  draft: CreateGroupSeriesDraft;
  locale: "ar" | "en";
}): number[] {
  const anchorDay = getWeekdayFromDateInput(input.draft.firstSessionDate);

  if (input.draft.recurrenceMode === "weekly") {
    return [anchorDay];
  }

  const selected = [...new Set(input.draft.selectedWeekdays)].sort((a, b) => a - b);

  if (!selected.includes(anchorDay)) {
    throw new Error(
      t(
        input.locale,
        "يجب أن تشمل أيام التكرار يوم أول حصة الذي اخترته في التاريخ.",
        "Selected recurrence days must include the weekday of the first session date.",
      ),
    );
  }

  if (input.draft.recurrenceMode === "twice_weekly" && selected.length !== 2) {
    throw new Error(t(input.locale, "اختر يومين بالضبط للتكرار مرتين أسبوعيًا.", "Choose exactly two days for twice-weekly recurrence."));
  }

  if (input.draft.recurrenceMode === "custom" && selected.length < 1) {
    throw new Error(t(input.locale, "اختر يومًا واحدًا على الأقل.", "Choose at least one weekday."));
  }

  return selected;
}
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
interface SessionDeferDraft {
  sessionDate: string;
  startTime: string;
  endTime: string;
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


type SessionTimelineStatus = "upcoming" | "today" | "past" | "no_date";

function getSessionTimelineStatus(session: GroupDetails["sessions"][number]): SessionTimelineStatus {
  if (!session.sessionDate) return "no_date";

  const today = new Date().toISOString().slice(0, 10);
  if (session.sessionDate === today) return "today";
  return session.sessionDate > today ? "upcoming" : "past";
}

function getSessionStatusMeta(session: GroupDetails["sessions"][number], locale: "ar" | "en") {
  const status = getSessionTimelineStatus(session);

  if (status === "today") {
    return {
      label: t(locale, "اليوم", "Today"),
      className: "border-info-100 bg-info-50 text-info-700",
    };
  }

  if (status === "upcoming") {
    return {
      label: t(locale, "قادمة", "Upcoming"),
      className: "border-brand-100 bg-brand-50 text-brand-700",
    };
  }

  if (status === "past") {
    return {
      label: t(locale, "فائتة", "Past"),
      className: "border-border bg-muted text-muted-foreground",
    };
  }

  return {
    label: t(locale, "بدون تاريخ", "No date"),
    className: "border-warning-100 bg-warning-50 text-warning-700",
  };
}

function getMarkedAttendanceCount(session: GroupDetails["sessions"][number]): number {
  return (
    session.attendanceSummary.present +
    session.attendanceSummary.absent +
    session.attendanceSummary.late +
    session.attendanceSummary.excused
  );
}

function isSessionOperationsComplete(session: GroupDetails["sessions"][number]): boolean {
  const operations = session.operations;
  return Boolean(
    operations?.attendanceTaken &&
    operations?.materialsUploaded &&
    operations?.recordingUploaded &&
    operations?.telegramPosted &&
    operations?.homeworkShared
  );
}

function createDeferDraft(session: GroupDetails["sessions"][number]): SessionDeferDraft {
  return {
    sessionDate: session.sessionDate ?? "",
    startTime: session.startTime,
    endTime: session.endTime,
  };
}
export default function GroupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const user = useCurrentUser();
  const canAccess = canAccessTeachersForUser(user);

  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [allStudents, setAllStudents] = useState<StudentListItem[]>([]);
  const [allGroups, setAllGroups] = useState<GroupListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busySessionId, setBusySessionId] = useState<string | null>(null);
  const [busyAttendanceSessionId, setBusyAttendanceSessionId] = useState<string | null>(null);
  const [busyDeferSessionId, setBusyDeferSessionId] = useState<string | null>(null);
  const [busyCompletingSessions, setBusyCompletingSessions] = useState(false);
  const [busyStudentId, setBusyStudentId] = useState<string | null>(null);
  const [busyMoveStudentId, setBusyMoveStudentId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [moveTargets, setMoveTargets] = useState<Record<string, string>>({});
  const [groupNotes, setGroupNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, SessionDraft>>({});
  const [attendanceDrafts, setAttendanceDrafts] = useState<Record<string, Record<string, AttendanceDraft>>>({});
  const [deferDrafts, setDeferDrafts] = useState<Record<string, SessionDeferDraft>>({});

  const [busyCreatingSessionSeries, setBusyCreatingSessionSeries] = useState(false);
  const [newSeriesDraft, setNewSeriesDraft] = useState<CreateGroupSeriesDraft>(() => createDefaultGroupSeriesDraft());
  async function load() {
    setLoading(true);

    const [groupData, studentRows, groupRows] = await Promise.all([getGroupDetails(id), listStudents(), listGroups()]);
    setGroup(groupData);
    setAllStudents(studentRows);
    setAllGroups(groupRows);

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

      const nextDeferDrafts = Object.fromEntries(
        groupData.sessions.map((session) => [session.id, createDeferDraft(session)]),
      );
      setDeferDrafts(nextDeferDrafts);
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
      const [groupData, studentRows, groupRows] = await Promise.all([getGroupDetails(id), listStudents(), listGroups()]);
      if (!mounted) return;

      setGroup(groupData);
      setAllStudents(studentRows);
      setAllGroups(groupRows);

      if (groupData) {
        const nextDrafts = Object.fromEntries(
          groupData.sessions.map((session) => [session.id, createDraft(session)]),
        );
        setDrafts(nextDrafts);

        const nextAttendanceDrafts = Object.fromEntries(
          groupData.sessions.map((session) => [session.id, createAttendanceDrafts(session)]),
        );
        setAttendanceDrafts(nextAttendanceDrafts);

      const nextDeferDrafts = Object.fromEntries(
        groupData.sessions.map((session) => [session.id, createDeferDraft(session)]),
      );
      setDeferDrafts(nextDeferDrafts);
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

  const availableTargetGroups = useMemo(() => {
    if (!group) return [];

    return allGroups
      .filter((item) => item.id !== group.id && item.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allGroups, group]);
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

  function updateMoveTarget(studentId: string, targetGroupId: string) {
    setMoveTargets((prev) => ({
      ...prev,
      [studentId]: targetGroupId,
    }));
  }

  async function handleMoveStudent(studentId: string) {
    if (!group) return;

    const targetGroupId = moveTargets[studentId];
    const targetGroup = availableTargetGroups.find((item) => item.id === targetGroupId);

    if (!targetGroup) {
      toast.error(t(locale, "اختر الجروب الجديد أولًا", "Choose the target group first"));
      return;
    }

    const confirmed = window.confirm(
      t(
        locale,
        `سيتم نقل الطالب إلى ${targetGroup.name}. سيظل تاريخ الحضور القديم محفوظًا في هذا الجروب. هل تريد المتابعة؟`,
        `Student will be moved to ${targetGroup.name}. Previous attendance history in this group will remain preserved. Continue?`,
      ),
    );

    if (!confirmed) return;

    setBusyMoveStudentId(studentId);

    try {
      await moveStudentToGroup({
        sourceGroupId: group.id,
        targetGroupId: targetGroup.id,
        studentId,
        targetCourse: targetGroup.course,
      });

      toast.success(t(locale, "تم نقل الطالب إلى الجروب الجديد", "Student moved to the target group"));
      setMoveTargets((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر نقل الطالب", "Could not move student"));
    } finally {
      setBusyMoveStudentId(null);
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

  function updateDeferDraft(sessionId: string, patch: Partial<SessionDeferDraft>) {
    setDeferDrafts((prev) => ({
      ...prev,
      [sessionId]: {
        ...(prev[sessionId] ?? { sessionDate: "", startTime: "", endTime: "" }),
        ...patch,
      },
    }));
  }

  async function handleDeferSession(sessionId: string) {
    if (!group) return;

    const session = group.sessions.find((item) => item.id === sessionId);
    const draft = deferDrafts[sessionId];
    if (!session || !draft) return;

    if (!draft.sessionDate || !draft.startTime || !draft.endTime) {
      toast.error(t(locale, "حدد التاريخ ووقت البداية والنهاية أولًا", "Choose date, start time, and end time first"));
      return;
    }

    const confirmed = window.confirm(
      t(
        locale,
        "سيتم تعديل موعد هذه الحصة فقط بدون تغيير مواعيد باقي الحصص. هل تريد المتابعة؟",
        "Only this session will be rescheduled. The other sessions will not shift. Continue?",
      ),
    );

    if (!confirmed) return;

    setBusyDeferSessionId(sessionId);

    try {
      await updateGroupSessionSchedule({
        sessionId,
        sessionDate: draft.sessionDate,
        startTime: draft.startTime,
        endTime: draft.endTime,
      });

      toast.success(t(locale, "تم تأجيل هذه الحصة فقط", "Only this session was rescheduled"));
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر تأجيل الحصة", "Could not reschedule session"));
    } finally {
      setBusyDeferSessionId(null);
    }
  }

  function updateNewSeriesDraft(patch: Partial<CreateGroupSeriesDraft>) {
    setNewSeriesDraft((prev) => ({
      ...prev,
      ...patch,
    }));
  }


  async function handleDeleteGroupPermanently() {
    if (!group) return;

    const firstConfirm = window.confirm(
      t(
        locale,
        "تحذير: هذا حذف نهائي. سيتم حذف الجروب وحصصه وحضور الحصص وربط الطلاب به. استخدمه فقط لو الجروب اتعمل بالخطأ. هل تريد المتابعة؟",
        "Warning: this is permanent. It will delete the group, its sessions, attendance records, and student enrollments. Use it only for mistaken groups. Continue?",
      ),
    );

    if (!firstConfirm) return;

    const typed = window.prompt(
      t(
        locale,
        `للتأكيد النهائي اكتب اسم الجروب كما هو: ${group.name}`,
        `For final confirmation, type the group name exactly: ${group.name}`,
      ),
    );

    if (typed !== group.name) {
      toast.error(t(locale, "لم يتم الحذف لأن اسم الجروب غير مطابق.", "Group was not deleted because the name did not match."));
      return;
    }

    setDeletingGroup(true);

    try {
      await deleteGroupPermanently(group.id);
      toast.success(t(locale, "تم حذف الجروب نهائيًا", "Group permanently deleted"));
      window.location.href = "/groups";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر حذف الجروب نهائيًا", "Could not permanently delete group"));
    } finally {
      setDeletingGroup(false);
    }
  }
  async function handleCreateSessionSeries() {
    if (!group) return;

    if (!newSeriesDraft.firstSessionDate || !newSeriesDraft.startTime || !newSeriesDraft.endTime) {
      toast.error(t(locale, "حدد تاريخ أول حصة ووقت البداية والنهاية أولًا.", "Choose first session date, start time, and end time first."));
      return;
    }

    if (newSeriesDraft.startTime >= newSeriesDraft.endTime) {
      toast.error(t(locale, "وقت النهاية يجب أن يكون بعد وقت البداية.", "End time must be after start time."));
      return;
    }

    const targetCount = Math.min(48, Math.max(1, Number(newSeriesDraft.targetCount) || 1));
    const recurrenceWeekdays = resolveGroupSeriesWeekdays({ draft: newSeriesDraft, locale });
    const dayLabels = recurrenceWeekdays.map((day) => getGroupSeriesDayLabel(day, locale)).join("، ");

    const confirmed = window.confirm(
      t(
        locale,
        `سيتم إنشاء ${targetCount} حصة داخل هذا الجروب فقط، بداية من ${newSeriesDraft.firstSessionDate}، أيام: ${dayLabels}. هل تريد المتابعة؟`,
        `${targetCount} sessions will be created inside this group only, starting ${newSeriesDraft.firstSessionDate}, on: ${dayLabels}. Continue?`,
      ),
    );

    if (!confirmed) return;

    setBusyCreatingSessionSeries(true);

    try {
      const result = await createGroupSessionSeries({
        groupId: group.id,
        firstSessionDate: newSeriesDraft.firstSessionDate,
        startTime: newSeriesDraft.startTime,
        endTime: newSeriesDraft.endTime,
        targetCount,
        recurrenceWeekdays,
      });

      toast.success(
        t(
          locale,
          `تم إنشاء ${result.createdCount} حصة. إجمالي الحصص الآن ${result.totalCount}.`,
          `${result.createdCount} sessions created. Total sessions is now ${result.totalCount}.`,
        ),
      );

      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر إنشاء حصص الجروب", "Could not create group sessions"));
    } finally {
      setBusyCreatingSessionSeries(false);
    }
  }
  async function handleCompleteSessionSeries() {
    if (!group) return;

    if (group.sessions.length === 0) {
      toast.error(t(locale, "أنشئ أول حصة للجروب من الجدول أولًا، ثم ارجع لاستكمال السلسلة.", "Create the first group session from the schedule first, then come back to complete the series."));
      return;
    }

    if (group.sessions.length >= 8) {
      toast.success(t(locale, "الجروب لديه 8 حصص أو أكثر بالفعل", "This group already has 8 sessions or more"));
      return;
    }

    const missingCount = Math.max(0, 8 - group.sessions.length);
    const confirmed = window.confirm(
      t(
        locale,
        `سيتم إنشاء ${missingCount} حصص ناقصة أسبوعيًا من أول حصة في الجروب. لن يتم تعديل الحصص الموجودة. هل تريد المتابعة؟`,
        `${missingCount} missing weekly sessions will be created from the first group session. Existing sessions will not be modified. Continue?`,
      ),
    );

    if (!confirmed) return;

    setBusyCompletingSessions(true);

    try {
      const result = await completeGroupSessionSeries({
        groupId: group.id,
        targetCount: 8,
      });

      if (result.createdCount === 0) {
        toast.success(t(locale, "لا توجد حصص ناقصة لإنشائها", "No missing sessions needed to be created"));
      } else {
        toast.success(
          t(
            locale,
            `تم إنشاء ${result.createdCount} حصص. إجمالي الحصص الآن ${result.totalCount}.`,
            `${result.createdCount} sessions created. Total sessions is now ${result.totalCount}.`,
          ),
        );
      }

      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر استكمال حصص الجروب", "Could not complete group sessions"));
    } finally {
      setBusyCompletingSessions(false);
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
          <Link href={"/groups/" + group.id + "/edit"} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            {t(locale, "تعديل البيانات", "Edit data")}
          </Link>
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
                  data-group-student-row
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4"
                >
                  <Link href={"/students/" + student.id} className="block min-w-0 rounded-xl px-1 py-1 transition-colors hover:text-brand-700">
                    <p data-group-student-name className="truncate text-base font-bold text-foreground">{student.fullName || t(locale, "طالب بدون اسم", "Unnamed student")}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {student.parentName} • {student.parentPhone}
                    </p>
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                      {student.sessionsAttended} {t(locale, "حصة", "sessions")}
                    </span>

                    <Link
                      href={"/groups/" + id + "/report/" + student.id}
                      className="inline-flex items-center gap-1 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/30 dark:text-brand-300"
                      title={t(locale, "تقرير ولي الأمر", "Parent report")}
                    >
                      <FileText size={14} />
                      {t(locale, "تقرير", "Report")}
                    </Link>
                    <div data-student-move-controls className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <select
                        value={moveTargets[student.id] ?? ""}
                        onChange={(event) => updateMoveTarget(student.id, event.target.value)}
                        disabled={busyMoveStudentId !== null || availableTargetGroups.length === 0}
                        className="min-w-44 rounded-xl border border-input bg-card px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-ring disabled:opacity-50"
                      >
                        <option value="">{t(locale, "نقل إلى جروب...", "Move to group...")}</option>
                        {availableTargetGroups.map((targetGroup) => (
                          <option key={targetGroup.id} value={targetGroup.id}>
                            {targetGroup.name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleMoveStudent(student.id)}
                        disabled={busyMoveStudentId !== null || !moveTargets[student.id]}
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-info-100 bg-info-50 px-3 py-2 text-xs font-semibold text-info-700 transition-colors hover:bg-info-100 disabled:opacity-50"
                      >
                        {busyMoveStudentId === student.id ? t(locale, "جاري النقل...", "Moving...") : t(locale, "نقل", "Move")}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(student.id)}
                      disabled={busyStudentId !== null || busyMoveStudentId !== null}
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
            <InfoRow label={t(locale, "مدة حصة المدرس", "Teacher session duration")} value={group.teacherSessionDurationMinutes ? String(group.teacherSessionDurationMinutes) + " " + t(locale, "دقيقة", "min") : "—"} />
            <InfoRow label={t(locale, "حساب المدرس للحصة", "Teacher rate per session")} value={group.teacherSessionRate ? String(group.teacherSessionRate) : "—"} />
            <InfoRow label={t(locale, "ملاحظات حساب المدرس", "Teacher finance notes")} value={group.teacherFinanceNotes || "—"} />
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
            <div data-delete-group-permanently className="mt-4 border-t border-danger-100 pt-4">
              <p className="mb-3 text-xs leading-6 text-muted-foreground">
                {t(
                  locale,
                  "لو أنشأت هذا الجروب بالخطأ، يمكنك حذفه نهائيًا. هذا الإجراء لا يمكن التراجع عنه.",
                  "If this group was created by mistake, you can permanently delete it. This action cannot be undone.",
                )}
              </p>
              <button
                type="button"
                onClick={handleDeleteGroupPermanently}
                disabled={deletingGroup}
                className="inline-flex items-center gap-2 rounded-xl border border-danger-300 bg-danger-50 px-4 py-2.5 text-sm font-semibold text-danger-700 transition-colors hover:bg-danger-100 disabled:opacity-50 dark:border-danger-800 dark:bg-danger-950/30 dark:text-danger-300"
              >
                <Trash2 size={16} />
                {deletingGroup ? t(locale, "جاري الحذف...", "Deleting...") : t(locale, "حذف الجروب نهائيًا", "Delete group permanently")}
              </button>
            </div>
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
                <div data-create-session-series className="mb-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                  <div className="mb-4">
                    <p className="text-sm font-bold text-brand-700">
                      {t(locale, "إنشاء حصص لهذا الجروب", "Create sessions for this group")}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-brand-700/80">
                      {t(locale, "هذا الخيار ينشئ الحصص داخل الجروب الحالي فقط، بدون إنشاء جروب جديد.", "This creates sessions inside the current group only, without creating a new group.")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-brand-700">
                        {t(locale, "تاريخ أول حصة", "First session date")}
                      </span>
                      <input
                        type="date"
                        value={newSeriesDraft.firstSessionDate}
                        onChange={(event) => {
                          const nextDate = event.target.value;
                          updateNewSeriesDraft({
                            firstSessionDate: nextDate,
                            selectedWeekdays:
                              newSeriesDraft.recurrenceMode === "weekly"
                                ? [getWeekdayFromDateInput(nextDate)]
                                : newSeriesDraft.selectedWeekdays,
                          });
                        }}
                        className="w-full rounded-xl border border-brand-100 bg-card px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-brand-700">
                        {t(locale, "من", "From")}
                      </span>
                      <input
                        type="time"
                        value={newSeriesDraft.startTime}
                        onChange={(event) => updateNewSeriesDraft({ startTime: event.target.value })}
                        className="w-full rounded-xl border border-brand-100 bg-card px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-brand-700">
                        {t(locale, "إلى", "To")}
                      </span>
                      <input
                        type="time"
                        value={newSeriesDraft.endTime}
                        onChange={(event) => updateNewSeriesDraft({ endTime: event.target.value })}
                        className="w-full rounded-xl border border-brand-100 bg-card px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-brand-700">
                        {t(locale, "عدد الحصص", "Sessions count")}
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={48}
                        value={newSeriesDraft.targetCount}
                        onChange={(event) => updateNewSeriesDraft({ targetCount: Number(event.target.value) })}
                        className="w-full rounded-xl border border-brand-100 bg-card px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring"
                      />
                    </label>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[240px_1fr]">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-brand-700">
                        {t(locale, "نمط التكرار", "Recurrence pattern")}
                      </span>
                      <select
                        value={newSeriesDraft.recurrenceMode}
                        onChange={(event) => {
                          const mode = event.target.value as GroupSeriesRecurrenceMode;
                          const anchorDay = getWeekdayFromDateInput(newSeriesDraft.firstSessionDate);
                          updateNewSeriesDraft({
                            recurrenceMode: mode,
                            selectedWeekdays: mode === "weekly" ? [anchorDay] : newSeriesDraft.selectedWeekdays.includes(anchorDay) ? newSeriesDraft.selectedWeekdays : [anchorDay, ...newSeriesDraft.selectedWeekdays],
                          });
                        }}
                        className="w-full rounded-xl border border-brand-100 bg-card px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring"
                      >
                        <option value="weekly">{t(locale, "مرة أسبوعيًا", "Once weekly")}</option>
                        <option value="twice_weekly">{t(locale, "مرتين أسبوعيًا", "Twice weekly")}</option>
                        <option value="custom">{t(locale, "أيام مخصصة", "Custom weekdays")}</option>
                      </select>
                    </label>

                    {newSeriesDraft.recurrenceMode !== "weekly" ? (
                      <div>
                        <span className="mb-1.5 block text-xs font-semibold text-brand-700">
                          {t(locale, "أيام التكرار", "Recurrence days")}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {GROUP_SERIES_WEEKDAYS.map((day) => {
                            const selected = newSeriesDraft.selectedWeekdays.includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => updateNewSeriesDraft({ selectedWeekdays: toggleNumber(newSeriesDraft.selectedWeekdays, day) })}
                                className={
                                  selected
                                    ? "rounded-xl bg-brand-700 px-3 py-2 text-xs font-semibold text-white"
                                    : "rounded-xl border border-brand-100 bg-card px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                                }
                              >
                                {getGroupSeriesDayLabel(day, locale)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-brand-100 bg-card px-3 py-2 text-sm text-brand-700">
                        {t(locale, "سيتم التكرار أسبوعيًا في نفس يوم تاريخ أول حصة.", "Repeats weekly on the weekday of the first session date.")}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleCreateSessionSeries}
                      disabled={busyCreatingSessionSeries}
                      className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
                    >
                      {busyCreatingSessionSeries ? t(locale, "جاري الإنشاء...", "Creating...") : t(locale, "إنشاء حصص الجروب", "Create group sessions")}
                    </button>
                  </div>
                </div>
              ) : null}

              <div data-complete-session-series className={group.sessions.length === 0 ? "hidden" : "mb-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-4"}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-bold text-brand-700">
                      {t(locale, "استكمال حصص الجروب إلى 8", "Complete group sessions to 8")}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-brand-700/80">
                      {t(locale, "لو ظهر في الجروب حصة واحدة فقط، استخدم هذا الخيار لإنشاء الحصص الناقصة أسبوعيًا من أول حصة. الحصص الموجودة لن تتغير.", "If only one session appears in the group, use this action to create the missing weekly sessions from the first session. Existing sessions will not change.")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCompleteSessionSeries}
                    disabled={busyCompletingSessions || group.sessions.length === 0 || group.sessions.length >= 8}
                    className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
                  >
                    {busyCompletingSessions
                      ? t(locale, "جاري الإنشاء...", "Creating...")
                      : group.sessions.length >= 8
                        ? t(locale, "مكتمل", "Complete")
                        : t(locale, `إنشاء ${Math.max(0, 8 - group.sessions.length)} حصص`, `Create ${Math.max(0, 8 - group.sessions.length)} sessions`)}
                  </button>
                </div>
              </div>

        {group.sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t(locale, "لا توجد حصص مرتبطة بهذا الجروب بعد", "No sessions are linked to this group yet")}
          </div>
        ) : (
          <div className="space-y-4">
            {group.sessions.map((session, index) => {
              const draft = drafts[session.id] ?? createDraft(session);
              const isSaving = busySessionId === session.id;
              const isSavingAttendance = busyAttendanceSessionId === session.id;
              const sessionNumber = index + 1;
              const statusMeta = getSessionStatusMeta(session, locale);
              const markedAttendance = getMarkedAttendanceCount(session);
              const totalAttendance = session.attendanceEntries.length;
              const attendanceProgress = totalAttendance > 0 ? `${markedAttendance}/${totalAttendance}` : "0/0";
              const operationsComplete = isSessionOperationsComplete(session);
              const deferDraft = deferDrafts[session.id] ?? createDeferDraft(session);
              const isDeferring = busyDeferSessionId === session.id;
              const deferChanged =
                deferDraft.sessionDate !== (session.sessionDate ?? "") ||
                deferDraft.startTime !== session.startTime ||
                deferDraft.endTime !== session.endTime;

              return (
                <div key={session.id} className="rounded-2xl border border-border bg-background p-4">
                                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
                          {t(locale, `الحصة ${sessionNumber}`, `Session ${sessionNumber}`)}
                        </span>
                        <span className={"rounded-full border px-2.5 py-1 font-semibold " + statusMeta.className}>
                          {statusMeta.label}
                        </span>
                        <span
                          className={
                            operationsComplete
                              ? "rounded-full border border-success-100 bg-success-50 px-2.5 py-1 font-semibold text-success-700"
                              : "rounded-full border border-border bg-muted px-2.5 py-1 font-semibold text-muted-foreground"
                          }
                        >
                          {operationsComplete ? t(locale, "Checklist مكتملة", "Checklist complete") : t(locale, "Checklist غير مكتملة", "Checklist pending")}
                        </span>
                      </div>

                      <p className="truncate font-semibold text-foreground">{session.className}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {session.sessionDate ?? "—"} · {session.startTime} — {session.endTime}
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
                      <span className="rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
                        {t(locale, "تم تسجيل", "Marked")}: {attendanceProgress}
                      </span>
                    </div>
                  </div>                                    <details data-session-defer-panel className="mb-4 rounded-2xl border border-warning-100 bg-warning-50/50 p-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-1 py-1 text-sm font-bold text-warning-700 outline-none transition hover:text-warning-800">
                      <span>{t(locale, "تأجيل هذه الحصة فقط", "Reschedule this session only")}</span>
                      <span className="rounded-full border border-warning-200 bg-card px-2.5 py-1 text-[11px] font-semibold text-warning-700">
                        {deferChanged ? t(locale, "يوجد تعديل غير محفوظ", "Unsaved change") : t(locale, "فتح خيارات التأجيل", "Open reschedule options")}
                      </span>
                    </summary>

                    <div className="mt-4 border-t border-warning-100 pt-4">
                      <p className="mb-3 text-xs leading-5 text-warning-700/80">
                        {t(locale, "تغيير موعد هذه الحصة لن يغيّر مواعيد باقي حصص الجروب.", "Changing this session will not shift the rest of the group sessions.")}
                      </p>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px_120px_auto] md:items-end">
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-semibold text-warning-700">{t(locale, "التاريخ الجديد", "New date")}</span>
                          <input
                            type="date"
                            value={deferDraft.sessionDate}
                            onChange={(event) => updateDeferDraft(session.id, { sessionDate: event.target.value })}
                            className="w-full rounded-xl border border-warning-200 bg-card px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block text-xs font-semibold text-warning-700">{t(locale, "من", "From")}</span>
                          <input
                            type="time"
                            value={deferDraft.startTime}
                            onChange={(event) => updateDeferDraft(session.id, { startTime: event.target.value })}
                            className="w-full rounded-xl border border-warning-200 bg-card px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block text-xs font-semibold text-warning-700">{t(locale, "إلى", "To")}</span>
                          <input
                            type="time"
                            value={deferDraft.endTime}
                            onChange={(event) => updateDeferDraft(session.id, { endTime: event.target.value })}
                            className="w-full rounded-xl border border-warning-200 bg-card px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => handleDeferSession(session.id)}
                          disabled={isDeferring || !deferChanged || !deferDraft.sessionDate || !deferDraft.startTime || !deferDraft.endTime}
                          className="inline-flex items-center justify-center rounded-xl bg-warning-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-warning-600 disabled:opacity-50"
                        >
                          {isDeferring ? t(locale, "جاري التأجيل...", "Rescheduling...") : t(locale, "حفظ التأجيل", "Save change")}
                        </button>
                      </div>
                    </div>
                  </details>

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
