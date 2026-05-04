"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, CalendarDays, CalendarPlus, FileText, GraduationCap, MessageCircle, ReceiptText, Trash2, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/stores/ui-store";
import { STUDENT_STATUS_META, getMetaLabel } from "@/config/status-meta";
import { getCourseLabel, t } from "@/lib/locale";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { extractLeadIdFromProjectionId, getStudentDetails } from "@/services/relations.service";
import { deleteStudent } from "@/services/students.service";
import { listGroups } from "@/services/group-operations.service";
import { transferStudentToGroup } from "@/services/academic-transfer.service";
import {
  getStudentPaymentSessionsCounter,
  type StudentPaymentSessionsCounter,
} from "@/services/student-payment-sessions.service";
import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import type { CourseType, GroupListItem, StudentDetails } from "@/types/crm";

const TRANSFER_COURSE_OPTIONS: CourseType[] = [
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
  "web",
  "ai",
];

export default function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferCourse, setTransferCourse] = useState<CourseType | "">("");
  const [targetGroupId, setTargetGroupId] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [paymentCounter, setPaymentCounter] = useState<StudentPaymentSessionsCounter | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const [studentData, groupRows, counterData] = await Promise.all([
        getStudentDetails(id),
        listGroups(),
        getStudentPaymentSessionsCounter(id),
      ]);

      if (!mounted) return;

      setStudent(studentData);
      setGroups(groupRows);
      setPaymentCounter(counterData);

      if (studentData?.currentCourse) {
        setTransferCourse(studentData.currentCourse);
      }

      setLoading(false);
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDeleteStudent = async () => {
    if (!student) return;
    const confirmed = window.confirm(t(locale, "هل تريد حذف هذا الطالب نهائياً؟", "Delete this student permanently?"));
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteStudent(student.id);
      toast.success(t(locale, "تم حذف الطالب", "Student deleted"));
      router.push("/students");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t(locale, "تعذر حذف الطالب", "Could not delete student"));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <LoadingState
        titleAr="جارِ تحميل ملف الطالب"
        titleEn="Loading student profile"
        descriptionAr="يتم الآن تجهيز الربط بين الطالب وولي الأمر والمدرسين والجلسات المرتبطة."
        descriptionEn="Linking the student with the parent, teachers, and related sessions now."
      />
    );
  }

  if (!student) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="الطالب غير موجود"
        titleEn="Student not found"
        descriptionAr="قد يكون هذا الملف محذوفاً أو أن الرابط غير صحيح. ارجع إلى قائمة الطلاب ثم اختر الملف الصحيح."
        descriptionEn="This student profile may have been removed or the link is incorrect. Go back to the students list and open the correct record."
        actionHref="/students"
        actionLabelAr="العودة إلى الطلاب"
        actionLabelEn="Back to students"
      />
    );
  }

  const status = STUDENT_STATUS_META[student.status];
  const sourceLeadId = extractLeadIdFromProjectionId(student.id);
  const primaryTeacher = student.teachers[0] ?? null;
  const linkedClassName = student.className ?? "";
  const hasSessions = student.relatedSessions.length > 0;
  const scheduleHref = "/schedule/new?className=" + encodeURIComponent(linkedClassName) + (student.currentCourse ? "&course=" + student.currentCourse : "") + (primaryTeacher ? "&teacherId=" + primaryTeacher.id : "");
  const createActualHref = "/students/new?parentName=" + encodeURIComponent(student.parentName) + "&parentPhone=" + encodeURIComponent(student.parentPhone) + "&childName=" + encodeURIComponent(student.fullName) + (student.age > 0 ? "&childAge=" + student.age : "") + (student.currentCourse ? "&currentCourse=" + student.currentCourse : "") + (student.className ? "&className=" + encodeURIComponent(student.className) : "");

  const activeGroups = groups.filter((group) => group.isActive);

  const transferCourseOptions = TRANSFER_COURSE_OPTIONS;

  const targetGroups = activeGroups.filter((group) =>
    transferCourse ? group.course === transferCourse : true,
  );

  const sessionClassIds = student.relatedSessions
    .map((session) => session.classId ?? null)
    .filter((classId): classId is string => Boolean(classId));

  const groupIdsByName = activeGroups
    .filter((group) => group.name === student.className)
    .map((group) => group.id);

  const currentGroupIds = [...new Set([...sessionClassIds, ...groupIdsByName])];

  const selectedTargetGroup =
    groups.find((group) => group.id === targetGroupId) ?? null;

  async function handleAcademicTransfer() {
    if (!student) return;

    if (!transferCourse) {
      toast.error(t(locale, "اختر الكورس أولًا", "Choose the course first"));
      return;
    }

    if (!targetGroupId || !selectedTargetGroup) {
      toast.error(t(locale, "اختر الجروب الجديد", "Choose the new group"));
      return;
    }

    if (selectedTargetGroup.course !== transferCourse) {
      toast.error(t(locale, "الجروب لا يطابق الكورس المختار", "The group does not match the selected course"));
      return;
    }

    if (currentGroupIds.includes(targetGroupId)) {
      toast.error(t(locale, "الطالب موجود بالفعل في هذا الجروب", "The student is already in this group"));
      return;
    }

    const confirmed = window.confirm(
      t(
        locale,
        "سيتم نقل الطالب إلى الجروب الجديد وتحديث الكورس الحالي. هل تريد المتابعة؟",
        "The student will be moved to the new group and the current course will be updated. Continue?",
      ),
    );

    if (!confirmed) return;

    setTransferring(true);

    try {
      await transferStudentToGroup({
        studentId: student.id,
        targetGroupId,
      });

      const [studentData, groupRows, freshCounterData] = await Promise.all([
        getStudentDetails(id),
        listGroups(),
        getStudentPaymentSessionsCounter(id),
      ]);

      setStudent(studentData);
      setGroups(groupRows);
      setPaymentCounter(freshCounterData);
      setTransferOpen(false);
      setTargetGroupId("");

      if (studentData?.currentCourse) {
        setTransferCourse(studentData.currentCourse);
      }

      toast.success(t(locale, "تم نقل الطالب بنجاح", "Student transferred successfully"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t(locale, "تعذر نقل الطالب", "Could not transfer student"));
    } finally {
      setTransferring(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/students" className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
            {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{student.fullName}</h1>
            <p className="text-sm text-muted-foreground">{student.parentName} — {student.parentPhone}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={"/students/" + student.id + "/edit"} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            {t(locale, "تعديل البيانات", "Edit data")}
          </Link>
          {sourceLeadId ? (
            <>
              <Link href={"/leads/" + sourceLeadId} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                <FileText size={16} />
                {t(locale, "العميل الأصلي", "Source lead")}
              </Link>
              <Link href={createActualHref} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                <UserCircle size={16} />
                {t(locale, "إنشاء ملف طالب فعلي", "Create real student profile")}
              </Link>
            </>
          ) : (
            <>
              <Link href={"/students/" + student.id + "/report"} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                <FileText size={16} />
                {t(locale, "التقرير الشهري", "Monthly report")}
              </Link>
              <Link href={"/payments/new?studentId=" + student.id} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                <ReceiptText size={16} />
                {t(locale, "إضافة دفعة", "Add payment")}
              </Link>
              <Link href={scheduleHref} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                <CalendarPlus size={16} />
                {t(locale, "إضافة حصة", "Add session")}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <QuickStat title={t(locale, "الحالة", "Status")} value={getMetaLabel(status, locale)} />
        <QuickStat title={t(locale, "المدرس الحالي", "Current teacher")} value={primaryTeacher?.fullName ?? t(locale, "غير مرتبط بعد", "Not linked yet")} />
        <QuickStat title={t(locale, "الكلاس الحالي", "Current class")} value={student.className ?? t(locale, "غير مسجل", "Not assigned")} />
        <QuickStat title={t(locale, "المسؤول", "Owner")} value={student.ownerName ?? t(locale, "غير مخصص", "Unassigned")} />
      </div>

      {/* BATCH14_PAYMENT_SESSIONS_COUNTER */}
      {paymentCounter ? (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <ReceiptText size={18} className="text-brand-600" />
                {t(locale, "عداد حصص آخر دفعة", "Latest payment sessions counter")}
              </h2>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                {t(
                  locale,
                  "يتم احتساب الحضور والتأخير فقط منذ بداية آخر باقة مدفوعة.",
                  "Only present and late sessions are counted since the latest paid block start.",
                )}
              </p>
            </div>

            <span
              className={
                "rounded-full px-3 py-1 text-xs font-semibold " +
                (paymentCounter.status === "ok"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : paymentCounter.status === "near_renewal"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                    : "bg-danger-50 text-danger-700 dark:bg-danger-950/30 dark:text-danger-300")
              }
            >
              {paymentCounter.status === "no_payment"
                ? t(locale, "لا توجد دفعة", "No payment")
                : paymentCounter.status === "ok"
                  ? t(locale, "جيد", "OK")
                  : paymentCounter.status === "near_renewal"
                    ? t(locale, "قرب التجديد", "Near renewal")
                    : t(locale, "يحتاج تجديد", "Needs renewal")}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
            <Info
              label={t(locale, "بداية العد", "Start date")}
              value={paymentCounter.startDate ? formatDate(paymentCounter.startDate, locale) : "—"}
            />
            <Info
              label={t(locale, "المستخدم", "Used")}
              value={String(paymentCounter.usedSessions)}
            />
            <Info
              label={t(locale, "المغطى", "Covered")}
              value={String(paymentCounter.sessionsCovered)}
            />
            <Info
              label={t(locale, "المتبقي", "Remaining")}
              value={String(paymentCounter.remainingSessions)}
            />
            <Info
              label={t(locale, "زيادة", "Overused")}
              value={String(paymentCounter.overusedSessions)}
            />
          </div>

          {paymentCounter.latestPayment ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>
                {t(locale, "آخر دفعة", "Latest payment")}:{" "}
                {formatCurrency(paymentCounter.latestPayment.amount, locale)}
              </span>
              <span>•</span>
              <span>
                {paymentCounter.latestPayment.paidAt
                  ? formatDate(paymentCounter.latestPayment.paidAt, locale)
                  : formatDate(paymentCounter.latestPayment.dueDate, locale)}
              </span>
              <Link
                href={"/payments/" + paymentCounter.latestPayment.id}
                className="font-semibold text-brand-700 hover:text-brand-600"
              >
                {t(locale, "فتح الدفعة", "Open payment")}
              </Link>
            </div>
          ) : (
            <div className="mt-4">
              <Link
                href={"/payments/new?studentId=" + student.id}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <ReceiptText size={16} />
                {t(locale, "إضافة دفعة", "Add payment")}
              </Link>
            </div>
          )}
        </div>
      ) : null}


      {/* ── Profile + Parent + Teachers ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap size={20} className="text-brand-600" />
            <h2 className="text-lg font-bold text-foreground">{t(locale, "ملف الطالب", "Student profile")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info label={t(locale, "العمر", "Age")} value={student.age + " " + t(locale, "سنة", "years")} />
            <Info label={t(locale, "الحالة", "Status")} value={getMetaLabel(status, locale)} />
            <Info label={t(locale, "الكورس الحالي", "Current course")} value={student.currentCourse ? getCourseLabel(student.currentCourse, locale) : t(locale, "غير محدد", "Not set")} />
            <Info label={t(locale, "الكلاس", "Class")} value={student.className ?? t(locale, "غير مسجل", "Not assigned")} />
            <Info label={t(locale, "تاريخ الالتحاق", "Enrollment date")} value={formatDate(student.enrollmentDate, locale)} />
            <Info label={t(locale, "عدد الحصص", "Sessions attended")} value={student.sessionsAttended.toString()} />
            <Info label={t(locale, "إجمالي المدفوع", "Total paid")} value={formatCurrency(student.totalPaid, locale)} />
            <Info label={t(locale, "المسؤول", "Owner")} value={student.ownerName ?? t(locale, "غير مخصص", "Unassigned")} />
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-foreground">
                  {t(locale, "نقل / ترقية الطالب", "Transfer / promote student")}
                </h3>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  {t(
                    locale,
                    "لا يتم تغيير الكورس وحده. اختر جروبًا مناسبًا للحفاظ على اتساق البيانات.",
                    "The course is not changed alone. Choose a matching group to keep data consistent.",
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTransferOpen((value) => !value)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                {transferOpen
                  ? t(locale, "إغلاق", "Close")
                  : t(locale, "اختيار جروب جديد", "Choose new group")}
              </button>
            </div>

            {transferOpen ? (
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t(locale, "الكورس", "Course")}
                  </span>
                  <select
                    value={transferCourse}
                    onChange={(event) => {
                      setTransferCourse(event.target.value as CourseType);
                      setTargetGroupId("");
                    }}
                    className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
                  >
                    <option value="">{t(locale, "اختر الكورس", "Choose course")}</option>
                    {transferCourseOptions.map((course) => (
                      <option key={course} value={course}>
                        {getCourseLabel(course, locale)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t(locale, "الجروب الجديد", "New group")}
                  </span>
                  <select
                    value={targetGroupId}
                    onChange={(event) => setTargetGroupId(event.target.value)}
                    disabled={!transferCourse}
                    className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring disabled:opacity-50"
                  >
                    <option value="">
                      {transferCourse
                        ? t(locale, "اختر الجروب", "Choose group")
                        : t(locale, "اختر الكورس أولًا", "Choose course first")}
                    </option>
                    {targetGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name} — {group.studentsCount} {t(locale, "طالب", "students")}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAcademicTransfer}
                    disabled={transferring || !transferCourse || !targetGroupId}
                    className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:w-auto"
                  >
                    {transferring
                      ? t(locale, "جارٍ النقل...", "Transferring...")
                      : t(locale, "نقل الطالب", "Transfer")}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground"><UserCircle size={18} className="text-brand-600" />{t(locale, "ولي الأمر", "Parent")}</h3>
            <div className="space-y-3">
              <Info label={t(locale, "الاسم", "Name")} value={student.parent?.fullName ?? student.parentName} />
              <Info label={t(locale, "الهاتف", "Phone")} value={student.parent?.phone ?? student.parentPhone} />
              {student.parent?.whatsapp ? <Info label="WhatsApp" value={student.parent.whatsapp} /> : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {student.parent ? (
                <Link href={"/parents/" + student.parent.id} className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90">
                  {t(locale, "فتح ملف ولي الأمر", "Open parent profile")}
                </Link>
              ) : null}
              <a href={"tel:" + student.parentPhone} className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
                {t(locale, "اتصال", "Call")}
              </a>
              <a href={"https://wa.me/2" + student.parentPhone.replace(/\D/g, "")} target="_blank" rel="noreferrer" className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
                {t(locale, "واتساب", "WhatsApp")}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground"><MessageCircle size={18} className="text-brand-600" />{t(locale, "المدرسون المرتبطون", "Linked teachers")}</h3>
            <div className="flex flex-wrap gap-2">
              {student.teachers.length === 0 ? (
                <span className="text-sm text-muted-foreground">{t(locale, "لا يوجد مدرس مرتبط بعد", "No linked teacher yet")}</span>
              ) : (
                student.teachers.map((teacher) => (
                  <Link key={teacher.id} href={"/teachers/" + teacher.id} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {teacher.fullName}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sessions + Siblings ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground"><CalendarDays size={18} className="text-brand-600" />{t(locale, "الجلسات المرتبطة", "Linked sessions")}</h3>
          {student.relatedSessions.length === 0 ? (
            <EmptyCopy locale={locale} ar="لا توجد جلسات مرتبطة بهذا الطالب حتى الآن" en="No sessions are linked to this student yet" />
          ) : (
            <div className="space-y-3">
              {student.relatedSessions.map((session) => (
                <Link key={session.id} href={"/schedule/" + session.id} className="block rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{session.className}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{session.startTime} → {session.endTime}</p>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{getCourseLabel(session.course, locale)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 font-bold text-foreground">{t(locale, "الإخوة / الملفات المرتبطة", "Siblings / related profiles")}</h3>
          {student.siblings.length === 0 ? (
            <EmptyCopy locale={locale} ar="لا توجد ملفات أخرى مرتبطة بنفس ولي الأمر" en="No additional student profiles are linked to this parent" />
          ) : (
            <div className="space-y-3">
              {student.siblings.map((item) => (
                <Link key={item.id} href={"/students/" + item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted/40">
                  <div>
                    <p className="font-semibold text-foreground">{item.fullName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.className ?? t(locale, "غير مسجل", "Not assigned")}</p>
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: STUDENT_STATUS_META[item.status].bg, color: STUDENT_STATUS_META[item.status].color }}>
                    {getMetaLabel(STUDENT_STATUS_META[item.status], locale)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="rounded-2xl border-2 border-danger-200 bg-danger-50/30 p-5 dark:border-danger-800 dark:bg-danger-950/20">
        <h3 className="mb-1 flex items-center gap-2 font-bold text-danger-700 dark:text-danger-400"><AlertTriangle size={18} />{t(locale, "منطقة خطرة", "Danger Zone")}</h3>
        <p className="mb-4 text-xs text-danger-600/70 dark:text-danger-400/70">{t(locale, "إجراءات لا يمكن التراجع عنها. تأكد قبل المتابعة.", "Irreversible actions. Confirm before proceeding.")}</p>
        {hasSessions && (
          <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            {t(locale, "هذا الطالب مرتبط بـ " + student.relatedSessions.length + " جلسة. الحذف سيفصله عنها.", "This student is linked to " + student.relatedSessions.length + " sessions. Deletion will unlink them.")}
          </p>
        )}
        <button onClick={handleDeleteStudent} disabled={deleting} className="inline-flex items-center gap-2 rounded-xl bg-danger-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-danger-600 disabled:opacity-50">
          <Trash2 size={16} />
          {deleting ? t(locale, "جارِ الحذف...", "Deleting...") : t(locale, "حذف الطالب نهائياً", "Delete student permanently")}
        </button>
      </div>
    </div>
  );
}

function QuickStat({ title, value }: { title: string; value: string }) {
  return <div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{title}</p><p className="mt-2 font-semibold text-foreground">{value}</p></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-muted/40 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold text-foreground">{value}</p></div>;
}

function EmptyCopy({ locale, ar, en }: { locale: "ar" | "en"; ar: string; en: string }) {
  return <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{t(locale, ar, en)}</div>;
}
