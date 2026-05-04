"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, PlusCircle, Search } from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { getPaymentStatusLabel, t } from "@/lib/locale";
import { cn } from "@/lib/utils";
import {
  getBillingCycleText,
  getPaymentDisplayState,
  getPaymentEffectiveDueDate,
  getPaymentsSummary,
  listPayments,
} from "@/services/payments.service";
import { useUIStore } from "@/stores/ui-store";
import type { PaymentItem } from "@/types/crm";
import type { PaymentStatus } from "@/types/common.types";
import { useCurrentUser } from "@/providers/user-provider";
import { canAccessPaymentsForUser, canManagePaymentsForUser } from "@/config/roles";
import { PageStateCard } from "@/components/shared/page-state";
import { PageHeader } from "@/components/ui/page-header";

type DisplayStatus = PaymentStatus | "deferred";
type CurrencySummary = {
  currency: NonNullable<PaymentItem["currency"]>;
  totalExpected: number;
  totalCollected: number;
  totalOverdue: number;
  collectionRate: number;
};

type MoneyMetricField = "totalExpected" | "totalCollected" | "totalOverdue";

function getCurrencyLabel(currency: CurrencySummary["currency"], locale: "ar" | "en"): string {
  return currency === "SAR" ? t(locale, "Ø±ÙŠØ§Ù„ Ø³Ø¹ÙˆØ¯ÙŠ", "SAR") : t(locale, "Ø¬Ù†ÙŠÙ‡ Ù…ØµØ±ÙŠ", "EGP");
}

function getMoneyFieldLabel(field: MoneyMetricField, locale: "ar" | "en"): string {
  if (field === "totalCollected") return t(locale, "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø­ØµÙ„", "Total collected");
  if (field === "totalOverdue") return t(locale, "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…ØªØ£Ø®Ø±", "Total overdue");
  return t(locale, "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø³ØªØ­Ù‚", "Total expected");
}

function getMoneyFieldColor(field: MoneyMetricField): string {
  if (field === "totalCollected") return "text-success-600";
  if (field === "totalOverdue") return "text-danger-600";
  return "text-foreground";
}

function buildMoneyMetricCards(rows: CurrencySummary[], locale: "ar" | "en") {
  const activeRows: CurrencySummary[] =
    rows.length > 0
      ? rows
      : [
          {
            currency: "EGP",
            totalExpected: 0,
            totalCollected: 0,
            totalOverdue: 0,
            collectionRate: 0,
          },
        ];

  const fields: MoneyMetricField[] = ["totalExpected", "totalCollected", "totalOverdue"];

  return activeRows.flatMap((row) =>
    fields.map((field) => ({
      key: `${field}-${row.currency}`,
      label: `${getMoneyFieldLabel(field, locale)} â€” ${getCurrencyLabel(row.currency, locale)}`,
      value: formatCurrency(row[field], locale, row.currency),
      colorClass: getMoneyFieldColor(field),
    })),
  );
}
const PAYMENT_STATUS_META: Record<DisplayStatus, { color: string; bg: string }> = {
  paid: { color: "#059669", bg: "#ECFDF5" },
  pending: { color: "#D97706", bg: "#FFFBEB" },
  overdue: { color: "#DC2626", bg: "#FEF2F2" },
  refunded: { color: "#6B7280", bg: "#F3F4F6" },
  partial: { color: "#2563EB", bg: "#EFF6FF" },
  deferred: { color: "#7C3AED", bg: "#F5F3FF" },
};

function getDisplayStatusLabel(status: DisplayStatus, locale: "ar" | "en") {
  return status === "deferred" ? t(locale, "Ù…Ø¤Ø¬Ù„", "Deferred") : getPaymentStatusLabel(status, locale);
}

export default function PaymentsPage() {
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const user = useCurrentUser();
  const canAccess = canAccessPaymentsForUser(user);
  const canManage = canManagePaymentsForUser(user);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DisplayStatus | "all">("all");
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalExpected: 0,
    totalCollected: 0,
    totalOverdue: 0,
    dueToday: 0,
    deferredCount: 0,
    collectionRate: 0,
    upcoming: [] as PaymentItem[],
    moneyByCurrency: [] as CurrencySummary[],
  });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      const [data, nextSummary] = await Promise.all([listPayments(), getPaymentsSummary()]);
      if (isMounted) {
        setPayments(data);
        setSummary(nextSummary);
        setLoading(false);
      }
    }

    if (canAccess) {
      void load();
    }

    return () => {
      isMounted = false;
    };
  }, [canAccess]);

  const filtered = useMemo(() => {
    return payments.filter((payment) => {
      const query = search.trim().toLowerCase();
      const displayStatus = getPaymentDisplayState(payment);
      const matchSearch =
        !query ||
        payment.studentName.toLowerCase().includes(query) ||
        payment.parentName.toLowerCase().includes(query) ||
        (payment.invoiceNumber ?? "").toLowerCase().includes(query);
      const matchStatus = statusFilter === "all" || displayStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [payments, search, statusFilter]);

  const statusCounts = useMemo(() => {
    return {
      paid: payments.filter((payment) => getPaymentDisplayState(payment) === "paid").length,
      pending: payments.filter((payment) => getPaymentDisplayState(payment) === "pending").length,
      overdue: payments.filter((payment) => getPaymentDisplayState(payment) === "overdue").length,
      partial: payments.filter((payment) => getPaymentDisplayState(payment) === "partial").length,
      deferred: payments.filter((payment) => getPaymentDisplayState(payment) === "deferred").length,
    };
  }, [payments]);

  const moneyMetricCards = useMemo(() => buildMoneyMetricCards(summary.moneyByCurrency, locale), [summary.moneyByCurrency, locale]);

  if (!canAccess) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª Ù…ØªØ§Ø­Ø© Ù„Ù„Ù…Ø³Ø¤ÙˆÙ„ÙŠÙ† Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ÙŠÙ† ÙÙ‚Ø·"
        titleEn="Payments are restricted to approved users"
        descriptionAr="Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª ÙˆØ§Ù„ÙÙˆØ§ØªÙŠØ± Ø¯Ø§Ø®Ù„ Skidy Rein Ù…Ø­ØµÙˆØ±Ø© Ø¹Ù„Ù‰ Ø®Ø§Ù„Ø¯ ÙˆØ¹Ø¨Ø¯Ø§Ù„Ø±Ø­Ù…Ù† ÙˆØ§Ù„Ø§Ø¡ ÙÙ‚Ø·. ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„Ø±Ø¬ÙˆØ¹ Ø¥Ù„Ù‰ Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ… Ø£Ùˆ Ù…ØªØ§Ø¨Ø¹Ø© Ø£ÙŠ Ù‚Ø³Ù… Ø¢Ø®Ø± Ø­Ø³Ø¨ Ø¯ÙˆØ±Ùƒ."
        descriptionEn="Payments and invoicing in Skidy Rein are restricted to Khaled, Abdelrahman, and Alaa only. You can go back to the dashboard or continue working in the sections allowed for your role."
        actionHref="/"
        actionLabelAr="Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ…"
        actionLabelEn="Back to dashboard"
      />
    );
  }

  const hasRealPayments = payments.length > 0;
  const hasFilteredResults = filtered.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAr ? "\u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0627\u062a \u0648\u0627\u0644\u0641\u0648\u062a\u0631\u0629" : "Payments & Billing"}
        subtitle={isAr ? "\u0627\u0644\u062f\u0641\u0639\u0627\u062a \u0627\u0644\u0627\u0641\u062a\u0631\u0627\u0636\u064a\u0629 \u0643\u0644 8 \u062c\u0644\u0633\u0627\u062a" : "Default cycle: 8 sessions per invoice"}
        actions={
          canManage ? (
            <Link href="/payments/new">
              <button className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-brand-700)] px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-600)]">
                <PlusCircle className="h-4 w-4" />
                {isAr ? "\u0625\u0636\u0627\u0641\u0629 \u062f\u0641\u0639\u0629" : "Add payment"}
              </button>
            </Link>
          ) : undefined
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {moneyMetricCards.map((card) => (
          <MetricCard key={card.key} label={card.label} value={card.value} colorClass={card.colorClass} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-2">
        <MetricCard label={t(locale, "Ù…Ø³ØªØ­Ù‚ Ø§Ù„ÙŠÙˆÙ…", "Due today")} value={String(summary.dueToday)} colorClass="text-amber-600" />
        <MetricCard label={t(locale, "Ù…Ø¤Ø¬Ù„ Ø­Ø§Ù„ÙŠÙ‹Ø§", "Currently deferred")} value={String(summary.deferredCount)} colorClass="text-violet-600" />
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <StatusMiniCard label={getDisplayStatusLabel("paid", locale)} count={statusCounts.paid} status="paid" />
        <StatusMiniCard label={getDisplayStatusLabel("pending", locale)} count={statusCounts.pending} status="pending" />
        <StatusMiniCard label={getDisplayStatusLabel("overdue", locale)} count={statusCounts.overdue} status="overdue" />
        <StatusMiniCard label={getDisplayStatusLabel("partial", locale)} count={statusCounts.partial} status="partial" />
        <StatusMiniCard label={getDisplayStatusLabel("deferred", locale)} count={statusCounts.deferred} status="deferred" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isAr ? "right-3" : "left-3")} />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t(locale, "Ø¨Ø­Ø« Ø¨Ø§Ù„Ø·Ø§Ù„Ø¨ Ø£Ùˆ ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø± Ø£Ùˆ Ø±Ù‚Ù… Ø§Ù„ÙØ§ØªÙˆØ±Ø©...", "Search by student, parent, or invoice number...")}
                className={cn("w-full rounded-xl border border-border bg-card py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring", isAr ? "pr-10 pl-4" : "pl-10 pr-4")}
              />
            </div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as DisplayStatus | "all")} className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground">
              <option value="all">{t(locale, "ÙƒÙ„ Ø­Ø§Ù„Ø§Øª Ø§Ù„Ø¯ÙØ¹", "All payment statuses")}</option>
              {(["paid", "pending", "overdue", "partial", "deferred"] as DisplayStatus[]).map((key) => (
                <option key={key} value={key}>{getDisplayStatusLabel(key, locale)}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex min-h-[20vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-brand-500)]" />
            </div>
          ) : !hasRealPayments ? (
            <PageStateCard
              icon={AlertCircle}
              titleAr="Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ø¯ÙÙˆØ¹Ø§Øª Ø­Ù‚ÙŠÙ‚ÙŠØ© Ù…Ø³Ø¬Ù„Ø© Ø¨Ø¹Ø¯"
              titleEn="No real payments have been recorded yet"
              descriptionAr="Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø¢Ù† ØµØ§Ø¯Ù‚Ø© Ø¨Ø§Ù„ÙƒØ§Ù…Ù„: Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨ÙŠØ§Ù†Ø§Øª ØªØ¬Ø±ÙŠØ¨ÙŠØ© Ù…Ø¹Ø±ÙˆØ¶Ø©. Ø§Ø¨Ø¯Ø£ Ø¨Ø¥Ø¶Ø§ÙØ© Ø£ÙˆÙ„ Ø¯ÙØ¹Ø© Ø­Ù‚ÙŠÙ‚ÙŠØ© ÙˆØ³ÙŠØ¸Ù‡Ø± Ø£Ø«Ø±Ù‡Ø§ Ù‡Ù†Ø§ ÙˆÙÙŠ Ø§Ù„ÙÙˆØ§ØªÙŠØ± ÙˆØ§Ù„ØªÙ‚Ø§Ø±ÙŠØ±."
              descriptionEn="This list is now fully honest: no demo data is shown. Create the first real payment and it will appear here, in invoices, and in reports."
              actionHref={canManage ? "/payments/new" : undefined}
              actionLabelAr="Ø¥Ø¶Ø§ÙØ© Ø£ÙˆÙ„ Ø¯ÙØ¹Ø©"
              actionLabelEn="Create the first payment"
            />
          ) : !hasFilteredResults ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-12 text-muted-foreground">
              <AlertCircle size={18} />
              {t(locale, "Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ø¯ÙÙˆØ¹Ø§Øª Ù…Ø·Ø§Ø¨Ù‚Ø© Ù„Ù„ÙÙ„Ø§ØªØ± Ø§Ù„Ø­Ø§Ù„ÙŠØ©", "No payments match the current filters")}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "Ø§Ù„Ø·Ø§Ù„Ø¨", "Student")}</th>
                      <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±", "Parent")}</th>
                      <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "Ø¯ÙˆØ±Ø© Ø§Ù„ÙÙˆØªØ±Ø©", "Covered sessions")}</th>
                      <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "Ø§Ù„Ù…Ø¨Ù„Øº", "Amount")}</th>
                      <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "Ø§Ù„Ø­Ø§Ù„Ø©", "Status")}</th>
                      <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "Ø§Ù„Ø§Ø³ØªØ­Ù‚Ø§Ù‚ Ø§Ù„ÙØ¹Ù„ÙŠ", "Effective due")}</th>
                      <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "Ø§Ù„ØªÙØ§ØµÙŠÙ„", "Details")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((payment) => {
                      const displayStatus = getPaymentDisplayState(payment);
                      const meta = PAYMENT_STATUS_META[displayStatus];
                      return (
                        <tr key={payment.id} className={cn("border-b border-border last:border-0 transition-colors hover:bg-muted/30", displayStatus === "overdue" && "bg-danger-50/50")}>
                          <td className="px-4 py-3"><p className="font-semibold text-foreground">{payment.studentName}</p></td>
                          <td className="px-4 py-3 text-foreground">{payment.parentName}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{getBillingCycleText(payment, locale)}</td>
                          <td className="px-4 py-3 font-semibold text-foreground">{formatCurrency(payment.amount, locale, payment.currency ?? "EGP")}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: meta.bg, color: meta.color }}>
                              {getDisplayStatusLabel(displayStatus, locale)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(getPaymentEffectiveDueDate(payment), locale)}</td>
                          <td className="px-4 py-3">
                            <Link href={`/payments/${payment.id}`} className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-300">
                              {t(locale, "ÙØªØ­", "Open")}
                              {isAr ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-bold text-foreground">{t(locale, "Ø£Ù‚Ø±Ø¨ Ø§Ù„Ø§Ø³ØªØ­Ù‚Ø§Ù‚Ø§Øª Ø§Ù„Ù‚Ø§Ø¯Ù…Ø©", "Next billing checkpoints")}</h3>
          {summary.upcoming.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {t(locale, "Ù„Ø§ ØªÙˆØ¬Ø¯ Ø§Ø³ØªØ­Ù‚Ø§Ù‚Ø§Øª Ù‚Ø§Ø¯Ù…Ø© Ø­Ø§Ù„ÙŠØ§Ù‹", "There are no upcoming billing checkpoints right now")}
            </div>
          ) : (
            <div className="space-y-3">
              {summary.upcoming.map((payment) => {
                const displayStatus = getPaymentDisplayState(payment);
                return (
                  <Link key={payment.id} href={`/payments/${payment.id}`} className="block rounded-2xl border border-border p-3 transition-colors hover:bg-muted/40">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{payment.studentName}</p>
                        <p className="text-xs text-muted-foreground">{getBillingCycleText(payment, locale)}</p>
                      </div>
                      <span className="text-sm font-bold text-foreground">{formatCurrency(payment.amount, locale, payment.currency ?? "EGP")}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(getPaymentEffectiveDueDate(payment), locale)}</span>
                      <span>{getDisplayStatusLabel(displayStatus, locale)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, colorClass }: { label: string; value: string; colorClass: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-2xl font-bold", colorClass)}>{value}</p>
    </div>
  );
}

function StatusMiniCard({ label, count, status }: { label: string; count: number; status: DisplayStatus }) {
  const meta = PAYMENT_STATUS_META[status];
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: meta.bg, color: meta.color }}>
        {label}
      </span>
      <p className="mt-3 text-2xl font-bold text-foreground">{count}</p>
    </div>
  );
}
