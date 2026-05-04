
import { STAGE_CONFIGS } from "@/config/stages";
import { DASHBOARD_TASK_STATUS_META, PRIORITY_META } from "@/config/status-meta";
import { formatCurrencyEgp, formatTime } from "@/lib/formatters";
import { getConversionTerm, t } from "@/lib/locale";
import { listFollowUps } from "@/services/follow-ups.service";
import { listLeads } from "@/services/leads.service";
import { getPaymentsSummary, listPayments } from "@/services/payments.service";
import { getScheduleOverview, listScheduleSessions } from "@/services/schedule.service";
import { listStudents } from "@/services/students.service";
import type { DashboardActionItem, DashboardContext, DashboardFollowUpItem, DashboardOverview, DashboardOperationItem } from "@/types/crm";
import type { Locale } from "@/types/common.types";

function isManagementRole(role: DashboardContext["role"]): boolean {
  return role === "admin" || role === "owner";
}

function isOpsRole(role: DashboardContext["role"]): boolean {
  return role === "ops";
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function matchesAssignee(nameAr: string, ctx: DashboardContext): boolean {
  const targets = [normalizeName(ctx.fullNameAr), normalizeName(ctx.fullName)];
  return targets.includes(normalizeName(nameAr));
}

function getToneBg(tone: DashboardOperationItem["tone"]): string {
  switch (tone) {
    case "success":
      return "#ECFDF5";
    case "warning":
      return "#FFFBEB";
    case "danger":
      return "#FEF2F2";
    case "info":
      return "#EFF6FF";
    default:
      return "#EEF2FF";
  }
}

export async function getDashboardOverview(
  context: DashboardContext,
  locale: Locale = "ar",
): Promise<DashboardOverview> {
  const [leads, students, followUps, payments, paymentsSummary, scheduleOverview, sessions] = await Promise.all([
    listLeads(),
    listStudents(),
    listFollowUps(),
    listPayments(),
    getPaymentsSummary(),
    getScheduleOverview(),
    listScheduleSessions(),
  ]);

  const isOps = isOpsRole(context.role);
  const activeStudents = students.filter((student) => student.status === "active").length;
  const recentLeads = leads.filter((lead) => {
    const createdAt = new Date(lead.createdAt).getTime();
    const threshold = Date.now() - 1000 * 60 * 60 * 24 * 7;
    return createdAt >= threshold;
  }).length;
  const monthlyRevenue = students.reduce((sum, student) => sum + student.totalPaid, 0);
  const atRiskStudents = students.filter((student) => student.status === "at_risk").length;
  const trialStudents = students.filter((student) => student.status === "trial").length;
  const bookedTrials = leads.filter((lead) => lead.stage === "trial_booked").length;
  const attendedTrials = leads.filter((lead) => lead.stage === "trial_attended").length;
  const overdueFollowUps = followUps.filter((item) => item.status === "overdue").length;
  const conversionRate = leads.length > 0 ? Math.round((leads.filter((lead) => lead.stage === "won").length / leads.length) * 100) : 0;
  const leadsMissingFollowUp = leads.filter((lead) => lead.stage !== "won" && lead.stage !== "lost" && !lead.nextFollowUpAt).length;
  const trialNoShows = leads.filter((lead) => lead.stage === "trial_booked" && !lead.lastContactAt).length;
  const overduePaymentsCount = payments.filter((payment) => payment.status === "overdue").length;
  const pendingPaymentsCount = payments.filter((payment) => payment.status === "pending").length;

  const allTasks: DashboardFollowUpItem[] = followUps.map((item) => ({
    id: item.id,
    name: item.leadName,
    reason: item.title,
    assignee: item.assignedTo,
    dot: PRIORITY_META[item.priority].color,
    time: formatTime(item.scheduledAt, locale),
    status: item.status === "overdue" ? "urgent" : item.status === "completed" ? "completed" : "pending",
  }));

  const employeeTasks = isManagementRole(context.role)
    ? allTasks
    : isOps
      ? []
      : allTasks.filter((task) => matchesAssignee(task.assignee, context));

  const alerts = [
    !isOps && overdueFollowUps > 0
      ? {
          icon: "warning",
          text: t(locale, `${overdueFollowUps} Ù…ØªØ§Ø¨Ø¹Ø§Øª Ù…ØªØ£Ø®Ø±Ø© ØªØ­ØªØ§Ø¬ ØªØ¯Ø®Ù„ Ø§Ù„Ø¢Ù†`, `${overdueFollowUps} overdue follow-ups need immediate action`),
          type: "danger" as const,
        }
      : null,
    overduePaymentsCount > 0
      ? {
          icon: "wallet",
          text: t(locale, `${overduePaymentsCount} Ø¯ÙØ¹Ø§Øª Ù…ØªØ£Ø®Ø±Ø© Ø¨Ù‚ÙŠÙ…Ø© ${formatCurrencyEgp(paymentsSummary.totalOverdue, locale)}`, `${overduePaymentsCount} overdue payments worth ${formatCurrencyEgp(paymentsSummary.totalOverdue, locale)}`),
          type: "warning" as const,
        }
      : null,
    atRiskStudents > 0
      ? {
          icon: "notification",
          text: t(locale, `${atRiskStudents} Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©`, `${atRiskStudents} students need attention`),
          type: "warning" as const,
        }
      : null,
    !isOps && recentLeads > 0
      ? {
          icon: "success",
          text: t(locale, `${recentLeads} Ø¹Ù…Ù„Ø§Ø¡ Ø¬Ø¯Ø¯ Ø®Ù„Ø§Ù„ Ø¢Ø®Ø± 7 Ø£ÙŠØ§Ù…`, `${recentLeads} new leads over the last 7 days`),
          type: "success" as const,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  const salesFunnelBase = Math.max(1, leads.length);
  const opsFunnelBase = Math.max(1, students.length);

  const operations: DashboardOperationItem[] = isOps
    ? [
        {
          title: t(locale, "Ø¬Ù„Ø³Ø§Øª Ù‡Ø°Ø§ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹", "Sessions this week"),
          value: scheduleOverview.sessionsCount.toLocaleString("en-US"),
          subtitle: t(locale, `${scheduleOverview.uniqueTeachers} Ù…Ø¯Ø±Ø³ÙŠÙ† â€¢ ${scheduleOverview.totalStudents} Ù…Ù‚Ø¹Ø¯`, `${scheduleOverview.uniqueTeachers} teachers â€¢ ${scheduleOverview.totalStudents} seats`),
          tone: "info",
        },
        {
          title: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"),
          value: atRiskStudents.toLocaleString("en-US"),
          subtitle: t(locale, "Ù…Ù„ÙØ§Øª ØªØ­ØªØ§Ø¬ ØªØ¯Ø®Ù„Ù‹Ø§ ØªØ´ØºÙŠÙ„ÙŠÙ‹Ø§ Ø§Ù„Ø¢Ù†", "Student files that need operational intervention"),
          tone: atRiskStudents > 0 ? "warning" : "success",
        },
        {
          title: t(locale, "Ø§Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠÙˆÙ†", "Trial students"),
          value: trialStudents.toLocaleString("en-US"),
          subtitle: t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø­Ø¶ÙˆØ± ÙˆØ§Ù„ØªØ­ÙˆÙŠÙ„ Ø¥Ù„Ù‰ Ø§Ø´ØªØ±Ø§Ùƒ", "Review attendance and conversion to enrollment"),
          tone: trialStudents > 0 ? "brand" : "info",
        },
        {
          title: t(locale, "ØªØ­ØµÙŠÙ„ Ø§Ù„Ø´Ù‡Ø±", "Collection this month"),
          value: `${paymentsSummary.collectionRate}%`,
          subtitle: t(locale, `${formatCurrencyEgp(paymentsSummary.totalCollected, locale)} Ù…Ù† ${formatCurrencyEgp(paymentsSummary.totalExpected, locale)}`, `${formatCurrencyEgp(paymentsSummary.totalCollected, locale)} out of ${formatCurrencyEgp(paymentsSummary.totalExpected, locale)}`),
          tone: paymentsSummary.collectionRate >= 80 ? "success" : paymentsSummary.collectionRate >= 60 ? "warning" : "danger",
        },
      ]
    : [
        {
          title: t(locale, "ØªØ­ØµÙŠÙ„ Ø§Ù„Ø´Ù‡Ø±", "Collection this month"),
          value: `${paymentsSummary.collectionRate}%`,
          subtitle: t(locale, `${formatCurrencyEgp(paymentsSummary.totalCollected, locale)} Ù…Ù† ${formatCurrencyEgp(paymentsSummary.totalExpected, locale)}`, `${formatCurrencyEgp(paymentsSummary.totalCollected, locale)} out of ${formatCurrencyEgp(paymentsSummary.totalExpected, locale)}`),
          tone: paymentsSummary.collectionRate >= 80 ? "success" : paymentsSummary.collectionRate >= 60 ? "warning" : "danger",
        },
        {
          title: t(locale, "Ø¬Ù„Ø³Ø§Øª Ù‡Ø°Ø§ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹", "Sessions this week"),
          value: scheduleOverview.sessionsCount.toLocaleString("en-US"),
          subtitle: t(locale, `${scheduleOverview.uniqueTeachers} Ù…Ø¯Ø±Ø³ÙŠÙ† â€¢ ${scheduleOverview.totalStudents} Ù…Ù‚Ø¹Ø¯`, `${scheduleOverview.uniqueTeachers} teachers â€¢ ${scheduleOverview.totalStudents} seats`),
          tone: "info",
        },
        {
          title: t(locale, "Ø¹Ù…Ù„Ø§Ø¡ Ø¨Ù„Ø§ Ù…ØªØ§Ø¨Ø¹Ø© Ù‚Ø§Ø¯Ù…Ø©", "Leads without next follow-up"),
          value: leadsMissingFollowUp.toLocaleString("en-US"),
          subtitle: t(locale, "Ø§Ø­ØªÙƒØ§Ùƒ ØªØ´ØºÙŠÙ„ÙŠ ÙŠØ¬Ø¨ ØªÙ†Ø¸ÙŠÙÙ‡", "Operational friction that needs cleanup"),
          tone: leadsMissingFollowUp > 0 ? "warning" : "success",
        },
        {
          title: t(locale, "Ø§Ù„Ø­ØµØµ Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ© Ø§Ù„Ù…Ø­Ø¬ÙˆØ²Ø©", "Booked trial sessions"),
          value: bookedTrials.toLocaleString("en-US"),
          subtitle: t(locale, `${attendedTrials.toLocaleString("en-US")} Ø­Ø¶Ø±ÙˆØ§ Ø¨Ø§Ù„ÙØ¹Ù„`, `${attendedTrials.toLocaleString("en-US")} already attended`),
          tone: bookedTrials > attendedTrials ? "brand" : "success",
        },
      ];

  const quickActions: DashboardActionItem[] = isManagementRole(context.role)
    ? [
        {
          title: t(locale, "Ù„ÙˆØ­Ø© Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡", "Leads board"),
          description: t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ù…Ø±Ø§Ø­Ù„ Ø§Ù„Ù…ØªÙˆÙ‚ÙØ© ÙˆØ§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ø£Ù‚Ø±Ø¨ Ù„Ù„Ø§Ø´ØªØ±Ø§Ùƒ", "Review stalled stages and the leads closest to enrollment"),
          href: "/leads",
          tone: "brand",
        },
        {
          title: t(locale, "Ù…Ø±ÙƒØ² Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª", "Action center"),
          description: t(locale, "Ø´Ø§Ù‡Ø¯ ÙƒÙ„ Ø§Ù„Ø¹Ù†Ø§ØµØ± Ø§Ù„Ø­Ø±Ø¬Ø© ÙˆØ§Ù„ØªÙ†ÙÙŠØ°ÙŠØ© ÙÙŠ Ù…ÙƒØ§Ù† ÙˆØ§Ø­Ø¯", "See all critical and operational items in one place"),
          href: "/action-center",
          tone: "warning",
        },
        {
          title: t(locale, "Ø§Ù„ØªØ­ØµÙŠÙ„ ÙˆØ§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª", "Collections & payments"),
          description: t(locale, "Ø£ØºÙ„Ù‚ Ø§Ù„Ù…ØªØ£Ø®Ø±Ø§Øª ÙˆØ§Ø±ÙØ¹ Ù…Ø¹Ø¯Ù„ Ø§Ù„ØªØ­ØµÙŠÙ„", "Close overdue balances and improve collection rate"),
          href: "/payments",
          tone: "success",
        },
        {
          title: t(locale, "Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„ØªÙ†ÙÙŠØ°ÙŠØ©", "Executive reports"),
          description: t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø³Ø±Ø¹Ø©ØŒ Ø§Ù„Ù‚Ù…Ø¹ØŒ ÙˆØ§Ù„ÙØ±Øµ Ø§Ù„Ø¶Ø§Ø¦Ø¹Ø©", "Review velocity, funnel, and missed opportunities"),
          href: "/reports",
          tone: "info",
        },
      ]
    : isOps
      ? [
          {
            title: t(locale, "Ù…Ø±ÙƒØ² Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª", "Action center"),
            description: t(locale, "Ø§ÙØªØ­ Ø§Ù„Ù…Ù‡Ø§Ù… Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠØ© Ø§Ù„Ø¹Ø§Ø¬Ù„Ø© ÙÙŠ Ø´Ø§Ø´Ø© ÙˆØ§Ø­Ø¯Ø©", "Open urgent operational tasks in one screen"),
            href: "/action-center",
            tone: "warning",
          },
          {
            title: t(locale, "Ø§Ù„Ø·Ù„Ø§Ø¨", "Students"),
            description: t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„Ù…Ø¹Ø±Ø¶ÙŠÙ† Ù„Ù„Ø®Ø·Ø± ÙˆØ§Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ©", "Review at-risk and trial students"),
            href: "/students",
            tone: "brand",
          },
          {
            title: t(locale, "Ø§Ù„Ø¬Ø¯ÙˆÙ„", "Schedule"),
            description: t(locale, "Ø±Ø§Ø¬Ø¹ Ø¬Ù„Ø³Ø§Øª Ø§Ù„ÙŠÙˆÙ… ÙˆØ§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ† Ø§Ù„Ù…Ø±ØªØ¨Ø·ÙŠÙ†", "Review today's sessions and linked teachers"),
            href: "/schedule",
            tone: "info",
          },
          {
            title: t(locale, "Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª", "Payments"),
            description: t(locale, "ØªØ§Ø¨Ø¹ Ø§Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„Ù…ØªØ£Ø®Ø±Ø© ÙˆØ§Ù„Ù…Ø³ØªØ­Ù‚Ø© Ø§Ù„ÙŠÙˆÙ…", "Follow overdue and due-today payments"),
            href: "/payments",
            tone: "success",
          },
        ]
      : [
          {
            title: t(locale, "Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ù…Ø­ØªÙ…Ù„ÙˆÙ†", "Leads"),
            description: t(locale, "Ø­Ø¯Ù‘Ø« Ø§Ù„Ù…Ø±Ø§Ø­Ù„ ÙˆØ³Ø¬Ù‘Ù„ Ø¢Ø®Ø± ØªÙˆØ§ØµÙ„", "Update stages and capture the latest contact"),
            href: "/leads",
            tone: "brand",
          },
          {
            title: t(locale, "Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø§Øª", "Follow-ups"),
            description: t(locale, "Ø£ØºÙ„Ù‚ Ø§Ù„Ù…Ù‡Ø§Ù… Ø§Ù„Ù…ÙØªÙˆØ­Ø© Ù‚Ø¨Ù„ Ù†Ù‡Ø§ÙŠØ© Ø§Ù„ÙŠÙˆÙ…", "Close open tasks before the day ends"),
            href: "/follow-ups",
            tone: "warning",
          },
          {
            title: t(locale, "Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª", "Payments"),
            description: t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„Ù…Ø¹Ù„Ù‚Ø© ÙˆØ§Ù„Ù…ØªØ£Ø®Ø±Ø©", "Review pending and overdue payments"),
            href: "/payments",
            tone: "success",
          },
        ];

  const recommendations = [
    !isOps && overdueFollowUps > 0 ? t(locale, "Ø§Ø¨Ø¯Ø£ Ù…Ù† Ù…Ø±ÙƒØ² Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ù„Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø§Øª Ø§Ù„Ù…ØªØ£Ø®Ø±Ø© Ø£ÙˆÙ„Ø§Ù‹", "Start from the action center to close overdue follow-ups first") : null,
    overduePaymentsCount > 0 ? t(locale, "Ø£Ø±Ø³Ù„ ØªØ°ÙƒÙŠØ±Ø§Øª Ø¯ÙØ¹ Ù…Ø±ÙƒØ²Ø© Ù„Ù„Ø¹Ø§Ø¦Ù„Ø§Øª Ø§Ù„Ù…ØªØ£Ø®Ø±Ø© Ø§Ù„ÙŠÙˆÙ…", "Send focused payment reminders to overdue families today") : null,
    !isOps && trialNoShows > 0 ? t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø­ØµØµ Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ© ØºÙŠØ± Ø§Ù„Ù…Ø¤ÙƒØ¯Ø© Ù„ØªÙ‚Ù„ÙŠÙ„ Ø§Ù„Ù€ no-show", "Review unconfirmed trial sessions to reduce no-shows") : null,
    !isOps && leadsMissingFollowUp > 0 ? t(locale, "Ø£Ø¶Ù Ù…ÙˆØ§Ø¹ÙŠØ¯ Ù…ØªØ§Ø¨Ø¹Ø© Ù„Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ù…ÙØªÙˆØ­ÙŠÙ† Ø­ØªÙ‰ Ù„Ø§ ÙŠØªØ³Ø±Ø¨ÙˆØ§ Ù…Ù† Ø§Ù„Ù‚Ù…Ø¹", "Add follow-up dates for open leads so they do not leak from the funnel") : null,
    isOps && atRiskStudents > 0 ? t(locale, "Ø§Ø¨Ø¯Ø£ Ø¨Ø§Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„Ù…Ø¹Ø±Ø¶ÙŠÙ† Ù„Ù„Ø®Ø·Ø± Ù„Ø£Ù†Ù‡Ù… Ø£Ù‚Ø±Ø¨ Ø®Ø³Ø§Ø±Ø© ØªØ´ØºÙŠÙ„ÙŠØ© Ø§Ù„Ø¢Ù†", "Start with at-risk students because they are the nearest operational risk right now") : null,
    isOps && scheduleOverview.sessionsCount > 0 ? t(locale, "Ø±Ø§Ø¬Ø¹ Ø¬Ø¯ÙˆÙ„ Ø§Ù„ÙŠÙˆÙ… ÙˆØªØ£ÙƒØ¯ Ù…Ù† Ø§ÙƒØªÙ…Ø§Ù„ Ø§Ù„Ø±Ø¨Ø· Ø¨ÙŠÙ† Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ† ÙˆØ§Ù„Ø·Ù„Ø§Ø¨", "Review today's schedule and confirm teacher-student assignment completeness") : null,
    sessions.length === 0 ? t(locale, "Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¬Ù„Ø³Ø§Øª Ù…Ø³Ø¬Ù„Ø© Ø­Ø§Ù„ÙŠØ§Ù‹ØŒ Ø±Ø§Ø¬Ø¹ Ø±Ø¨Ø· Ø§Ù„Ø¬Ø¯Ø§ÙˆÙ„ Ø¨Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª", "No sessions are registered right now, review schedule data mapping") : null,
  ].filter((item): item is string => Boolean(item));

  return {
    managementStats: isOps
      ? [
          {
            label: t(locale, "Ø·Ù„Ø§Ø¨ Ù†Ø´Ø·ÙˆÙ†", "Active students"),
            value: activeStudents.toLocaleString("en-US"),
            change: trialStudents > 0 ? `+${trialStudents}` : "0",
            bg: "#4F46E5",
          },
          {
            label: t(locale, "Ø¬Ù„Ø³Ø§Øª Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹", "Weekly sessions"),
            value: scheduleOverview.sessionsCount.toLocaleString("en-US"),
            change: scheduleOverview.uniqueTeachers > 0 ? `+${scheduleOverview.uniqueTeachers}` : "0",
            bg: "#8B5CF6",
          },
          {
            label: t(locale, "Ø¥ÙŠØ±Ø§Ø¯ Ø§Ù„Ø´Ù‡Ø±", "Monthly revenue"),
            value: formatCurrencyEgp(monthlyRevenue, locale),
            change: monthlyRevenue > 0 ? t(locale, "+Ù…Ø­Ø³ÙˆØ¨", "+Calculated") : "0",
            bg: "#10B981",
          },
          {
            label: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"),
            value: atRiskStudents.toLocaleString("en-US"),
            change: atRiskStudents > 0 ? t(locale, "+Ù…Ù‡Ù…", "+Important") : "0",
            bg: "#0D9488",
          },
        ]
      : [
          {
            label: t(locale, "Ø·Ù„Ø§Ø¨ Ù†Ø´Ø·ÙˆÙ†", "Active students"),
            value: activeStudents.toLocaleString("en-US"),
            change: recentLeads > 0 ? `+${recentLeads}` : "0",
            bg: "#4F46E5",
          },
          {
            label: t(locale, "Ø¹Ù…Ù„Ø§Ø¡ Ø¬Ø¯Ø¯", "New leads"),
            value: recentLeads.toLocaleString("en-US"),
            change: recentLeads > 0 ? t(locale, "+Ù†Ø´Ø·", "+Active") : "0",
            bg: "#8B5CF6",
          },
          {
            label: t(locale, "Ø¥ÙŠØ±Ø§Ø¯ Ø§Ù„Ø´Ù‡Ø±", "Monthly revenue"),
            value: formatCurrencyEgp(monthlyRevenue, locale),
            change: monthlyRevenue > 0 ? t(locale, "+Ù…Ø­Ø³ÙˆØ¨", "+Calculated") : "0",
            bg: "#10B981",
          },
          {
            label: getConversionTerm("conversionRate", locale),
            value: `${conversionRate}%`,
            change: conversionRate > 0 ? t(locale, "+Ù…Ø­Ø¯Ø«", "+Updated") : "0",
            bg: "#0D9488",
          },
        ],
    secondaryStats: isOps
      ? [
          { label: t(locale, "Ø¬Ù„Ø³Ø§Øª Ø§Ù„ÙŠÙˆÙ…", "Today's sessions"), value: sessions.length.toLocaleString("en-US"), icon: "calendar", bg: "#EFF6FF", color: "#2563EB" },
          { label: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"), value: atRiskStudents.toLocaleString("en-US"), icon: "warning", bg: "#FEF2F2", color: "#DC2626" },
          { label: t(locale, "Ø·Ù„Ø§Ø¨ ØªØ¬Ø±ÙŠØ¨ÙŠÙˆÙ†", "Trial students"), value: trialStudents.toLocaleString("en-US"), icon: "clock", bg: "#FFFBEB", color: "#D97706" },
          { label: t(locale, "Ù…Ø¯ÙÙˆØ¹Ø§Øª Ù…Ø¹Ù„Ù‚Ø©", "Pending payments"), value: pendingPaymentsCount.toLocaleString("en-US"), icon: "wallet", bg: "#F5F3FF", color: "#7C3AED" },
        ]
      : [
          { label: t(locale, "Ø³ÙŠØ´Ù† ØªØ¬Ø±ÙŠØ¨ÙŠØ©", "Trial sessions"), value: bookedTrials.toLocaleString("en-US"), icon: "calendar", bg: "#EFF6FF", color: "#2563EB" },
          { label: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"), value: atRiskStudents.toLocaleString("en-US"), icon: "warning", bg: "#FEF2F2", color: "#DC2626" },
          { label: t(locale, "Ù…ØªØ§Ø¨Ø¹Ø§Øª Ù…ØªØ£Ø®Ø±Ø©", "Overdue follow-ups"), value: overdueFollowUps.toLocaleString("en-US"), icon: "clock", bg: "#FFFBEB", color: "#D97706" },
          { label: t(locale, "Ù…Ø¯ÙÙˆØ¹Ø§Øª Ù…Ø¹Ù„Ù‚Ø©", "Pending payments"), value: pendingPaymentsCount.toLocaleString("en-US"), icon: "wallet", bg: "#F5F3FF", color: "#7C3AED" },
        ],
    alerts,
    funnel: isOps
      ? [
          {
            label: t(locale, "Ù†Ø´Ø·", "Active"),
            value: activeStudents,
            pct: `${Math.round((activeStudents / opsFunnelBase) * 100)}%`,
            color: "#4F46E5",
          },
          {
            label: t(locale, "ØªØ¬Ø±ÙŠØ¨ÙŠ", "Trial"),
            value: trialStudents,
            pct: `${Math.round((trialStudents / opsFunnelBase) * 100)}%`,
            color: "#F59E0B",
          },
          {
            label: t(locale, "Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "At risk"),
            value: atRiskStudents,
            pct: `${Math.round((atRiskStudents / opsFunnelBase) * 100)}%`,
            color: "#EF4444",
          },
          {
            label: t(locale, "Ù…ÙƒØªÙ…Ù„", "Completed"),
            value: students.filter((student) => student.status === "completed").length,
            pct: `${Math.round((students.filter((student) => student.status === "completed").length / opsFunnelBase) * 100)}%`,
            color: "#10B981",
          },
        ]
      : (["new", "qualified", "trial_proposed", "trial_booked", "trial_attended", "won"] as const).map((stage) => {
          const count = leads.filter((lead) => lead.stage === stage).length;
          return {
            label: locale === "ar" ? STAGE_CONFIGS[stage].labelAr : STAGE_CONFIGS[stage].labelEn,
            value: count,
            pct: `${Math.round((count / salesFunnelBase) * 100)}%`,
            color: STAGE_CONFIGS[stage].color,
          };
        }),
    followUps: employeeTasks,
    operations,
    quickActions,
    recommendations,
  };
}

export function getDashboardTaskLabel(status: keyof typeof DASHBOARD_TASK_STATUS_META, locale: Locale): string {
  const meta = DASHBOARD_TASK_STATUS_META[status];
  return locale === "ar" ? meta.label : meta.labelEn;
}

export function getDashboardOperationToneStyles(tone: DashboardOperationItem["tone"]): { bg: string; color: string } {
  return {
    bg: getToneBg(tone),
    color:
      tone === "danger"
        ? "#DC2626"
        : tone === "warning"
          ? "#D97706"
          : tone === "success"
            ? "#059669"
            : tone === "info"
              ? "#2563EB"
              : "#4338CA",
  };
}
