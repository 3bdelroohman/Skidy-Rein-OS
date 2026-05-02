"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Repeat2 } from "lucide-react";
import { toast } from "sonner";

import { ScheduleEntryForm } from "@/components/schedule/schedule-entry-form";
import { createScheduleEntry } from "@/services/schedule.service";
import { completeGroupSessionSeries } from "@/services/group-operations.service";
import { useUIStore } from "@/stores/ui-store";
import { t } from "@/lib/locale";
import type { CourseType } from "@/types/common.types";

type SchedulePayload = Parameters<typeof createScheduleEntry>[0];export default function NewScheduleEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useUIStore((state) => state.locale);

  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatCount, setRepeatCount] = useState(8);

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
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr] md:items-center">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-foreground">
                {t(locale, "عدد الحصص", "Sessions count")}
              </span>
              <input
                type="number"
                min={1}
                max={24}
                step={1}
                value={repeatCount}
                onChange={(event) => setRepeatCount(Number(event.target.value))}
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring"
              />
            </label>

            <div className="rounded-2xl border border-warning-100 bg-warning-50 p-4 text-sm leading-7 text-warning-700">
              {t(
                locale,
                `سيتم إنشاء ${normalizedRepeatCount} حصة مستقلة أسبوعيًا. هذا لا يربطهم كتكرار تلقائي؛ كل حصة يمكن تعديلها أو تأجيلها وحدها.`,
                `${normalizedRepeatCount} independent weekly sessions will be created. This is not an automatic recurrence; each session can be edited or deferred on its own.`,
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
          const firstSession = await createScheduleEntry(payload);

          if (!firstSession.classId) {
            throw new Error(t(locale, "تعذر تحديد الجروب الجديد بعد إنشاء أول حصة", "Could not resolve the new group after creating the first session"));
          }

          const result = await completeGroupSessionSeries({
            groupId: firstSession.classId,
            targetCount: normalizedRepeatCount,
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