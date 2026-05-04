"use client";

import { formatCurrency } from "@/lib/formatters";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { InvoiceToolbar } from "@/components/payments/invoice-toolbar";
import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import { t } from "@/lib/locale";
import { useUIStore } from "@/stores/ui-store";
import { getBillingCycleText, getPaymentDetails, getPaymentDisplayState, getPaymentEffectiveDueDate } from "@/services/payments.service";
import type { PaymentDetails } from "@/types/crm";

/** Convert Eastern-Arabic digits to Western 0-9 */
function _w(s: string): string {
  return s
    .replace(/[Ù -Ù©]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[Û°-Û¹]/g, (d) => String(d.charCodeAt(0) - 0x06F0));
}function formatDateLabel(value: string | null | undefined, locale: "ar" | "en"): string {
  if (!value) return "â€”";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return _w(new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date));
}

function normalizePhone(value: string | null | undefined): string {
  const digits = (value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `20${digits.slice(1)}`;
  return digits;
}

function getStatusLabel(status: ReturnType<typeof getPaymentDisplayState>, locale: "ar" | "en"): string {
  const labels = {
    paid: t(locale, "Ù…Ø¯ÙÙˆØ¹", "Paid"),
    pending: t(locale, "Ù‚ÙŠØ¯ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±", "Pending"),
    overdue: t(locale, "Ù…ØªØ£Ø®Ø±", "Overdue"),
    partial: t(locale, "Ù…Ø¯ÙÙˆØ¹ Ø¬Ø²Ø¦ÙŠÙ‹Ø§", "Partially paid"),
    refunded: t(locale, "Ù…Ø±ØªØ¬Ø¹", "Refunded"),
    deferred: t(locale, "Ù…Ø¤Ø¬Ù„", "Deferred"),
  } as const;
  return labels[status];
}

function getMethodLabel(method: PaymentDetails["method"], locale: "ar" | "en"): string {
  if (!method) return t(locale, "Ù„Ø§Ø­Ù‚Ù‹Ø§", "Later");

  const labels: Record<NonNullable<PaymentDetails["method"]>, string> = {
    instapay: t(locale, "Ø¥Ù†Ø³ØªØ§ Ø¨Ø§ÙŠ", "Instapay"),
    bank_transfer: t(locale, "ØªØ­ÙˆÙŠÙ„ Ø¨Ù†ÙƒÙŠ", "Bank transfer"),
    wallet: t(locale, "Ù…Ø­ÙØ¸Ø©", "Wallet"),
    cash: t(locale, "ÙƒØ§Ø´", "Cash"),
    card: t(locale, "Ø¨Ø·Ø§Ù‚Ø©", "Card"),
  };

  return labels[method];
}

export function PaymentInvoiceView({ paymentId }: { paymentId: string }) {
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      const details = await getPaymentDetails(paymentId);
      if (isMounted) {
        setPayment(details);
        setLoading(false);
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [paymentId]);

  const shareTargets = useMemo(() => {
    if (!payment) return { whatsappUrl: undefined, mailtoUrl: undefined };

    const parentPhone = payment.parent?.phone ?? payment.student?.parentPhone ?? null;
    const parentEmail = payment.parent?.email ?? null;
    const invoiceNumber = payment.invoiceNumber ?? `SKR-${new Date().getFullYear()}-${payment.id.slice(0, 6).toUpperCase()}`;
    const studentName = payment.studentName;
    const amount = formatCurrency(payment.amount, locale, payment.currency ?? "EGP");
    const sessions = String(payment.sessionsCovered);
    const effectiveDueDate = formatDateLabel(getPaymentEffectiveDueDate(payment), locale);

    const whatsappMessage = encodeURIComponent(
      t(
        locale,
        `Ø­Ø¶Ø±ØªÙƒØŒ Ù‡Ø°Ù‡ ÙØ§ØªÙˆØ±Ø© ${invoiceNumber} Ø§Ù„Ø®Ø§ØµØ© Ø¨Ø§Ù„Ø·Ø§Ù„Ø¨ ${studentName} Ù…Ù† Skidy Rein Ø¨Ù‚ÙŠÙ…Ø© ${amount} Ù„Ø¹Ø¯Ø¯ ${sessions} Ø¬Ù„Ø³Ø§Øª. Ù…ÙˆØ¹Ø¯ Ø§Ù„Ø§Ø³ØªØ­Ù‚Ø§Ù‚ Ø§Ù„ÙØ¹Ù„ÙŠ: ${effectiveDueDate}.`,
        `Here is invoice ${invoiceNumber} for ${studentName} from Skidy Rein. Amount: ${amount} for ${sessions} sessions. Effective due date: ${effectiveDueDate}.`,
      ),
    );
    const normalizedPhone = normalizePhone(parentPhone);
    const whatsappUrl = normalizedPhone ? `https://wa.me/${normalizedPhone}?text=${whatsappMessage}` : undefined;

    const mailtoBody = encodeURIComponent(
      t(
        locale,
        `Ù…Ø±Ø­Ø¨Ù‹Ø§ØŒ\n\nÙ‡Ø°Ù‡ ÙØ§ØªÙˆØ±Ø© ${invoiceNumber} Ø§Ù„Ø®Ø§ØµØ© Ø¨Ø§Ù„Ø·Ø§Ù„Ø¨ ${studentName}.\nØ§Ù„Ù‚ÙŠÙ…Ø©: ${amount}\nØ¹Ø¯Ø¯ Ø§Ù„Ø¬Ù„Ø³Ø§Øª: ${sessions}\nØ§Ù„Ø§Ø³ØªØ­Ù‚Ø§Ù‚ Ø§Ù„ÙØ¹Ù„ÙŠ: ${effectiveDueDate}\n\nSkidy Rein`,
        `Hello,\n\nThis is invoice ${invoiceNumber} for ${studentName}.\nAmount: ${amount}\nSessions: ${sessions}\nEffective due date: ${effectiveDueDate}\n\nSkidy Rein`,
      ),
    );
    const mailtoUrl = parentEmail
      ? `mailto:${parentEmail}?subject=${encodeURIComponent(`${t(locale, "ÙØ§ØªÙˆØ±Ø©", "Invoice")} ${invoiceNumber} - Skidy Rein`)}&body=${mailtoBody}`
      : undefined;

    return { whatsappUrl, mailtoUrl };
  }, [payment, locale]);

  if (loading) {
    return (
      <LoadingState
        titleAr="Ø¬Ø§Ø±Ù ØªØ¬Ù‡ÙŠØ² Ø§Ù„ÙØ§ØªÙˆØ±Ø©"
        titleEn="Preparing invoice"
        descriptionAr="ÙŠØªÙ… ØªØ­Ù…ÙŠÙ„ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¯ÙØ¹Ø© ÙˆØ§Ù„Ø·Ø¨Ø§Ø¹Ø© Ø§Ù„Ø¢Ù† Ù…Ù† Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠ."
        descriptionEn="The real payment record is being loaded for print and sharing."
      />
    );
  }

  if (!payment) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="Ø§Ù„ÙØ§ØªÙˆØ±Ø© ØºÙŠØ± Ù…ØªØ§Ø­Ø©"
        titleEn="Invoice not available"
        descriptionAr="Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø³Ø¬Ù„ Ø§Ù„Ø¯ÙØ¹Ø© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨ Ø£Ùˆ Ø£Ù† Ø§Ù„Ø³Ø¬Ù„ Ù„Ù… ÙŠØ¹Ø¯ Ù…ØªØ§Ø­Ù‹Ø§."
        descriptionEn="The requested payment record was not found or is no longer available."
        actionHref="/payments"
        actionLabelAr="Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª"
        actionLabelEn="Back to payments"
      />
    );
  }

  const invoiceNumber = payment.invoiceNumber ?? `SKR-${new Date().getFullYear()}-${payment.id.slice(0, 6).toUpperCase()}`;
  const displayStatus = getPaymentDisplayState(payment);
  const issuedAt = payment.invoiceIssuedAt ?? payment.paidAt ?? payment.dueDate;
  const effectiveDueDate = getPaymentEffectiveDueDate(payment);
  const note = payment.publicNote ?? "â€”";
  const parentName = payment.parent?.fullName ?? payment.parentName;
  const parentPhone = payment.parent?.phone ?? payment.student?.parentPhone ?? "â€”";
  const parentEmail = payment.parent?.email ?? "â€”";

  const rows = [
    [t(locale, "Ø±Ù‚Ù… Ø§Ù„ÙØ§ØªÙˆØ±Ø©", "Invoice number"), invoiceNumber],
    [t(locale, "Ø§Ù„Ø·Ø§Ù„Ø¨", "Student"), payment.studentName],
    [t(locale, "ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±", "Parent"), parentName],
    [t(locale, "Ø§Ù„Ù…Ø¨Ù„Øº", "Amount"), formatCurrency(payment.amount, locale, payment.currency ?? "EGP")],
    [t(locale, "Ø¹Ø¯Ø¯ Ø§Ù„Ø¬Ù„Ø³Ø§Øª", "Sessions covered"), String(payment.sessionsCovered)],
    [t(locale, "Ø§Ù„Ø­Ø§Ù„Ø©", "Status"), getStatusLabel(displayStatus, locale)],
    [t(locale, "Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¯ÙØ¹", "Payment method"), getMethodLabel(payment.method, locale)],
    [t(locale, "ØªØ§Ø±ÙŠØ® Ø§Ù„Ø¥ØµØ¯Ø§Ø±", "Issued at"), formatDateLabel(issuedAt, locale)],
    [t(locale, "Ø§Ù„Ø§Ø³ØªØ­Ù‚Ø§Ù‚ Ø§Ù„Ø£ØµÙ„ÙŠ", "Original due date"), formatDateLabel(payment.dueDate, locale)],
    [t(locale, "Ø§Ù„Ø§Ø³ØªØ­Ù‚Ø§Ù‚ Ø§Ù„ÙØ¹Ù„ÙŠ", "Effective due date"), formatDateLabel(effectiveDueDate, locale)],
    [t(locale, "Ø¨Ø¯Ø§ÙŠØ© Ø§Ù„Ø¨Ø§Ù‚Ø©", "Block start"), formatDateLabel(payment.blockStartDate, locale)],
    [t(locale, "Ù†Ù‡Ø§ÙŠØ© Ø§Ù„Ø¨Ø§Ù‚Ø©", "Block end"), formatDateLabel(payment.blockEndDate, locale)],
    [t(locale, "Ø§Ù„ØªØ£Ø¬ÙŠÙ„ Ø­ØªÙ‰", "Deferred until"), formatDateLabel(payment.deferredUntil, locale)],
    [t(locale, "Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„Ø§ØªÙØ§Ù‚", "Agreement notes"), note],
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 print:bg-white" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between gap-3 print:hidden">
          <Link
            href={`/payments/${paymentId}`}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {t(locale, "Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ Ø§Ù„Ø¯ÙØ¹Ø©", "Back to payment")}
          </Link>
          <InvoiceToolbar whatsappUrl={shareTargets.whatsappUrl} mailtoUrl={shareTargets.mailtoUrl} />
        </div>

        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-l from-indigo-600 to-violet-600 px-8 py-8 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-sm text-white/80">Skidy Rein</p>
                <h1 className="text-3xl font-bold">{t(locale, "ÙØ§ØªÙˆØ±Ø© ØªØ­ØµÙŠÙ„ â€” Skidy Rein", "Collection invoice â€” Skidy Rein")}</h1>
                <p className="text-sm text-white/85">{t(locale, "Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø¨Ø±Ù…Ø¬Ø© Ù„Ù„Ø£Ø·ÙØ§Ù„ â€¢ Ù…Ø³ØªÙ†Ø¯ Ù…Ø§Ù„ÙŠ Ø¬Ø§Ù‡Ø² Ù„Ù„Ø·Ø¨Ø§Ø¹Ø© ÙˆØ§Ù„Ø­ÙØ¸ ÙƒÙ€ PDF", "Kids coding academy â€¢ print-ready financial document")}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm backdrop-blur">
                <p className="text-white/75">{t(locale, "Ø±Ù‚Ù… Ø§Ù„ÙØ§ØªÙˆØ±Ø©", "Invoice number")}</p>
                <p className="mt-1 text-lg font-semibold">{invoiceNumber}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-8 py-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 p-5">
                <h2 className="mb-4 text-xl font-semibold text-slate-900">{t(locale, "ØªÙØ§ØµÙŠÙ„ Ø§Ù„ÙØ§ØªÙˆØ±Ø©", "Invoice details")}</h2>
                <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {rows.map(([label, value]) => (
                    <div key={label} className="border-b border-dashed border-slate-200 pb-3 last:border-b-0 last:pb-0">
                      <p className="text-sm text-slate-500">{label}</p>
                      <p className="mt-1 font-medium text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 p-5">
                <h2 className="mb-4 text-xl font-semibold text-slate-900">{t(locale, "Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ØªÙˆØ§ØµÙ„", "Contact details")}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-500">{t(locale, "ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±", "Parent")}</p>
                    <p className="mt-1 font-medium text-slate-900">{parentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{t(locale, "Ø§Ù„Ù‡Ø§ØªÙ", "Phone")}</p>
                    <p className="mt-1 font-medium text-slate-900">{parentPhone || "â€”"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-slate-500">{t(locale, "Ø§Ù„Ø¨Ø±ÙŠØ¯", "Email")}</p>
                    <p className="mt-1 font-medium text-slate-900">{parentEmail || "â€”"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-sm text-emerald-700">{t(locale, "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø³ØªØ­Ù‚", "Total amount due")}</p>
                <p className="mt-2 text-3xl font-bold text-emerald-900">{formatCurrency(payment.amount, locale, payment.currency ?? "EGP")}</p>
                <p className="mt-2 text-sm text-emerald-800">{getBillingCycleText(payment, locale)}</p>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                <p className="font-semibold">{t(locale, "Ù…Ù„Ø§Ø­Ø¸Ø© ØªØ´ØºÙŠÙ„ÙŠØ©", "Operational note")}</p>
                <p className="mt-2 leading-7">
                  {t(
                    locale,
                    "Ù‡Ø°Ù‡ Ø§Ù„ÙØ§ØªÙˆØ±Ø© Ù…Ø±ØªØ¨Ø·Ø© Ø¨Ø¨Ø§Ù‚Ø© Ø¬Ù„Ø³Ø§Øª ÙˆÙ„ÙŠØ³Øª Ø¨Ø§Ø´ØªØ±Ø§Ùƒ Ø´Ù‡Ø±ÙŠ Ø«Ø§Ø¨Øª. Ù„Ø°Ù„Ùƒ Ù‚Ø¯ ØªÙ†ØªÙ‡ÙŠ Ø§Ù„Ø«Ù…Ø§Ù†ÙŠ Ø¬Ù„Ø³Ø§Øª Ø®Ù„Ø§Ù„ Ø´Ù‡Ø± ÙˆØ§Ø­Ø¯ Ø£Ùˆ Ø£ÙƒØ«Ø± Ù…Ù† Ø´Ù‡Ø±ØŒ ÙƒÙ…Ø§ ÙŠÙ…ÙƒÙ† ØªØ£Ø¬ÙŠÙ„ Ø§Ù„Ø§Ø³ØªØ­Ù‚Ø§Ù‚ Ø¨Ø§Ù„Ø§ØªÙØ§Ù‚ Ù…Ø¹ ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±.",
                    "This invoice is tied to a session block, not a fixed monthly subscription. The eight sessions may finish within one month or over several months, and the due date can be deferred by agreement with the parent.",
                  )}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Skidy Rein</p>
                <p className="mt-2 leading-7">{t(locale, "ÙŠÙ…ÙƒÙ† Ø­ÙØ¸ Ù‡Ø°Ù‡ Ø§Ù„ØµÙØ­Ø© Ù…Ø¨Ø§Ø´Ø±Ø© ÙƒÙ…Ù„Ù PDF Ù…Ù† Ù†Ø§ÙØ°Ø© Ø§Ù„Ø·Ø¨Ø§Ø¹Ø© Ø£Ùˆ Ù…Ø´Ø§Ø±ÙƒØªÙ‡Ø§ Ù…Ø¹ ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø± Ø¹Ø¨Ø± ÙˆØ§ØªØ³Ø§Ø¨ Ø£Ùˆ Ø§Ù„Ø¨Ø±ÙŠØ¯.", "This page can be saved directly as a PDF from the print dialog or shared with the parent via WhatsApp or email.")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
