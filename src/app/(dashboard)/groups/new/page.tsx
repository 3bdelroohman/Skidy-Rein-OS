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

        if (activeTeachers.length > 0) {
          setTeacherId(activeTeachers[0].id);
        }
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

  function toggleStudent(studentId: string) {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    );
  }

  async function handleCreateGroup() {
    if (!name.trim()) {
      toast.error(t(locale, "اكتب اسم الجروب أولاً", "Enter the group name first"));
      return;
    }

    if (!teacherId) {
      toast.error(t(locale, "اختر المدرس المسؤول", "Select the responsible teacher"));
      return;
    }

    if (!startDate) {
      toast.error(t(locale, "اختر تاريخ البداية", "Choose the start date"));
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

      toast.success(t(locale, "تم إنشاء الجروب بنجاح", "Group created successfully"));
      router.push("/groups/" + groupId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر إنشاء الجروب", "Could not create group"));
    } finally {
      setSaving(false);
    }
  }

  if (!canAccess) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="هذا القسم خاص بتشغيل المدرسين"
        titleEn="This section is restricted to teacher operations"
        descriptionAr="إنشاء الجروبات وإدارتها متاح فقط للمستخدم المسؤول عن تشغيل المدرسين."
        descriptionEn="Group creation and management are restricted to the assigned teacher operations owner."
        actionHref="/groups"
        actionLabelAr="العودة إلى الجروبات"
        actionLabelEn="Back to groups"
      />
    );
  }

  if (loading) {
    return (
      <LoadingState
        titleAr="جارِ تحميل نموذج إنشاء الجروب"
        titleEn="Loading group creation form"
        descriptionAr="يتم الآن تجهيز المدرسين والطلاب وربطهم بإنشاء الجروب."
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
                {t(locale, "إنشاء جروب", "Create group")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(locale, "أنشئ جروبًا جديدًا وحدد المدرس والطلاب المرتبطين به.", "Create a new group and assign its teacher and students.")}
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
            {saving ? t(locale, "جارِ الإنشاء...", "Creating...") : t(locale, "حفظ الجروب", "Save group")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-bold text-foreground">{t(locale, "بيانات الجروب", "Group details")}</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "اسم الجروب", "Group name")}</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t(locale, "مثال: Python Teens Group A", "Example: Python Teens Group A")}
                className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "تاريخ البداية", "Start date")}</label>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "المدرس المسؤول", "Responsible teacher")}</label>
              <select
                value={teacherId}
                onChange={(event) => setTeacherId(event.target.value)}
                className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              >
                <option value="">{t(locale, "اختر المدرس", "Choose teacher")}</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <h3 className="mb-3 text-sm font-bold text-foreground">{t(locale, "حساب المدرس اليدوي", "Manual teacher finance")}</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "مدة حصة المدرس بالدقائق", "Teacher session duration in minutes")}</label>
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
                  <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "حساب المدرس للحصة", "Teacher rate per session")}</label>
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
                <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "ملاحظات حساب المدرس", "Teacher finance notes")}</label>
                <textarea
                  value={teacherFinanceNotes}
                  onChange={(event) => setTeacherFinanceNotes(event.target.value)}
                  rows={3}
                  placeholder={t(locale, "مثال: سعر خاص لهذا الجروب", "Example: special rate for this group")}
                  className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "الكورس", "Course")}</label>
              <select
                value={course}
                onChange={(event) => setCourse(event.target.value as CourseType)}
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
            {t(locale, "الطلاب داخل الجروب", "Students inside the group")}
          </h2>

          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "ابحث عن طالب لإضافته", "Search students to add")}</label>
            <input
              value={studentSearch}
              onChange={(event) => setStudentSearch(event.target.value)}
              placeholder={t(locale, "ابحث باسم الطالب أو ولي الأمر...", "Search by student or parent...")}
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">{t(locale, "الطلاب المحددون", "Selected students")}</p>

            {selectedStudents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                {t(locale, "لم يتم اختيار أي طلاب بعد", "No students selected yet")}
              </div>
            ) : (
              <div className="space-y-3">
                {selectedStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{student.fullName}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {student.parentName} • {student.parentPhone}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleStudent(student.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-danger-300 bg-danger-50 px-3 py-2 text-sm font-semibold text-danger-700 transition-colors hover:bg-danger-100 dark:border-danger-800 dark:bg-danger-950/30 dark:text-danger-300"
                    >
                      <Trash2 size={16} />
                      {t(locale, "حذف", "Remove")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-sm font-semibold text-foreground">{t(locale, "الطلاب المتاحون", "Available students")}</p>

            {availableStudents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                {t(locale, "لا يوجد طلاب متاحون حسب البحث الحالي", "No available students for the current search")}
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
                        {student.parentName} • {student.parentPhone}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {t(locale, "إضافة", "Add")}
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