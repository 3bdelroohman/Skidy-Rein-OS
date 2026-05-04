
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BellRing, CalendarClock, CircleAlert, FolderOpenDot, Wallet, Users2 } from "lucide-react";
import { useCurrentUser } from "@/providers/user-provider";
import { useUIStore } from "@/stores/ui-store";
import { t } from "@/lib/locale";
import { getActionCenterData, getActionToneStyles } from "@/services/operations.service";
import { getDataQualityActionCenterData } from "@/services/data-quality.service";
import { LoadingState } from "@/components/shared/page-state";
import type { ActionCenterData, ActionCenterItem } from "@/types/crm";

const ICONS = {
  follow_up: BellRing,
  lead: FolderOpenDot,
  payment: Wallet,
  student: Users2,
  schedule: CalendarClock,
  data_quality: CircleAlert,
} as const;

export default function ActionCenterPage() {
  const user = useCurrentUser();
  const locale = useUIStore((state) => state.locale);
  // const isAr = locale === "ar";
  const [data, setData] = useState<ActionCenterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const [next, dataQuality] = await Promise.all([
        getActionCenterData(
          {
            role: user.role,
            fullName: user.fullName,
            fullNameAr: user.fullNameAr,
          },
          locale,
        ),
        getDataQualityActionCenterData(locale),
      ]);

      if (isMounted) {
        setData({
          ...next,
          metrics: [...next.metrics, ...dataQuality.metrics],
          critical: [...dataQuality.critical, ...next.critical],
          mediumPriority: [...dataQuality.mediumPriority, ...next.mediumPriority],
          informational: [...dataQuality.informational, ...next.informational],
        });
        setLoading(false);
      }
    }
    void load();
    return () => {
      isMounted = false;
    };
  }, [locale, user.fullName, user.fullNameAr, user.role]);

  if (loading || !data) {
    return (
      <LoadingState
        titleAr="Ø¬Ø§Ø±Ù ØªØ­Ù…ÙŠÙ„ Ù…Ø±ÙƒØ² Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª"
        titleEn="Loading action center"
        descriptionAr="ÙŠØªÙ… Ø§Ù„Ø¢Ù† ØªØ¬Ù‡ÙŠØ² Ø§Ù„Ø¹Ù†Ø§ØµØ± Ø§Ù„Ø­Ø±Ø¬Ø© ÙˆØ§Ù„Ù…Ù‡Ø§Ù… Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠØ©."
        descriptionEn="Preparing critical items and operational tasks."
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <BellRing size={14} />
              {t(locale, "Ù„ÙˆØ­Ø© ØªÙ†ÙÙŠØ° ÙŠÙˆÙ…ÙŠØ©", "Daily execution board")}
            </div>
            <h1 className="mt-3 text-2xl font-bold text-foreground">
              {t(locale, "Ù…Ø±ÙƒØ² Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª", "Action Center")}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {t(locale, "Ù‡Ø°Ù‡ Ø§Ù„Ø´Ø§Ø´Ø© ØªØ¬Ù…Ø¹ ÙƒÙ„ Ø§Ù„Ø£Ø´ÙŠØ§Ø¡ Ø§Ù„ØªÙŠ ØªØ­ØªØ§Ø¬ Ù‚Ø±Ø§Ø±Ù‹Ø§ Ø£Ùˆ Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø¢Ù†ØŒ Ø­ØªÙ‰ Ù„Ø§ ÙŠØ¶ÙŠØ¹ Ø§Ù„ÙØ±ÙŠÙ‚ Ø¨ÙŠÙ† Ø§Ù„ØµÙØ­Ø§Øª Ø§Ù„Ù…Ø®ØªÙ„ÙØ©.", "This screen brings together the items that need a decision or follow-up now, so the team does not get lost between separate pages.")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:w-[420px]">
            {data.metrics.map((metric) => {
              const tone = metric.tone === "danger"
                ? { bg: "#FEF2F2", color: "#DC2626" }
                : metric.tone === "warning"
                  ? { bg: "#FFFBEB", color: "#D97706" }
                  : metric.tone === "success"
                    ? { bg: "#ECFDF5", color: "#059669" }
                    : metric.tone === "info"
                      ? { bg: "#EFF6FF", color: "#2563EB" }
                      : { bg: "#EEF2FF", color: "#4338CA" };
              return (
                <div key={metric.label} className="rounded-2xl border border-border p-4" style={{ background: tone.bg }}>
                  <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-2xl font-bold" style={{ color: tone.color }}>{metric.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ActionSection locale={locale} title={t(locale, "Ø­Ø±Ø¬ Ø§Ù„Ø¢Ù†", "Critical now")} description={t(locale, "Ù‡Ø°Ù‡ Ø§Ù„Ø¹Ù†Ø§ØµØ± Ù„Ù‡Ø§ Ø£Ø«Ø± Ù…Ø¨Ø§Ø´Ø± Ø¹Ù„Ù‰ Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ Ø£Ùˆ Ø§Ù„ØªØ­ØµÙŠÙ„ Ø£Ùˆ Ø§Ù„Ø§Ø­ØªÙØ§Ø¸ Ø¨Ø§Ù„Ø·Ø§Ù„Ø¨.", "These items directly affect enrollment, collection, or retention.")} items={data.critical} />
      <ActionSection locale={locale} title={t(locale, "ÙŠØ­ØªØ§Ø¬ Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„ÙŠÙˆÙ…", "Should be closed today")} description={t(locale, "Ù„Ùˆ ØªØ£Ø®Ø±Øª Ù‡Ø°Ù‡ Ø§Ù„Ø¹Ù†Ø§ØµØ±ØŒ Ø³ØªØªØ­ÙˆÙ„ Ø¨Ø³Ø±Ø¹Ø© Ø¥Ù„Ù‰ Ø§Ø­ØªÙƒØ§Ùƒ ØªØ´ØºÙŠÙ„ÙŠ Ø£Ùˆ ÙØ±Øµ Ø¶Ø§Ø¦Ø¹Ø©.", "If delayed, these items will quickly become operational friction or missed opportunities.")} items={data.mediumPriority} />
      <ActionSection locale={locale} title={t(locale, "Ù„Ù„Ø§Ø·Ù„Ø§Ø¹ ÙˆØ§Ù„ØªÙ†Ø¸ÙŠÙ…", "For visibility and planning")} description={t(locale, "Ù„ÙŠØ³Øª Ø­Ø±Ø¬Ø© Ø§Ù„Ø¢Ù†ØŒ Ù„ÙƒÙ†Ù‡Ø§ ØªØ³Ø§Ø¹Ø¯Ùƒ ØªØ­Ø§ÙØ¸ Ø¹Ù„Ù‰ ÙˆØ¶ÙˆØ­ Ø§Ù„ØªØ´ØºÙŠÙ„ Ø®Ù„Ø§Ù„ Ø§Ù„ÙŠÙˆÙ….", "Not critical now, but they help maintain operational clarity through the day.")} items={data.informational} />
    </div>
  );
}

function ActionSection({
  locale,
  title,
  description,
  items,
}: {
  locale: "ar" | "en";
  title: string;
  description: string;
  items: ActionCenterItem[];
}) {
  const isAr = locale === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-border bg-background px-3 text-sm font-semibold text-foreground">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-10 text-center text-sm text-muted-foreground">
          {t(locale, "Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¹Ù†Ø§ØµØ± ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„Ù‚Ø³Ù… Ø§Ù„Ø¢Ù†", "There are no items in this section right now")}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = ICONS[item.category] ?? CircleAlert;
            const tone = getActionToneStyles(item.priority);
            return (
              <Link key={item.id} href={item.href} className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: tone.bg, color: tone.color }}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium" style={{ borderColor: tone.border, background: tone.bg, color: tone.color }}>
                      {item.priority === "critical"
                        ? t(locale, "Ø­Ø±Ø¬", "Critical")
                        : item.priority === "high"
                          ? t(locale, "Ø¹Ø§Ù„Ù", "High")
                          : item.priority === "medium"
                            ? t(locale, "Ù…ØªÙˆØ³Ø·", "Medium")
                            : t(locale, "Ù…Ø¹Ù„ÙˆÙ…Ø©", "Info")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  {(item.owner || item.meta) && (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {item.owner ? <span className="rounded-full bg-muted px-2 py-1">{item.owner}</span> : null}
                      {item.meta ? <span className="rounded-full bg-muted px-2 py-1">{item.meta}</span> : null}
                    </div>
                  )}
                </div>
                <div className="mt-1 text-muted-foreground transition-transform group-hover:translate-x-0.5">
                  <Arrow size={18} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
