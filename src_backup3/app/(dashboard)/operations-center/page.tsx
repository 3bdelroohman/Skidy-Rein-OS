"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Layers3,
  Loader2,
  RefreshCw,
  Wrench,
} from "lucide-react";

import { PageStateCard } from "@/components/shared/page-state";
import { useCurrentUser } from "@/providers/user-provider";
import { getOperationsCenterData, type OperationsCenterData, type OperationsHandoffItem } from "@/services/operations-center.service";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { t } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

const OPS_ROLES = new Set(["admin", "owner", "ops"]);

export default function OperationsCenterPage() {
  const locale = useUIStore((state) => state.locale);
  const user = useCurrentUser();
  const canAccess = OPS_ROLES.has(user.role);

  const [data, setData] = useState<OperationsCenterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setRefreshing(true);
    try {
      const result = await getOperationsCenterData();
      setData(result);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (!canAccess) {
      setLoading(false);
      return;
    }

    void load();
  }, [canAccess]);

  const urgentCount = useMemo(() => {
    if (!data) return 0;
    return data.paidWithoutGroup.length + data.paidWithoutActiveGroup.length + data.needsFirstSessionCheck.length;
  }, [data]);

  if (!canAccess) {
    return (
      <PageStateCard
        variant="danger"
        titleAr="Ù„Ø§ ØªÙ…Ù„Ùƒ ØµÙ„Ø§Ø­ÙŠØ© Ø¯Ø®ÙˆÙ„ Ù…Ø±ÙƒØ² Ø§Ù„Ø£ÙˆØ¨Ø±ÙŠØ´Ù†"
        titleEn="You cannot access Operations Center"
        descriptionAr="Ù‡Ø°Ù‡ Ø§Ù„ØµÙØ­Ø© Ù…Ø®ØµØµØ© Ù„Ù„Ø¥Ø¯Ø§Ø±Ø© ÙˆÙØ±ÙŠÙ‚ Ø§Ù„Ø£ÙˆØ¨Ø±ÙŠØ´Ù†."
        descriptionEn="This page is reserved for management and operations users."
        actionHref="/"
        actionLabelAr="Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ©"
        actionLabelEn="Back to dashboard"
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
          <Loader2 className="animate-spin text-brand-600" size={18} />
          {t(locale, "Ø¬Ø§Ø±ÙŠ ØªØ­Ù…ÙŠÙ„ Ù…Ø±ÙƒØ² Ø§Ù„Ø£ÙˆØ¨Ø±ÙŠØ´Ù†...", "Loading Operations Center...")}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ù…Ø±ÙƒØ² Ø§Ù„Ø£ÙˆØ¨Ø±ÙŠØ´Ù†"
        titleEn="Could not load Operations Center"
        descriptionAr="Ø­Ø§ÙˆÙ„ ØªØ­Ø¯ÙŠØ« Ø§Ù„ØµÙØ­Ø© Ø£Ùˆ Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª."
        descriptionEn="Refresh the page or check the database connection."
        actionHref="/"
        actionLabelAr="Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ©"
        actionLabelEn="Back to dashboard"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <ClipboardList size={26} className="text-brand-600" />
            {t(locale, "Ù…Ø±ÙƒØ² Ø§Ù„Ø£ÙˆØ¨Ø±ÙŠØ´Ù†", "Operations Center")}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
            {t(
              locale,
              "Ù‚Ø§Ø¦Ù…Ø© ØªØ´ØºÙŠÙ„ Ù„Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„Ø°ÙŠÙ† Ø¯ÙØ¹ÙˆØ§ Ø¨Ø§Ù‚Ø© 8 Ø­ØµØµ ÙˆÙŠØ­ØªØ§Ø¬ÙˆÙ† Ø±Ø¨Ø·Ù‹Ø§ Ø¨Ø¬Ø±ÙˆØ¨ Ø£Ùˆ Ù…Ø±Ø§Ø¬Ø¹Ø© ØªØ´ØºÙŠÙ„ Ø¯Ø§Ø®Ù„ Ø§Ù„Ø¬Ø±ÙˆØ¨Ø§Øª.",
              "A handoff queue for students who paid for an 8-session package and need group assignment or operational review.",
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          <RefreshCw size={16} className={cn(refreshing && "animate-spin")} />
          {t(locale, "ØªØ­Ø¯ÙŠØ«", "Refresh")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.key} label={locale === "ar" ? metric.labelAr : metric.labelEn} value={metric.value} tone={metric.tone} />
        ))}
      </div>

      {urgentCount > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-1 shrink-0" />
            <p>
              {t(
                locale,
                "ÙŠÙˆØ¬Ø¯ " + urgentCount + " Ø·Ø§Ù„Ø¨ ÙŠØ­ØªØ§Ø¬ÙˆÙ† ØªØ¯Ø®Ù„Ù‹Ø§ ØªØ´ØºÙŠÙ„ÙŠÙ‹Ø§ Ø£Ùˆ Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ø±Ø¨Ø· Ø¨Ø§Ù„Ø¬Ø±ÙˆØ¨.",
                urgentCount + " students need operations action or group assignment review.",
              )}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <WorkQueue title={t(locale, "Ø¯ÙØ¹ÙˆØ§ Ø¨Ù„Ø§ Ø¬Ø±ÙˆØ¨", "Paid without group")} description={t(locale, "Ø·Ù„Ø§Ø¨ Ù„Ø¯ÙŠÙ‡Ù… Ø¯ÙØ¹Ø© Ù…Ø¯ÙÙˆØ¹Ø© Ø£Ùˆ Ø¬Ø²Ø¦ÙŠØ© ÙˆÙ„ÙƒÙ† Ù„Ø§ ÙŠØ¸Ù‡Ø± Ù„Ù‡Ù… Ø¬Ø±ÙˆØ¨ Ø­Ø§Ù„ÙŠ.", "Students have a paid or partial payment but no visible current group.")} items={data.paidWithoutGroup} emptyText={t(locale, "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø·Ù„Ø§Ø¨ Ø¯ÙØ¹ÙˆØ§ Ø¨Ù„Ø§ Ø¬Ø±ÙˆØ¨.", "No paid students without a group.")} tone="danger" locale={locale} />
        <WorkQueue title={t(locale, "Ø¨Ù„Ø§ Ø¬Ø±ÙˆØ¨ Ù†Ø´Ø· Ù…Ø·Ø§Ø¨Ù‚", "No matching active group")} description={t(locale, "Ø§Ù„Ø·Ø§Ù„Ø¨ Ù„Ø¯ÙŠÙ‡ Ø¬Ø±ÙˆØ¨ Ø¸Ø§Ù‡Ø± Ù„ÙƒÙ† Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø¬Ø±ÙˆØ¨ Ù†Ø´Ø· Ù…Ø·Ø§Ø¨Ù‚ Ù„Ù„ÙƒÙˆØ±Ø³ Ø¨ÙˆØ¶ÙˆØ­.", "Student has a visible group, but no active group clearly matches the current course.")} items={data.paidWithoutActiveGroup} emptyText={t(locale, "Ù„Ø§ ÙŠÙˆØ¬Ø¯ ØªØ¹Ø§Ø±Ø¶ Ø¨ÙŠÙ† Ø§Ù„ÙƒÙˆØ±Ø³ ÙˆØ§Ù„Ø¬Ø±ÙˆØ¨ Ø§Ù„Ù†Ø´Ø·.", "No active group/course mismatch.")} tone="warning" locale={locale} />
        <WorkQueue title={t(locale, "ÙŠØ­ØªØ§Ø¬ ØªØ£ÙƒÙŠØ¯ Ø£ÙˆÙ„ Ø­ØµØ©", "Needs first-session check")} description={t(locale, "Ø§Ù„Ø·Ø§Ù„Ø¨ Ù…Ø±Ø¨ÙˆØ· ØªØ´ØºÙŠÙ„ÙŠÙ‹Ø§ Ù„ÙƒÙ† Ù„Ø§ ØªÙˆØ¬Ø¯ Ø­ØµØµ Ø­Ø¶Ø±Ù‡Ø§ Ø¨Ø¹Ø¯.", "Student appears operationally assigned but has not attended any sessions yet.")} items={data.needsFirstSessionCheck} emptyText={t(locale, "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø·Ù„Ø§Ø¨ ÙŠØ­ØªØ§Ø¬ÙˆÙ† ØªØ£ÙƒÙŠØ¯ Ø£ÙˆÙ„ Ø­ØµØ©.", "No first-session checks needed.")} tone="info" locale={locale} />
        <WorkQueue title={t(locale, "ØªØ´ØºÙŠÙ„ Ù…Ø³ØªÙ‚Ø±", "Operationally ready")} description={t(locale, "Ø·Ù„Ø§Ø¨ Ù„Ø¯ÙŠÙ‡Ù… Ø¯ÙØ¹Ø© ÙˆØ¬Ø±ÙˆØ¨ ÙˆØ­Ø¶ÙˆØ± Ù…Ø³Ø¬Ù„.", "Students have payment, group assignment, and recorded attendance.")} items={data.ready.slice(0, 10)} emptyText={t(locale, "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø³Ø¬Ù„Ø§Øª ØªØ´ØºÙŠÙ„ Ù…Ø³ØªÙ‚Ø±Ø© Ø­Ø§Ù„ÙŠÙ‹Ø§.", "No operationally ready records right now.")} tone="success" locale={locale} />
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: number; tone: "brand" | "success" | "warning" | "danger" | "info" }) {
  const toneClass = {
    brand: "border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-900/60 dark:bg-brand-950/30 dark:text-brand-200",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200",
    warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100",
    danger: "border-danger-200 bg-danger-50 text-danger-800 dark:border-danger-900/60 dark:bg-danger-950/30 dark:text-danger-200",
    info: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-200",
  }[tone];

  return (
    <div className={cn("rounded-2xl border p-4", toneClass)}>
      <p className="text-xs font-medium opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function WorkQueue({ title, description, items, emptyText, tone, locale }: { title: string; description: string; items: OperationsHandoffItem[]; emptyText: string; tone: "success" | "warning" | "danger" | "info"; locale: "ar" | "en" }) {
  const iconClass = {
    success: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-danger-600",
    info: "text-sky-600",
  }[tone];

  const Icon = tone === "success" ? CheckCircle2 : tone === "info" ? Wrench : AlertTriangle;

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-start gap-3">
        <Icon size={20} className={cn("mt-1 shrink-0", iconClass)} />
        <div>
          <h2 className="font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{emptyText}</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => <OperationsQueueCard key={item.student.id + item.status} item={item} locale={locale} />)}
        </div>
      )}
    </section>
  );
}

function OperationsQueueCard({ item, locale }: { item: OperationsHandoffItem; locale: "ar" | "en" }) {
  const latestAmount = formatCurrency(item.latestPayment.amount, locale);
  const latestDate = item.latestPayment.paidAt ?? item.latestPayment.dueDate;

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <Link href={item.studentHref} className="font-bold text-foreground hover:text-brand-600">{item.student.fullName}</Link>
          <p className="mt-1 text-xs text-muted-foreground">{item.parentLabel}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full bg-muted px-2.5 py-1">{t(locale, "Ø§Ù„ÙƒÙˆØ±Ø³", "Course")}: {item.courseLabel}</span>
            <span className="rounded-full bg-muted px-2.5 py-1">{t(locale, "Ø§Ù„Ø¬Ø±ÙˆØ¨", "Group")}: {item.currentGroupName ?? "â€”"}</span>
            <span className="rounded-full bg-muted px-2.5 py-1">{t(locale, "Ø­ØµØµ Ø­Ø¶Ø±Ù‡Ø§", "Attended")}: {item.student.sessionsAttended}</span>
          </div>

          {item.suggestedGroups.length > 0 ? (
            <div className="mt-3 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
              <p className="mb-2 font-semibold text-foreground">{t(locale, "Ø¬Ø±ÙˆØ¨Ø§Øª Ù…Ù‚ØªØ±Ø­Ø©", "Suggested groups")}</p>
              <div className="space-y-1">
                {item.suggestedGroups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between gap-2">
                    <span>{group.name}</span>
                    <span>{group.studentsCount} {t(locale, "Ø·Ø§Ù„Ø¨", "students")}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-2 text-xs text-muted-foreground md:items-end">
          <span>{t(locale, "Ø¢Ø®Ø± Ø¯ÙØ¹Ø©", "Latest payment")}: {latestAmount}</span>
          <span>{formatDate(latestDate, locale)}</span>

          <div className="flex flex-wrap gap-2">
            <Link href={item.studentHref} className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-semibold text-foreground hover:bg-muted">
              {t(locale, "ÙØªØ­ Ø§Ù„Ø·Ø§Ù„Ø¨", "Open student")} <ArrowUpRight size={13} />
            </Link>
            <Link href={item.groupsHref} className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-semibold text-foreground hover:bg-muted">
              <Layers3 size={13} /> {t(locale, "Ø§Ù„Ø¬Ø±ÙˆØ¨Ø§Øª", "Groups")}
            </Link>
            <Link href={item.paymentHref} className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-700">
              {t(locale, "Ø§Ù„Ø¯ÙØ¹Ø©", "Payment")} <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
