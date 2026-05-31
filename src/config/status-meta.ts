import {
  PRIORITY_EN_LABELS,
  PRIORITY_LABELS,
  STUDENT_STATUS_EN_LABELS,
  STUDENT_STATUS_LABELS,
  TEMPERATURE_EN_LABELS,
  TEMPERATURE_LABELS,
} from "@/config/labels";
import type { LeadTemperature, Priority, StudentStatus } from "@/types/common.types";
import type { Locale } from "@/types/common.types";

export type FollowUpStatus = "pending" | "completed" | "overdue";
export type DashboardTaskStatus = "pending" | "completed" | "urgent" | "new";

export const TEMPERATURE_META: Record<
  LeadTemperature,
  { label: string; labelEn: string; color: string; bg: string }
> = {
  hot:  { label: TEMPERATURE_LABELS.hot,  labelEn: TEMPERATURE_EN_LABELS.hot,  color: "text-danger-600",  bg: "bg-danger-50"  },
  warm: { label: TEMPERATURE_LABELS.warm, labelEn: TEMPERATURE_EN_LABELS.warm, color: "text-warning-600", bg: "bg-warning-50" },
  cold: { label: TEMPERATURE_LABELS.cold, labelEn: TEMPERATURE_EN_LABELS.cold, color: "text-info-600",    bg: "bg-info-50"    },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; labelEn: string; color: string; bg: string; textClass: string }
> = {
  urgent: { label: PRIORITY_LABELS.urgent, labelEn: PRIORITY_EN_LABELS.urgent, color: "text-danger-600",      bg: "bg-danger-50",  textClass: "text-danger-600"      },
  high:   { label: PRIORITY_LABELS.high,   labelEn: PRIORITY_EN_LABELS.high,   color: "text-warning-600",     bg: "bg-warning-50", textClass: "text-warning-600"     },
  medium: { label: PRIORITY_LABELS.medium, labelEn: PRIORITY_EN_LABELS.medium, color: "text-brand-600",       bg: "bg-brand-50",   textClass: "text-brand-600"       },
  low:    { label: PRIORITY_LABELS.low,    labelEn: PRIORITY_EN_LABELS.low,    color: "text-muted-foreground", bg: "bg-muted",     textClass: "text-muted-foreground" },
};

export const STUDENT_STATUS_META: Record<
  StudentStatus,
  { label: string; labelEn: string; color: string; bg: string }
> = {
  trial:     { label: STUDENT_STATUS_LABELS.trial,     labelEn: STUDENT_STATUS_EN_LABELS.trial,     color: "text-warning-600",      bg: "bg-warning-50" },
  active:    { label: STUDENT_STATUS_LABELS.active,    labelEn: STUDENT_STATUS_EN_LABELS.active,    color: "text-success-600",      bg: "bg-success-50" },
  paused:    { label: STUDENT_STATUS_LABELS.paused,    labelEn: STUDENT_STATUS_EN_LABELS.paused,    color: "text-muted-foreground", bg: "bg-muted"      },
  at_risk:   { label: STUDENT_STATUS_LABELS.at_risk,   labelEn: STUDENT_STATUS_EN_LABELS.at_risk,   color: "text-danger-600",       bg: "bg-danger-50"  },
  completed: { label: STUDENT_STATUS_LABELS.completed, labelEn: STUDENT_STATUS_EN_LABELS.completed, color: "text-info-600",         bg: "bg-info-50"    },
  churned:   { label: STUDENT_STATUS_LABELS.churned,   labelEn: STUDENT_STATUS_EN_LABELS.churned,   color: "text-danger-600",       bg: "bg-danger-50"  },
};

export const FOLLOW_UP_STATUS_META: Record<
  FollowUpStatus,
  { label: string; labelEn: string; color: string; bg: string; border?: string }
> = {
  pending:   { label: "قيد التنفيذ", labelEn: "Pending",   color: "text-brand-600",   bg: "bg-brand-50"   },
  completed: { label: "مكتملة",      labelEn: "Completed", color: "text-success-600", bg: "bg-success-50" },
  overdue:   { label: "متأخرة",      labelEn: "Overdue",   color: "text-danger-600",  bg: "bg-danger-50", border: "border-danger-200" },
};

export const DASHBOARD_TASK_STATUS_META: Record<
  DashboardTaskStatus,
  { label: string; labelEn: string; color: string; bg: string }
> = {
  pending:   { label: "معلّق",                          labelEn: "Pending",   color: "text-brand-600",   bg: "bg-brand-50"   },
  completed: { label: "مكتملة",                         labelEn: "Completed", color: "text-success-600", bg: "bg-success-50" },
  urgent:    { label: PRIORITY_LABELS.urgent,            labelEn: PRIORITY_EN_LABELS.urgent, color: "text-danger-600", bg: "bg-danger-50" },
  new:       { label: "جديد",                           labelEn: "New",       color: "text-info-600",    bg: "bg-info-50"    },
};

export function getMetaLabel<T extends { label: string; labelEn: string }>(meta: T, locale: Locale): string {
  return locale === "ar" ? meta.label : meta.labelEn;
}