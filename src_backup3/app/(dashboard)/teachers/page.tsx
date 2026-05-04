"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, GraduationCap, Loader2, PlusCircle, Users } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { COURSE_TYPE_LABELS, COURSE_TYPE_EN_LABELS } from "@/config/labels";
import { getEmploymentTypeLabel } from "@/lib/locale";
import { listTeachersWithRelations } from "@/services/relations.service";
import type { TeacherListItem } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchBar } from "@/components/ui/search-bar";
import { EmptyState } from "@/components/ui/empty-state";

type StatusFilter = "all" | "active" | "inactive";

export default function TeachersPage() {
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [teachers, setTeachers] = useState<TeacherListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    listTeachersWithRelations()
      .then((data) => { if (isMounted) setTeachers(data); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const stats = useMemo(() => {
    const total = teachers.length;
    const active = teachers.filter((t) => t.isActive).length;
    const uniqueSpecializations = new Set(teachers.flatMap((t) => t.specialization)).size;
    const totalStudents = teachers.reduce((acc, t) => acc + t.studentsCount, 0);
    return { total, active, uniqueSpecializations, totalStudents };
  }, [teachers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teachers.filter((teacher) => {
      const matchesStatus =
        statusFilter === "all" ? true
        : statusFilter === "active" ? teacher.isActive
        : !teacher.isActive;
      if (!matchesStatus) return false;
      if (!q) return true;
      return (
        teacher.fullName.toLowerCase().includes(q) ||
        teacher.phone.includes(q) ||
        (teacher.email ?? "").toLowerCase().includes(q)
      );
    });
  }, [teachers, search, statusFilter]);

  const hasResults = filtered.length > 0;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-brand-500)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title={isAr ? "Ø§Ù„Ù…Ø¹Ù„Ù…ÙˆÙ†" : "Teachers"}
        subtitle={
          isAr
            ? `${stats.total} Ù…Ø¹Ù„Ù… Ù…Ø³Ø¬Ù‘Ù„`
            : `${stats.total} teacher${stats.total !== 1 ? "s" : ""} registered`
        }
        actions={
          <Link href="/teachers/new">
            <Button size="sm" className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              {isAr ? "Ø¥Ø¶Ø§ÙØ© Ù…Ø¹Ù„Ù…" : "Add Teacher"}
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          tone="brand"
          label={isAr ? "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø¹Ù„Ù…ÙŠÙ†" : "Total Teachers"}
          value={stats.total}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          tone="success"
          label={isAr ? "Ù†Ø´Ø·ÙˆÙ†" : "Active"}
          value={stats.active}
          icon={<GraduationCap className="h-5 w-5" />}
        />
        <StatCard
          tone="info"
          label={isAr ? "ØªØ®ØµØµØ§Øª Ù…Ø®ØªÙ„ÙØ©" : "Specializations"}
          value={stats.uniqueSpecializations}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          tone="neutral"
          label={isAr ? "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø·Ù„Ø§Ø¨" : "Total Students"}
          value={stats.totalStudents}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={isAr ? "Ø§Ø¨Ø­Ø« Ø¨Ø§Ù„Ø§Ø³Ù… Ø£Ùˆ Ø§Ù„ØªÙ„ÙŠÙÙˆÙ† Ø£Ùˆ Ø§Ù„Ø¥ÙŠÙ…ÙŠÙ„â€¦" : "Search by name, phone, or emailâ€¦"}
          className="sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]"
        >
          <option value="all">{isAr ? "Ø§Ù„ÙƒÙ„" : "All"}</option>
          <option value="active">{isAr ? "Ù†Ø´Ø·" : "Active"}</option>
          <option value="inactive">{isAr ? "ØºÙŠØ± Ù†Ø´Ø·" : "Inactive"}</option>
        </select>
      </div>

      {!hasResults ? (
        <EmptyState
          icon={<GraduationCap className="h-10 w-10" />}
          title={
            search || statusFilter !== "all"
              ? (isAr ? "Ù„Ø§ ØªÙˆØ¬Ø¯ Ù†ØªØ§Ø¦Ø¬" : "No results found")
              : (isAr ? "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø¹Ù„Ù…ÙˆÙ† Ø¨Ø¹Ø¯" : "No teachers yet")
          }
          description={
            search || statusFilter !== "all"
              ? (isAr ? "Ø¬Ø±Ù‘Ø¨ ØªØºÙŠÙŠØ± ÙƒÙ„Ù…Ø© Ø§Ù„Ø¨Ø­Ø« Ø£Ùˆ Ø§Ù„ÙÙ„ØªØ±" : "Try changing your search or filter")
              : (isAr ? "Ø§Ø¨Ø¯Ø£ Ø¨Ø¥Ø¶Ø§ÙØ© Ø£ÙˆÙ„ Ù…Ø¹Ù„Ù… ÙÙŠ Ø§Ù„Ù†Ø¸Ø§Ù…" : "Start by adding the first teacher")
          }
          action={
            !search && statusFilter === "all" ? (
              <Link href="/teachers/new">
                <Button size="sm" className="gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  {isAr ? "Ø¥Ø¶Ø§ÙØ© Ù…Ø¹Ù„Ù…" : "Add Teacher"}
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((teacher) => {
            const specs = teacher.specialization
              .map((s) => (isAr ? COURSE_TYPE_LABELS[s] : COURSE_TYPE_EN_LABELS[s]))
              .filter(Boolean);
            return (
              <li key={teacher.id}>
                <Link
                  href={`/teachers/${teacher.id}`}
                  className="group block h-full rounded-lg border border-border bg-card p-4 shadow-xs transition-all hover:shadow-md hover:border-[var(--color-brand-300)] hover:-translate-y-0.5"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground leading-tight">
                      {teacher.fullName}
                    </h3>
                    <span
                      className={[
                        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                        teacher.isActive
                          ? "bg-[var(--color-success-100)] text-[var(--color-success-700)]"
                          : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)]",
                      ].join(" ")}
                    >
                      {teacher.isActive ? (isAr ? "Ù†Ø´Ø·" : "Active") : (isAr ? "ØºÙŠØ± Ù†Ø´Ø·" : "Inactive")}
                    </span>
                  </div>

                  <p className="mb-3 text-xs text-muted-foreground">
                    {getEmploymentTypeLabel(teacher.employment, locale)}
                  </p>

                  {specs.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {specs.slice(0, 3).map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-[var(--color-brand-50)] px-2 py-0.5 text-xs text-[var(--color-brand-700)]"
                        >
                          {label}
                        </span>
                      ))}
                      {specs.length > 3 && (
                        <span className="rounded-full bg-[var(--color-neutral-100)] px-2 py-0.5 text-xs text-[var(--color-neutral-600)]">
                          +{specs.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {teacher.classesCount}{" "}
                      {isAr ? "Ø¬Ø±ÙˆØ¨" : "group" + (teacher.classesCount !== 1 ? "s" : "")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {teacher.studentsCount}{" "}
                      {isAr ? "Ø·Ø§Ù„Ø¨" : "student" + (teacher.studentsCount !== 1 ? "s" : "")}
                    </span>
                  </div>

                  <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground space-y-1">
                    <p dir="ltr">{teacher.phone}</p>
                    {teacher.email && (
                      <p className="truncate" dir="ltr">{teacher.email}</p>
                    )}
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
