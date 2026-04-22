"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Calculator, PlusCircle, Wallet } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useCurrentUser } from "@/providers/user-provider";
import { canManageTeacherFinanceForUser, canManageTeachersForUser } from "@/config/roles";
import { t } from "@/lib/locale";
import { formatCourseLabel, formatCurrencyEgp } from "@/lib/formatters";
import { getEmploymentTypeLabel } from "@/lib/locale";
import { getTeacherDetails } from "@/services/relations.service";
import { listTeachers } from "@/services/teachers.service";
import { computeTeacherFinanceSummary, getTeacherFinanceConfig } from "@/services/teacher-finance.service";
import { LoadingState, PageStateCard } from "@/components/shared/page-state";
import type { TeacherDetails } from "@/types/crm";

type StatusFilter = "all" | "active" | "inactive";

interface TeacherFinanceView {
  teacher: TeacherDetails;
  weeklyEstimated: number;
  monthlyEstimated: number;
  averagePerSession: number;
  linkedSessions: number;
}

export default function TeachersFinancePage() {
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const user = useCurrentUser();
  const canManageFinance = canManageTeacherFinanceForUser(user);
  const canManageTeachers = canManageTeachersForUser(user);

  const [items, setItems] = useState<TeacherFinanceView[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");

  useEffect(() => {
    let mounted = true;

    if (canManageFinance) {
      (async () => {
        const teachers = await listTeachers();
        const details = (await Promise.all(teachers.map((teacher) => getTeacherDetails(teacher.id)))).filter(Boolean) as TeacherDetails[];

        if (!mounted) return;

        const next = await Promise.all(
          details.map(async (teacher) => {
            const config = await getTeacherFinanceConfig(teacher.id);
            const summary = computeTeacherFinanceSummary(teacher.linkedSessions, config);

            return {
              teacher,
              weeklyEstimated: summary.weeklyEstimated,
              monthlyEstimated: summary.monthlyEstimated,
              averagePerSession: summary.averagePerSession,
              linkedSessions: summary.linkedSessions,
            } satisfies TeacherFinanceView;
          }),
        );

        setItems(
          next.sort(
            (a, b) =>
              b.monthlyEstimated - a.monthlyEstimated ||
              a.teacher.fullName.localeCompare(b.teacher.fullName, "ar"),
          ),
        );
        setLoading(false);
      })();
    }

    return () => {
      mounted = false;
    };
  }, [canManageFinance]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((item) => (statusFilter === "active" ? item.teacher.isActive : !item.teacher.isActive));
  }, [items, statusFilter]);

  const totals = useMemo(
    () => ({
      weekly: filtered.reduce((sum, item) => sum + item.weeklyEstimated, 0),
      monthly: filtered.reduce((sum, item) => sum + item.monthlyEstimated, 0),
      sessions: filtered.reduce((sum, item) => sum + item.linkedSessions, 0),
    }),
    [filtered],
  );

  if (!canManageFinance) {
    return (
      <PageStateCard
        variant="warning"
        titleAr="الحسابات المالية للمدرسين محصورة على المسؤول المختص"
        titleEn="Teacher finance is restricted"
        descriptionAr="إعدادات وحسابات المدرسين المالية متاحة فقط للمستخدم المسؤول عن تشغيل المدرسين."
        descriptionEn="Teacher finance settings are restricted to the assigned teacher operations owner."
        actionHref="/"
        actionLabelAr="العودة إلى لوحة التحكم"
        actionLabelEn="Back to dashboard"
      />
    );
  }

  if (loading) {
    return (
      <LoadingState
        titleAr="\u062c\u0627\u0631\u0650 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0644\u0644\u0645\u062f\u0631\u0633\u064a\u0646"
        titleEn="Loading teachers finance"
        descriptionAr="\u064a\u062a\u0645 \u0627\u0644\u0622\u0646 \u062d\u0633\u0627\u0628 \u0627\u0644\u062a\u0642\u062f\u064a\u0631 \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064a \u0648\u0627\u0644\u0634\u0647\u0631\u064a \u0628\u0646\u0627\u0621\u064b \u0639\u0644\u0649 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0643\u0648\u0631\u0633\u0627\u062a \u0648\u0645\u062f\u062f \u0627\u0644\u062f\u0631\u0648\u0633."
        descriptionEn="Preparing weekly and monthly estimates from real course and lesson-duration pricing."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/teachers" className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
          {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </Link>
        <div className="flex-1">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Wallet size={26} className="text-brand-600" />
            {t(locale, "\u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0646", "Teacher accounts")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              locale,
              "\u062a\u0642\u062f\u064a\u0631 \u0623\u0633\u0628\u0648\u0639\u064a \u0648\u0634\u0647\u0631\u064a \u0644\u0645\u0633\u062a\u062d\u0642\u0627\u062a \u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0646 \u0628\u0646\u0627\u0621\u064b \u0639\u0644\u0649 \u0627\u0644\u062d\u0635\u0635 \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u0629 \u0648\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0643\u0648\u0631\u0633\u0627\u062a \u0627\u0644\u0641\u0639\u0644\u064a\u0629.",
              "Weekly and monthly estimates for teacher dues based on linked sessions and real course-based pricing.",
            )}
          </p>
        </div>
        {canManageTeachers ? (
          <Link href="/teachers/new" className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
            <PlusCircle size={16} />
            {t(locale, "\u0625\u0636\u0627\u0641\u0629 \u0645\u062f\u0631\u0633", "Add teacher")}
          </Link>
        ) : null}
      </div>

      <div className="flex gap-2">
        {(["all", "active", "inactive"] as StatusFilter[]).map((filterValue) => {
          const label =
            filterValue === "all"
              ? t(locale, "\u0627\u0644\u0643\u0644", "All")
              : filterValue === "active"
                ? t(locale, "\u0646\u0634\u0637", "Active")
                : t(locale, "\u063a\u064a\u0631 \u0646\u0634\u0637", "Inactive");
          const count =
            filterValue === "all"
              ? items.length
              : items.filter((item) => (filterValue === "active" ? item.teacher.isActive : !item.teacher.isActive)).length;

          return (
            <button key={filterValue} onClick={() => setStatusFilter(filterValue)} className={"rounded-xl px-4 py-2 text-sm font-medium transition-colors " + (statusFilter === filterValue ? "bg-brand-700 text-white" : "border border-border bg-card text-foreground hover:bg-muted")}>
              {label} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard locale={locale} icon={Wallet} labelAr="\u0625\u062c\u0645\u0627\u0644\u064a \u0623\u0633\u0628\u0648\u0639\u064a" labelEn="Weekly total" value={formatCurrencyEgp(totals.weekly, locale)} />
        <SummaryCard locale={locale} icon={Wallet} labelAr="\u0625\u062c\u0645\u0627\u0644\u064a \u0634\u0647\u0631\u064a \u062a\u0642\u062f\u064a\u0631\u064a" labelEn="Estimated monthly total" value={formatCurrencyEgp(totals.monthly, locale)} />
        <SummaryCard locale={locale} icon={Calculator} labelAr="\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u062d\u0635\u0635" labelEn="Total sessions" value={String(totals.sessions)} />
      </div>

      {filtered.length === 0 ? (
        <PageStateCard
          variant="default"
          titleAr="\u0644\u0627 \u062a\u0648\u062c\u062f \u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0627\u0644\u064a\u0629 \u0644\u0644\u0645\u062f\u0631\u0633\u064a\u0646 \u0628\u0639\u062f"
          titleEn="No teacher finance data yet"
          descriptionAr="\u0623\u0636\u0641 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0643\u0648\u0631\u0633\u0627\u062a \u0648\u0645\u062f\u062f \u0627\u0644\u062f\u0631\u0648\u0633 \u0645\u0646 \u0645\u0644\u0641 \u0643\u0644 \u0645\u062f\u0631\u0633 \u062b\u0645 \u0631\u0627\u062c\u0639 \u0627\u0644\u0645\u0644\u062e\u0635 \u0627\u0644\u0645\u0627\u0644\u064a."
          descriptionEn="Add course and duration pricing from each teacher profile, then review the finance summary here."
          actionHref="/teachers"
          actionLabelAr="\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0646"
          actionLabelEn="Back to teachers"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((item) => (
            <Link key={item.teacher.id} href={"/teachers/" + item.teacher.id} className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-brand-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-lg font-bold text-foreground">{item.teacher.fullName}</p>
                    {!item.teacher.isActive ? (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        {t(locale, "\u063a\u064a\u0631 \u0646\u0634\u0637", "Inactive")}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {getEmploymentTypeLabel(item.teacher.employment, locale)} \u2022 {item.teacher.linkedStudents.length} {t(locale, "\u0637\u0644\u0627\u0628", "students")} \u2022 {item.linkedSessions} {t(locale, "\u062d\u0635\u0635", "sessions")}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {formatCurrencyEgp(item.monthlyEstimated, locale)}
                </span>
              </div>

              {item.teacher.activeCourses.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.teacher.activeCourses.map((course) => (
                    <span key={course} className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-foreground">
                      {formatCourseLabel(course, locale)}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                <MiniMetric locale={locale} labelAr="\u0623\u0633\u0628\u0648\u0639\u064a" labelEn="Weekly" value={formatCurrencyEgp(item.weeklyEstimated, locale)} />
                <MiniMetric locale={locale} labelAr="\u0634\u0647\u0631\u064a" labelEn="Monthly" value={formatCurrencyEgp(item.monthlyEstimated, locale)} />
                <MiniMetric locale={locale} labelAr="\u0645\u062a\u0648\u0633\u0637 \u0627\u0644\u062d\u0635\u0629" labelEn="Avg session" value={formatCurrencyEgp(item.averagePerSession, locale)} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ locale, icon: Icon, labelAr, labelEn, value }: { locale: "ar" | "en"; icon: typeof Wallet; labelAr: string; labelEn: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon size={16} />
        {t(locale, labelAr, labelEn)}
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function MiniMetric({ locale, labelAr, labelEn, value }: { locale: "ar" | "en"; labelAr: string; labelEn: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <p className="text-[11px] text-muted-foreground">{t(locale, labelAr, labelEn)}</p>
      <p className="mt-1 font-bold text-foreground">{value}</p>
    </div>
  );
}
