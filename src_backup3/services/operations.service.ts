
import { formatCurrencyEgp, formatDate } from "@/lib/formatters";
import { getDayLabel, t } from "@/lib/locale";
import { listFollowUps } from "@/services/follow-ups.service";
import { listLeads } from "@/services/leads.service";
import { getPaymentsSummary, listPayments } from "@/services/payments.service";
import { getScheduleOverview, listScheduleSessions } from "@/services/schedule.service";
import { listStudents } from "@/services/students.service";
import type {
  ActionCenterData,
  ActionCenterItem,
  ActionCenterMetric,
  AppNotificationItem,
  DashboardContext,
} from "@/types/crm";
import type { Locale } from "@/types/common.types";

function isManagementRole(role: DashboardContext["role"]): boolean {
  return role === "admin" || role === "owner";
}

function isSalesRole(role: DashboardContext["role"]): boolean {
  return role === "sales";
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


export function getActionToneStyles(priority: ActionCenterItem["priority"]): { bg: string; color: string; border: string } {
  switch (priority) {
    case "critical":
      return { bg: "#FEF2F2", color: "#DC2626", border: "#FCA5A5" };
    case "high":
      return { bg: "#FFFBEB", color: "#D97706", border: "#FCD34D" };
    case "medium":
      return { bg: "#EEF2FF", color: "#4338CA", border: "#C7D2FE" };
    default:
      return { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" };
  }
}

export async function getActionCenterData(
  context: DashboardContext,
  locale: Locale = "ar",
): Promise<ActionCenterData> {
  const [leads, followUps, students, payments, paymentsSummary, sessions, scheduleOverview] = await Promise.all([
    listLeads(),
    listFollowUps(),
    listStudents(),
    listPayments(),
    getPaymentsSummary(),
    listScheduleSessions(),
    getScheduleOverview(),
  ]);

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayDay = new Date().getDay();

  const scopedFollowUps = isManagementRole(context.role)
    ? followUps
    : followUps.filter((item) => matchesAssignee(item.assignedTo, context));

  const overdueFollowUps = scopedFollowUps.filter((item) => item.status === "overdue");
  const dueTodayFollowUps = scopedFollowUps.filter((item) => {
    if (item.status === "completed") return false;
    return item.scheduledAt.slice(0, 10) === todayIso;
  });

  const scopedLeads = isManagementRole(context.role)
    ? leads
    : isSalesRole(context.role)
      ? leads.filter((lead) => matchesAssignee(lead.assignedToName, context))
      : [];

  const leadsWithoutFollowUp = scopedLeads.filter(
    (lead) => lead.stage !== "won" && lead.stage !== "lost" && !lead.nextFollowUpAt,
  );
  const trialBookedStale = scopedLeads.filter((lead) => lead.stage === "trial_booked" && !lead.nextFollowUpAt);

  const overduePayments = payments.filter((payment) => payment.status === "overdue");
  const dueTodayPayments = payments.filter(
    (payment) => payment.status === "pending" && payment.dueDate.slice(0, 10) === todayIso,
  );

  const atRiskStudents = students.filter((student) => student.status === "at_risk");
  const dueTodayTrials = students.filter((student) => student.status === "trial");
  const todaySessions = sessions.filter((session) => session.day === todayDay);

  const critical: ActionCenterItem[] = [];
  const mediumPriority: ActionCenterItem[] = [];
  const informational: ActionCenterItem[] = [];

  if (!isOpsRole(context.role)) {
    critical.push(
      ...overdueFollowUps.map((item) => ({
        id: `follow-up-overdue-${item.id}`,
        title: t(locale, `Ù…ØªØ§Ø¨Ø¹Ø© Ù…ØªØ£Ø®Ø±Ø©: ${item.leadName}`, `Overdue follow-up: ${item.leadName}`),
        description: t(locale, item.title, item.title),
        href: item.leadId ? `/leads/${item.leadId}` : "/follow-ups",
        category: "follow_up" as const,
        priority: "critical" as const,
        owner: item.assignedTo,
        meta: formatDate(item.scheduledAt, locale),
      })),
    );

    mediumPriority.push(
      ...dueTodayFollowUps.map((item) => ({
        id: `follow-up-today-${item.id}`,
        title: t(locale, `Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ÙŠÙˆÙ…: ${item.leadName}`, `Today follow-up: ${item.leadName}`),
        description: t(locale, item.title, item.title),
        href: item.leadId ? `/leads/${item.leadId}` : "/follow-ups",
        category: "follow_up" as const,
        priority: "high" as const,
        owner: item.assignedTo,
        meta: formatDate(item.scheduledAt, locale),
      })),
      ...leadsWithoutFollowUp.map((lead) => ({
        id: `lead-missing-next-${lead.id}`,
        title: t(locale, `Ø¹Ù…ÙŠÙ„ Ø¨Ù„Ø§ Ù…ØªØ§Ø¨Ø¹Ø© Ù‚Ø§Ø¯Ù…Ø©: ${lead.childName}`, `Lead without next follow-up: ${lead.childName}`),
        description: t(locale, `${lead.parentName} â€¢ ${lead.parentPhone}`, `${lead.parentName} â€¢ ${lead.parentPhone}`),
        href: `/leads/${lead.id}`,
        category: "lead" as const,
        priority: "high" as const,
        owner: lead.assignedToName,
        meta: t(locale, "ØºÙŠØ± Ù…Ø­Ø¯Ø¯", "Not scheduled"),
      })),
      ...trialBookedStale.map((lead) => ({
        id: `trial-stale-${lead.id}`,
        title: t(locale, `Ø³ÙŠØ´Ù† ØªØ¬Ø±ÙŠØ¨ÙŠØ© ØªØ­ØªØ§Ø¬ ØªØ£ÙƒÙŠØ¯: ${lead.childName}`, `Trial session needs confirmation: ${lead.childName}`),
        description: t(locale, `${lead.parentName} â€¢ ${lead.assignedToName}`, `${lead.parentName} â€¢ ${lead.assignedToName}`),
        href: `/leads/${lead.id}`,
        category: "lead" as const,
        priority: "medium" as const,
        owner: lead.assignedToName,
      })),
    );
  }

  critical.push(
    ...overduePayments.map((payment) => ({
      id: `payment-overdue-${payment.id}`,
      title: t(locale, `Ø¯ÙØ¹Ø© Ù…ØªØ£Ø®Ø±Ø©: ${payment.parentName}`, `Overdue payment: ${payment.parentName}`),
      description: t(locale, `${payment.studentName} â€¢ ${formatCurrencyEgp(payment.amount, locale)}`, `${payment.studentName} â€¢ ${formatCurrencyEgp(payment.amount, locale)}`),
      href: `/payments/${payment.id}`,
      category: "payment" as const,
      priority: "critical" as const,
      meta: formatDate(payment.dueDate, locale),
    })),
    ...atRiskStudents.map((student) => ({
      id: `student-risk-${student.id}`,
      title: t(locale, `Ø·Ø§Ù„Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©: ${student.fullName}`, `Student at risk: ${student.fullName}`),
      description: t(locale, `${student.parentName} â€¢ ${student.className ?? "Ø¨Ø¯ÙˆÙ† Ù…Ø¬Ù…ÙˆØ¹Ø©"}`, `${student.parentName} â€¢ ${student.className ?? "No group"}`),
      href: `/students/${student.id}`,
      category: "student" as const,
      priority: "high" as const,
      meta: student.currentCourse ?? undefined,
    })),
  );

  mediumPriority.push(
    ...dueTodayPayments.map((payment) => ({
      id: `payment-today-${payment.id}`,
      title: t(locale, `Ø§Ø³ØªØ­Ù‚Ø§Ù‚ Ø§Ù„ÙŠÙˆÙ…: ${payment.parentName}`, `Due today: ${payment.parentName}`),
      description: t(locale, `${payment.studentName} â€¢ ${formatCurrencyEgp(payment.amount, locale)}`, `${payment.studentName} â€¢ ${formatCurrencyEgp(payment.amount, locale)}`),
      href: `/payments/${payment.id}`,
      category: "payment" as const,
      priority: "medium" as const,
      meta: formatDate(payment.dueDate, locale),
    })),
    ...dueTodayTrials.map((student) => ({
      id: `trial-student-${student.id}`,
      title: t(locale, `Ø·Ø§Ù„Ø¨ ØªØ¬Ø±ÙŠØ¨ÙŠ ÙŠØ­ØªØ§Ø¬ Ù…ØªØ§Ø¨Ø¹Ø©: ${student.fullName}`, `Trial student needs follow-up: ${student.fullName}`),
      description: t(locale, `${student.parentName} â€¢ ${student.currentCourse ?? "Ø¨Ø¯ÙˆÙ† ÙƒÙˆØ±Ø³"}`, `${student.parentName} â€¢ ${student.currentCourse ?? "No course"}`),
      href: `/students/${student.id}`,
      category: "student" as const,
      priority: "medium" as const,
    })),
  );

  informational.push(
    ...todaySessions.map((session) => ({
      id: `session-${session.id}`,
      title: t(locale, `Ø¬Ù„Ø³Ø© Ø§Ù„ÙŠÙˆÙ…: ${session.className}`, `Today's session: ${session.className}`),
      description: t(locale, `${session.teacher} â€¢ ${session.startTime} - ${session.endTime}`, `${session.teacher} â€¢ ${session.startTime} - ${session.endTime}`),
      href: `/schedule/${session.id}`,
      category: "schedule" as const,
      priority: "info" as const,
      meta: getDayLabel(session.day, locale),
    })),
  );

  const metrics: ActionCenterMetric[] = isOpsRole(context.role)
    ? [
        {
          label: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"),
          value: atRiskStudents.length.toLocaleString("en-US"),
          tone: atRiskStudents.length > 0 ? "warning" : "success",
        },
        {
          label: t(locale, "Ù…Ø¯ÙÙˆØ¹Ø§Øª Ù…ØªØ£Ø®Ø±Ø©", "Overdue payments"),
          value: overduePayments.length.toLocaleString("en-US"),
          tone: overduePayments.length > 0 ? "danger" : "success",
        },
        {
          label: t(locale, "Ø¬Ù„Ø³Ø§Øª Ø§Ù„ÙŠÙˆÙ…", "Today's sessions"),
          value: todaySessions.length.toLocaleString("en-US"),
          tone: "info",
        },
        {
          label: t(locale, "Ø­Ù…ÙˆÙ„Ø© Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹", "Weekly load"),
          value: scheduleOverview.sessionsCount.toLocaleString("en-US"),
          tone: "brand",
        },
      ]
    : [
        {
          label: t(locale, "Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ø­Ø±Ø¬Ø©", "Critical actions"),
          value: critical.length.toLocaleString("en-US"),
          tone: critical.length > 0 ? "danger" : "success",
        },
        {
          label: t(locale, "ØªØ­ØµÙŠÙ„ Ø§Ù„Ø´Ù‡Ø±", "Collection rate"),
          value: `${paymentsSummary.collectionRate}%`,
          tone: paymentsSummary.collectionRate >= 80 ? "success" : paymentsSummary.collectionRate >= 60 ? "warning" : "danger",
        },
        {
          label: t(locale, "Ø¬Ù„Ø³Ø§Øª Ø§Ù„ÙŠÙˆÙ…", "Today's sessions"),
          value: todaySessions.length.toLocaleString("en-US"),
          tone: "info",
        },
        {
          label: t(locale, "Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ù…ÙØªÙˆØ­ÙˆÙ† Ø¨Ù„Ø§ Ù…ØªØ§Ø¨Ø¹Ø©", "Open leads without follow-up"),
          value: leadsWithoutFollowUp.length.toLocaleString("en-US"),
          tone: leadsWithoutFollowUp.length > 0 ? "warning" : "success",
        },
      ];

  const notifications: AppNotificationItem[] = [...critical, ...mediumPriority]
    .slice(0, 6)
    .map((item, index) => ({
      id: item.id,
      title: item.title,
      timeLabel: item.meta ?? t(locale, "Ø§Ù„Ø¢Ù†", "Now"),
      href: item.href,
      type: item.priority === "critical" ? "warning" : item.priority === "high" ? "warning" : item.priority === "medium" ? "info" : "success",
      readDefault: index > 1,
    }));

  if (notifications.length === 0) {
    notifications.push({
      id: "healthy-system",
      title: t(locale, "Ù„Ø§ ØªÙˆØ¬Ø¯ ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ø­Ø±Ø¬Ø© Ø§Ù„Ø¢Ù†", "No urgent alerts right now"),
      timeLabel: t(locale, "Ø§Ù„Ø¢Ù†", "Now"),
      href: "/action-center",
      type: "success",
      readDefault: false,
    });
  }

  return {
    metrics,
    critical: critical.slice(0, 12),
    mediumPriority: mediumPriority.slice(0, 16),
    informational: informational.slice(0, 8),
    notifications,
  };
}
