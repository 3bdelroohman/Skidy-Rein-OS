"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";

import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import { t } from "@/lib/locale";
import { useUIStore } from "@/stores/ui-store";
import { getParentDetails } from "@/services/relations.service";
import { updateParentBasic } from "@/services/basic-edit.service";
import type { ParentDetails } from "@/types/crm";

export default function EditParentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";

  const [parent, setParent] = useState<ParentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      const data = await getParentDetails(id);
      if (!mounted) return;

      setParent(data);

      if (data) {
        setFullName(data.fullName);
        setPhone(data.phone);
        setWhatsapp(data.whatsapp ?? data.phone);
        setEmail(data.email ?? "");
        setCity(data.city ?? "");
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
    if (!parent) return;

    setSaving(true);

    try {
      await updateParentBasic({
        parentId: parent.id,
        fullName,
        phone,
        whatsapp,
        email,
        city,
      });

      toast.success(t(locale, "تم تحديث بيانات ولي الأمر", "Parent data updated"));
      router.push("/parents/" + parent.id);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر تحديث بيانات ولي الأمر", "Could not update parent data"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState titleAr="جارٍ تحميل ولي الأمر" titleEn="Loading parent" descriptionAr="يتم تجهيز بيانات ولي الأمر للتعديل." descriptionEn="Preparing parent data for editing." />;
  }

  if (!parent) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="ولي الأمر غير موجود"
        titleEn="Parent not found"
        descriptionAr="تعذر العثور على ملف ولي الأمر."
        descriptionEn="Could not find the parent profile."
        actionHref="/parents"
        actionLabelAr="العودة إلى أولياء الأمور"
        actionLabelEn="Back to parents"
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={"/parents/" + parent.id} className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
          {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t(locale, "تعديل بيانات ولي الأمر", "Edit parent data")}</h1>
          <p className="text-sm text-muted-foreground">{t(locale, "تصحيح بيانات التواصل فقط دون تغيير علاقات الطلاب.", "Contact data only without changing student relationships.")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "اسم ولي الأمر", "Parent name")}</span>
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" required />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "الهاتف", "Phone")}</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" required />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">WhatsApp</span>
            <input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "البريد", "Email")}</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "المدينة", "City")}</span>
            <input value={city} onChange={(event) => setCity(event.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            <Save size={16} />
            {saving ? t(locale, "جارٍ الحفظ...", "Saving...") : t(locale, "حفظ التعديلات", "Save changes")}
          </button>
          <Link href={"/parents/" + parent.id} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">{t(locale, "إلغاء", "Cancel")}</Link>
        </div>
      </form>
    </div>
  );
}
