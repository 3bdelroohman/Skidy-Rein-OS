"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Layers3, PlusCircle, Trash2, Users } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useCurrentUser } from "@/providers/user-provider";
import { canAccessTeachersForUser } from "@/config/roles";
import { formatCourseLabel } from "@/lib/formatters";
import { t } from "@/lib/locale";
import {
  buildTeacherCourseWarning,
  filterTeachersByCourse,
  teacherTeachesCourse,
} from "@/lib/teacher-course-utils";
import { createGroup } from "@/services/group-operations.service";
import { listStudents } from "@/services/students.service";
import { listTeachers } from "@/services/teachers.service";
import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import type { CourseType, StudentListItem, TeacherListItem } from "@/types/crm";
import { COURSE_STAGE_LABELS, COURSE_STAGE_MAP } from "@/types/crm";

const AVAILABLE_COURSES: CourseType[] = [
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
  courses: AVAILABLE_COURSES.filter((course) => COURSE_STAGE_MAP[course] === stage),
}));

export default function NewGroupPage() {
  const router = useRouter();
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const user = useCurrentUser();
  const canAccess = canAccessTeachersForUser(user);

  const [teachers, setTeachers] = useState<TeacherListItem[]>([]);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [teacherId, setTeacherId] = useState("");
  const [course, setCourse] = useState<CourseType>("scratch");
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [teacherSessionDurationMinutes, setTeacherSessionDurationMinutes] = useState("");
  const [teacherSessionRate, setTeacherSessionRate] = useState("");
  const [teacherFinanceNotes, setTeacherFinanceNotes] = useState("");

  useEffect(() => {
    let mounted = true;

    if (!canAccess) {
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    (async () => {
      try {
        const [teacherRows, studentRows] = await Promise.all([listTeachers(), listStudents()]);
        if (!mounted) return;

        const activeTeachers = teacherRows.filter((teacher) => teacher.isActive);
        setTeachers(activeTeachers);
        setStudents(studentRows);

        const initialTeacher = filterTeachersByCourse(activeTeachers, "scratch")[0] ?? null;
        setTeacherId(initialTeacher?.id ?? "");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [canAccess]);

  const selectedStudents = useMemo(() => {
    return selectedStudentIds
      .map((id) => students.find((student) => student.id === id) ?? null)
      .filter((item): item is StudentListItem => item !== null);
  }, [selectedStudentIds, students]);

  const availableStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    const selectedSet = new Set(selectedStudentIds);

    return students.filter((student) => {
      if (selectedSet.has(student.id)) return false;
      if (!query) return true;

      return (
        student.fullName.toLowerCase().includes(query) ||
        student.parentName.toLowerCase().includes(query) ||
        student.parentPhone.toLowerCase().includes(query)
      );
    });
  }, [selectedStudentIds, studentSearch, students]);

  const selectedTeacher = useMemo(() => {
    return teachers.find((teacher) => teacher.id === teacherId) ?? null;
  }, [teacherId, teachers]);

  const teachersForSelectedCourse = useMemo(() => {
    return filterTeachersByCourse(teachers, course);
  }, [teachers, course]);

  const teacherCourseWarning = useMemo(() => {
    return buildTeacherCourseWarning({
      selectedTeacher,
      selectedCourse: course,
      availableTeachers: teachersForSelectedCourse,
      locale,
    });
  }, [selectedTeacher, course, teachersForSelectedCourse, locale]);

  useEffect(() => {
    if (!teacherId) return;

    const currentTeacher = teachers.find((teacher) => teacher.id === teacherId) ?? null;
    if (!currentTeacher) return;

    if (!teacherTeachesCourse(currentTeacher, course)) {
      setTeacherId("");
    }
  }, [teacherId, teachers, course]);
  function toggleStudent(studentId: string) {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    );
  }

  async function handleCreateGroup() {
    if (!name.trim()) {
      toast.error(t(locale, "Ø§ÙƒØªØ¨ Ø§Ø³Ù… Ø§Ù„Ø¬Ø±ÙˆØ¨ Ø£ÙˆÙ„Ø§Ù‹", "Enter the group name first"));
      return;
    }

    if (!teacherId) {
      toast.error(t(locale, "Ø§Ø®ØªØ± Ø§Ù„Ù…Ø¯Ø±Ø³ Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„", "Select the responsible teacher"));
      return;
    }

        if (selectedTeacher && !teacherTeachesCourse(selectedTeacher, course)) {
      toast.error(
        t(
          locale,
          "Ø§Ù„Ù…Ø¯Ø±Ø³ Ø§Ù„Ù…Ø®ØªØ§Ø± Ù„Ø§ ÙŠØ¯Ø±Ù‘Ø³ Ù‡Ø°Ù‡ Ø§Ù„Ù…Ø§Ø¯Ø©. Ø§Ø®ØªØ± Ù…Ø¯Ø±Ø³Ù‹Ø§ Ù…Ù†Ø§Ø³Ø¨Ù‹Ø§ Ø£Ùˆ ØºÙŠÙ‘Ø± Ø§Ù„Ù…Ø§Ø¯Ø©.",
          "The selected teacher does not teach this course. Choose a suitable teacher or change the course.",
        ),
      );
      return;
    }
if (!startDate) {
      toast.error(t(locale, "Ø§Ø®ØªØ± ØªØ§Ø±ÙŠØ® Ø§Ù„Ø¨Ø¯Ø§ÙŠØ©", "Choose the start date"));
      return;
    }

    setSaving(true);
    try {
      const groupId = await createGroup({
        name,
        startDate,
        teacherId,
        course,
        studentIds: selectedStudentIds,
        isActive: true,
        teacherSessionDurationMinutes: teacherSessionDurationMinutes ? Number(teacherSessionDurationMinutes) : null,
        teacherSessionRate: teacherSessionRate ? Number(teacherSessionRate) : null,
        teacherFinanceNotes: teacherFinanceNotes || null,
      });

      toast.success(t(locale, "ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø¬Ø±ÙˆØ¨ Ø¨Ù†Ø¬Ø§Ø­", "Group created successfully"));
      router.push("/groups/" + groupId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "ØªØ¹Ø°Ø± Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø¬Ø±ÙˆØ¨", "Could not create group"));
    } finally {
      setSaving(false);
    }
  }

  if (!canAccess) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="Ù‡Ø°Ø§ Ø§Ù„Ù‚Ø³Ù… Ø®Ø§Øµ Ø¨ØªØ´ØºÙŠÙ„ Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†"
        titleEn="This section is restricted to teacher operations"
        descriptionAr="Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø¬Ø±ÙˆØ¨Ø§Øª ÙˆØ¥Ø¯Ø§Ø±ØªÙ‡Ø§ Ù…ØªØ§Ø­ ÙÙ‚Ø· Ù„Ù„Ù…Ø³ØªØ®Ø¯Ù… Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„ Ø¹Ù† ØªØ´ØºÙŠÙ„ Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†."
        descriptionEn="Group creation and management are restricted to the assigned teacher operations owner."
        actionHref="/groups"
        actionLabelAr="Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ Ø§Ù„Ø¬Ø±ÙˆØ¨Ø§Øª"
        actionLabelEn="Back to groups"
      />
    );
  }

  if (loading) {
    return (
      <LoadingState
        titleAr="Ø¬Ø§Ø±Ù ØªØ­Ù…ÙŠÙ„ Ù†Ù…ÙˆØ°Ø¬ Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø¬Ø±ÙˆØ¨"
        titleEn="Loading group creation form"
        descriptionAr="ÙŠØªÙ… Ø§Ù„Ø¢Ù† ØªØ¬Ù‡ÙŠØ² Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ† ÙˆØ§Ù„Ø·Ù„Ø§Ø¨ ÙˆØ±Ø¨Ø·Ù‡Ù… Ø¨Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø¬Ø±ÙˆØ¨."
        descriptionEn="Preparing teachers and students for group creation."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/groups" className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
              {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </Link>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Layers3 size={26} className="text-brand-600" />
                {t(locale, "Ø¥Ù†Ø´Ø§Ø¡ Ø¬Ø±ÙˆØ¨", "Create group")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(locale, "Ø£Ù†Ø´Ø¦ Ø¬Ø±ÙˆØ¨Ù‹Ø§ Ø¬Ø¯ÙŠØ¯Ù‹Ø§ ÙˆØ­Ø¯Ø¯ Ø§Ù„Ù…Ø¯Ø±Ø³ ÙˆØ§Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„Ù…Ø±ØªØ¨Ø·ÙŠÙ† Ø¨Ù‡.", "Create a new group and assign its teacher and students.")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateGroup}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
          >
            <PlusCircle size={18} />
            {saving ? t(locale, "Ø¬Ø§Ø±Ù Ø§Ù„Ø¥Ù†Ø´Ø§Ø¡...", "Creating...") : t(locale, "Ø­ÙØ¸ Ø§Ù„Ø¬Ø±ÙˆØ¨", "Save group")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-bold text-foreground">{t(locale, "Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¬Ø±ÙˆØ¨", "Group details")}</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "Ø§Ø³Ù… Ø§Ù„Ø¬Ø±ÙˆØ¨", "Group name")}</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t(locale, "Ù…Ø«Ø§Ù„: Python Teens Group A", "Example: Python Teens Group A")}
                className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "ØªØ§Ø±ÙŠØ® Ø§Ù„Ø¨Ø¯Ø§ÙŠØ©", "Start date")}</label>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "Ø§Ù„Ù…Ø¯Ø±Ø³ Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„", "Responsible teacher")}</label>
              <select
                value={teacherId}
                onChange={(event) => setTeacherId(event.target.value)}
                disabled={teachersForSelectedCourse.length === 0}
                className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                <option value="">{t(locale, "Ø§Ø®ØªØ± Ø§Ù„Ù…Ø¯Ø±Ø³", "Choose teacher")}</option>
                {teachersForSelectedCourse.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.fullName}
                  </option>
                ))}
              </select>
              {teachersForSelectedCourse.length === 0 ? (
                <p className="mt-2 rounded-xl border border-warning-200 bg-warning-50 px-3 py-2 text-xs leading-5 text-warning-700">
                  {t(
                    locale,
                    "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø¯Ø±Ø³ Ù†Ø´Ø· ÙŠØ¯Ø±Ù‘Ø³ Ù‡Ø°Ù‡ Ø§Ù„Ù…Ø§Ø¯Ø©. ØºÙŠÙ‘Ø± Ø§Ù„Ù…Ø§Ø¯Ø© Ø£Ùˆ Ø£Ø¶Ù Ù…Ø¯Ø±Ø³Ù‹Ø§ ÙŠØ¯Ø±Ù‘Ø³Ù‡Ø§ Ù…Ù† ØµÙØ­Ø© Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†.",
                    "No active teacher teaches this course. Change the course or add a teacher who teaches it from Teachers.",
                  )}
                </p>
              ) : null}

              {teacherCourseWarning ? (
                <p className="mt-2 rounded-xl border border-danger-200 bg-danger-50 px-3 py-2 text-xs leading-5 text-danger-700">
                  {teacherCourseWarning}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <h3 className="mb-3 text-sm font-bold text-foreground">{t(locale, "Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…Ø¯Ø±Ø³ Ø§Ù„ÙŠØ¯ÙˆÙŠ", "Manual teacher finance")}</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "Ù…Ø¯Ø© Ø­ØµØ© Ø§Ù„Ù…Ø¯Ø±Ø³ Ø¨Ø§Ù„Ø¯Ù‚Ø§Ø¦Ù‚", "Teacher session duration in minutes")}</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={teacherSessionDurationMinutes}
                    onChange={(event) => setTeacherSessionDurationMinutes(event.target.value)}
                    placeholder="60 / 90"
                    className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…Ø¯Ø±Ø³ Ù„Ù„Ø­ØµØ©", "Teacher rate per session")}</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={teacherSessionRate}
                    onChange={(event) => setTeacherSessionRate(event.target.value)}
                    placeholder="120 / 180 / 200"
                    className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…Ø¯Ø±Ø³", "Teacher finance notes")}</label>
                <textarea
                  value={teacherFinanceNotes}
                  onChange={(event) => setTeacherFinanceNotes(event.target.value)}
                  rows={3}
                  placeholder={t(locale, "Ù…Ø«Ø§Ù„: Ø³Ø¹Ø± Ø®Ø§Øµ Ù„Ù‡Ø°Ø§ Ø§Ù„Ø¬Ø±ÙˆØ¨", "Example: special rate for this group")}
                  className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "Ø§Ù„ÙƒÙˆØ±Ø³", "Course")}</label>
              <select
                value={course}
                onChange={(event) => {
                  const nextCourse = event.target.value as CourseType;
                  setCourse(nextCourse);
                  const nextTeacher = filterTeachersByCourse(teachers, nextCourse)[0] ?? null;
                  setTeacherId(nextTeacher?.id ?? "");
                }}
                className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              >
                {COURSE_OPTIONS_BY_STAGE.map((group) => (
                  <optgroup
                    key={group.stage}
                    label={isAr ? COURSE_STAGE_LABELS[group.stage].ar : COURSE_STAGE_LABELS[group.stage].en}
                  >
                    {group.courses.map((courseOption) => (
                      <option key={courseOption} value={courseOption}>
                        {formatCourseLabel(courseOption, locale)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <Users size={18} className="text-brand-600" />
            {t(locale, "Ø§Ù„Ø·Ù„Ø§Ø¨ Ø¯Ø§Ø®Ù„ Ø§Ù„Ø¬Ø±ÙˆØ¨", "Students inside the group")}
          </h2>

          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "Ø§Ø¨Ø­Ø« Ø¹Ù† Ø·Ø§Ù„Ø¨ Ù„Ø¥Ø¶Ø§ÙØªÙ‡", "Search students to add")}</label>
            <input
              value={studentSearch}
              onChange={(event) => setStudentSearch(event.target.value)}
              placeholder={t(locale, "Ø§Ø¨Ø­Ø« Ø¨Ø§Ø³Ù… Ø§Ù„Ø·Ø§Ù„Ø¨ Ø£Ùˆ ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±...", "Search by student or parent...")}
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">{t(locale, "Ø§Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„Ù…Ø­Ø¯Ø¯ÙˆÙ†", "Selected students")}</p>

            {selectedStudents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                {t(locale, "Ù„Ù… ÙŠØªÙ… Ø§Ø®ØªÙŠØ§Ø± Ø£ÙŠ Ø·Ù„Ø§Ø¨ Ø¨Ø¹Ø¯", "No students selected yet")}
              </div>
            ) : (
              <div className="space-y-3">
                {selectedStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{student.fullName}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {student.parentName} â€¢ {student.parentPhone}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleStudent(student.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-danger-300 bg-danger-50 px-3 py-2 text-sm font-semibold text-danger-700 transition-colors hover:bg-danger-100 dark:border-danger-800 dark:bg-danger-950/30 dark:text-danger-300"
                    >
                      <Trash2 size={16} />
                      {t(locale, "Ø­Ø°Ù", "Remove")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-sm font-semibold text-foreground">{t(locale, "Ø§Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„Ù…ØªØ§Ø­ÙˆÙ†", "Available students")}</p>

            {availableStudents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                {t(locale, "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø·Ù„Ø§Ø¨ Ù…ØªØ§Ø­ÙˆÙ† Ø­Ø³Ø¨ Ø§Ù„Ø¨Ø­Ø« Ø§Ù„Ø­Ø§Ù„ÙŠ", "No available students for the current search")}
              </div>
            ) : (
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {availableStudents.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => toggleStudent(student.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{student.fullName}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {student.parentName} â€¢ {student.parentPhone}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {t(locale, "Ø¥Ø¶Ø§ÙØ©", "Add")}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
