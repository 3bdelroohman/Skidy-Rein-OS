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

const STATUS_OPTIONS: PaymentStatus[] = ["pending", "paid", "partial", "overdue"];
const METHOD_OPTIONS: PaymentMethod[] = ["instapay", "bank_transfer", "wallet", "cash", "card"];

function statusLabel(s: PaymentStatus, locale: Locale): string {
  const map: Record<PaymentStatus, { ar: string; en: string }> = {
    pending: { ar: "\u0642\u064a\u062f \u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631", en: "Pending" },
    paid: { ar: "\u0645\u062f\u0641\u0648\u0639", en: "Paid" },
    partial: { ar: "\u062c\u0632\u0626\u064a", en: "Partial" },
    overdue: { ar: "\u0645\u062a\u0623\u062e\u0631", en: "Overdue" },
    refunded: { ar: "\u0645\u0633\u062a\u0631\u062f", en: "Refunded" },
  };
  return locale === "ar" ? map[s].ar : map[s].en;
}

function methodLabel(m: PaymentMethod, locale: Locale): string {
  const map: Record<PaymentMethod, { ar: string; en: string }> = {
    instapay: { ar: "\u0625\u0646\u0633\u062a\u0627\u0628\u0627\u064a", en: "InstaPay" },
    bank_transfer: { ar: "\u062a\u062d\u0648\u064a\u0644 \u0628\u0646\u0643\u064a", en: "Bank Transfer" },
    wallet: { ar: "\u0645\u062d\u0641\u0638\u0629 \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629", en: "Wallet" },
    cash: { ar: "\u0643\u0627\u0634", en: "Cash" },
    card: { ar: "\u0628\u0637\u0627\u0642\u0629", en: "Card" },
  };
  return locale === "ar" ? map[m].ar : map[m].en;
}

function normalizeSessionBlock(value: string): number {
  const parsed = Number(value || 4);
  if (!Number.isFinite(parsed)) return 4;
  return Math.max(4, Math.ceil(parsed / 4) * 4);
}

function studentOptionLabel(s: StudentListItem): string {
  if (s.className) return s.fullName + " \u2014 " + s.className;
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
  const normalizedSessions = useMemo(() => normalizeSessionBlock(form.sessionsCovered), [form.sessionsCovered]);
  const amountNumber = Number(form.amount || 0);
  const hasRoundedSessions = normalizedSessions !== Number(form.sessionsCovered || 0);

  if (!canManage) {
    return (
      <PageStateCard
        variant="danger"
        titleAr="\u0644\u0627 \u062a\u0645\u0644\u0643 \u0635\u0644\u0627\u062d\u064a\u0629 \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0627\u062a"
        titleEn="You cannot manage payments"
        descriptionAr="\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0627\u062a \u0645\u062d\u0635\u0648\u0631\u0629 \u0639\u0644\u0649 \u0627\u0644\u0623\u062f\u0648\u0627\u0631 \u0627\u0644\u0645\u062e\u0648\u0644\u0629 \u0641\u0642\u0637 \u062f\u0627\u062e\u0644 \u0627\u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0645\u0627\u0644\u064a. \u064a\u0645\u0643\u0646\u0643 \u0645\u0634\u0627\u0647\u062f\u0629 \u0627\u0644\u0633\u062c\u0644\u0627\u062a \u0644\u0643\u0646 \u0644\u0627 \u064a\u0645\u0643\u0646\u0643 \u0625\u0646\u0634\u0627\u0621 \u062f\u0641\u0639\u0629 \u062c\u062f\u064a\u062f\u0629."
        descriptionEn="Payment management is restricted to the approved finance users. You can review records but cannot create a new payment."
        actionHref="/payments"
        actionLabelAr="\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0627\u062a"
        actionLabelEn="Back to payments"
      />
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.studentId) {
      toast.error(t(locale, "\u0627\u062e\u062a\u0631 \u0627\u0644\u0637\u0627\u0644\u0628 \u0623\u0648\u0644\u0627\u064b", "Choose a student first"));
      return;
    }

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      toast.error(t(locale, "\u0623\u062f\u062e\u0644 \u0645\u0628\u0644\u063a\u064b\u0627 \u0635\u062d\u064a\u062d\u064b\u0627 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631", "Enter a valid amount greater than zero"));
      return;
    }

    setSaving(true);
    try {
      const created = await createPayment({
        studentId: form.studentId,
        amount: amountNumber,
        status: form.status,
        method: form.method || null,
        dueDate: form.dueDate,
        sessionsCovered: normalizedSessions,
        blockStartDate: form.blockStartDate || null,
        blockEndDate: form.blockEndDate || null,
        deferredUntil: form.deferredUntil || null,
        notes: form.notes || null,
      });
      toast.success(t(locale, "\u062a\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062f\u0641\u0639\u0629 \u0628\u0646\u062c\u0627\u062d", "Payment created successfully"));
      router.push("/payments/" + created.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "\u062a\u0639\u0630\u0631 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062f\u0641\u0639\u0629", "Could not create payment"));
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
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground"><ReceiptText size={24} className="text-brand-600" />{t(locale, "\u0625\u0636\u0627\u0641\u0629 \u062f\u0641\u0639\u0629 \u062c\u062f\u064a\u062f\u0629", "Add new payment")}</h1>
          <p className="text-sm text-muted-foreground">{t(locale, "\u0627\u0644\u0641\u0627\u062a\u0648\u0631\u0629 \u0627\u0644\u0627\u0641\u062a\u0631\u0627\u0636\u064a\u0629 \u062a\u063a\u0637\u064a 4 \u062c\u0644\u0633\u0627\u062a. \u0625\u0630\u0627 \u0623\u062f\u062e\u0644\u062a \u0639\u062f\u062f\u0627\u064b \u0645\u062e\u062a\u0644\u0641\u0627\u064b \u0641\u0633\u064a\u062a\u0645 \u062a\u0642\u0631\u064a\u0628\u0647 \u0625\u0644\u0649 \u0623\u0642\u0631\u0628 \u0645\u0636\u0627\u0639\u0641 \u0644\u0640 4.", "Default invoice covers 4 sessions. Different counts are rounded up to the nearest multiple of 4.")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <Field label={t(locale, "\u0627\u0644\u0637\u0627\u0644\u0628", "Student")}>
            <select value={form.studentId} onChange={(event) => setForm((prev) => ({ ...prev, studentId: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
              <option value="">{t(locale, "\u0627\u062e\u062a\u0631 \u0627\u0644\u0637\u0627\u0644\u0628", "Choose student")}</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>{studentOptionLabel(student)}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t(locale, "\u0627\u0644\u0645\u0628\u0644\u063a", "Amount")}>
              <input type="number" min="1" value={form.amount} onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" />
            </Field>
            <Field label={t(locale, "\u0639\u062f\u062f \u0627\u0644\u062c\u0644\u0633\u0627\u062a", "Sessions covered")}>
              <input type="number" min="4" step="1" value={form.sessionsCovered} onChange={(event) => setForm((prev) => ({ ...prev, sessionsCovered: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" />
            </Field>
          </div>

          {hasRoundedSessions ? (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" />
              <p>
                {t(locale, "\u0633\u064a\u062a\u0645 \u0625\u0635\u062f\u0627\u0631 \u0627\u0644\u0641\u0627\u062a\u0648\u0631\u0629 \u0639\u0644\u0649 " + normalizedSessions + " \u062c\u0644\u0633\u0627\u062a \u0628\u062f\u0644 " + form.sessionsCovered + " \u0644\u0623\u0646 \u062f\u0648\u0631\u0629 \u0627\u0644\u0641\u0648\u062a\u0631\u0629 \u0645\u0639\u062a\u0645\u062f\u0629 \u0639\u0644\u0649 \u0645\u0636\u0627\u0639\u0641\u0627\u062a 4 \u062c\u0644\u0633\u0627\u062a.", "The invoice will be issued for " + normalizedSessions + " sessions instead of " + form.sessionsCovered + ", because the billing cycle is locked to multiples of 4 sessions.")}
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t(locale, "\u0627\u0644\u062d\u0627\u0644\u0629", "Status")}>
              <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as PaymentStatus }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
                {STATUS_OPTIONS.map((status) => (<option key={status} value={status}>{statusLabel(status, locale)}</option>))}
              </select>
            </Field>
            <Field label={t(locale, "\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u062f\u0641\u0639", "Payment method")}>
              <select value={form.method} onChange={(event) => setForm((prev) => ({ ...prev, method: event.target.value as PaymentMethod | "" }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
                <option value="">{t(locale, "\u0644\u0627\u062d\u0642\u064b\u0627", "Later")}</option>
                {METHOD_OPTIONS.map((method) => (<option key={method} value={method}>{methodLabel(method, locale)}</option>))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label={t(locale, "\u0628\u062f\u0627\u064a\u0629 \u0627\u0644\u0628\u0627\u0642\u0629", "Block start")}>
              <input type="date" value={form.blockStartDate} onChange={(event) => setForm((prev) => ({ ...prev, blockStartDate: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" />
            </Field>
            <Field label={t(locale, "\u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u0628\u0627\u0642\u0629", "Block end")}>
              <input type="date" value={form.blockEndDate} onChange={(event) => setForm((prev) => ({ ...prev, blockEndDate: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" />
            </Field>
            <Field label={t(locale, "\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0627\u0633\u062a\u062d\u0642\u0627\u0642", "Due date")}>
              <input type="date" value={form.dueDate} onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" />
            </Field>
          </div>

          <Field label={t(locale, "\u062a\u0623\u062c\u064a\u0644 \u0627\u0644\u062f\u0641\u0639 \u062d\u062a\u0649", "Deferred until")}>
            <input type="date" value={form.deferredUntil} onChange={(event) => setForm((prev) => ({ ...prev, deferredUntil: event.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" />
          </Field>

          <Field label={t(locale, "\u0645\u0644\u0627\u062d\u0638\u0629", "Note")}>
            <textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground" placeholder={t(locale, "\u0645\u062b\u0627\u0644: \u0627\u062a\u0641\u0642\u0646\u0627 \u0623\u0646 \u064a\u062a\u0645 \u0627\u0644\u0633\u062f\u0627\u062f \u0628\u0639\u062f \u0627\u0646\u062a\u0647\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639 \u062c\u0644\u0633\u0627\u062a", "Example: the parent will pay after the four sessions are completed")} />
          </Field>
        </div>

        <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold text-foreground">{t(locale, "\u0645\u0644\u062e\u0635 \u0633\u0631\u064a\u0639", "Quick summary")}</h2>
          <SummaryRow label={t(locale, "\u0627\u0644\u0637\u0627\u0644\u0628", "Student")} value={selectedStudent?.fullName ?? "\u2014"} />
          <SummaryRow label={t(locale, "\u0648\u0644\u064a \u0627\u0644\u0623\u0645\u0631", "Parent")} value={selectedStudent?.parentName ?? "\u2014"} />
          <SummaryRow label={t(locale, "\u0627\u0644\u0643\u0644\u0627\u0633", "Class")} value={selectedStudent?.className ?? "\u2014"} />
          <SummaryRow label={t(locale, "\u0627\u0644\u0641\u0648\u062a\u0631\u0629", "Billing")} value={t(locale, "\u0628\u0627\u0642\u0629 " + normalizedSessions + " \u062c\u0644\u0633\u0627\u062a", normalizedSessions + "-session block")} />
          <SummaryRow label={t(locale, "\u0627\u0644\u0645\u0628\u0644\u063a", "Amount")} value={form.amount ? form.amount + " " + (isAr ? "\u062c.\u0645" : "EGP") : "\u2014"} />
          <SummaryRow label={t(locale, "\u0627\u0644\u062d\u0627\u0644\u0629", "Status")} value={statusLabel(form.status, locale)} />
          <SummaryRow label={t(locale, "\u0627\u0644\u0627\u0633\u062a\u062d\u0642\u0627\u0642", "Due date")} value={form.dueDate || "\u2014"} />
          <SummaryRow label={t(locale, "\u0627\u0644\u062a\u0623\u062c\u064a\u0644", "Deferred until")} value={form.deferredUntil || t(locale, "\u0628\u062f\u0648\u0646 \u062a\u0623\u062c\u064a\u0644", "No deferment")} />

          <button type="submit" disabled={saving} className={cn("w-full rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600", saving && "opacity-70")}>{saving ? t(locale, "\u062c\u0627\u0631\u0650 \u0627\u0644\u0625\u0646\u0634\u0627\u0621...", "Creating...") : t(locale, "\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062f\u0641\u0639\u0629 \u0648\u0625\u0635\u062f\u0627\u0631 \u0641\u0627\u062a\u0648\u0631\u0629", "Create payment & issue invoice")}</button>
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
