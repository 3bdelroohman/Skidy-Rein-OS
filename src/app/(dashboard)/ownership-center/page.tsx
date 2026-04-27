"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, RefreshCw, ShieldCheck } from "lucide-react";

import { PageStateCard } from "@/components/shared/page-state";
import { useCurrentUser } from "@/providers/user-provider";
import { getOwnershipCenterData, type OwnershipCenterData, type OwnershipUnassignedItem } from "@/services/ownership-center.service";
import { t } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

const OWNERSHIP_ROLES = new Set(["admin", "owner"]);

export default function OwnershipCenterPage() {
  const locale = useUIStore((state) => state.locale);
  const user = useCurrentUser();
  const canAccess = OWNERSHIP_ROLES.has(user.role);

  const [data, setData] = useState<OwnershipCenterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setRefreshing(true);
    try {
      const result = await getOwnershipCenterData();
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

  if (!canAccess) {
    return (
      <PageStateCard
        variant="danger"
        titleAr="لا تملك صلاحية دخول مركز الملكية"
        titleEn="You cannot access Ownership Center"
        descriptionAr="هذه الصفحة مخصصة للإدارة فقط."
        descriptionEn="This page is reserved for management only."
        actionHref="/"
        actionLabelAr="العودة للرئيسية"
        actionLabelEn="Back to dashboard"
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
          <Loader2 className="animate-spin text-brand-600" size={18} />
          {t(locale, "جاري تحميل مركز الملكية...", "Loading Ownership Center...")}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="تعذر تحميل مركز الملكية"
        titleEn="Could not load Ownership Center"
        descriptionAr="حاول تحديث الصفحة أو راجع الاتصال بقاعدة البيانات."
        descriptionEn="Refresh the page or check the database connection."
        actionHref="/"
        actionLabelAr="العودة للرئيسية"
        actionLabelEn="Back to dashboard"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <ShieldCheck size={26} className="text-brand-600" />
            {t(locale, "مركز الملكية", "Ownership Center")}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
            {t(
              locale,
              "صفحة تدقيق لتوزيع المسؤولية بين العملاء المحتملين وأولياء الأمور والطلاب قبل تشديد الصلاحيات.",
              "An audit page for ownership distribution across leads, parents, and students before tightening security.",
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
          {t(locale, "تحديث", "Refresh")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <MetricCard label={t(locale, "المسؤولون", "Owners")} value={data.totals.owners} />
        <MetricCard label={t(locale, "العملاء", "Leads")} value={data.totals.leads} />
        <MetricCard label={t(locale, "أولياء الأمور", "Parents")} value={data.totals.parents} />
        <MetricCard label={t(locale, "الطلاب", "Students")} value={data.totals.students} />
        <MetricCard label={t(locale, "بلا مسؤول", "Unassigned")} value={data.totals.unassigned} danger={data.totals.unassigned > 0} />
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-bold text-foreground">{t(locale, "توزيع المسؤولية", "Ownership distribution")}</h2>

        {data.buckets.length === 0 ? (
          <EmptyState text={t(locale, "لا توجد سجلات مرتبطة بمسؤولين حتى الآن.", "No records are linked to owners yet.")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-3 py-3 text-start">{t(locale, "المسؤول", "Owner")}</th>
                  <th className="px-3 py-3 text-center">Leads</th>
                  <th className="px-3 py-3 text-center">Parents</th>
                  <th className="px-3 py-3 text-center">Students</th>
                  <th className="px-3 py-3 text-center">{t(locale, "الإجمالي", "Total")}</th>
                </tr>
              </thead>
              <tbody>
                {data.buckets.map((bucket) => (
                  <tr key={bucket.ownerName} className="border-b border-border/70">
                    <td className="px-3 py-3 font-semibold text-foreground">{bucket.ownerName}</td>
                    <td className="px-3 py-3 text-center text-muted-foreground">{bucket.leadsCount}</td>
                    <td className="px-3 py-3 text-center text-muted-foreground">{bucket.parentsCount}</td>
                    <td className="px-3 py-3 text-center text-muted-foreground">{bucket.studentsCount}</td>
                    <td className="px-3 py-3 text-center font-bold text-foreground">{bucket.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <UnassignedPanel title={t(locale, "Leads بلا مسؤول", "Unassigned leads")} emptyText={t(locale, "لا يوجد Leads بلا مسؤول.", "No unassigned leads.")} items={data.unassignedLeads} />
        <UnassignedPanel title={t(locale, "أولياء أمور بلا مسؤول", "Unassigned parents")} emptyText={t(locale, "لا يوجد أولياء أمور بلا مسؤول.", "No unassigned parents.")} items={data.unassignedParents} />
        <UnassignedPanel title={t(locale, "طلاب بلا مسؤول", "Unassigned students")} emptyText={t(locale, "لا يوجد طلاب بلا مسؤول.", "No unassigned students.")} items={data.unassignedStudents} />
      </div>
    </div>
  );
}

function MetricCard({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        danger
          ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100"
          : "border-border bg-card text-foreground",
      )}
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function UnassignedPanel({ title, emptyText, items }: { title: string; emptyText: string; items: OwnershipUnassignedItem[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-bold text-foreground">{title}</h2>

      {items.length === 0 ? (
        <EmptyState text={emptyText} />
      ) : (
        <div className="space-y-3">
          {items.slice(0, 20).map((item) => (
            <Link key={item.type + item.id} href={item.href} className="block rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
                <ArrowUpRight size={14} className="shrink-0 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{text}</div>;
}
