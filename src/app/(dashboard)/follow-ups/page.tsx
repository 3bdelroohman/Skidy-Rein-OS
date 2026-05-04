"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Loader2,
  MessageSquare,
  Phone,
  RotateCcw,
} from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { FOLLOW_UP_STATUS_META, PRIORITY_META, getMetaLabel } from "@/config/status-meta";
import { formatTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { getCommChannelLabel, getFollowUpTypeLabel } from "@/lib/locale";
import { listFollowUps, markFollowUpCompleted, reopenFollowUp } from "@/services/follow-ups.service";
import type { FollowUpItem } from "@/types/crm";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

const CHANNEL_ICON: Record<FollowUpItem["channel"], typeof Phone> = {
  whatsapp: MessageSquare,
  call: Phone,
  email: MessageSquare,
  sms: MessageSquare,
};

export default function FollowUpsPage() {
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const [tab, setTab] = useState<"today" | "overdue" | "completed">("today");
  const [items, setItems] = useState<FollowUpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = await listFollowUps();
      if (isMounted) {
        setItems(data);
        setLoading(false);
      }
    }
    void load();
    return () => { isMounted = false; };
  }, []);

  const todayItems     = useMemo(() => items.filter((i) => i.status === "pending"),   [items]);
  const overdueItems   = useMemo(() => items.filter((i) => i.status === "overdue"),   [items]);
  const completedItems = useMemo(() => items.filter((i) => i.status === "completed"), [items]);
  const displayItems   = tab === "today" ? todayItems : tab === "overdue" ? overdueItems : completedItems;

  const handleComplete = async (id: string) => {
    setSavingId(id);
    const updated = await markFollowUpCompleted(id);
    if (updated) setItems((curr) => curr.map((item) => (item.id === id ? updated : item)));
    setSavingId(null);
  };

  const handleUndo = async (id: string) => {
    setSavingId(id);
    const updated = await reopenFollowUp(id);
    if (updated) setItems((curr) => curr.map((item) => (item.id === id ? updated : item)));
    setSavingId(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-brand-500)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <PageHeader
        title={isAr ? "\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0627\u062a" : "Follow-ups"}
        subtitle={
          isAr
            ? "\u0645\u0647\u0627\u0645 \u0627\u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u064a\u0648\u0645\u064a\u0629 \u0648\u0627\u0644\u0645\u062a\u0623\u062e\u0631\u0629"
            : "Daily and overdue follow-up tasks"
        }
      />

      {/* Tab counters */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setTab("today")}
          className={cn(
            "rounded-xl border bg-card p-4 text-center transition-all",
            tab === "today"
              ? "border-[var(--color-brand-500)] ring-2 ring-[var(--color-brand-500)]/20"
              : "border-border hover:border-[var(--color-brand-300)]"
          )}
        >
          <Clock className="mx-auto mb-1 h-5 w-5 text-[var(--color-brand-600)]" />
          <p className="text-2xl font-bold text-foreground">{todayItems.length}</p>
          <p className="text-xs text-muted-foreground">{isAr ? "\u0627\u0644\u064a\u0648\u0645" : "Today"}</p>
        </button>

        <button
          onClick={() => setTab("overdue")}
          className={cn(
            "rounded-xl border bg-card p-4 text-center transition-all",
            tab === "overdue"
              ? "border-[var(--color-danger-500)] ring-2 ring-[var(--color-danger-500)]/20"
              : "border-border hover:border-[var(--color-danger-300)]"
          )}
        >
          <AlertTriangle className="mx-auto mb-1 h-5 w-5 text-[var(--color-danger-600)]" />
          <p className="text-2xl font-bold text-[var(--color-danger-600)]">{overdueItems.length}</p>
          <p className="text-xs text-muted-foreground">{isAr ? "\u0645\u062a\u0623\u062e\u0631\u0629" : "Overdue"}</p>
        </button>

        <button
          onClick={() => setTab("completed")}
          className={cn(
            "rounded-xl border bg-card p-4 text-center transition-all",
            tab === "completed"
              ? "border-[var(--color-success-500)] ring-2 ring-[var(--color-success-500)]/20"
              : "border-border hover:border-[var(--color-success-300)]"
          )}
        >
          <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-[var(--color-success-600)]" />
          <p className="text-2xl font-bold text-[var(--color-success-600)]">{completedItems.length}</p>
          <p className="text-xs text-muted-foreground">{isAr ? "\u0645\u0643\u062a\u0645\u0644\u0629" : "Completed"}</p>
        </button>
      </div>

      {/* List */}
      {displayItems.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="h-10 w-10" />}
          title={
            tab === "today"
              ? (isAr ? "\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u062a\u0627\u0628\u0639\u0627\u062a \u0644\u0644\u064a\u0648\u0645" : "No follow-ups for today")
              : tab === "overdue"
              ? (isAr ? "\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u062a\u0627\u0628\u0639\u0627\u062a \u0645\u062a\u0623\u062e\u0631\u0629" : "No overdue follow-ups")
              : (isAr ? "\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u062a\u0627\u0628\u0639\u0627\u062a \u0645\u0643\u062a\u0645\u0644\u0629" : "No completed follow-ups")
          }
          description={isAr ? "\u0633\u062a\u0638\u0647\u0631 \u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0627\u062a \u0647\u0646\u0627 \u0639\u0646\u062f \u0625\u0636\u0627\u0641\u062a\u0647\u0627" : "Follow-ups will appear here once added"}
        />
      ) : (
        <div className="space-y-3">
          {displayItems.map((item) => {
            const ChannelIcon = CHANNEL_ICON[item.channel] ?? MessageSquare;
            const priority = PRIORITY_META[item.priority];
            const status = FOLLOW_UP_STATUS_META[item.status];
            const completed = item.status === "completed";
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl border border-border bg-card p-4 transition-all",
                  item.status === "overdue" && "border-[var(--color-danger-300)] bg-[var(--color-danger-50)]/30",
                  completed && "opacity-70"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <ChannelIcon className="h-4 w-4 text-muted-foreground" />
                      <p className={cn("text-sm font-bold text-foreground", completed && "line-through")}>
                        {item.title}
                      </p>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ backgroundColor: status.bg, color: status.color }}
                      >
                        {getMetaLabel(status, locale)}
                      </span>
                    </div>
                    <p className={cn("text-xs text-muted-foreground", completed && "line-through")}>
                      {item.parentName} — {item.leadName}
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {getFollowUpTypeLabel(item.type, locale)} • {getCommChannelLabel(item.channel, locale)}
                    </p>
                  </div>

                  <div className={cn("shrink-0 space-y-1", isAr ? "text-left" : "text-right")}>
                    <p className={cn("text-xs font-semibold", priority.textClass)}>
                      {getMetaLabel(priority, locale)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{formatTime(item.scheduledAt, locale)}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">{item.assignedTo}</span>
                  <div className="flex items-center gap-2">
                    {completed ? (
                      <button
                        onClick={() => void handleUndo(item.id)}
                        disabled={savingId === item.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-60"
                      >
                        <RotateCcw className="h-3 w-3" />
                        {savingId === item.id
                          ? (isAr ? "\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u0631\u0627\u062c\u0639..." : "Undoing...")
                          : (isAr ? "\u062a\u0631\u0627\u062c\u0639" : "Undo")}
                      </button>
                    ) : (
                      <button
                        onClick={() => void handleComplete(item.id)}
                        disabled={savingId === item.id}
                        className="inline-flex items-center rounded-lg bg-[var(--color-success-500)] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-success-600)] disabled:opacity-60"
                      >
                        {savingId === item.id
                          ? (isAr ? "\u062c\u0627\u0631\u064a \u0627\u0644\u062d\u0641\u0638..." : "Saving...")
                          : (isAr ? "\u062a\u0645 \u0627\u0644\u0625\u0643\u0645\u0627\u0644" : "Mark done")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}