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
  return `${formatScheduleDateLabel(weekStart, locale)} — ${formatScheduleDateLabel(weekEnd, locale)}`;
}

function getScheduleWeekStatusLabel(weekStart: string, locale: "ar" | "en"): string {
  const currentWeek = getScheduleWeekStartDateInput();

  if (weekStart === currentWeek) {
    return t(locale, "الأسبوع الحالي", "Current week");
  }

  if (weekStart < currentWeek) {
    return t(locale, "أسبوع سابق", "Past week");
  }

  return t(locale, "أسبوع قادم", "Upcoming week");
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
              {t(locale, "الجدول", "Schedule")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(locale, "عرض أسبوعي للكلاسات، الأحمال، وأهم الجلسات الجارية", "Weekly view of classes, load, and ongoing sessions")}
            </p>
          </div>
          <Link href="/schedule/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
            <Plus size={18} />
            {t(locale, "إضافة حصة / حدث", "Add session / event")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MiniMetric label={t(locale, "عدد الجلسات", "Sessions")} value={overview.sessionsCount} />
        <MiniMetric label={t(locale, "إجمالي المقاعد", "Total seats")} value={overview.totalStudents} />
        <MiniMetric label={t(locale, "عدد المدرسين", "Teachers")} value={overview.uniqueTeachers} />
        <MiniMetric label={t(locale, "أكثر يوم ازدحاماً", "Busiest day")} value={getDayLabel(overview.busiestDay, locale) + " (" + overview.busiestDayCount + ")"} />
      </div>

      <div className="rounded-3xl border border-border bg-card/95 p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-700/10 px-3 py-1 text-[11px] font-black text-brand-700 ring-1 ring-brand-700/20">
                {getScheduleWeekStatusLabel(weekStart, locale)}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                {weekStart} → {weekEnd}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-foreground">
                {formatScheduleWeekRange(weekStart, weekEnd, locale)}
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {t(
                  locale,
                  "الجدول يعرض حصص الأسبوع المختار فقط حتى لا تتكدس حصص الأسابيع القادمة في نفس اليوم.",
                  "The timetable shows only the selected week so future weekly sessions do not stack under the same day.",
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-border bg-background px-4 py-3 text-center sm:min-w-24">
              <p className="text-[11px] font-semibold text-muted-foreground">
                {t(locale, "حصص الأسبوع", "Week sessions")}
              </p>
              <p className="mt-1 text-2xl font-black text-foreground">{filtered.length}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-background p-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => setWeekStart((current) => addDaysToDateInput(current, -7))}
                className="rounded-xl px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted"
              >
                {t(locale, "السابق", "Previous")}
              </button>

              <button
                type="button"
                onClick={() => setWeekStart(getScheduleWeekStartDateInput())}
                className="rounded-xl bg-brand-700 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-600"
              >
                {t(locale, "الحالي", "Current")}
              </button>

              <button
                type="button"
                onClick={() => setWeekStart((current) => addDaysToDateInput(current, 7))}
                className="rounded-xl px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted"
              >
                {t(locale, "التالي", "Next")}
              </button>
            </div>

            <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
              {t(locale, "اذهب لتاريخ", "Jump to date")}
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
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isAr ? "right-3" : "left-3")} />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t(locale, "بحث باسم الكلاس أو المدرس...", "Search by class or teacher...")}
            className={cn("w-full rounded-xl border border-border bg-card py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring", isAr ? "pr-10 pl-4" : "pl-10 pr-4")}
          />
        </div>
        <select
          value={courseFilter}
          onChange={(event) => setCourseFilter(event.target.value as CourseType | "all")}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground"
        >
          <option value="all">{t(locale, "كل الكورسات", "All courses")}</option>
          <optgroup label={t(locale, "مرحلة التأسيس الإبداعي", "Creative Foundation")}>
            <option value="scratch">Scratch</option>
            <option value="app_inventor">App Inventor</option>
            <option value="robotics_basic">{t(locale, "روبوتكس أساسي", "Robotics Basic")}</option>
            <option value="ai_intro">{t(locale, "مقدمة في الذكاء الاصطناعي", "AI Intro")}</option>
          </optgroup>
          <optgroup label={t(locale, "مرحلة البرمجة العملية", "Practical Programming")}>
            <option value="python">Python</option>
            <option value="godot">Godot</option>
            <option value="robotics_iot">Robotics / IoT</option>
            <option value="fastapi">FastAPI</option>
          </optgroup>
          <optgroup label={t(locale, "مرحلة التطبيقات والويب", "Web & Apps")}>
            <option value="html_css">HTML / CSS</option>
            <option value="javascript_tailwind">JavaScript / Tailwind</option>
            <option value="front_end">Front End</option>
          </optgroup>
          <optgroup label={t(locale, "مرحلة الذكاء الاصطناعي والبيانات", "AI & Data")}>
            <option value="ai_ml">AI & Machine Learning</option>
            <option value="data_science">Data Science</option>
            <option value="back_end">Back End</option>
            <option value="raspberry_pi">Raspberry Pi</option>
          </optgroup>
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          {t(locale, "جارٍ تحميل الجدول...", "Loading schedule...")}
        </div>
      ) : (
        <>
          <div className="hidden gap-3 xl:grid xl:grid-cols-7">
            {grouped.map(({ day, items }) => (
              <div key={day} className="min-w-0 rounded-2xl border border-border bg-card p-2.5">
                <div className="mb-2 border-b border-border pb-2 text-center text-sm font-bold text-foreground">{day}</div>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <EmptyDay label={t(locale, "لا توجد جلسات", "No sessions")} />
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
                            <div className="flex items-center gap-1.5"><Clock size={10} />{session.startTime} — {session.endTime}</div>
                            <div className="flex items-center gap-1.5 truncate"><Users size={10} /><span className="truncate">{session.teacher}</span> - {session.students} {t(locale, "طلاب", "students")}</div>
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
                  <EmptyDay label={t(locale, "لا توجد جلسات", "No sessions")} />
                ) : (
                  items.map((session) => {
                    const colors = getCourseColors(session.course);
                    return (
                      <Link key={session.id} href={"/schedule/" + session.id} className={cn("block rounded-xl border p-3 transition-colors hover:bg-muted/20", colors.bg, colors.border)}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className={cn("truncate text-sm font-bold", colors.text)}>{session.className}</p>
                            <p className="truncate text-xs text-muted-foreground">{session.teacher} — {session.students} {t(locale, "طلاب", "students")}</p>
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
