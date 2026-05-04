"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";

import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import { getPaymentMethodLabel, getPaymentStatusLabel, t } from "@/lib/locale";
import { useUIStore } from "@/stores/ui-store";
import { getPaymentDetails, updatePayment } from "@/services/payments.service";
import type { PaymentCurrency, PaymentDetails } from "@/types/crm";
import type { PaymentMethod, PaymentStatus } from "@/types/common.types";

const PAYMENT_STATUSES = ["paid", "pending", "overdue", "refunded", "partial"] as const satisfies PaymentStatus[];
const PAYMENT_METHODS = ["bank_transfer", "card", "wallet", "cash", "instapay"] as const satisfies PaymentMethod[];
const PAYMENT_CURRENCIES = ["EGP", "SAR"] as const satisfies PaymentCurrency[];

function getCurrencyLabel(currency: PaymentCurrency, locale: "ar" | "en"): string {
  return currency === "SAR" ? t(locale, "ريال سعودي", "SAR") : t(locale, "جنيه مصري", "EGP");
}

function dateValue(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

export default function EditPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";

  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<PaymentCurrency>("EGP");
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [dueDate, setDueDate] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [sessionsCovered, setSessionsCovered] = useState("8");
  const [blockStartDate, setBlockStartDate] = useState("");
  const [blockEndDate, setBlockEndDate] = useState("");
  const [deferredUntil, setDeferredUntil] = useState("");
  const [publicNote, setPublicNote] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      const data = await getPaymentDetails(id);
      if (!mounted) return;

      setPayment(data);

      if (data) {
        setAmount(String(data.amount));
        setCurrency(data.currency ?? "EGP");
        setStatus(data.status);
        setMethod(data.method ?? "");
        setDueDate(dateValue(data.dueDate));
        setPaidAt(dateValue(data.paidAt));
        setSessionsCovered(String(data.sessionsCovered));
        setBlockStartDate(dateValue(data.blockStartDate));
        setBlockEndDate(dateValue(data.blockEndDate));
        setDeferredUntil(dateValue(data.deferredUntil));
        setPublicNote(data.publicNote ?? "");
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
    if (!payment) return;

    setSaving(true);

    try {
      await updatePayment({
        paymentId: payment.id,
        amount: Number(amount),
        currency,
        status,
        method: method || null,
        dueDate,
        paidAt: paidAt || null,
        sessionsCovered: Number(sessionsCovered),
        blockStartDate: blockStartDate || null,
        blockEndDate: blockEndDate || null,
        deferredUntil: deferredUntil || null,
        publicNote,
      });

      toast.success(t(locale, "تم تحديث الدفعة", "Payment updated"));
      router.push("/payments/" + payment.id);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر تحديث الدفعة", "Could not update payment"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState titleAr="جارٍ تحميل الدفعة" titleEn="Loading payment" descriptionAr="يتم تجهيز بيانات الدفعة للتعديل." descriptionEn="Preparing payment data for editing." />;
  }

  if (!payment) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="الدفعة غير موجودة"
        titleEn="Payment not found"
        descriptionAr="تعذر العثور على الدفعة."
        descriptionEn="Could not find the payment record."
        actionHref="/payments"
        actionLabelAr="العودة إلى المدفوعات"
        actionLabelEn="Back to payments"
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={"/payments/" + payment.id} className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
          {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t(locale, "تعديل الدفعة", "Edit payment")}</h1>
          <p className="text-sm text-muted-foreground">{payment.studentName} — {payment.parentName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-5">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          {t(locale, "تعديل الدفعة يؤثر على عداد الحصص. راجع بداية الباقة وعدد الحصص قبل الحفظ.", "Editing payment affects the sessions counter. Review block start and sessions covered before saving.")}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "المبلغ", "Amount")}</span>
            <input type="number" min={1} value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" required />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "العملة", "Currency")}</span>
            <select value={currency} onChange={(event) => setCurrency(event.target.value as PaymentCurrency)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring">
              {PAYMENT_CURRENCIES.map((item) => (
                <option key={item} value={item}>{getCurrencyLabel(item, locale)}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "الحالة", "Status")}</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as PaymentStatus)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring">
              {PAYMENT_STATUSES.map((item) => (
                <option key={item} value={item}>{getPaymentStatusLabel(item, locale)}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "طريقة الدفع", "Payment method")}</span>
            <select value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod | "")} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring">
              <option value="">{t(locale, "غير محدد", "Not set")}</option>
              {PAYMENT_METHODS.map((item) => (
                <option key={item} value={item}>{getPaymentMethodLabel(item, locale)}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "عدد الحصص المغطاة", "Covered sessions")}</span>
            <input type="number" min={1} value={sessionsCovered} onChange={(event) => setSessionsCovered(event.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" required />
          </label>

          <DateField label={t(locale, "تاريخ الاستحقاق", "Due date")} value={dueDate} onChange={setDueDate} required />
          <DateField label={t(locale, "تاريخ الدفع", "Paid at")} value={paidAt} onChange={setPaidAt} />
          <DateField label={t(locale, "بداية الباقة", "Block start")} value={blockStartDate} onChange={setBlockStartDate} />
          <DateField label={t(locale, "نهاية الباقة", "Block end")} value={blockEndDate} onChange={setBlockEndDate} />
          <DateField label={t(locale, "مؤجل حتى", "Deferred until")} value={deferredUntil} onChange={setDeferredUntil} />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "ملاحظات", "Notes")}</span>
          <textarea value={publicNote} onChange={(event) => setPublicNote(event.target.value)} rows={4} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" />
        </label>

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            <Save size={16} />
            {saving ? t(locale, "جارٍ الحفظ...", "Saving...") : t(locale, "حفظ التعديلات", "Save changes")}
          </button>
          <Link href={"/payments/" + payment.id} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">{t(locale, "إلغاء", "Cancel")}</Link>
        </div>
      </form>
    </div>
  );
}

function DateField({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input type="date" value={value} onChange={(event) => onChange(event.target.value)} required={required} className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring" />
    </label>
  );
}
