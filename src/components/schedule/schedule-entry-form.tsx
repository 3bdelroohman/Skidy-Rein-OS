"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarPlus, Save } from "lucide-react";
import { toast } from "sonner";
import { t, getDayLabel } from "@/lib/locale";
import { useUIStore } from "@/stores/ui-store";
import type { CourseType } from "@/types/common.types";
import type { CreateScheduleEntryInput, TeacherListItem } from "@/types/crm";
import { listTeachers } from "@/services/teachers.service";

interface ScheduleEntryFormProps {
  title: string;
  description: string;
  submitLabel: string;
  successMessage: string;
  onSubmit: (payload: CreateScheduleEntryInput) => Promise<void>;
  cancelHref?: string;
  initialValues?: {
    className?: string;
    teacherId?: string;
    course?: CourseType;
    sessionDate?: string;
  };
}

const COURSE_OPTIONS: CourseType[] = ["scratch", "app_inventor", "robotics_basic", "ai_intro", "python", "godot", "robotics_iot", "fastapi", "html_css", "javascript_tailwind", "front_end", "ai_ml", "data_science", "back_end", "raspberry_pi"];

function getCourseLabel(course: CourseType, locale: "ar" | "en") {
  const labels: Record<CourseType, { ar: string; en: string }> = {
    app_inventor: { ar: "App Inventor", en: "App Inventor" },
    robotics_basic: { ar: "روبوتكس", en: "Robotics Basic" },
    ai_intro: { ar: "مقدمة AI", en: "AI Intro" },
    godot: { ar: "Godot", en: "Godot" },
    robotics_iot: { ar: "Robotics / IoT", en: "Robotics / IoT" },
    fastapi: { ar: "FastAPI", en: "FastAPI" },
    javascript_tailwind: { ar: "JavaScript / Tailwind", en: "JavaScript / Tailwind" },
    front_end: { ar: "Front End", en: "Front End" },
    data_science: { ar: "Data Science", en: "Data Science" },
    back_end: { ar: "Back End", en: "Back End" },
    raspberry_pi: { ar: "Raspberry Pi", en: "Raspberry Pi" },
    scratch: { ar: "Scratch", en: "Scratch" },
    python: { ar: "Python", en: "Python" },
    html_css: { ar: "HTML / CSS", en: "HTML / CSS" },
    ai_ml: { ar: "AI & Machine Learning", en: "AI & Machine Learning" },
    web: { ar: "Web", en: "Web" },
    ai: { ar: "AI", en: "AI" },
  };
  return locale === "ar" ? labels[course].ar : labels[course].en;
}

function getLocalDateInput(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function getWeekdayFromDateInput(dateValue: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return new Date().getDay();
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

export function ScheduleEntryForm({ title, description, submitLabel, successMessage, onSubmit, cancelHref = "/schedule", initialValues }: ScheduleEntryFormProps) {
  const router = useRouter();
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<TeacherListItem[]>([]);

  const initialSessionDate =
    typeof initialValues?.sessionDate === "string" && initialValues.sessionDate
      ? initialValues.sessionDate
      : getLocalDateInput();
  const [form, setForm] = useState({
    className: initialValues?.className ?? "",
    teacherId: initialValues?.teacherId ?? "",
    course: initialValues?.course ?? ("scratch" as CourseType),
    sessionDate: initialSessionDate,
    day: String(getWeekdayFromDateInput(initialSessionDate)),
    startTime: "16:00",
    endTime: "17:00",
  });

  useEffect(() => {
    listTeachers().then((items) => {
      setTeachers(items);
      setForm((prev) => {
        const hasRequestedTeacher = prev.teacherId && items.some((teacher) => teacher.id === prev.teacherId);
        return { ...prev, teacherId: hasRequestedTeacher ? prev.teacherId : prev.teacherId || items[0]?.id || "" };
      });
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.className.trim() || !form.teacherId) {
      toast.error(t(locale, "اسم الحصة والمدرس مطلوبان", "Class name and teacher are required"));
      return;
    }
    if (form.endTime <= form.startTime) {
      toast.error(t(locale, "وقت النهاية يجب أن يكون بعد وقت البداية", "End time must be after start time"));
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        className: form.className.trim(),
        teacherId: form.teacherId,
        course: form.course,
        day: getWeekdayFromDateInput(form.sessionDate),

        sessionDate: form.sessionDate,

        startTime: form.startTime,
        endTime: form.endTime,
      });
      toast.success(successMessage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(locale, "تعذر إضافة الحصة", "Could not create schedule entry"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push(cancelHref)} className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">{isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}</button>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground"><CalendarPlus size={28} className="text-brand-600" />{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t(locale, "اسم الحصة / الحدث *", "Session / event name *")} value={form.className} onChange={(value) => setForm((prev) => ({ ...prev, className: value }))} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "المدرس *", "Teacher *")}</label>
              <select value={form.teacherId} onChange={(event) => setForm((prev) => ({ ...prev, teacherId: event.target.value }))} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.fullName}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t(locale, "المسار", "Track")}</label>
              <select value={form.course} onChange={(event) => setForm((prev) => ({ ...prev, course: event.target.value as CourseType }))} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring">
                {COURSE_OPTIONS.map((course) => <option key={course} value={course}>{getCourseLabel(course, locale)}</option>)}
              </select>
            </div>
            <Field
              label={t(locale, "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062D\u0635\u0629", "Session date")}
              value={form.sessionDate}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  sessionDate: value,
                  day: String(getWeekdayFromDateInput(value)),
                }))
              }
              type="date"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t(locale, "\u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u0645\u062D\u0633\u0648\u0628", "Calculated day")}
              </label>
              <div className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm font-semibold text-foreground">
                {getDayLabel(getWeekdayFromDateInput(form.sessionDate), locale)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(locale, "\u064A\u062A\u062D\u062F\u062F \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627 \u0645\u0646 \u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062D\u0635\u0629.", "Automatically calculated from the session date.")}
              </p>
            </div>
            <Field label={t(locale, "وقت البداية", "Start time")} value={form.startTime} onChange={(value) => setForm((prev) => ({ ...prev, startTime: value }))} type="time" />
            <Field label={t(locale, "وقت النهاية", "End time")} value={form.endTime} onChange={(value) => setForm((prev) => ({ ...prev, endTime: value }))} type="time" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.push(cancelHref)} className="rounded-xl px-6 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted">{t(locale, "إلغاء", "Cancel")}</button>
          <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <><Save size={18} />{submitLabel}</>}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <div><label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-ring" /></div>;
}
