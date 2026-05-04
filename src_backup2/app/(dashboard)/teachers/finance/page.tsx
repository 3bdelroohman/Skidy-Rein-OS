"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Calculator, PlusCircle, Wallet } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useCurrentUser } from "@/providers/user-provider";
import { canManageTeacherFinanceForUser, canManageTeachersForUser } from "@/config/roles";
import { t } from "@/lib/locale";
import { formatCourseLabel, formatCurrency } from "@/lib/formatters";
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
        titleAr="Ø§Ù„Ø­Ø³Ø§Ø¨Ø§Øª Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ù„Ù„Ù…Ø¯Ø±Ø³ÙŠÙ† Ù…Ø­ØµÙˆØ±Ø© Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„ Ø§Ù„Ù…Ø®ØªØµ"
        titleEn="Teacher finance is restricted"
        descriptionAr="Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª ÙˆØ­Ø³Ø§Ø¨Ø§Øª Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ† Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ù…ØªØ§Ø­Ø© ÙÙ‚Ø· Ù„Ù„Ù…Ø³ØªØ®Ø¯Ù… Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„ Ø¹Ù† ØªØ´ØºÙŠÙ„ Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†."
        descriptionEn="Teacher finance settings are restricted to the assigned teacher operations owner."
        actionHref="/"
        actionLabelAr="Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ…"
        actionLabelEn="Back to dashboard"
      />
    );
  }

  if (loading) {
    return (
      <LoadingState
        titleAr="Ø¬Ø§Ø±Ù ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø­Ø³Ø§Ø¨Ø§Øª Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ù„Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†"
        titleEn="Loading teachers finance"
        descriptionAr="ÙŠØªÙ… Ø§Ù„Ø¢Ù† Ø­Ø³Ø§Ø¨ Ø§Ù„ØªÙ‚Ø¯ÙŠØ± Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹ÙŠ ÙˆØ§Ù„Ø´Ù‡Ø±ÙŠ Ø¨Ù†Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ø£Ø³Ø¹Ø§Ø± Ø§Ù„ÙƒÙˆØ±Ø³Ø§Øª ÙˆÙ…Ø¯Ø¯ Ø§Ù„Ø¯Ø±ÙˆØ³."
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
            {t(locale, "Ø­Ø³Ø§Ø¨Ø§Øª Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†", "Teacher accounts")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              locale,
              "ØªÙ‚Ø¯ÙŠØ± Ø£Ø³Ø¨ÙˆØ¹ÙŠ ÙˆØ´Ù‡Ø±ÙŠ Ù„Ù…Ø³ØªØ­Ù‚Ø§Øª Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ† Ø¨Ù†Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ø§Ù„Ø­ØµØµ Ø§Ù„Ù…Ø±ØªØ¨Ø·Ø© ÙˆØ£Ø³Ø¹Ø§Ø± Ø§Ù„ÙƒÙˆØ±Ø³Ø§Øª Ø§Ù„ÙØ¹Ù„ÙŠØ©.",
              "Weekly and monthly estimates for teacher dues based on linked sessions and real course-based pricing.",
            )}
          </p>
        </div>
        {canManageTeachers ? (
          <Link href="/teachers/new" className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
            <PlusCircle size={16} />
            {t(locale, "Ø¥Ø¶Ø§ÙØ© Ù…Ø¯Ø±Ø³", "Add teacher")}
          </Link>
        ) : null}
      </div>

      <div className="flex gap-2">
        {(["all", "active", "inactive"] as StatusFilter[]).map((filterValue) => {
          const label =
            filterValue === "all"
              ? t(locale, "Ø§Ù„ÙƒÙ„", "All")
              : filterValue === "active"
                ? t(locale, "Ù†Ø´Ø·", "Active")
                : t(locale, "ØºÙŠØ± Ù†Ø´Ø·", "Inactive");
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
        <SummaryCard locale={locale} icon={Wallet} labelAr="Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø£Ø³Ø¨ÙˆØ¹ÙŠ" labelEn="Weekly total" value={formatCurrency(totals.weekly, locale)} />
        <SummaryCard locale={locale} icon={Wallet} labelAr="Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø´Ù‡Ø±ÙŠ ØªÙ‚Ø¯ÙŠØ±ÙŠ" labelEn="Estimated monthly total" value={formatCurrency(totals.monthly, locale)} />
        <SummaryCard locale={locale} icon={Calculator} labelAr="Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø­ØµØµ" labelEn="Total sessions" value={String(totals.sessions)} />
      </div>

      {filtered.length === 0 ? (
        <PageStateCard
          variant="default"
          titleAr="Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨ÙŠØ§Ù†Ø§Øª Ù…Ø§Ù„ÙŠØ© Ù„Ù„Ù…Ø¯Ø±Ø³ÙŠÙ† Ø¨Ø¹Ø¯"
          titleEn="No teacher finance data yet"
          descriptionAr="Ø£Ø¶Ù Ø£Ø³Ø¹Ø§Ø± Ø§Ù„ÙƒÙˆØ±Ø³Ø§Øª ÙˆÙ…Ø¯Ø¯ Ø§Ù„Ø¯Ø±ÙˆØ³ Ù…Ù† Ù…Ù„Ù ÙƒÙ„ Ù…Ø¯Ø±Ø³ Ø«Ù… Ø±Ø§Ø¬Ø¹ Ø§Ù„Ù…Ù„Ø®Øµ Ø§Ù„Ù…Ø§Ù„ÙŠ."
          descriptionEn="Add course and duration pricing from each teacher profile, then review the finance summary here."
          actionHref="/teachers"
          actionLabelAr="Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†"
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
                        {t(locale, "ØºÙŠØ± Ù†Ø´Ø·", "Inactive")}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {getEmploymentTypeLabel(item.teacher.employment, locale)} â€¢ {item.teacher.linkedStudents.length} {t(locale, "Ø·Ù„Ø§Ø¨", "students")} â€¢ {item.linkedSessions} {t(locale, "Ø­ØµØµ", "sessions")}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {formatCurrency(item.monthlyEstimated, locale)}
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
                <MiniMetric locale={locale} labelAr="Ø£Ø³Ø¨ÙˆØ¹ÙŠ" labelEn="Weekly" value={formatCurrency(item.weeklyEstimated, locale)} />
                <MiniMetric locale={locale} labelAr="Ø´Ù‡Ø±ÙŠ" labelEn="Monthly" value={formatCurrency(item.monthlyEstimated, locale)} />
                <MiniMetric locale={locale} labelAr="Ù…ØªÙˆØ³Ø· Ø§Ù„Ø­ØµØ©" labelEn="Avg session" value={formatCurrency(item.averagePerSession, locale)} />
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
