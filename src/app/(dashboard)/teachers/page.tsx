"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Calculator, Mail, Phone, PlusCircle, Search } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { COURSE_TYPE_LABELS, COURSE_TYPE_EN_LABELS } from "@/config/labels";
import { getEmploymentTypeLabel, t } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { listTeachersWithRelations } from "@/services/relations.service";
import type { TeacherListItem } from "@/types/crm";
import { EmptySearchState, LoadingState } from "@/components/shared/page-state";

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
    async function load() {
      setLoading(true);
      const data = await listTeachersWithRelations();
      if (isMounted) {
        setTeachers(data);
        setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return teachers.filter((teacher) => {
      const matchStatus = statusFilter === "all" || (statusFilter === "active" ? teacher.isActive : !teacher.isActive);
      if (!matchStatus) return false;
      if (!query) return true;
      return (
        teacher.fullName.toLowerCase().includes(query) ||
        teacher.specialization.some((item) => (isAr ? COURSE_TYPE_LABELS[item] : COURSE_TYPE_EN_LABELS[item]).toLowerCase().includes(query))
      );
    });
  }, [teachers, search, isAr, statusFilter]);

  const totals = useMemo(() => ({
    active: teachers.filter((teacher) => teacher.isActive).length,
    inactive: teachers.filter((teacher) => !teacher.isActive).length,
    classes: filtered.reduce((sum, teacher) => sum + teacher.classesCount, 0),
    students: filtered.reduce((sum, teacher) => sum + teacher.studentsCount, 0),
  }), [teachers, filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <BookOpen size={28} className="text-brand-600" />
            {t(locale, "\u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0646", "Teachers")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t(locale, "\u0625\u062f\u0627\u0631\u0629 \u0641\u0631\u064a\u0642 \u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0646 \u0648\u0631\u0628\u0637\u0647\u0645 \u0628\u0627\u0644\u0643\u0644\u0627\u0633\u0627\u062a \u0648\u0627\u0644\u0637\u0644\u0627\u0628 \u0648\u0627\u0644\u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0645\u0627\u0644\u064a\u0629", "Manage teachers, their linked classes and students, plus financial tracking")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/teachers/finance" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            <Calculator size={16} />
            {t(locale, "\u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0646", "Teacher accounts")}
          </Link>
          <Link href="/teachers/new" className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
            <PlusCircle size={16} />
            {t(locale, "\u0625\u0636\u0627\u0641\u0629 \u0645\u062f\u0631\u0633", "Add teacher")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard label={t(locale, "\u0645\u062f\u0631\u0633\u0648\u0646 \u0646\u0634\u0637\u0648\u0646", "Active teachers")} value={String(totals.active)} />
        <SummaryCard label={t(locale, "\u0627\u0644\u0643\u0644\u0627\u0633\u0627\u062a \u0627\u0644\u062d\u0627\u0644\u064a\u0629", "Current classes")} value={String(totals.classes)} />
        <SummaryCard label={t(locale, "\u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u0648\u0646", "Linked students")} value={String(totals.students)} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isAr ? "right-3" : "left-3")} />
          <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t(locale, "\u0628\u062d\u062b \u0628\u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0627\u0644\u062a\u062e\u0635\u0635...", "Search by name or specialization...")} className={cn("w-full rounded-xl border border-border bg-card py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring", isAr ? "pr-10 pl-4" : "pl-10 pr-4")} />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as StatusFilter[]).map((f) => {
            const label = f === "all" ? t(locale, "\u0627\u0644\u0643\u0644", "All") : f === "active" ? t(locale, "\u0646\u0634\u0637", "Active") : t(locale, "\u063a\u064a\u0631 \u0646\u0634\u0637", "Inactive");
            const count = f === "all" ? teachers.length : f === "active" ? totals.active : totals.inactive;
            return (
              <button key={f} onClick={() => setStatusFilter(f)} className={"rounded-xl px-4 py-2 text-sm font-medium transition-colors " + (statusFilter === f ? "bg-brand-700 text-white" : "border border-border bg-card text-foreground hover:bg-muted")}>
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <LoadingState
          titleAr="\u062c\u0627\u0631\u0650 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0646"
          titleEn="Loading teachers"
          descriptionAr="\u064a\u062a\u0645 \u0627\u0644\u0622\u0646 \u062a\u062c\u0647\u064a\u0632 \u0645\u0644\u0641\u0627\u062a \u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0646 \u0648\u0631\u0628\u0637\u0647\u0645 \u0628\u0627\u0644\u0643\u0644\u0627\u0633\u0627\u062a \u0648\u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u064a\u0646."
          descriptionEn="Teacher profiles are being linked with actual classes and students now."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((teacher) => (
            <Link key={teacher.id} href={"/teachers/" + teacher.id} className="rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-brand-md">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-700">
                  <span className="font-bold text-white">{teacher.fullName.replace("\u0623. ", "").charAt(0)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-foreground">{teacher.fullName}</p>
                  <p className="text-xs text-muted-foreground">{getEmploymentTypeLabel(teacher.employment, locale)}</p>
                </div>
                {teacher.isActive
                  ? <span className="shrink-0 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-semibold text-success-600">{t(locale, "\u0646\u0634\u0637", "Active")}</span>
                  : <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">{t(locale, "\u063a\u064a\u0631 \u0646\u0634\u0637", "Inactive")}</span>
                }
              </div>

              <div className="mb-3 flex flex-wrap gap-1.5">
                {teacher.specialization.map((item) => (
                  <span key={item} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] text-brand-700 dark:bg-brand-950 dark:text-brand-300">{isAr ? COURSE_TYPE_LABELS[item] : COURSE_TYPE_EN_LABELS[item]}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl bg-muted/50 p-2">
                  <p className="text-lg font-bold text-foreground">{teacher.classesCount}</p>
                  <p className="text-muted-foreground">{t(locale, "\u0643\u0644\u0627\u0633\u0627\u062a", "Classes")}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-2">
                  <p className="text-lg font-bold text-foreground">{teacher.studentsCount}</p>
                  <p className="text-muted-foreground">{t(locale, "\u0637\u0644\u0627\u0628", "Students")}</p>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Phone size={14} /><span dir="ltr">{teacher.phone}</span></div>
                <div className="flex items-center gap-2"><Mail size={14} /><span dir="ltr">{teacher.email ?? t(locale, "\u063a\u064a\u0631 \u0645\u062a\u0648\u0641\u0631", "N/A")}</span></div>
              </div>
            </Link>
          ))}
          {!loading && filtered.length === 0 ? <div className="col-span-full"><EmptySearchState /></div> : null}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold text-foreground">{value}</p></div>;
}
