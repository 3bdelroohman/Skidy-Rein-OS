"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { PageStateCard } from "@/components/shared/page-state";
import { useCurrentUser } from "@/providers/user-provider";
import { getAccountCenterData, type AccountCenterData, type AccountCenterStudentItem } from "@/services/account-center.service";
import { formatCurrencyEgp, formatDate } from "@/lib/formatters";
import { t } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

const ACCOUNT_ROLES = new Set(["admin", "owner", "sales"]);

export default function AccountCenterPage() {
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const user = useCurrentUser();
  const canAccess = ACCOUNT_ROLES.has(user.role);

  const [data, setData] = useState<AccountCenterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setRefreshing(true);
    try {
      const result = await getAccountCenterData();
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
    return data.needsRenewal.length + data.overused.length + data.nearRenewal.length;
  }, [data]);

  if (!canAccess) {
    return (
      <PageStateCard
        variant="danger"
        titleAr="لا تملك صلاحية دخول مركز الأكاونت"
        titleEn="You cannot access Account Center"
        descriptionAr="هذه الصفحة مخصصة للإدارة وفريق الأكاونت."
        descriptionEn="This page is reserved for management and account users."
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
          {t(locale, "جاري تحميل مركز الأكاونت...", "Loading Account Center...")}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="تعذر تحميل مركز الأكاونت"
        titleEn="Could not load Account Center"
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
            <CircleDollarSign size={26} className="text-brand-600" />
            {t(locale, "مركز الأكاونت", "Account Center")}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
            {t(
              locale,
              "قائمة عمل يومية لمتابعة التحصيل اليدوي، الحصص المغطاة، التجديدات، الاستخدام الزائد، والطلاب الذين دفعوا ويحتاجون تسليمًا للأوبريشن.",
              "A daily work queue for manual collection, covered sessions, renewals, overuse, and paid students who need operations handoff.",
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

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.key} label={isAr ? metric.labelAr : metric.labelEn} value={metric.value} tone={metric.tone} />
        ))}
      </div>

      {urgentCount > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-1 shrink-0" />
            <p>
              {t(
                locale,
                "يوجد " + urgentCount + " طالب يحتاجون متابعة تجديد أو مراجعة استخدام التحصيل.",
                urgentCount + " students need renewal follow-up or collection usage review.",
              )}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <WorkQueue title={t(locale, "يحتاج تجديد", "Needs renewal")} description={t(locale, "التحصيل انتهت أو لا يوجد متبقي من الحصص.", "Collection is finished or has no remaining sessions.")} items={data.needsRenewal} emptyText={t(locale, "لا يوجد طلاب يحتاجون تجديد الآن.", "No students need renewal now.")} tone="danger" locale={locale} />
        <WorkQueue title={t(locale, "قرب التجديد", "Near renewal")} description={t(locale, "متبقي حصتان أو أقل من الحصص المغطاة.", "Two sessions or fewer remain from the covered sessions.")} items={data.nearRenewal} emptyText={t(locale, "لا يوجد طلاب قرب التجديد حاليًا.", "No students are near renewal right now.")} tone="warning" locale={locale} />
        <WorkQueue title={t(locale, "استخدام زائد", "Overused")} description={t(locale, "الطالب حضر حصصًا أكثر من المغطى في آخر دفعة.", "Student attended more sessions than the latest paid collection covers.")} items={data.overused} emptyText={t(locale, "لا يوجد استخدام زائد.", "No overused collections.")} tone="danger" locale={locale} />
        <WorkQueue title={t(locale, "يحتاج تسليم للأوبريشن", "Pending operations handoff")} description={t(locale, "طلاب لديهم دفعة ولكن لا يظهر لهم جروب نشط بعد.", "Students have a payment but no active group appears yet.")} items={data.pendingHandoff} emptyText={t(locale, "لا يوجد تسليم معلق للأوبريشن.", "No pending operations handoff.")} tone="info" locale={locale} />
        <WorkQueue title={t(locale, "بلا دفعة", "No payment")} description={t(locale, "طلاب موجودون في النظام لكن لا توجد لهم دفعة مدفوعة أو جزئية.", "Students exist in the system but have no paid or partial payment.")} items={data.noPayment} emptyText={t(locale, "لا يوجد طلاب بلا دفعة.", "No students without payment.")} tone="warning" locale={locale} />
        <WorkQueue title={t(locale, "حالة جيدة", "Healthy")} description={t(locale, "طلاب لديهم باقة نشطة ولا يحتاجون متابعة تجديد الآن.", "Students have an active collection and do not need renewal follow-up now.")} items={data.healthy.slice(0, 10)} emptyText={t(locale, "لا يوجد طلاب في الحالة الجيدة حاليًا.", "No healthy collection records right now.")} tone="success" locale={locale} />
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

function WorkQueue({ title, description, items, emptyText, tone, locale }: { title: string; description: string; items: AccountCenterStudentItem[]; emptyText: string; tone: "success" | "warning" | "danger" | "info"; locale: "ar" | "en" }) {
  const iconClass = {
    success: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-danger-600",
    info: "text-sky-600",
  }[tone];

  const Icon = tone === "success" ? CheckCircle2 : tone === "info" ? Clock3 : AlertTriangle;

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
          {items.map((item) => <StudentQueueCard key={item.student.id + item.status} item={item} locale={locale} />)}
        </div>
      )}
    </section>
  );
}

function StudentQueueCard({ item, locale }: { item: AccountCenterStudentItem; locale: "ar" | "en" }) {
  const latestAmount = item.latestPayment ? formatCurrencyEgp(item.latestPayment.amount, locale) : "—";
  const latestDate = item.latestPayment?.paidAt ?? item.latestPayment?.dueDate ?? null;
  const nextCollectionDueDate = item.nextCollectionDueDate;
  const collectionStatus = item.collectionStatus;
  const collectionNotes = item.collectionNotes;

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <Link href={item.studentHref} className="font-bold text-foreground hover:text-brand-600">{item.student.fullName}</Link>
          <p className="mt-1 text-xs text-muted-foreground">{item.parentLabel}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full bg-muted px-2.5 py-1">{t(locale, "مستخدم", "Used")}: {item.usedSessions}</span>
            <span className="rounded-full bg-muted px-2.5 py-1">{t(locale, "متبقي", "Remaining")}: {item.remainingSessions}</span>
            <span className="rounded-full bg-muted px-2.5 py-1">{t(locale, "المغطى", "Covered")}: {item.sessionsCovered}</span>
            {item.overusedSessions > 0 ? <span className="rounded-full bg-danger-50 px-2.5 py-1 text-danger-700 dark:bg-danger-950/30 dark:text-danger-300">{t(locale, "زيادة", "Overused")}: {item.overusedSessions}</span> : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 text-xs text-muted-foreground md:items-end">
          <span>{t(locale, "آخر دفعة", "Latest payment")}: {latestAmount}</span>          <span>{latestDate ? formatDate(latestDate, locale) : "—"}</span>
          {nextCollectionDueDate ? <span>{t(locale, "موعد التحصيل", "Collection due")}: {formatDate(nextCollectionDueDate, locale)}</span> : null}
          {collectionStatus ? <span>{t(locale, "حالة التحصيل", "Collection status")}: {collectionStatus}</span> : null}
          {collectionNotes ? <span className="max-w-[240px] text-right leading-5">{t(locale, "ملاحظات", "Notes")}: {collectionNotes}</span> : null}
          <div className="flex flex-wrap gap-2">
            <Link href={item.studentHref} className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-semibold text-foreground hover:bg-muted">
              {t(locale, "فتح الطالب", "Open student")} <ArrowUpRight size={13} />
            </Link>
            {item.paymentHref ? (
              <Link href={item.paymentHref} className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-semibold text-foreground hover:bg-muted">
                {t(locale, "الدفعة", "Payment")} <ArrowUpRight size={13} />
              </Link>
            ) : (
              <Link href={"/payments/new?studentId=" + item.student.id} className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-700">
                {t(locale, "إضافة دفعة", "Add payment")} <ArrowUpRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
