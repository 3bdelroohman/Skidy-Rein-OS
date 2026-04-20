"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Plus, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { listScheduleSessions, getScheduleOverview } from "@/services/schedule.service";
import { useUIStore } from "@/stores/ui-store";
import { getCourseLabel, getDayLabel, t } from "@/lib/locale";
import { COURSE_STAGE_MAP } from "@/types/crm";
import type { CourseType, CourseStage } from "@/types/common.types";
import type { ScheduleSessionItem } from "@/types/crm";

const STAGE_COLORS: Record<CourseStage, { bg: string; border: string; text: string }> = {
  foundation: { bg: "bg-brand-50", border: "border-brand-200", text: "text-brand-700" },
  practical: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  web_apps: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  ai_data: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
};

function getCourseColors(course: CourseType) {
  const stage = COURSE_STAGE_MAP[course] ?? "foundation";
  return STAGE_COLORS[stage];
}

export default function SchedulePage() {
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<CourseType | "all">("all");
  const [sessions, setSessions] = useState<ScheduleSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    sessionsCount: 0,
    totalStudents: 0,
    uniqueTeachers: 0,
    busiestDay: 0,
    busiestDayCount: 0,
  });

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const [data, nextOverview] = await Promise.all([listScheduleSessions(), getScheduleOverview()]);
      if (isMounted) {
        setSessions(data);
        setOverview(nextOverview);
        setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sessions.filter((session) => {
      const matchCourse = courseFilter === "all" || session.course === courseFilter;
      const matchSearch = !query || session.className.toLowerCase().includes(query) || session.teacher.toLowerCase().includes(query);
      return matchCourse && matchSearch;
    });
  }, [courseFilter, search, sessions]);

  const grouped = useMemo(() => {
    return Array.from({ length: 7 }, (_, dayIndex) => ({
      dayIndex,
      day: getDayLabel(dayIndex, locale),
      items: filtered.filter((session) => session.day === dayIndex).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }));
  }, [filtered, locale]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <CalendarDays size={28} className="text-brand-600" />
              {t(locale, "\u0627\u0644\u062c\u062f\u0648\u0644", "Schedule")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(locale, "\u0639\u0631\u0636 \u0623\u0633\u0628\u0648\u0639\u064a \u0644\u0644\u0643\u0644\u0627\u0633\u0627\u062a\u060c \u0627\u0644\u0623\u062d\u0645\u0627\u0644\u060c \u0648\u0623\u0647\u0645 \u0627\u0644\u062c\u0644\u0633\u0627\u062a \u0627\u0644\u062c\u0627\u0631\u064a\u0629", "Weekly view of classes, load, and ongoing sessions")}
            </p>
          </div>
          <Link href="/schedule/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
            <Plus size={18} />
            {t(locale, "\u0625\u0636\u0627\u0641\u0629 \u062d\u0635\u0629 / \u062d\u062f\u062b", "Add session / event")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MiniMetric label={t(locale, "\u0639\u062f\u062f \u0627\u0644\u062c\u0644\u0633\u0627\u062a", "Sessions")} value={overview.sessionsCount} />
        <MiniMetric label={t(locale, "\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0645\u0642\u0627\u0639\u062f", "Total seats")} value={overview.totalStudents} />
        <MiniMetric label={t(locale, "\u0639\u062f\u062f \u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0646", "Teachers")} value={overview.uniqueTeachers} />
        <MiniMetric label={t(locale, "\u0623\u0643\u062b\u0631 \u064a\u0648\u0645 \u0627\u0632\u062f\u062d\u0627\u0645\u0627\u064b", "Busiest day")} value={getDayLabel(overview.busiestDay, locale) + " (" + overview.busiestDayCount + ")"} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isAr ? "right-3" : "left-3")} />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t(locale, "\u0628\u062d\u062b \u0628\u0627\u0633\u0645 \u0627\u0644\u0643\u0644\u0627\u0633 \u0623\u0648 \u0627\u0644\u0645\u062f\u0631\u0633...", "Search by class or teacher...")}
            className={cn("w-full rounded-xl border border-border bg-card py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring", isAr ? "pr-10 pl-4" : "pl-10 pr-4")}
          />
        </div>
        <select
          value={courseFilter}
          onChange={(event) => setCourseFilter(event.target.value as CourseType | "all")}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground"
        >
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
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          {t(locale, "\u062c\u0627\u0631\u064d \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u062c\u062f\u0648\u0644...", "Loading schedule...")}
        </div>
      ) : (
        <>
          <div className="hidden gap-3 xl:grid xl:grid-cols-7">
            {grouped.map(({ day, items }) => (
              <div key={day} className="min-w-0 rounded-2xl border border-border bg-card p-2.5">
                <div className="mb-2 border-b border-border pb-2 text-center text-sm font-bold text-foreground">{day}</div>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <EmptyDay label={t(locale, "\u0644\u0627 \u062a\u0648\u062c\u062f \u062c\u0644\u0633\u0627\u062a", "No sessions")} />
                  ) : (
                    items.map((session) => {
                      const colors = getCourseColors(session.course);
                      return (
                        <Link key={session.id} href={"/schedule/" + session.id} className={cn("block overflow-hidden rounded-xl border p-2.5 transition-all hover:-translate-y-0.5 hover:shadow-sm", colors.bg, colors.border)}>
                          <div className="flex items-start justify-between gap-1">
                            <p className={cn("truncate text-[13px] font-bold leading-5", colors.text)}>{session.className}</p>
                            <span className="shrink-0 rounded-lg bg-white/70 px-1.5 py-0.5 text-[10px] text-muted-foreground dark:bg-black/20">{session.startTime}</span>
                          </div>
                          <p className="mt-1 truncate text-[10px] text-muted-foreground">{getCourseLabel(session.course, locale)}</p>
                          <div className="mt-2 space-y-1 text-[10px] text-muted-foreground">
                            <div className="flex items-center gap-1.5"><Clock size={10} />{session.startTime} \u2014 {session.endTime}</div>
                            <div className="flex items-center gap-1.5 truncate"><Users size={10} /><span className="truncate">{session.teacher}</span> - {session.students} {t(locale, "\u0637\u0644\u0627\u0628", "students")}</div>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-5 xl:hidden">
            {grouped.map(({ day, items }) => (
              <div key={day} className="space-y-2">
                <p className="text-sm font-bold text-foreground">{day}</p>
                {items.length === 0 ? (
                  <EmptyDay label={t(locale, "\u0644\u0627 \u062a\u0648\u062c\u062f \u062c\u0644\u0633\u0627\u062a", "No sessions")} />
                ) : (
                  items.map((session) => {
                    const colors = getCourseColors(session.course);
                    return (
                      <Link key={session.id} href={"/schedule/" + session.id} className={cn("block rounded-xl border p-3 transition-colors hover:bg-muted/20", colors.bg, colors.border)}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className={cn("truncate text-sm font-bold", colors.text)}>{session.className}</p>
                            <p className="truncate text-xs text-muted-foreground">{session.teacher} \u2014 {session.students} {t(locale, "\u0637\u0644\u0627\u0628", "students")}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                            <span>{session.startTime}</span>
                            {isAr ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            ))}
          </div>
        </>
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

function EmptyDay({ label }: { label: string }) {
  return <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">{label}</div>;
}
