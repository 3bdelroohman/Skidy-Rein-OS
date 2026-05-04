"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ReceiptText, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { PageStateCard } from "@/components/shared/page-state";
import { canManagePaymentsForUser } from "@/config/roles";
import { useCurrentUser } from "@/providers/user-provider";
import { createPayment } from "@/services/payments.service";
import { listStudents } from "@/services/students.service";
import { useUIStore } from "@/stores/ui-store";
import type { PaymentMethod, PaymentStatus, Locale } from "@/types/common.types";
import type { StudentListItem } from "@/types/crm";
import { t } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";

const STATUS_OPTIONS: PaymentStatus[] = ["pending", "paid", "partial", "overdue"];
const METHOD_OPTIONS: PaymentMethod[] = ["instapay", "bank_transfer", "wallet", "cash", "card"];
type PaymentCurrency = "EGP" | "SAR";

function statusLabel(s: PaymentStatus, locale: Locale): string {
  const map: Record<PaymentStatus, { ar: string; en: string }> = {
    pending: { ar: "Ù‚ÙŠØ¯ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±", en: "Pending" },
    paid: { ar: "Ù…Ø¯ÙÙˆØ¹", en: "Paid" },
    partial: { ar: "Ø¬Ø²Ø¦ÙŠ", en: "Partial" },
    overdue: { ar: "Ù…ØªØ£Ø®Ø±", en: "Overdue" },
    refunded: { ar: "Ù…Ø³ØªØ±Ø¯", en: "Refunded" },
  };
  return locale === "ar" ? map[s].ar : map[s].en;
}

function methodLabel(m: PaymentMethod, locale: Locale): string {
  const map: Record<PaymentMethod, { ar: string; en: string }> = {
    instapay: { ar: "Ø¥Ù†Ø³ØªØ§Ø¨Ø§ÙŠ", en: "InstaPay" },
    bank_transfer: { ar: "ØªØ­ÙˆÙŠÙ„ Ø¨Ù†ÙƒÙŠ", en: "Bank Transfer" },
    wallet: { ar: "Ù…Ø­ÙØ¸Ø© Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ©", en: "Wallet" },
    cash: { ar: "ÙƒØ§Ø´", en: "Cash" },
    card: { ar: "Ø¨Ø·Ø§Ù‚Ø©", en: "Card" },
  };
  return locale === "ar" ? map[m].ar : map[m].en;
}

function normalizeSessionBlock(value: string): number {
  const parsed = Number(value || 4);
  if (!Number.isFinite(parsed)) return 4;
  return Math.max(1, Math.round(parsed));
}

function studentOptionLabel(s: StudentListItem): string {
  if (s.className) return s.fullName + " â€” " + s.className;
  return s.fullName;
}

export default function NewPaymentPage() {
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const user = useCurrentUser();
  const canManage = canManagePaymentsForUser(user);
  const router = useRouter();
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    amount: "1200",
    currency: "EGP" as PaymentCurrency,
    status: "pending" as PaymentStatus,
    method: "" as PaymentMethod | "",
    dueDate: new Date().toISOString().slice(0, 10),
    blockStartDate: new Date().toISOString().slice(0, 10),
    blockEndDate: "",
    deferredUntil: "",
    notes: "",
    sessionsCovered: "4",
  });

  useEffect(() => {
    listStudents().then(setStudents);
  }, []);

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === form.studentId) ?? null,
    [students, form.studentId],
  );
  const selectedStudentHasParent = Boolean(selectedStudent?.parentId);
  const normalizedSessions = useMemo(() => normalizeSessionBlock(form.sessionsCovered), [form.sessionsCovered]);
  const amountNumber = Number(form.amount || 0);
  const hasRoundedSessions = normalizedSessions !== Number(form.sessionsCovered || 0);

  if (!canManage) {
    return (
      <PageStateCard
        variant="danger"
        titleAr="Ù„Ø§ ØªÙ…Ù„Ùƒ ØµÙ„Ø§Ø­ÙŠØ© Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª"
        titleEn="You cannot manage payments"
        descriptionAr="Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª Ù…Ø­ØµÙˆØ±Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø£Ø¯ÙˆØ§Ø± Ø§Ù„Ù…Ø®ÙˆÙ„Ø© ÙÙ‚Ø· Ø¯Ø§Ø®Ù„ Ø§Ù„ÙØ±ÙŠÙ‚ Ø§Ù„Ù…Ø§Ù„ÙŠ. ÙŠÙ…ÙƒÙ†Ùƒ Ù…Ø´Ø§Ù‡Ø¯Ø© Ø§Ù„Ø³Ø¬Ù„Ø§Øª Ù„ÙƒÙ† Ù„Ø§ ÙŠÙ…ÙƒÙ†Ùƒ Ø¥Ù†Ø´Ø§Ø¡ Ø¯ÙØ¹Ø© Ø¬Ø¯ÙŠØ¯Ø©."
        descriptionEn="Payment management is restricted to the approved finance users. You can review records but cannot create a new payment."
        actionHref="/payments"
        actionLabelAr="Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª"
        actionLabelEn="Back to payments"
      />
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.studentId) {
      toast.error(t(locale, "Ø§Ø®ØªØ± Ø§Ù„Ø·Ø§Ù„Ø¨ Ø£ÙˆÙ„Ø§Ù‹", "Choose a student first"));
      return;
    }

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      toast.error(t(locale, "Ø£Ø¯Ø®Ù„ Ù…Ø¨Ù„ØºÙ‹Ø§ ØµØ­ÙŠØ­Ù‹Ø§ Ø£ÙƒØ¨Ø± Ù…Ù† ØµÙØ±", "Enter a valid amount greater than zero"));
      return;
    }

    if (selectedStudent && !selectedStudentHasParent) {
      toast.error(
        t(
          locale,
          "Ù‡Ø°Ø§ Ø§Ù„Ø·Ø§Ù„Ø¨ ØºÙŠØ± Ù…Ø±Ø¨ÙˆØ· Ø¨ÙˆÙ„ÙŠ Ø£Ù…Ø±. Ø§Ø±Ø¨Ø· ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø± Ø£ÙˆÙ„Ø§Ù‹ Ù‚Ø¨Ù„ Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø¯ÙØ¹Ø©",
          "This student is not linked to a parent yet. Link a parent first before creating a payment.",
        ),
      );
      return;
    }

    setSaving(true);
    try {
      const created = await createPayment({
        studentId: form.studentId,
        amount: amountNumber,
        currency: form.currency,
        status: form.status,
        method: form.method || null,
        dueDate: form.dueDate,
        sessionsCovered: normalizedSessions,
        blockStartDate: form.blockStartDate || null,
        blockEndDate: form.blockEndDate || null,
        deferredUntil: form.deferredUntil || null,
        notes: form.notes || null,
      });
      toast.success(t(locale, "ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø¯ÙØ¹Ø© Ø¨Ù†Ø¬Ø§Ø­", "Payment created successfully"));
      router.push("/payments/" + created.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "ØªØ¹Ø°Ø± Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø¯ÙØ¹Ø©", "Could not create payment"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/payments")} className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
          {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </button>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground"><ReceiptText size={24} className="text-brand-600" />{t(locale, "Ø¥Ø¶Ø§ÙØ© Ø¯ÙØ¹Ø© Ø¬Ø¯ÙŠØ¯Ø©", "Add new payment")}</h1>
          <p className="text-sm text-muted-foreground">{t(locale, "Ø§Ù„ÙØ§ØªÙˆØ±Ø© Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠØ© ØªØºØ·ÙŠ 8 Ø¬Ù„Ø³Ø§Øª. Ø¥Ø°Ø§ Ø£Ø¯Ø®Ù„Øª Ø¹Ø¯Ø¯Ø§Ù‹ Ù…Ø®ØªÙ„ÙØ§Ù‹ ÙØ³ÙŠØªÙ… ØªÙ‚Ø±ÙŠØ¨Ù‡ Ø¥Ù„Ù‰ Ø£Ù‚Ø±Ø¨ Ù…Ø¶Ø§Ø¹Ù Ù„Ù€ 8.", "Default invoice covers 8 sessions. Different counts are rounded up to the nearest multiple of 8.")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <Field label={t(locale, "Ø§Ù„Ø·Ø§Ù„Ø¨", "Student")}>
            <select value={form.studentId} onChange={(event) => setForm((prev) => ({ ...prev, studentId: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
              <option value="">{t(locale, "Ø§Ø®ØªØ± Ø§Ù„Ø·Ø§Ù„Ø¨", "Choose student")}</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>{studentOptionLabel(student)}</option>
              ))}
            </select>
          </Field>

          {selectedStudent && !selectedStudentHasParent ? (
            <div className="flex items-start gap-3 rounded-2xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-800 dark:border-danger-900/60 dark:bg-danger-950/30 dark:text-danger-200">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" />
              <p>
                {t(
                  locale,
                  "Ù‡Ø°Ø§ Ø§Ù„Ø·Ø§Ù„Ø¨ ØºÙŠØ± Ù…Ø±Ø¨ÙˆØ· Ø¨ÙˆÙ„ÙŠ Ø£Ù…Ø± Ø­ØªÙ‰ Ø§Ù„Ø¢Ù†. Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø¥ØµØ¯Ø§Ø± Ø¯ÙØ¹Ø© ØµØ­ÙŠØ­Ø© Ù„Ù‡ Ù‚Ø¨Ù„ Ø±Ø¨Ø· ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±.",
                  "This student is not linked to a parent yet. A valid payment cannot be created until the parent is linked.",
                )}
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t(locale, "Ø§Ù„Ù…Ø¨Ù„Øº", "Amount")}>
              <input type="number" min="1" value={form.amount} onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" />
            </Field>
            <Field label={t(locale, "Ø§Ù„Ø¹Ù…Ù„Ø©", "Currency")}>
              <select
                data-payment-currency-select
                value={form.currency}
                onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value as PaymentCurrency }))}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
              >
                <option value="EGP">{t(locale, "Ø¬Ù†ÙŠÙ‡ Ù…ØµØ±ÙŠ", "EGP")}</option>
                <option value="SAR">{t(locale, "Ø±ÙŠØ§Ù„ Ø³Ø¹ÙˆØ¯ÙŠ", "SAR")}</option>
              </select>
            </Field>
            <Field label={t(locale, "Ø¹Ø¯Ø¯ Ø§Ù„Ø­ØµØµ", "Covered sessions")}>
              <input type="number" min="1" step="1" value={form.sessionsCovered} onChange={(event) => setForm((prev) => ({ ...prev, sessionsCovered: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" />
            </Field>
          </div>

          {hasRoundedSessions ? (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" />
              <p>
                {t(locale, "Ø³ÙŠØªÙ… Ø¥ØµØ¯Ø§Ø± Ø§Ù„ÙØ§ØªÙˆØ±Ø© Ø¹Ù„Ù‰ " + normalizedSessions + " Ø¬Ù„Ø³Ø§Øª Ø¨Ø¯Ù„ " + form.sessionsCovered + " Ù„Ø£Ù† Ø¹Ø¯Ø¯ Ø§Ù„Ø­ØµØµ ÙŠØ¬Ø¨ Ø£Ù† ÙŠÙƒÙˆÙ† Ø±Ù‚Ù…Ù‹Ø§ ØµØ­ÙŠØ­Ù‹Ø§ Ù…ÙˆØ¬Ø¨Ù‹Ø§.", "The invoice will be issued for " + normalizedSessions + " sessions instead of " + form.sessionsCovered + ", because the covered sessions value must be a positive whole number.")}
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t(locale, "Ø§Ù„Ø­Ø§Ù„Ø©", "Status")}>
              <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as PaymentStatus }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
                {STATUS_OPTIONS.map((status) => (<option key={status} value={status}>{statusLabel(status, locale)}</option>))}
              </select>
            </Field>
            <Field label={t(locale, "Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¯ÙØ¹", "Payment method")}>
              <select value={form.method} onChange={(event) => setForm((prev) => ({ ...prev, method: event.target.value as PaymentMethod | "" }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
                <option value="">{t(locale, "Ù„Ø§Ø­Ù‚Ù‹Ø§", "Later")}</option>
                {METHOD_OPTIONS.map((method) => (<option key={method} value={method}>{methodLabel(method, locale)}</option>))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label={t(locale, "Ø¨Ø¯Ø§ÙŠØ© Ø§Ù„Ø¨Ø§Ù‚Ø©", "Block start")}>
              <input type="date" value={form.blockStartDate} onChange={(event) => setForm((prev) => ({ ...prev, blockStartDate: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" />
            </Field>
            <Field label={t(locale, "Ù†Ù‡Ø§ÙŠØ© Ø§Ù„Ø¨Ø§Ù‚Ø©", "Block end")}>
              <input type="date" value={form.blockEndDate} onChange={(event) => setForm((prev) => ({ ...prev, blockEndDate: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" />
            </Field>
            <Field label={t(locale, "ØªØ§Ø±ÙŠØ® Ø§Ù„Ø§Ø³ØªØ­Ù‚Ø§Ù‚", "Due date")}>
              <input type="date" value={form.dueDate} onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" />
            </Field>
          </div>

          <Field label={t(locale, "ØªØ£Ø¬ÙŠÙ„ Ø§Ù„Ø¯ÙØ¹ Ø­ØªÙ‰", "Deferred until")}>
            <input type="date" value={form.deferredUntil} onChange={(event) => setForm((prev) => ({ ...prev, deferredUntil: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" />
          </Field>

          <Field label={t(locale, "Ù…Ù„Ø§Ø­Ø¸Ø©", "Note")}>
            <textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" placeholder={t(locale, "Ù…Ø«Ø§Ù„: Ø§ØªÙÙ‚Ù†Ø§ Ø£Ù† ÙŠØªÙ… Ø§Ù„Ø³Ø¯Ø§Ø¯ Ø¨Ø¹Ø¯ Ø§Ù†ØªÙ‡Ø§Ø¡ Ø§Ù„Ø«Ù…Ø§Ù†ÙŠ Ø¬Ù„Ø³Ø§Øª", "Example: the parent will pay after the eight sessions are completed")} />
          </Field>
        </div>

        <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold text-foreground">{t(locale, "Ù…Ù„Ø®Øµ Ø³Ø±ÙŠØ¹", "Quick summary")}</h2>
          <SummaryRow label={t(locale, "Ø§Ù„Ø·Ø§Ù„Ø¨", "Student")} value={selectedStudent?.fullName ?? "â€”"} />
          <SummaryRow label={t(locale, "ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±", "Parent")} value={selectedStudent?.parentName ?? "â€”"} />
          <SummaryRow label={t(locale, "Ø§Ù„ÙƒÙ„Ø§Ø³", "Class")} value={selectedStudent?.className ?? "â€”"} />
          <SummaryRow label={t(locale, "Ø§Ù„ÙÙˆØªØ±Ø©", "Billing")} value={t(locale, "Ø¨Ø§Ù‚Ø© " + normalizedSessions + " Ø¬Ù„Ø³Ø§Øª", normalizedSessions + "-session block")} />
          <SummaryRow label={t(locale, "Ø§Ù„Ù…Ø¨Ù„Øº", "Amount")} value={form.amount ? formatCurrency(Number(form.amount || 0), locale, form.currency) : "â€”"} />
          <SummaryRow label={t(locale, "Ø§Ù„Ø­Ø§Ù„Ø©", "Status")} value={statusLabel(form.status, locale)} />
          <SummaryRow label={t(locale, "Ø§Ù„Ø§Ø³ØªØ­Ù‚Ø§Ù‚", "Due date")} value={form.dueDate || "â€”"} />
          <SummaryRow label={t(locale, "Ø§Ù„ØªØ£Ø¬ÙŠÙ„", "Deferred until")} value={form.deferredUntil || t(locale, "Ø¨Ø¯ÙˆÙ† ØªØ£Ø¬ÙŠÙ„", "No deferment")} />

          <button type="submit" disabled={saving || Boolean(selectedStudent && !selectedStudentHasParent)} className={cn("w-full rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600", (saving || Boolean(selectedStudent && !selectedStudentHasParent)) && "opacity-70")}>{saving ? t(locale, "Ø¬Ø§Ø±Ù Ø§Ù„Ø¥Ù†Ø´Ø§Ø¡...", "Creating...") : t(locale, "Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø¯ÙØ¹Ø© ÙˆØ¥ØµØ¯Ø§Ø± ÙØ§ØªÙˆØ±Ø©", "Create payment & issue invoice")}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
