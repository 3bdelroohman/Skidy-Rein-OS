"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Layers3, Plus, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useCurrentUser } from "@/providers/user-provider";
import { canAccessTeachersForUser } from "@/config/roles";
import { formatCourseLabel } from "@/lib/formatters";
import { t } from "@/lib/locale";
import { listGroups } from "@/services/group-operations.service";
import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import type { GroupListItem } from "@/types/crm";

type StatusFilter = "all" | "active" | "planned" | "completed";

export default function GroupsPage() {
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const user = useCurrentUser();
  const canAccess = canAccessTeachersForUser(user);

  const [items, setItems] = useState<GroupListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");

  useEffect(() => {
    let mounted = true;

    if (!canAccess) {
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    (async () => {
      try {
        const groups = await listGroups();
        if (!mounted) return;
        setItems(groups);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [canAccess]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((group) => {
      const matchStatus =
        statusFilter === "all" || group.groupStatus === statusFilter;

      const matchSearch =
        !query ||
        group.name.toLowerCase().includes(query) ||
        group.teacherName.toLowerCase().includes(query);

      return matchStatus && matchSearch;
    });
  }, [items, search, statusFilter]);

  const totals = useMemo(() => {
    return {
      groups: filtered.length,
      students: filtered.reduce((sum, item) => sum + item.studentsCount, 0),
      sessions: filtered.reduce((sum, item) => sum + item.sessionsCount, 0),
      active: filtered.filter((item) => item.isActive).length,
    };
  }, [filtered]);

  if (!canAccess) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="هذا القسم خاص بتشغيل المدرسين"
        titleEn="This section is restricted to teacher operations"
        descriptionAr="إدارة الجروبات وتشغيل الحصص متاحة فقط للمستخدم المسؤول عن تشغيل المدرسين."
        descriptionEn="Groups and class operations are restricted to the assigned teacher operations owner."
        actionHref="/"
        actionLabelAr="العودة إلى لوحة التحكم"
        actionLabelEn="Back to dashboard"
      />
    );
  }

  if (loading) {
    return (
      <LoadingState
        titleAr="جارِ تحميل الجروبات"
        titleEn="Loading groups"
        descriptionAr="يتم الآن تجهيز الجروبات والحصص والطلاب المرتبطين بها."
        descriptionEn="Preparing groups, linked sessions, and enrolled students."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
              {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </Link>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Layers3 size={26} className="text-brand-600" />
                {t(locale, "الجروبات", "Groups")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(
                  locale,
                  "عرض تشغيلي لكل الجروبات المرتبطة بالمدرسين والطلاب والحصص.",
                  "Operational view of all groups linked to teachers, students, and sessions.",
                )}
              </p>
            </div>
          </div>

          <Link
            href="/groups/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            <Plus size={18} />
            {t(locale, "إنشاء جروب", "Create group")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MiniMetric label={t(locale, "عدد الجروبات", "Groups")} value={totals.groups} />
        <MiniMetric label={t(locale, "الطلاب", "Students")} value={totals.students} />
        <MiniMetric label={t(locale, "الحصص", "Sessions")} value={totals.sessions} />
        <MiniMetric label={t(locale, "الجروبات النشطة", "Active groups")} value={totals.active} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isAr ? "right-3" : "left-3")}
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t(locale, "ابحث باسم الجروب أو المدرس...", "Search by group or teacher...")}
            className={cn(
              "w-full rounded-xl border border-border bg-card py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring",
              isAr ? "pr-10 pl-4" : "pl-10 pr-4",
            )}
          />
        </div>

        <div className="flex gap-2">
          {(["all", "active", "planned", "completed"] as StatusFilter[]).map((value) => {
            const label =
              value === "all"
                ? t(locale, "الكل", "All")
                : value === "active"
                  ? t(locale, "نشط", "Active")
                  : value === "planned"
                    ? t(locale, "مخطط", "Planned")
                    : t(locale, "مكتمل", "Completed");

            return (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  statusFilter === value
                    ? "bg-brand-700 text-white"
                    : "border border-border bg-card text-foreground hover:bg-muted",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <PageStateCard
          variant="default"
          titleAr="لا توجد جروبات مطابقة"
          titleEn="No matching groups"
          descriptionAr="جرّب تغيير البحث أو الفلتر."
          descriptionEn="Try changing the search or filter."
          actionHref="/schedule"
          actionLabelAr="الذهاب إلى الجدول"
          actionLabelEn="Open schedule"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((group) => (
            <Link
              key={group.id}
              href={"/groups/" + group.id}
              className="group block rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-brand-md"
            >
              {/* ── Header: identity band ── */}
              <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
                  <Layers3 size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-bold text-foreground group-hover:text-brand-700 transition-colors">
                      {group.name}
                    </h3>
                    <span className={"shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold " + (group.groupStatus === "active" ? "bg-success-50 text-success-600 dark:bg-success-950 dark:text-success-300" : group.groupStatus === "planned" ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300")}>
                      {group.groupStatus === "active" ? t(locale, "نشط", "Active") : group.groupStatus === "planned" ? t(locale, "مخطط", "Planned") : t(locale, "مكتمل", "Completed")}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {group.teacherName} • {formatCourseLabel(group.course, locale)}
                  </p>
                </div>
              </div>

              {/* ── Body: operational metrics ── */}
              <div className="px-5 py-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <MiniInfo icon={Users} label={t(locale, "طلاب", "Students")} value={group.studentsCount} />
                  <MiniInfo icon={CalendarDays} label={t(locale, "حصص", "Sessions")} value={group.sessionsCount} />
                  <MiniInfo icon={BookOpen} label={t(locale, "البداية", "Started")} value={group.startDate} />
                </div>

                {/* ── Next session indicator ── */}
                {group.nextSessionDate ? (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-brand-50/60 px-3 py-2 dark:bg-brand-950/30">
                    <CalendarDays size={13} className="shrink-0 text-brand-600" />
                    <p className="text-xs font-medium text-brand-700 dark:text-brand-300">
                      {t(locale, "أقرب حصة", "Next session")}: {group.nextSessionDate}
                      {group.nextSessionStartTime ? " • " + group.nextSessionStartTime : ""}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                    <CalendarDays size={13} className="shrink-0 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {t(locale, "لا توجد حصص مجدولة بعد", "No sessions scheduled yet")}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function MiniInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
        <Icon size={12} />
        {label}
      </div>
      <p className="mt-1 font-bold text-foreground">{value}</p>
    </div>
  );
}