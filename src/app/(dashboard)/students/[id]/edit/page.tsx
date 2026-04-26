"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";

import { STUDENT_STATUS_META, getMetaLabel } from "@/config/status-meta";
import { formatDate } from "@/lib/formatters";
import { t } from "@/lib/locale";
import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import { useUIStore } from "@/stores/ui-store";
import { getStudentDetails } from "@/services/relations.service";
import { updateStudentBasicProfile } from "@/services/student-basic-edit.service";
import type { StudentDetails } from "@/types/crm";
import type { StudentStatus } from "@/types/common.types";

const STUDENT_STATUSES = [
  "trial",
  "active",
  "paused",
  "at_risk",
  "completed",
  "churned",
] as const satisfies StudentStatus[];

export default function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";

  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState<StudentStatus>("active");
  const [enrollmentDate, setEnrollmentDate] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const data = await getStudentDetails(id);

      if (!mounted) return;

      setStudent(data);

      if (data) {
        setFullName(data.fullName);
        setAge(String(data.age));
        setStatus(data.status);
        setEnrollmentDate(data.enrollmentDate.slice(0, 10));
      }

      setLoading(false);
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!student) return;

    const numericAge = Number(age);

    setSaving(true);

    try {
      await updateStudentBasicProfile({
        studentId: student.id,
        fullName,
        age: numericAge,
        status,
        enrollmentDate,
      });

      toast.success(t(locale, "تم تحديث بيانات الطالب", "Student data updated"));
      router.push("/students/" + student.id);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t(locale, "تعذر تحديث بيانات الطالب", "Could not update student data"),
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <LoadingState
        titleAr="جارٍ تحميل بيانات الطالب"
        titleEn="Loading student data"
        descriptionAr="يتم تجهيز بيانات الطالب الأساسية للتعديل."
        descriptionEn="Preparing basic student data for editing."
      />
    );
  }

  if (!student) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="الطالب غير موجود"
        titleEn="Student not found"
        descriptionAr="تعذر العثور على ملف الطالب المطلوب."
        descriptionEn="Could not find the requested student profile."
        actionHref="/students"
        actionLabelAr="العودة إلى الطلاب"
        actionLabelEn="Back to students"
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={"/students/" + student.id}
          className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted"
        >
          {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t(locale, "تعديل بيانات الطالب", "Edit student data")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t(
              locale,
              "تعديل آمن للبيانات الأساسية فقط دون تغيير الكورس أو الجروب.",
              "Safe edit for basic data only without changing course or group.",
            )}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border bg-card p-5"
      >
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          {t(
            locale,
            "هذه الصفحة لا تغيّر الكورس أو الجروب. استخدم نقل / ترقية الطالب من صفحة الطالب عند الحاجة.",
            "This page does not change course or group. Use Transfer / promote student from the student page when needed.",
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              {t(locale, "اسم الطالب", "Student name")}
            </span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              {t(locale, "العمر", "Age")}
            </span>
            <input
              type="number"
              min={4}
              max={18}
              value={age}
              onChange={(event) => setAge(event.target.value)}
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              {t(locale, "الحالة", "Status")}
            </span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as StudentStatus)}
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
            >
              {STUDENT_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {getMetaLabel(STUDENT_STATUS_META[item], locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              {t(locale, "تاريخ الالتحاق", "Enrollment date")}
            </span>
            <input
              type="date"
              value={enrollmentDate}
              onChange={(event) => setEnrollmentDate(event.target.value)}
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-muted/20 p-4 sm:grid-cols-2">
          <ReadOnlyInfo
            label={t(locale, "الكورس الحالي", "Current course")}
            value={student.currentCourse ?? "—"}
          />
          <ReadOnlyInfo
            label={t(locale, "الجروب الحالي", "Current group")}
            value={student.className ?? "—"}
          />
          <ReadOnlyInfo
            label={t(locale, "ولي الأمر", "Parent")}
            value={student.parentName}
          />
          <ReadOnlyInfo
            label={t(locale, "تاريخ الإنشاء/الالتحاق الحالي", "Current enrollment date")}
            value={formatDate(student.enrollmentDate, locale)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Save size={16} />
            {saving
              ? t(locale, "جارٍ الحفظ...", "Saving...")
              : t(locale, "حفظ التعديلات", "Save changes")}
          </button>

          <Link
            href={"/students/" + student.id}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            {t(locale, "إلغاء", "Cancel")}
          </Link>
        </div>
      </form>
    </div>
  );
}

function ReadOnlyInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}
