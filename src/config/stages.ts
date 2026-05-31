import { STAGE_LABELS } from "@/config/labels";
import type { LeadStage } from "@/types/common.types";

export interface StageConfig {
  key: LeadStage;
  labelAr: string;
  labelEn: string;
  color: string;
  bgColor: string;
  textColor: string;
  order: number;
}

export const STAGE_CONFIGS: Record<LeadStage, StageConfig> = {
  new:            { key: "new",            labelAr: STAGE_LABELS.new,            labelEn: "New",            color: "border-brand-200",   bgColor: "bg-brand-50",   textColor: "text-brand-600",   order: 1 },
  qualified:      { key: "qualified",      labelAr: STAGE_LABELS.qualified,      labelEn: "Interested",     color: "border-brand-200",   bgColor: "bg-brand-50",   textColor: "text-brand-600",   order: 2 },
  trial_proposed: { key: "trial_proposed", labelAr: STAGE_LABELS.trial_proposed, labelEn: "Trial Proposed", color: "border-danger-200",  bgColor: "bg-danger-50",  textColor: "text-danger-600",  order: 3 },
  trial_booked:   { key: "trial_booked",   labelAr: STAGE_LABELS.trial_booked,   labelEn: "Trial Booked",   color: "border-warning-200", bgColor: "bg-warning-50", textColor: "text-warning-600", order: 4 },
  trial_attended: { key: "trial_attended", labelAr: STAGE_LABELS.trial_attended, labelEn: "Trial Attended", color: "border-success-200", bgColor: "bg-success-50", textColor: "text-success-600", order: 5 },
  offer_sent:     { key: "offer_sent",     labelAr: STAGE_LABELS.offer_sent,     labelEn: "Offer Sent",     color: "border-info-200",    bgColor: "bg-info-50",    textColor: "text-info-600",    order: 6 },
  won:            { key: "won",            labelAr: STAGE_LABELS.won,            labelEn: "Won",            color: "border-success-200", bgColor: "bg-success-50", textColor: "text-success-600", order: 7 },
  lost:           { key: "lost",           labelAr: STAGE_LABELS.lost,           labelEn: "Lost",           color: "border-danger-200",  bgColor: "bg-danger-50",  textColor: "text-danger-600",  order: 8 },
};

export const PIPELINE_STAGES: LeadStage[] = ["new","qualified","trial_proposed","trial_booked","trial_attended","offer_sent","won","lost"];
export const KANBAN_STAGES: LeadStage[]   = ["new","qualified","trial_proposed","trial_booked","trial_attended","offer_sent"];

export const NEXT_STAGE_MAP: Partial<Record<LeadStage, LeadStage[]>> = {
  new:            ["qualified", "lost"],
  qualified:      ["trial_proposed", "lost"],
  trial_proposed: ["trial_booked", "lost"],
  trial_booked:   ["trial_attended", "trial_proposed", "lost"],
  trial_attended: ["offer_sent", "lost"],
  offer_sent:     ["won", "lost"],
  won:            [],
  lost:           ["new"],
};

export function getStageConfig(stage: LeadStage): StageConfig {
  return STAGE_CONFIGS[stage];
}