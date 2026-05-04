"use client";

import { type ReactNode, use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";

import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import { t } from "@/lib/locale";
import { useUIStore } from "@/stores/ui-store";
import { getGroupDetails } from "@/services/group-operations.service";
import { updateGroupBasic } from "@/services/basic-edit.service";
import type { GroupDetails } from "@/types/crm";

export default function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";

  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [teacherSessionDurationMinutes, setTeacherSessionDurationMinutes] = useState("");
  const [teacherSessionRate, setTeacherSessionRate] = useState("");
  const [teacherFinanceNotes, setTeacherFinanceNotes] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const data = await getGroupDetails(id);
      if (!mounted) return;

      setGroup(data);

      if (data) {
        setName(data.name);
        setStartDate(data.startDate.slice(0, 10));
        setNotes(data.groupNotes ?? "");
        setIsActive(data.isActive);
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
    if (!group) return;

    setSaving(true);

    try {
      await updateGroupBasic({
        groupId: group.id,
        name,
        startDate,
        notes,
        isActive,
        teacherSessionDurationMinutes: teacherSessionDurationMinutes ? Number(teacherSessionDurationMinutes) : null,
        teacherSessionRate: teacherSessionRate ? Number(teacherSessionRate) : null,
        teacherFinanceNotes: teacherFinanceNotes || null,
      });

      toast.success(t(locale, "تم تحديث بيانات الجروب", "Group data updated"));
      router.push("/groups/" + group.id);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر تحديث بيانات الجروب", "Could not update group data"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState titleAr="جارٍ تحميل الجروب" titleEn="Loading group" descriptionAr="يتم تجهيز بيانات الجروب للتعديل." descriptionEn="Preparing group data for editing." />;
  }

  if (!group) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="الجروب غير موجود"
        titleEn="Group not found"
        descriptionAr="تعذر العثور على الجروب."
        descriptionEn="Could not find the group."
        actionHref="/groups"
        actionLabelAr="العودة إلى الجروبات"
        actionLabelEn="Back to groups"
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={"/groups/" + group.id} className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
          {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t(locale, "تعديل بيانات الجروب", "Edit group data")}</h1>
          <p className="text-sm text-muted-foreground">{t(locale, "تعديل البيانات الأساسية فقط دون تغيير الكورس أو المدرس أو الطلاب.", "Basic data only without changing course, teacher, or students.")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-5">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          {t(locale, "هذه الصفحة لا تنقل الطلاب ولا تغيّر مدرس الجروب أو الكورس.", "This page does not move students or change the group teacher/course.")}
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "اسم الجروب", "Group name")}</span>
          <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" required />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "تاريخ البداية", "Start date")}</span>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" required />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "ملاحظات الجروب", "Group notes")}</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" />
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
          <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
          <span className="text-sm font-medium text-foreground">{t(locale, "جروب نشط", "Active group")}</span>
        </label>

        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-muted/20 p-4 sm:grid-cols-2">
          <ReadOnlyInfo label={t(locale, "الكورس", "Course")} value={group.course} />
          <ReadOnlyInfo label={t(locale, "المدرس", "Teacher")} value={group.teacherName} />
          <ReadOnlyInfo label={t(locale, "عدد الطلاب", "Students")} value={String(group.studentsCount)} />
          <ReadOnlyInfo label={t(locale, "عدد الحصص", "Sessions")} value={String(group.sessionsCount)} />
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-bold text-foreground">{t(locale, "حساب المدرس اليدوي", "Manual teacher finance")}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t(locale, "مدة حصة المدرس بالدقائق", "Teacher session duration in minutes")}>
                <input type="number" min="0" step="1" value={teacherSessionDurationMinutes} onChange={(event) => setTeacherSessionDurationMinutes(event.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground" placeholder="60 / 90" />
              </Field>
              <Field label={t(locale, "حساب المدرس للحصة", "Teacher rate per session")}>
                <input type="number" min="0" step="1" value={teacherSessionRate} onChange={(event) => setTeacherSessionRate(event.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground" placeholder="120 / 180 / 200" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label={t(locale, "ملاحظات حساب المدرس", "Teacher finance notes")}>
                <textarea value={teacherFinanceNotes} onChange={(event) => setTeacherFinanceNotes(event.target.value)} rows={3} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground" placeholder={t(locale, "مثال: سعر خاص لهذا الجروب", "Example: special rate for this group")} />
              </Field>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            <Save size={16} />
            {saving ? t(locale, "جارٍ الحفظ...", "Saving...") : t(locale, "حفظ التعديلات", "Save changes")}
          </button>
          <Link href={"/groups/" + group.id} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">{t(locale, "إلغاء", "Cancel")}</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
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
