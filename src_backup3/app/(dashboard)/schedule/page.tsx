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


function toDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDaysToDateInput(value: string, days: number): string {
  const date = parseDateInput(value);
  date.setDate(date.getDate() + days);
  return toDateInput(date);
}

function getScheduleWeekStartDateInput(value = toDateInput(new Date())): string {
  const date = parseDateInput(value);
  date.setDate(date.getDate() - date.getDay());
  return toDateInput(date);
}

function formatScheduleDateLabel(value: string, locale: "ar" | "en"): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(parseDateInput(value));
}

function formatScheduleWeekRange(weekStart: string, weekEnd: string, locale: "ar" | "en"): string {
  return `${formatScheduleDateLabel(weekStart, locale)} â€” ${formatScheduleDateLabel(weekEnd, locale)}`;
}

function getScheduleWeekStatusLabel(weekStart: string, locale: "ar" | "en"): string {
  const currentWeek = getScheduleWeekStartDateInput();

  if (weekStart === currentWeek) {
    return t(locale, "\u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u062D\u0627\u0644\u064A", "Current week");
  }

  if (weekStart < currentWeek) {
    return t(locale, "\u0623\u0633\u0628\u0648\u0639 \u0633\u0627\u0628\u0642", "Past week");
  }

  return t(locale, "\u0623\u0633\u0628\u0648\u0639 \u0642\u0627\u062F\u0645", "Upcoming week");
}

function isSessionInsideWeek(session: ScheduleSessionItem, weekStart: string, weekEnd: string): boolean {
  if (!session.sessionDate) return true;

  const sessionDate = session.sessionDate.slice(0, 10);
  return sessionDate >= weekStart && sessionDate <= weekEnd;
}

export default function SchedulePage() {
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<CourseType | "all">("all");
  const [weekStart, setWeekStart] = useState(() => getScheduleWeekStartDateInput());
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

  const weekEnd = useMemo(() => addDaysToDateInput(weekStart, 6), [weekStart]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sessions.filter((session) => {
      const matchWeek = isSessionInsideWeek(session, weekStart, weekEnd);

      const matchCourse = courseFilter === "all" || session.course === courseFilter;
      const matchSearch = !query || session.className.toLowerCase().includes(query) || session.teacher.toLowerCase().includes(query);
      return matchWeek && matchCourse && matchSearch;
    });
  }, [courseFilter, search, sessions, weekEnd, weekStart]);

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
              {t(locale, "Ø§Ù„Ø¬Ø¯ÙˆÙ„", "Schedule")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(locale, "Ø¹Ø±Ø¶ Ø£Ø³Ø¨ÙˆØ¹ÙŠ Ù„Ù„ÙƒÙ„Ø§Ø³Ø§ØªØŒ Ø§Ù„Ø£Ø­Ù…Ø§Ù„ØŒ ÙˆØ£Ù‡Ù… Ø§Ù„Ø¬Ù„Ø³Ø§Øª Ø§Ù„Ø¬Ø§Ø±ÙŠØ©", "Weekly view of classes, load, and ongoing sessions")}
            </p>
          </div>
          <Link href="/schedule/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
            <Plus size={18} />
            {t(locale, "Ø¥Ø¶Ø§ÙØ© Ø­ØµØ© / Ø­Ø¯Ø«", "Add session / event")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MiniMetric label={t(locale, "Ø¹Ø¯Ø¯ Ø§Ù„Ø¬Ù„Ø³Ø§Øª", "Sessions")} value={overview.sessionsCount} />
        <MiniMetric label={t(locale, "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ù‚Ø§Ø¹Ø¯", "Total seats")} value={overview.totalStudents} />
        <MiniMetric label={t(locale, "Ø¹Ø¯Ø¯ Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†", "Teachers")} value={overview.uniqueTeachers} />
        <MiniMetric label={t(locale, "Ø£ÙƒØ«Ø± ÙŠÙˆÙ… Ø§Ø²Ø¯Ø­Ø§Ù…Ø§Ù‹", "Busiest day")} value={getDayLabel(overview.busiestDay, locale) + " (" + overview.busiestDayCount + ")"} />
      </div>

      <div className="rounded-3xl border border-border bg-card/95 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1.45fr_1fr] xl:items-stretch">
          <button
            type="button"
            onClick={() => setWeekStart((current) => addDaysToDateInput(current, -7))}
            className="group rounded-2xl border border-border bg-background p-4 text-start transition-colors hover:border-brand-300 hover:bg-brand-50/60"
          >
            <span className="text-[11px] font-black uppercase tracking-wide text-muted-foreground">
              {t(locale, "\u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u0633\u0627\u0628\u0642", "Previous week")}
            </span>
            <span className="mt-2 block text-sm font-black text-foreground group-hover:text-brand-800">
              {formatScheduleWeekRange(
                addDaysToDateInput(weekStart, -7),
                addDaysToDateInput(weekStart, -1),
                locale,
              )}
            </span>
          </button>

          <div className="rounded-2xl border border-brand-700/20 bg-brand-700/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-brand-700 px-3 py-1 text-[11px] font-black text-white">
                {getScheduleWeekStatusLabel(weekStart, locale)}
              </span>

              <span className="rounded-full bg-background px-3 py-1 text-[11px] font-bold text-muted-foreground ring-1 ring-border">
                {t(locale, "\u062D\u0635\u0635 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", "Week sessions")}: {filtered.length}
              </span>
            </div>

            <div className="mt-4 text-center">
              <p className="text-[11px] font-bold text-muted-foreground">
                {t(locale, "\u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u0645\u0639\u0631\u0648\u0636", "Visible week")}
              </p>
              <h2 className="mt-1 text-xl font-black text-foreground">
                {formatScheduleWeekRange(weekStart, weekEnd, locale)}
              </h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {t(
                  locale,
                  "\u0627\u0644\u062C\u062F\u0648\u0644 \u064A\u0639\u0631\u0636 \u0623\u0633\u0628\u0648\u0639\u064B\u0627 \u0648\u0627\u062D\u062F\u064B\u0627 \u0641\u0642\u0637 \u062D\u062A\u0649 \u0644\u0627 \u062A\u062A\u0643\u062F\u0633 \u0627\u0644\u062D\u0635\u0635.",
                  "The timetable shows one week at a time so sessions do not stack.",
                )}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-center">
              <button
                type="button"
                onClick={() => setWeekStart(getScheduleWeekStartDateInput())}
                className="rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-brand-600"
              >
                {t(locale, "\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u062D\u0627\u0644\u064A", "Back to current week")}
              </button>

              <label className="flex flex-col gap-1 text-[11px] font-bold text-muted-foreground">
                {t(locale, "\u0627\u0630\u0647\u0628 \u0644\u0623\u064A \u0623\u0633\u0628\u0648\u0639", "Jump to any week")}
                <input
                  type="date"
                  value={weekStart}
                  onChange={(event) => {
                    if (event.target.value) {
                      setWeekStart(getScheduleWeekStartDateInput(event.target.value));
                    }
                  }}
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-brand-500"
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setWeekStart((current) => addDaysToDateInput(current, 7))}
            className="group rounded-2xl border border-border bg-background p-4 text-start transition-colors hover:border-brand-300 hover:bg-brand-50/60"
          >
            <span className="text-[11px] font-black uppercase tracking-wide text-muted-foreground">
              {t(locale, "\u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u062A\u0627\u0644\u064A", "Next week")}
            </span>
            <span className="mt-2 block text-sm font-black text-foreground group-hover:text-brand-800">
              {formatScheduleWeekRange(
                addDaysToDateInput(weekStart, 7),
                addDaysToDateInput(weekStart, 13),
                locale,
              )}
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isAr ? "right-3" : "left-3")} />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t(locale, "Ø¨Ø­Ø« Ø¨Ø§Ø³Ù… Ø§Ù„ÙƒÙ„Ø§Ø³ Ø£Ùˆ Ø§Ù„Ù…Ø¯Ø±Ø³...", "Search by class or teacher...")}
            className={cn("w-full rounded-xl border border-border bg-card py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring", isAr ? "pr-10 pl-4" : "pl-10 pr-4")}
          />
        </div>
        <select
          value={courseFilter}
          onChange={(event) => setCourseFilter(event.target.value as CourseType | "all")}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground"
        >
          <option value="all">{t(locale, "ÙƒÙ„ Ø§Ù„ÙƒÙˆØ±Ø³Ø§Øª", "All courses")}</option>
          <optgroup label={t(locale, "Ù…Ø±Ø­Ù„Ø© Ø§Ù„ØªØ£Ø³ÙŠØ³ Ø§Ù„Ø¥Ø¨Ø¯Ø§Ø¹ÙŠ", "Creative Foundation")}>
            <option value="scratch">Scratch</option>
            <option value="app_inventor">App Inventor</option>
            <option value="robotics_basic">{t(locale, "Ø±ÙˆØ¨ÙˆØªÙƒØ³ Ø£Ø³Ø§Ø³ÙŠ", "Robotics Basic")}</option>
            <option value="ai_intro">{t(locale, "Ù…Ù‚Ø¯Ù…Ø© ÙÙŠ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ", "AI Intro")}</option>
          </optgroup>
          <optgroup label={t(locale, "Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ø¨Ø±Ù…Ø¬Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ©", "Practical Programming")}>
            <option value="python">Python</option>
            <option value="godot">Godot</option>
            <option value="robotics_iot">Robotics / IoT</option>
            <option value="fastapi">FastAPI</option>
          </optgroup>
          <optgroup label={t(locale, "Ù…Ø±Ø­Ù„Ø© Ø§Ù„ØªØ·Ø¨ÙŠÙ‚Ø§Øª ÙˆØ§Ù„ÙˆÙŠØ¨", "Web & Apps")}>
            <option value="html_css">HTML / CSS</option>
            <option value="javascript_tailwind">JavaScript / Tailwind</option>
            <option value="front_end">Front End</option>
          </optgroup>
          <optgroup label={t(locale, "Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙˆØ§Ù„Ø¨ÙŠØ§Ù†Ø§Øª", "AI & Data")}>
            <option value="ai_ml">AI & Machine Learning</option>
            <option value="data_science">Data Science</option>
            <option value="back_end">Back End</option>
            <option value="raspberry_pi">Raspberry Pi</option>
          </optgroup>
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          {t(locale, "Ø¬Ø§Ø±Ù ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø¬Ø¯ÙˆÙ„...", "Loading schedule...")}
        </div>
      ) : (
        <>
          <div className="hidden gap-3 xl:grid xl:grid-cols-7">
            {grouped.map(({ day, items }) => (
              <div key={day} className="min-w-0 rounded-2xl border border-border bg-card p-2.5">
                <div className="mb-2 border-b border-border pb-2 text-center text-sm font-bold text-foreground">{day}</div>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <EmptyDay label={t(locale, "Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¬Ù„Ø³Ø§Øª", "No sessions")} />
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
                            <div className="flex items-center gap-1.5"><Clock size={10} />{session.startTime} â€” {session.endTime}</div>
                            <div className="flex items-center gap-1.5 truncate"><Users size={10} /><span className="truncate">{session.teacher}</span> - {session.students} {t(locale, "Ø·Ù„Ø§Ø¨", "students")}</div>
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
                  <EmptyDay label={t(locale, "Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¬Ù„Ø³Ø§Øª", "No sessions")} />
                ) : (
                  items.map((session) => {
                    const colors = getCourseColors(session.course);
                    return (
                      <Link key={session.id} href={"/schedule/" + session.id} className={cn("block rounded-xl border p-3 transition-colors hover:bg-muted/20", colors.bg, colors.border)}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className={cn("truncate text-sm font-bold", colors.text)}>{session.className}</p>
                            <p className="truncate text-xs text-muted-foreground">{session.teacher} â€” {session.students} {t(locale, "Ø·Ù„Ø§Ø¨", "students")}</p>
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
