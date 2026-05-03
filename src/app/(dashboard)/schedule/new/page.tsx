"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Repeat2 } from "lucide-react";
import { toast } from "sonner";

import { ScheduleEntryForm } from "@/components/schedule/schedule-entry-form";
import { createScheduleEntry } from "@/services/schedule.service";
import { completeGroupSessionSeries } from "@/services/group-operations.service";
import { useUIStore } from "@/stores/ui-store";
import { getDayLabel, t } from "@/lib/locale";
import type { CourseType } from "@/types/common.types";

type RecurrenceMode = "weekly" | "twice_weekly" | "custom";

const WEEKDAY_VALUES = [0, 1, 2, 3, 4, 5, 6];

function toggleNumber(list: number[], value: number): number[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value].sort((a, b) => a - b);
}

function resolveRecurrenceWeekdays(input: {
  mode: RecurrenceMode;
  selectedWeekdays: number[];
  anchorDay: number;
  locale: "ar" | "en";
}): number[] {
  if (input.mode === "weekly") return [input.anchorDay];

  const unique = [...new Set(input.selectedWeekdays)].sort((a, b) => a - b);

  if (!unique.includes(input.anchorDay)) {
    throw new Error(
      t(
        input.locale,
        "يوم الحصة الأساسي في النموذج يجب أن يكون ضمن أيام التكرار المختارة.",
        "The main session day in the form must be included in the selected recurrence days.",
      ),
    );
  }

  if (input.mode === "twice_weekly" && unique.length !== 2) {
    throw new Error(t(input.locale, "اختر يومين بالضبط للتكرار مرتين أسبوعيًا.", "Choose exactly two days for twice-weekly recurrence."));
  }

  if (input.mode === "custom" && unique.length < 1) {
    throw new Error(t(input.locale, "اختر يومًا واحدًا على الأقل للتكرار المخصص.", "Choose at least one day for custom recurrence."));
  }

  return unique;
}
export default function NewSchedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useUIStore((state) => state.locale);

  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatCount, setRepeatCount] = useState(8);

  const [recurrenceMode, setRecurrenceMode] = useState<RecurrenceMode>("weekly");
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const normalizedRepeatCount = useMemo(() => {
    if (!repeatEnabled) return 1;
    if (!Number.isFinite(repeatCount)) return 1;
    return Math.min(24, Math.max(1, Math.floor(repeatCount)));
  }, [repeatCount, repeatEnabled]);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Repeat2 size={20} className="text-brand-600" />
              {t(locale, "تكرار الحصص يدويًا", "Manual session repetition")}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {t(
                locale,
                "فعّل هذا الخيار فقط لو عايز إنشاء سلسلة حصص من نفس أول موعد. الافتراضي 8 حصص، وكل حصة تنشأ كعنصر مستقل يمكن تعديلها أو تأجيلها لاحقًا بدون التأثير على باقي الحصص.",
                "Enable this only when you want to create a session series from the first date. Default is 8 sessions, and every session is created independently so it can be edited or deferred later without shifting the rest.",
              )}
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-border bg-muted/20 px-4 py-3">
            <input
              type="checkbox"
              checked={repeatEnabled}
              onChange={(event) => setRepeatEnabled(event.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm font-semibold text-foreground">
              {t(locale, "إنشاء أكثر من حصة", "Create multiple sessions")}
            </span>
          </label>
        </div>
        {repeatEnabled ? (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-foreground">
                  {t(locale, "عدد الحصص", "Sessions count")}
                </span>
                <input
                  type="number"
                  min={1}
                  max={48}
                  step={1}
                  value={repeatCount}
                  onChange={(event) => setRepeatCount(Number(event.target.value))}
                  className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-foreground">
                  {t(locale, "نمط التكرار", "Recurrence pattern")}
                </span>
                <select
                  value={recurrenceMode}
                  onChange={(event) => {
                    const nextMode = event.target.value as RecurrenceMode;
                    setRecurrenceMode(nextMode);
                    if (nextMode === "weekly") setSelectedWeekdays([]);
                  }}
                  className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring"
                >
                  <option value="weekly">{t(locale, "مرة أسبوعيًا حسب يوم الحصة", "Once weekly based on the session day")}</option>
                  <option value="twice_weekly">{t(locale, "مرتين أسبوعيًا", "Twice weekly")}</option>
                  <option value="custom">{t(locale, "أيام مخصصة أسبوعيًا", "Custom weekdays")}</option>
                </select>
              </label>
            </div>

            {recurrenceMode !== "weekly" ? (
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <p className="mb-3 text-sm font-semibold text-foreground">
                  {t(locale, "اختر أيام التكرار، ويجب أن تشمل يوم الحصة المحدد في النموذج.", "Choose recurrence days. They must include the main session day selected in the form.")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAY_VALUES.map((day) => {
                    const selected = selectedWeekdays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedWeekdays((prev: number[]) => toggleNumber(prev, day))}
                        className={
                          selected
                            ? "rounded-xl bg-brand-700 px-3 py-2 text-sm font-semibold text-white"
                            : "rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted"
                        }
                      >
                        {getDayLabel(day, locale)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="rounded-2xl border border-warning-100 bg-warning-50 p-4 text-sm leading-7 text-warning-700">
              {t(
                locale,
                `سيتم إنشاء ${normalizedRepeatCount} حصة داخل نفس الجروب حسب نمط التكرار المختار. كل حصة مستقلة ويمكن تأجيلها لاحقًا بدون تحريك باقي الحصص.`,
                `${normalizedRepeatCount} sessions will be created in the same group using the selected recurrence pattern. Each session remains independent and can be deferred later without shifting the others.`,
              )}
            </div>
          </div>
        ) : null}
      </section>

      <ScheduleEntryForm
        title="إضافة حصة / حدث"
        description="أنشئ حصة جديدة واربطها بالمدرس والمسار واليوم حتى تظهر مباشرة داخل الجدول."
        submitLabel={repeatEnabled ? t(locale, "حفظ سلسلة الحصص", "Save session series") : t(locale, "حفظ الحصة", "Save session")}
        successMessage={repeatEnabled ? t(locale, "تم إنشاء سلسلة الحصص", "Session series created") : t(locale, "تمت إضافة الحصة إلى الجدول", "Session added to the schedule")}
        initialValues={{
          className: searchParams.get("className") ?? "",
          teacherId: searchParams.get("teacherId") ?? "",
          course: (searchParams.get("course") as CourseType | null) ?? undefined,
        }}
        onSubmit={async (payload) => {
          if (!repeatEnabled || normalizedRepeatCount <= 1) {
            const created = await createScheduleEntry(payload);
            router.push(`/schedule/${created.id}`);
            return;
          }
          const recurrenceWeekdays = resolveRecurrenceWeekdays({
            mode: recurrenceMode,
            selectedWeekdays,
            anchorDay: payload.day,
            locale,
          });

          const firstSession = await createScheduleEntry(payload);

          if (!firstSession.classId) {
            throw new Error(t(locale, "تعذر تحديد الجروب الجديد بعد إنشاء أول حصة", "Could not resolve the new group after creating the first session"));
          }

          const result = await completeGroupSessionSeries({
            groupId: firstSession.classId,
            targetCount: normalizedRepeatCount,
            recurrenceWeekdays: recurrenceWeekdays,
          });

          toast.success(
            t(
              locale,
              `تم إنشاء جروب واحد واستكماله إلى ${result.totalCount} حصص.`,
              `One group was created and completed to ${result.totalCount} sessions.`,
            ),
          );

          router.push(`/groups/${firstSession.classId}`);
          return;

        }}
        cancelHref="/schedule"
      />
    </div>
  );
}