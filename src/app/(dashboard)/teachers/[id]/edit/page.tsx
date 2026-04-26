"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";

import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import { t, getEmploymentTypeLabel } from "@/lib/locale";
import { useUIStore } from "@/stores/ui-store";
import { getTeacherDetails } from "@/services/relations.service";
import { updateTeacherBasic } from "@/services/basic-edit.service";
import type { TeacherDetails } from "@/types/crm";
import type { EmploymentType } from "@/types/common.types";

const EMPLOYMENTS = ["full_time", "part_time", "freelance"] as const satisfies EmploymentType[];

export default function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";

  const [teacher, setTeacher] = useState<TeacherDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [employment, setEmployment] = useState<EmploymentType>("part_time");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const data = await getTeacherDetails(id);
      if (!mounted) return;

      setTeacher(data);

      if (data) {
        setFullName(data.fullName);
        setPhone(data.phone);
        setEmail(data.email ?? "");
        setEmployment(data.employment);
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
    if (!teacher) return;

    setSaving(true);

    try {
      await updateTeacherBasic({
        teacherId: teacher.id,
        fullName,
        phone,
        email,
        employment,
        isActive,
      });

      toast.success(t(locale, "تم تحديث بيانات المدرس", "Teacher data updated"));
      router.push("/teachers/" + teacher.id);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر تحديث بيانات المدرس", "Could not update teacher data"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState titleAr="جارٍ تحميل المدرس" titleEn="Loading teacher" descriptionAr="يتم تجهيز بيانات المدرس للتعديل." descriptionEn="Preparing teacher data for editing." />;
  }

  if (!teacher) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="المدرس غير موجود"
        titleEn="Teacher not found"
        descriptionAr="تعذر العثور على ملف المدرس."
        descriptionEn="Could not find the teacher profile."
        actionHref="/teachers"
        actionLabelAr="العودة إلى المدرسين"
        actionLabelEn="Back to teachers"
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={"/teachers/" + teacher.id} className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
          {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t(locale, "تعديل بيانات المدرس", "Edit teacher data")}</h1>
          <p className="text-sm text-muted-foreground">{t(locale, "تعديل البيانات الأساسية فقط. التخصصات لها أداة منفصلة.", "Basic data only. Specializations have a separate editor.")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "اسم المدرس", "Teacher name")}</span>
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" required />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "الهاتف", "Phone")}</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" required />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "البريد", "Email")}</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "نوع التوظيف", "Employment")}</span>
            <select value={employment} onChange={(event) => setEmployment(event.target.value as EmploymentType)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring">
              {EMPLOYMENTS.map((item) => (
                <option key={item} value={item}>{getEmploymentTypeLabel(item, locale)}</option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
            <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
            <span className="text-sm font-medium text-foreground">{t(locale, "مدرس نشط", "Active teacher")}</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            <Save size={16} />
            {saving ? t(locale, "جارٍ الحفظ...", "Saving...") : t(locale, "حفظ التعديلات", "Save changes")}
          </button>
          <Link href={"/teachers/" + teacher.id} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">{t(locale, "إلغاء", "Cancel")}</Link>
        </div>
      </form>
    </div>
  );
}
