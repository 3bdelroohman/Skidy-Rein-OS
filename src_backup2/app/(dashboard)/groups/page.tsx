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
  active:    { ar: "Ù†Ø´Ø·",    en: "Active",    cls: "bg-[var(--color-success-100)] text-[var(--color-success-700)]" },
  planned:   { ar: "Ù…Ø®Ø·Ø·",   en: "Planned",   cls: "bg-[var(--color-info-100)] text-[var(--color-info-700)]" },
  completed: { ar: "Ù…Ù†ØªÙ‡ÙŠ",  en: "Completed", cls: "bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)]" },
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

  // â”€â”€ Stats (Ø¹Ù„Ù‰ ÙƒÙ„ Ø§Ù„Ù€ items Ø¨Ø¯ÙˆÙ† ÙÙ„ØªØ±) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((g) => g.groupStatus === "active").length;
    const planned = items.filter((g) => g.groupStatus === "planned").length;
    const totalStudents = items.reduce((acc, g) => acc + g.studentsCount, 0);
    return { total, active, planned, totalStudents };
  }, [items]);

  // â”€â”€ Filtered list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        title={isAr ? "Ø§Ù„Ø¬Ø±ÙˆØ¨Ø§Øª" : "Groups"}
        subtitle={
          isAr
            ? `${stats.total} Ø¬Ø±ÙˆØ¨ Ù…Ø³Ø¬Ù‘Ù„`
            : `${stats.total} group${stats.total !== 1 ? "s" : ""} registered`
        }
        actions={
          <Link href="/groups/new">
            <Button size="sm" className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              {isAr ? "Ø¥Ø¶Ø§ÙØ© Ø¬Ø±ÙˆØ¨" : "Add Group"}
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          tone="brand"
          label={isAr ? "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø¬Ø±ÙˆØ¨Ø§Øª" : "Total Groups"}
          value={stats.total}
          icon={<Layers3 className="h-5 w-5" />}
        />
        <StatCard
          tone="success"
          label={isAr ? "Ù†Ø´Ø·Ø©" : "Active"}
          value={stats.active}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          tone="info"
          label={isAr ? "Ù…Ø®Ø·Ø·Ø©" : "Planned"}
          value={stats.planned}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard
          tone="neutral"
          label={isAr ? "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø·Ù„Ø§Ø¨" : "Total Students"}
          value={stats.totalStudents}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={isAr ? "Ø§Ø¨Ø­Ø« Ø¨Ø§Ù„Ø§Ø³Ù… Ø£Ùˆ Ø§Ù„Ù…Ø¹Ù„Ù… Ø£Ùˆ Ø§Ù„ÙƒÙˆØ±Ø³â€¦" : "Search by name, teacher, or courseâ€¦"}
          className="sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]"
        >
          <option value="all">{isAr ? "Ø§Ù„ÙƒÙ„" : "All"}</option>
          <option value="active">{isAr ? "Ù†Ø´Ø·" : "Active"}</option>
          <option value="planned">{isAr ? "Ù…Ø®Ø·Ø·" : "Planned"}</option>
          <option value="completed">{isAr ? "Ù…Ù†ØªÙ‡ÙŠ" : "Completed"}</option>
        </select>
      </div>

      {/* List */}
      {!hasResults ? (
        <EmptyState
          icon={<Layers3 className="h-10 w-10" />}
          title={
            search || statusFilter !== "all"
              ? (isAr ? "Ù„Ø§ ØªÙˆØ¬Ø¯ Ù†ØªØ§Ø¦Ø¬" : "No results found")
              : (isAr ? "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø¬Ø±ÙˆØ¨Ø§Øª Ø¨Ø¹Ø¯" : "No groups yet")
          }
          description={
            search || statusFilter !== "all"
              ? (isAr ? "Ø¬Ø±Ù‘Ø¨ ØªØºÙŠÙŠØ± ÙƒÙ„Ù…Ø© Ø§Ù„Ø¨Ø­Ø« Ø£Ùˆ Ø§Ù„ÙÙ„ØªØ±" : "Try changing your search or filter")
              : (isAr ? "Ø§Ø¨Ø¯Ø£ Ø¨Ø¥Ø¶Ø§ÙØ© Ø£ÙˆÙ„ Ø¬Ø±ÙˆØ¨ ÙÙŠ Ø§Ù„Ù†Ø¸Ø§Ù…" : "Start by adding the first group")
          }
          action={
            !search && statusFilter === "all" ? (
              <Link href="/groups/new">
                <Button size="sm" className="gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  {isAr ? "Ø¥Ø¶Ø§ÙØ© Ø¬Ø±ÙˆØ¨" : "Add Group"}
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

                  {/* Teacher â€” only if canAccess */}
                  {canAccess && group.teacherName && (
                    <p className="mb-3 text-xs text-muted-foreground">
                      {isAr ? "Ø§Ù„Ù…Ø¹Ù„Ù…: " : "Teacher: "}
                      <span className="font-medium text-foreground">{group.teacherName}</span>
                    </p>
                  )}

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {group.studentsCount}{" "}
                      {isAr ? "Ø·Ø§Ù„Ø¨" : "student" + (group.studentsCount !== 1 ? "s" : "")}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {group.sessionsCount}{" "}
                      {isAr ? "Ø¬Ù„Ø³Ø©" : "session" + (group.sessionsCount !== 1 ? "s" : "")}
                    </span>
                  </div>

                  {/* Next session + start date */}
                  <div className="mt-3 border-t border-border pt-3 space-y-1 text-xs text-muted-foreground">
                    {group.nextSessionDate ? (
                      <p className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        {isAr ? "Ø§Ù„Ù‚Ø§Ø¯Ù…Ø©: " : "Next: "}
                        <span dir="ltr">
                          {new Date(group.nextSessionDate).toLocaleDateString(
                            isAr ? "ar-EG" : "en-GB",
                            { day: "numeric", month: "short" }
                          )}
                          {group.nextSessionStartTime && ` Â· ${group.nextSessionStartTime.slice(0, 5)}`}
                        </span>
                      </p>
                    ) : (
                      <p className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        {isAr ? "Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¬Ù„Ø³Ø© Ù‚Ø§Ø¯Ù…Ø©" : "No upcoming session"}
                      </p>
                    )}
                    <p dir="ltr">
                      {isAr ? "Ø§Ù„Ø¨Ø¯Ø§ÙŠØ©: " : "Start: "}
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
