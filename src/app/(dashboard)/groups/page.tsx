"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Layers3, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useCurrentUser } from "@/providers/user-provider";
import { canAccessTeachersForUser } from "@/config/roles";
import { formatCourseLabel } from "@/lib/formatters";
import { t } from "@/lib/locale";
import { listGroups } from "@/services/group-operations.service";
import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import type { GroupListItem } from "@/types/crm";

type StatusFilter = "all" | "active" | "inactive";

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
        statusFilter === "all" ||
        (statusFilter === "active" ? group.isActive : !group.isActive);

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
        titleAr="هذا القسم خاص بمسؤول تشغيل المدرسين"
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
        titleAr="جارٍ تحميل الجروبات"
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
          <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isAr ? "right-3" : "left-3")} />
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
          {(["all", "active", "inactive"] as StatusFilter[]).map((value) => {
            const label =
              value === "all"
                ? t(locale, "الكل", "All")
                : value === "active"
                  ? t(locale, "نشط", "Active")
                  : t(locale, "غير نشط", "Inactive");

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
            <div key={group.id} className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-brand-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-lg font-bold text-foreground">{group.name}</p>
                    {!group.isActive ? (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        {t(locale, "غير نشط", "Inactive")}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{group.teacherName}</p>
                </div>

                <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {formatCourseLabel(group.course, locale)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <MiniInfo icon={Users} label={t(locale, "الطلاب", "Students")} value={group.studentsCount} />
                <MiniInfo icon={CalendarDays} label={t(locale, "الحصص", "Sessions")} value={group.sessionsCount} />
                <MiniInfo icon={BookOpen} label={t(locale, "التالي", "Next")} value={group.nextSessionStartTime ?? "—"} />
              </div>

              {group.nextSessionDate ? (
                <p className="mt-4 text-xs text-muted-foreground">
                  {t(locale, "أقرب حصة", "Next session")}: {group.nextSessionDate} {group.nextSessionStartTime ? "• " + group.nextSessionStartTime : ""}
                </p>
              ) : (
                <p className="mt-4 text-xs text-muted-foreground">
                  {t(locale, "لا توجد حصص مجدولة بعد", "No sessions scheduled yet")}
                </p>
              )}
            </div>
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
