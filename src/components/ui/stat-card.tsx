import * as React from "react";
import { cn } from "@/lib/utils";

type StatTone = "brand" | "success" | "warning" | "danger" | "info" | "neutral";

const TONE_CLASSES: Record<StatTone, string> = {
  brand:
    "bg-[var(--color-brand-50)] text-[var(--color-brand-700)] border-[var(--color-brand-100)]",
  success:
    "bg-[var(--color-success-50)] text-[var(--color-success-700)] border-[var(--color-success-100)]",
  warning:
    "bg-[var(--color-warning-50)] text-[var(--color-warning-700)] border-[var(--color-warning-100)]",
  danger:
    "bg-[var(--color-danger-50)] text-[var(--color-danger-700)] border-[var(--color-danger-100)]",
  info:
    "bg-[var(--color-info-50)] text-[var(--color-info-700)] border-[var(--color-info-100)]",
  neutral: "bg-muted text-foreground border-border",
};

export interface StatCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  tone?: StatTone;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  tone = "neutral",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 shadow-xs transition-colors",
        TONE_CLASSES[tone],
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium opacity-80">{label}</span>
        {icon ? <span className="opacity-70">{icon}</span> : null}
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums" data-numeric>
        {value}
      </div>
    </div>
  );
}