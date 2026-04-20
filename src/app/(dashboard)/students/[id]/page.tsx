"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, CalendarDays, CalendarPlus, FileText, GraduationCap, MessageCircle, ReceiptText, Trash2, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/stores/ui-store";
import { STUDENT_STATUS_META, getMetaLabel } from "@/config/status-meta";
import { getCourseLabel, t } from "@/lib/locale";
import { formatCurrencyEgp, formatDate } from "@/lib/formatters";
import { extractLeadIdFromProjectionId, getStudentDetails } from "@/services/relations.service";
import { deleteStudent } from "@/services/students.service";
import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import type { StudentDetails } from "@/types/crm";

export default function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    getStudentDetails(id).then((data) => {
      if (mounted) {
        setStudent(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [id]);

  const handleDeleteStudent = async () => {
    if (!student) return;
    const confirmed = window.confirm(t(locale, "\u0647\u0644 \u062a\u0631\u064a\u062f \u062d\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0637\u0627\u0644\u0628 \u0646\u0647\u0627\u0626\u064a\u0627\u064b\u061f", "Delete this student permanently?"));
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteStudent(student.id);
      toast.success(t(locale, "\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u0637\u0627\u0644\u0628", "Student deleted"));
      router.push("/students");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t(locale, "\u062a\u0639\u0630\u0631 \u062d\u0630\u0641 \u0627\u0644\u0637\u0627\u0644\u0628", "Could not delete student"));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <LoadingState
        titleAr="\u062c\u0627\u0631\u0650 \u062a\u062d\u0645\u064a\u0644 \u0645\u0644\u0641 \u0627\u0644\u0637\u0627\u0644\u0628"
        titleEn="Loading student profile"
        descriptionAr="\u064a\u062a\u0645 \u0627\u0644\u0622\u0646 \u062a\u062c\u0647\u064a\u0632 \u0627\u0644\u0631\u0628\u0637 \u0628\u064a\u0646 \u0627\u0644\u0637\u0627\u0644\u0628 \u0648\u0648\u0644\u064a \u0627\u0644\u0623\u0645\u0631 \u0648\u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0646 \u0648\u0627\u0644\u062c\u0644\u0633\u0627\u062a \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u0629."
        descriptionEn="Linking the student with the parent, teachers, and related sessions now."
      />
    );
  }

  if (!student) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="\u0627\u0644\u0637\u0627\u0644\u0628 \u063a\u064a\u0631 \u0645\u0648\u062c\u0648\u062f"
        titleEn="Student not found"
        descriptionAr="\u0642\u062f \u064a\u0643\u0648\u0646 \u0647\u0630\u0627 \u0627\u0644\u0645\u0644\u0641 \u0645\u062d\u0630\u0648\u0641\u0627\u064b \u0623\u0648 \u0623\u0646 \u0627\u0644\u0631\u0627\u0628\u0637 \u063a\u064a\u0631 \u0635\u062d\u064a\u062d. \u0627\u0631\u062c\u0639 \u0625\u0644\u0649 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0644\u0627\u0628 \u062b\u0645 \u0627\u062e\u062a\u0631 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0635\u062d\u064a\u062d."
        descriptionEn="This student profile may have been removed or the link is incorrect. Go back to the students list and open the correct record."
        actionHref="/students"
        actionLabelAr="\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0637\u0644\u0627\u0628"
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

  return (
    <div className="space-y-6">
      {/* \u2500\u2500 Header \u2500\u2500 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/students" className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
            {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{student.fullName}</h1>
            <p className="text-sm text-muted-foreground">{student.parentName} \u2014 {student.parentPhone}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {sourceLeadId ? (
            <>
              <Link href={"/leads/" + sourceLeadId} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                <FileText size={16} />
                {t(locale, "\u0627\u0644\u0639\u0645\u064a\u0644 \u0627\u0644\u0623\u0635\u0644\u064a", "Source lead")}
              </Link>
              <Link href={createActualHref} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                <UserCircle size={16} />
                {t(locale, "\u0625\u0646\u0634\u0627\u0621 \u0645\u0644\u0641 \u0637\u0627\u0644\u0628 \u0641\u0639\u0644\u064a", "Create real student profile")}
              </Link>
            </>
          ) : (
            <>
              <Link href={"/students/" + student.id + "/report"} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                <FileText size={16} />
                {t(locale, "\u0627\u0644\u062a\u0642\u0631\u064a\u0631 \u0627\u0644\u0634\u0647\u0631\u064a", "Monthly report")}
              </Link>
              <Link href={"/payments/new?studentId=" + student.id} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                <ReceiptText size={16} />
                {t(locale, "\u0625\u0636\u0627\u0641\u0629 \u062f\u0641\u0639\u0629", "Add payment")}
              </Link>
              <Link href={scheduleHref} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                <CalendarPlus size={16} />
                {t(locale, "\u0625\u0636\u0627\u0641\u0629 \u062d\u0635\u0629", "Add session")}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* \u2500\u2500 Quick Stats \u2500\u2500 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <QuickStat title={t(locale, "\u0627\u0644\u062d\u0627\u0644\u0629", "Status")} value={getMetaLabel(status, locale)} />
        <QuickStat title={t(locale, "\u0627\u0644\u0645\u062f\u0631\u0633 \u0627\u0644\u062d\u0627\u0644\u064a", "Current teacher")} value={primaryTeacher?.fullName ?? t(locale, "\u063a\u064a\u0631 \u0645\u0631\u062a\u0628\u0637 \u0628\u0639\u062f", "Not linked yet")} />
        <QuickStat title={t(locale, "\u0627\u0644\u0643\u0644\u0627\u0633 \u0627\u0644\u062d\u0627\u0644\u064a", "Current class")} value={student.className ?? t(locale, "\u063a\u064a\u0631 \u0645\u0633\u062c\u0644", "Not assigned")} />
        <QuickStat title={t(locale, "\u0627\u0644\u0645\u0633\u0624\u0648\u0644", "Owner")} value={student.ownerName ?? t(locale, "\u063a\u064a\u0631 \u0645\u062e\u0635\u0635", "Unassigned")} />
      </div>

      {/* \u2500\u2500 Profile + Parent + Teachers \u2500\u2500 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap size={20} className="text-brand-600" />
            <h2 className="text-lg font-bold text-foreground">{t(locale, "\u0645\u0644\u0641 \u0627\u0644\u0637\u0627\u0644\u0628", "Student profile")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info label={t(locale, "\u0627\u0644\u0639\u0645\u0631", "Age")} value={student.age + " " + t(locale, "\u0633\u0646\u0629", "years")} />
            <Info label={t(locale, "\u0627\u0644\u062d\u0627\u0644\u0629", "Status")} value={getMetaLabel(status, locale)} />
            <Info label={t(locale, "\u0627\u0644\u0643\u0648\u0631\u0633 \u0627\u0644\u062d\u0627\u0644\u064a", "Current course")} value={student.currentCourse ? getCourseLabel(student.currentCourse, locale) : t(locale, "\u063a\u064a\u0631 \u0645\u062d\u062f\u062f", "Not set")} />
            <Info label={t(locale, "\u0627\u0644\u0643\u0644\u0627\u0633", "Class")} value={student.className ?? t(locale, "\u063a\u064a\u0631 \u0645\u0633\u062c\u0644", "Not assigned")} />
            <Info label={t(locale, "\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0627\u0644\u062a\u062d\u0627\u0642", "Enrollment date")} value={formatDate(student.enrollmentDate, locale)} />
            <Info label={t(locale, "\u0639\u062f\u062f \u0627\u0644\u062d\u0635\u0635", "Sessions attended")} value={student.sessionsAttended.toString()} />
            <Info label={t(locale, "\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0645\u062f\u0641\u0648\u0639", "Total paid")} value={formatCurrencyEgp(student.totalPaid, locale)} />
            <Info label={t(locale, "\u0627\u0644\u0645\u0633\u0624\u0648\u0644", "Owner")} value={student.ownerName ?? t(locale, "\u063a\u064a\u0631 \u0645\u062e\u0635\u0635", "Unassigned")} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground"><UserCircle size={18} className="text-brand-600" />{t(locale, "\u0648\u0644\u064a \u0627\u0644\u0623\u0645\u0631", "Parent")}</h3>
            <div className="space-y-3">
              <Info label={t(locale, "\u0627\u0644\u0627\u0633\u0645", "Name")} value={student.parent?.fullName ?? student.parentName} />
              <Info label={t(locale, "\u0627\u0644\u0647\u0627\u062a\u0641", "Phone")} value={student.parent?.phone ?? student.parentPhone} />
              {student.parent?.whatsapp ? <Info label="WhatsApp" value={student.parent.whatsapp} /> : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {student.parent ? (
                <Link href={"/parents/" + student.parent.id} className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90">
                  {t(locale, "\u0641\u062a\u062d \u0645\u0644\u0641 \u0648\u0644\u064a \u0627\u0644\u0623\u0645\u0631", "Open parent profile")}
                </Link>
              ) : null}
              <a href={"tel:" + student.parentPhone} className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
                {t(locale, "\u0627\u062a\u0635\u0627\u0644", "Call")}
              </a>
              <a href={"https://wa.me/2" + student.parentPhone.replace(/\D/g, "")} target="_blank" rel="noreferrer" className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
                {t(locale, "\u0648\u0627\u062a\u0633\u0627\u0628", "WhatsApp")}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground"><MessageCircle size={18} className="text-brand-600" />{t(locale, "\u0627\u0644\u0645\u062f\u0631\u0633\u0648\u0646 \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u0648\u0646", "Linked teachers")}</h3>
            <div className="flex flex-wrap gap-2">
              {student.teachers.length === 0 ? (
                <span className="text-sm text-muted-foreground">{t(locale, "\u0644\u0627 \u064a\u0648\u062c\u062f \u0645\u062f\u0631\u0633 \u0645\u0631\u062a\u0628\u0637 \u0628\u0639\u062f", "No linked teacher yet")}</span>
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

      {/* \u2500\u2500 Sessions + Siblings \u2500\u2500 */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground"><CalendarDays size={18} className="text-brand-600" />{t(locale, "\u0627\u0644\u062c\u0644\u0633\u0627\u062a \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u0629", "Linked sessions")}</h3>
          {student.relatedSessions.length === 0 ? (
            <EmptyCopy locale={locale} ar="\u0644\u0627 \u062a\u0648\u062c\u062f \u062c\u0644\u0633\u0627\u062a \u0645\u0631\u062a\u0628\u0637\u0629 \u0628\u0647\u0630\u0627 \u0627\u0644\u0637\u0627\u0644\u0628 \u062d\u062a\u0649 \u0627\u0644\u0622\u0646" en="No sessions are linked to this student yet" />
          ) : (
            <div className="space-y-3">
              {student.relatedSessions.map((session) => (
                <Link key={session.id} href={"/schedule/" + session.id} className="block rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{session.className}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{session.startTime} \u2192 {session.endTime}</p>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{getCourseLabel(session.course, locale)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 font-bold text-foreground">{t(locale, "\u0627\u0644\u0625\u062e\u0648\u0629 / \u0627\u0644\u0645\u0644\u0641\u0627\u062a \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u0629", "Siblings / related profiles")}</h3>
          {student.siblings.length === 0 ? (
            <EmptyCopy locale={locale} ar="\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u0644\u0641\u0627\u062a \u0623\u062e\u0631\u0649 \u0645\u0631\u062a\u0628\u0637\u0629 \u0628\u0646\u0641\u0633 \u0648\u0644\u064a \u0627\u0644\u0623\u0645\u0631" en="No additional student profiles are linked to this parent" />
          ) : (
            <div className="space-y-3">
              {student.siblings.map((item) => (
                <Link key={item.id} href={"/students/" + item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted/40">
                  <div>
                    <p className="font-semibold text-foreground">{item.fullName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.className ?? t(locale, "\u063a\u064a\u0631 \u0645\u0633\u062c\u0644", "Not assigned")}</p>
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

      {/* \u2500\u2500 Danger Zone \u2500\u2500 */}
      <div className="rounded-2xl border-2 border-danger-200 bg-danger-50/30 p-5 dark:border-danger-800 dark:bg-danger-950/20">
        <h3 className="mb-1 flex items-center gap-2 font-bold text-danger-700 dark:text-danger-400"><AlertTriangle size={18} />{t(locale, "\u0645\u0646\u0637\u0642\u0629 \u062e\u0637\u0631\u0629", "Danger Zone")}</h3>
        <p className="mb-4 text-xs text-danger-600/70 dark:text-danger-400/70">{t(locale, "\u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0644\u0627 \u064a\u0645\u0643\u0646 \u0627\u0644\u062a\u0631\u0627\u062c\u0639 \u0639\u0646\u0647\u0627. \u062a\u0623\u0643\u062f \u0642\u0628\u0644 \u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629.", "Irreversible actions. Confirm before proceeding.")}</p>
        {hasSessions && (
          <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            {t(locale, "\u0647\u0630\u0627 \u0627\u0644\u0637\u0627\u0644\u0628 \u0645\u0631\u062a\u0628\u0637 \u0628\u0640 " + student.relatedSessions.length + " \u062c\u0644\u0633\u0629. \u0627\u0644\u062d\u0630\u0641 \u0633\u064a\u0641\u0635\u0644\u0647 \u0639\u0646\u0647\u0627.", "This student is linked to " + student.relatedSessions.length + " sessions. Deletion will unlink them.")}
          </p>
        )}
        <button onClick={handleDeleteStudent} disabled={deleting} className="inline-flex items-center gap-2 rounded-xl bg-danger-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-danger-600 disabled:opacity-50">
          <Trash2 size={16} />
          {deleting ? t(locale, "\u062c\u0627\u0631\u0650 \u0627\u0644\u062d\u0630\u0641...", "Deleting...") : t(locale, "\u062d\u0630\u0641 \u0627\u0644\u0637\u0627\u0644\u0628 \u0646\u0647\u0627\u0626\u064a\u0627\u064b", "Delete student permanently")}
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
