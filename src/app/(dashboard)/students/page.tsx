"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Plus, Search } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { getFilterLabel, t } from "@/lib/locale";
import { STUDENT_STATUS_META, getMetaLabel } from "@/config/status-meta";
import { formatCourseLabel, formatCurrencyEgp } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { listParentsWithRelations, listStudentsWithRelations, extractLeadIdFromProjectionId } from "@/services/relations.service";
import type { ParentListItem, StudentListItem } from "@/types/crm";
import type { CourseType, StudentStatus } from "@/types/common.types";
import { EmptySearchState, LoadingState } from "@/components/shared/page-state";

function normalizePhone(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "").replace(/^20/, "");
}

export default function StudentsPage() {
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StudentStatus | "all">("all");
  const [courseFilter, setCourseFilter] = useState<CourseType | "all">("all");
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [parents, setParents] = useState<ParentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const [studentData, parentData] = await Promise.all([listStudentsWithRelations(), listParentsWithRelations()]);
      if (isMounted) {
        setStudents(studentData);
        setParents(parentData);
        setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const parentMap = useMemo(() => {
    const map = new Map<string, ParentListItem>();
    students.forEach((student) => {
      const match = parents.find((parent) => {
        if (student.parentId && parent.id === student.parentId) return true;
        return normalizePhone(parent.phone) === normalizePhone(student.parentPhone) || parent.fullName === student.parentName;
      });
      if (match) map.set(student.id, match);
    });
    return map;
  }, [parents, students]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchSearch = !query || student.fullName.toLowerCase().includes(query) || student.parentName.toLowerCase().includes(query);
      const matchStatus = statusFilter === "all" || student.status === statusFilter;
      const matchCourse = courseFilter === "all" || student.currentCourse === courseFilter;
      return matchSearch && matchStatus && matchCourse;
    });
  }, [search, statusFilter, courseFilter, students]);

  const totals = useMemo(() => ({
    total: filtered.length,
    projected: filtered.filter((s) => Boolean(extractLeadIdFromProjectionId(s.id))).length,
    assigned: filtered.filter((s) => Boolean(s.ownerName)).length,
  }), [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <GraduationCap size={28} className="text-brand-600" />
            {t(locale, "\u0627\u0644\u0637\u0644\u0627\u0628", "Students")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t(locale, "\u0631\u0624\u064a\u0629 \u0623\u0648\u0636\u062d \u0644\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u062d\u0627\u0644\u064a\u064a\u0646 \u0648\u0631\u0628\u0637\u0647\u0645 \u0628\u0623\u0648\u0644\u064a\u0627\u0621 \u0627\u0644\u0623\u0645\u0648\u0631 \u0648\u0627\u0644\u0643\u0644\u0627\u0633\u0627\u062a", "A clearer view of current students and their parent and class relationships")}</p>
        </div>
        <Link href="/students/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
          <Plus size={18} />
          {t(locale, "\u0625\u0636\u0627\u0641\u0629 \u0637\u0627\u0644\u0628", "Add student")}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard title={t(locale, "\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0637\u0644\u0627\u0628", "Total students")} value={String(totals.total)} />
        <MetricCard title={t(locale, "\u0645\u0646 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u062d\u0627\u0644\u064a\u064a\u0646", "From current customers")} value={String(totals.projected)} />
        <MetricCard title={t(locale, "\u0644\u0647\u0645 \u0645\u0633\u0624\u0648\u0644", "Assigned owner")} value={String(totals.assigned)} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isAr ? "right-3" : "left-3")} />
          <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t(locale, "\u0628\u062d\u062b \u0628\u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0648\u0644\u064a \u0627\u0644\u0623\u0645\u0631", "Search by student or parent")} className={cn("w-full rounded-xl bg-card py-2.5 text-sm text-foreground border border-border placeholder:text-muted-foreground focus:ring-2 focus:ring-ring", isAr ? "pr-10 pl-4" : "pl-10 pr-4")} />
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StudentStatus | "all")} className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground">
          <option value="all">{getFilterLabel("allStudentStatuses", locale)}</option>
          {Object.entries(STUDENT_STATUS_META).map(([key, meta]) => (
            <option key={key} value={key}>{getMetaLabel(meta, locale)}</option>
          ))}
        </select>
        <select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value as CourseType | "all")} className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground">
          <option value="all">{t(locale, "\u0643\u0644 \u0627\u0644\u0643\u0648\u0631\u0633\u0627\u062a", "All courses")}</option>
          <optgroup label={t(locale, "\u0645\u0631\u062d\u0644\u0629 \u0627\u0644\u062a\u0623\u0633\u064a\u0633 \u0627\u0644\u0625\u0628\u062f\u0627\u0639\u064a", "Creative Foundation")}>
            <option value="scratch">Scratch</option>
            <option value="app_inventor">App Inventor</option>
            <option value="robotics_basic">{t(locale, "\u0631\u0648\u0628\u0648\u062a\u0643\u0633 \u0623\u0633\u0627\u0633\u064a", "Robotics Basic")}</option>
            <option value="ai_intro">{t(locale, "\u0645\u0642\u062f\u0645\u0629 \u0641\u064a \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a", "AI Intro")}</option>
          </optgroup>
          <optgroup label={t(locale, "\u0645\u0631\u062d\u0644\u0629 \u0627\u0644\u0628\u0631\u0645\u062c\u0629 \u0627\u0644\u0639\u0645\u0644\u064a\u0629", "Practical Programming")}>
            <option value="python">Python</option>
            <option value="godot">Godot</option>
            <option value="robotics_iot">Robotics / IoT</option>
            <option value="fastapi">FastAPI</option>
          </optgroup>
          <optgroup label={t(locale, "\u0645\u0631\u062d\u0644\u0629 \u0627\u0644\u062a\u0637\u0628\u064a\u0642\u0627\u062a \u0648\u0627\u0644\u0648\u064a\u0628", "Web & Apps")}>
            <option value="html_css">HTML / CSS</option>
            <option value="javascript_tailwind">JavaScript / Tailwind</option>
            <option value="front_end">Front End</option>
          </optgroup>
          <optgroup label={t(locale, "\u0645\u0631\u062d\u0644\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0648\u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a", "AI & Data")}>
            <option value="ai_ml">AI & Machine Learning</option>
            <option value="data_science">Data Science</option>
            <option value="back_end">Back End</option>
            <option value="raspberry_pi">Raspberry Pi</option>
          </optgroup>
        </select>
      </div>

      {loading ? (
        <LoadingState
          titleAr="\u062c\u0627\u0631\u0650 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0637\u0644\u0627\u0628"
          titleEn="Loading students"
          descriptionAr="\u064a\u062a\u0645 \u0627\u0644\u0622\u0646 \u062a\u062c\u0647\u064a\u0632 \u0645\u0644\u0641\u0627\u062a \u0627\u0644\u0637\u0644\u0627\u0628 \u0648\u0631\u0628\u0637 \u0623\u0648\u0644\u064a\u0627\u0621 \u0627\u0644\u0623\u0645\u0648\u0631 \u0648\u0627\u0644\u062d\u0627\u0644\u0627\u062a \u0627\u0644\u062f\u0631\u0627\u0633\u064a\u0629 \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u0629 \u0628\u0647\u0645."
          descriptionEn="Student records are being prepared with linked parents and academic statuses."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "\u0627\u0644\u0637\u0627\u0644\u0628", "Student")}</th>
                  <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "\u0648\u0644\u064a \u0627\u0644\u0623\u0645\u0631", "Parent")}</th>
                  <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "\u0627\u0644\u062d\u0627\u0644\u0629", "Status")}</th>
                  <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "\u0627\u0644\u0643\u0648\u0631\u0633", "Course")}</th>
                  <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "\u0627\u0644\u0643\u0644\u0627\u0633", "Class")}</th>
                  <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "\u0627\u0644\u0645\u0633\u0624\u0648\u0644", "Owner")}</th>
                  <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "\u0627\u0644\u062d\u0636\u0648\u0631", "Attendance")}</th>
                  <th className={cn("px-4 py-3 font-semibold text-muted-foreground", isAr ? "text-right" : "text-left")}>{t(locale, "\u0627\u0644\u0645\u062f\u0641\u0648\u0639", "Paid")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => {
                  const meta = STUDENT_STATUS_META[student.status];
                  const parent = parentMap.get(student.id);
                  const isProjected = Boolean(extractLeadIdFromProjectionId(student.id));
                  return (
                    <tr key={student.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link href={"/students/" + student.id} className="group block">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-foreground transition-colors group-hover:text-brand-600">{student.fullName}</p>
                            {isProjected ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{t(locale, "\u0645\u0646 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u062d\u0627\u0644\u064a\u064a\u0646", "From current customers")}</span> : null}
                          </div>
                          <p className="text-xs text-muted-foreground">{student.age} {t(locale, "\u0633\u0646\u0629", "years")}</p>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {parent ? <Link href={"/parents/" + parent.id} className="transition-colors hover:text-brand-600">{student.parentName}</Link> : student.parentName}
                      </td>
                      <td className="px-4 py-3"><span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: meta.bg, color: meta.color }}>{getMetaLabel(meta, locale)}</span></td>
                      <td className="px-4 py-3"><span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-950 dark:text-brand-300">{formatCourseLabel(student.currentCourse, locale)}</span></td>
                      <td className="px-4 py-3 text-xs text-foreground">{student.className ?? t(locale, "\u063a\u064a\u0631 \u0645\u0633\u062c\u0644", "Not assigned")}</td>
                      <td className="px-4 py-3 text-xs text-foreground">{student.ownerName ?? t(locale, "\u063a\u064a\u0631 \u0645\u062e\u0635\u0635", "Unassigned")}</td>
                      <td className="px-4 py-3 text-foreground">{student.sessionsAttended} {t(locale, "\u062d\u0635\u0629", "sessions")}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">{formatCurrencyEgp(student.totalPaid, locale)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 ? <EmptySearchState /> : null}
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-semibold text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
