"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, CalendarDays, Layers3, Loader2, PlusCircle, Users } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useCurrentUser } from "@/providers/user-provider";
import { canAccessTeachersForUser } from "@/config/roles";
import { formatCourseLabel } from "@/lib/formatters";
import { listGroups } from "@/services/group-operations.service";
import type { GroupListItem } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchBar } from "@/components/ui/search-bar";
import { EmptyState } from "@/components/ui/empty-state";

type StatusFilter = "all" | "active" | "planned" | "completed";

const STATUS_LABEL: Record<GroupListItem["groupStatus"], { ar: string; en: string; cls: string }> = {
  active:    { ar: "نشط",    en: "Active",    cls: "bg-[var(--color-success-100)] text-[var(--color-success-700)]" },
  planned:   { ar: "مخطط",   en: "Planned",   cls: "bg-[var(--color-info-100)] text-[var(--color-info-700)]" },
  completed: { ar: "منتهي",  en: "Completed", cls: "bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)]" },
};

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
    listGroups()
      .then((data) => { if (mounted) setItems(data); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  // ── Stats (على كل الـ items بدون فلتر) ────────────────────────────────────
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((g) => g.groupStatus === "active").length;
    const planned = items.filter((g) => g.groupStatus === "planned").length;
    const totalStudents = items.reduce((acc, g) => acc + g.studentsCount, 0);
    return { total, active, planned, totalStudents };
  }, [items]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((group) => {
      const matchesStatus =
        statusFilter === "all" ? true : group.groupStatus === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      return (
        group.name.toLowerCase().includes(q) ||
        group.teacherName.toLowerCase().includes(q) ||
        formatCourseLabel(group.course, locale).toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter, locale]);

  const hasResults = filtered.length > 0;

  // ── Loading ────────────────────────────────────────────────────────────────
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
        title={isAr ? "الجروبات" : "Groups"}
        subtitle={
          isAr
            ? `${stats.total} جروب مسجّل`
            : `${stats.total} group${stats.total !== 1 ? "s" : ""} registered`
        }
        actions={
          <Link href="/groups/new">
            <Button size="sm" className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              {isAr ? "إضافة جروب" : "Add Group"}
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          tone="brand"
          label={isAr ? "إجمالي الجروبات" : "Total Groups"}
          value={stats.total}
          icon={<Layers3 className="h-5 w-5" />}
        />
        <StatCard
          tone="success"
          label={isAr ? "نشطة" : "Active"}
          value={stats.active}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          tone="info"
          label={isAr ? "مخططة" : "Planned"}
          value={stats.planned}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard
          tone="neutral"
          label={isAr ? "إجمالي الطلاب" : "Total Students"}
          value={stats.totalStudents}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={isAr ? "ابحث بالاسم أو المعلم أو الكورس…" : "Search by name, teacher, or course…"}
          className="sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]"
        >
          <option value="all">{isAr ? "الكل" : "All"}</option>
          <option value="active">{isAr ? "نشط" : "Active"}</option>
          <option value="planned">{isAr ? "مخطط" : "Planned"}</option>
          <option value="completed">{isAr ? "منتهي" : "Completed"}</option>
        </select>
      </div>

      {/* List */}
      {!hasResults ? (
        <EmptyState
          icon={<Layers3 className="h-10 w-10" />}
          title={
            search || statusFilter !== "all"
              ? (isAr ? "لا توجد نتائج" : "No results found")
              : (isAr ? "لا يوجد جروبات بعد" : "No groups yet")
          }
          description={
            search || statusFilter !== "all"
              ? (isAr ? "جرّب تغيير كلمة البحث أو الفلتر" : "Try changing your search or filter")
              : (isAr ? "ابدأ بإضافة أول جروب في النظام" : "Start by adding the first group")
          }
          action={
            !search && statusFilter === "all" ? (
              <Link href="/groups/new">
                <Button size="sm" className="gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  {isAr ? "إضافة جروب" : "Add Group"}
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((group) => {
            const statusMeta = STATUS_LABEL[group.groupStatus];
            return (
              <li key={group.id}>
                <Link
                  href={`/groups/${group.id}`}
                  className="group block h-full rounded-lg border border-border bg-card p-4 shadow-xs transition-all hover:shadow-md hover:border-[var(--color-brand-300)] hover:-translate-y-0.5"
                >
                  {/* Name + status */}
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground leading-tight">
                      {group.name}
                    </h3>
                    <span className={[
                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                      statusMeta.cls,
                    ].join(" ")}>
                      {isAr ? statusMeta.ar : statusMeta.en}
                    </span>
                  </div>

                  {/* Course */}
                  <p className="mb-3 text-xs text-muted-foreground">
                    {formatCourseLabel(group.course, locale)}
                  </p>

                  {/* Teacher — only if canAccess */}
                  {canAccess && group.teacherName && (
                    <p className="mb-3 text-xs text-muted-foreground">
                      {isAr ? "المعلم: " : "Teacher: "}
                      <span className="font-medium text-foreground">{group.teacherName}</span>
                    </p>
                  )}

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {group.studentsCount}{" "}
                      {isAr ? "طالب" : "student" + (group.studentsCount !== 1 ? "s" : "")}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {group.sessionsCount}{" "}
                      {isAr ? "جلسة" : "session" + (group.sessionsCount !== 1 ? "s" : "")}
                    </span>
                  </div>

                  {/* Next session + start date */}
                  <div className="mt-3 border-t border-border pt-3 space-y-1 text-xs text-muted-foreground">
                    {group.nextSessionDate ? (
                      <p className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        {isAr ? "القادمة: " : "Next: "}
                        <span dir="ltr">
                          {new Date(group.nextSessionDate).toLocaleDateString(
                            isAr ? "ar-EG" : "en-GB",
                            { day: "numeric", month: "short" }
                          )}
                          {group.nextSessionStartTime && ` · ${group.nextSessionStartTime.slice(0, 5)}`}
                        </span>
                      </p>
                    ) : (
                      <p className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        {isAr ? "لا توجد جلسة قادمة" : "No upcoming session"}
                      </p>
                    )}
                    <p dir="ltr">
                      {isAr ? "البداية: " : "Start: "}
                      {new Date(group.startDate).toLocaleDateString(
                        isAr ? "ar-EG" : "en-GB",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}