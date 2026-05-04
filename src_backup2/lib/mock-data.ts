import type {
  CourseType,
  LeadSource,
  LeadStage,
  LeadTemperature,
  StudentStatus,
} from "@/types/common.types";
import type { FollowUpItem, LeadActivityItem } from "@/types/crm";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Production safety guard
// This module contains demo/seed data and must never silently leak
// into a real customer environment. If anything imports this file in
// a production build, log a loud warning so it shows up in monitoring.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_ALLOW_DEMO_FALLBACK === "true"
) {
  console.warn(
    "[mock-data] WARNING: demo fallback is enabled in a production build. " +
      "Set NEXT_PUBLIC_ALLOW_DEMO_FALLBACK to false or remove it before client delivery.",
  );
}

export interface MockLead {
  id: string;
  parentName: string;
  parentPhone: string;
  childName: string;
  childAge: number;
  stage: LeadStage;
  temperature: LeadTemperature;
  source: LeadSource;
  suggestedCourse: CourseType | null;
  assignedTo: string;
  assignedToName: string;
  lastContactAt: string | null;
  nextFollowUpAt: string | null;
  notes: string | null;
  createdAt: string;
  lossReason?: null | "price";
}

export const MOCK_LEADS: MockLead[] = [
  {
    id: "1",
    parentName: "Ø£Ø­Ù…Ø¯ Ù…Ø­Ù…Ø¯",
    parentPhone: "01012345678",
    childName: "ÙŠÙˆØ³Ù",
    childAge: 10,
    stage: "new",
    temperature: "hot",
    source: "facebook_ad",
    suggestedCourse: "scratch",
    assignedTo: "1",
    assignedToName: "Ø§Ù„Ø§Ø¡",
    lastContactAt: null,
    nextFollowUpAt: "2026-04-06T10:00:00",
    notes: "Ù…Ù‡ØªÙ… Ø¬Ø¯Ø§Ù‹ â€” Ø³Ø£Ù„ Ø¹Ù† Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯",
    createdAt: "2026-04-05T08:00:00",
    lossReason: null,
  },
  {
    id: "2",
    parentName: "Ø³Ø§Ø±Ø© Ø£Ø­Ù…Ø¯",
    parentPhone: "01098765432",
    childName: "Ù…Ù„Ùƒ",
    childAge: 14,
    stage: "qualified",
    temperature: "hot",
    source: "instagram_ad",
    suggestedCourse: "python",
    assignedTo: "2",
    assignedToName: "Ø³Ù…Ø±",
    lastContactAt: "2026-04-04T14:00:00",
    nextFollowUpAt: "2026-04-06T14:00:00",
    notes: "Ø¹Ù†Ø¯Ù‡Ø§ Ù„Ø§Ø¨ØªÙˆØ¨ â€” Ù…Ù‡ØªÙ…Ø© Ø¨Ø§Ù„Ù€ AI",
    createdAt: "2026-04-03T10:00:00",
    lossReason: null,
  },
  {
    id: "3",
    parentName: "Ù…Ø­Ù…Ø¯ Ø¹Ù„ÙŠ",
    parentPhone: "01155544433",
    childName: "Ø¹Ù…Ø±",
    childAge: 8,
    stage: "trial_proposed",
    temperature: "warm",
    source: "referral",
    suggestedCourse: "scratch",
    assignedTo: "1",
    assignedToName: "Ø§Ù„Ø§Ø¡",
    lastContactAt: "2026-04-04T11:00:00",
    nextFollowUpAt: "2026-04-07T10:00:00",
    notes: "ØµØ§Ø­Ø¨ Ø£Ø­Ù…Ø¯ Ù…Ø­Ù…Ø¯ â€” referral",
    createdAt: "2026-04-02T09:00:00",
    lossReason: null,
  },
  {
    id: "4",
    parentName: "ÙØ§Ø·Ù…Ø© Ø­Ø³Ù†",
    parentPhone: "01234567890",
    childName: "Ø²ÙŠÙ†",
    childAge: 11,
    stage: "trial_booked",
    temperature: "hot",
    source: "facebook_ad",
    suggestedCourse: "scratch",
    assignedTo: "2",
    assignedToName: "Ø³Ù…Ø±",
    lastContactAt: "2026-04-05T09:00:00",
    nextFollowUpAt: "2026-04-08T16:00:00",
    notes: "Ø§Ù„Ø³ÙŠØ´Ù† Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ© ÙŠÙˆÙ… Ø§Ù„Ø«Ù„Ø§Ø«Ø§Ø¡ 4 Ù…Ø³Ø§Ø¡Ù‹",
    createdAt: "2026-04-01T12:00:00",
    lossReason: null,
  },
  {
    id: "5",
    parentName: "Ù‡Ø¯Ù‰ Ø¥Ø¨Ø±Ø§Ù‡ÙŠÙ…",
    parentPhone: "01122334455",
    childName: "Ù„ÙŠÙ„Ù‰",
    childAge: 13,
    stage: "trial_attended",
    temperature: "hot",
    source: "website",
    suggestedCourse: "python",
    assignedTo: "1",
    assignedToName: "Ø§Ù„Ø§Ø¡",
    lastContactAt: "2026-04-05T17:00:00",
    nextFollowUpAt: "2026-04-06T12:00:00",
    notes: "Ø­Ø¶Ø±Øª Ø§Ù„Ø³ÙŠØ´Ù† Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ© â€” Ø§Ù„Ù…Ø¯Ø±Ø³ Ø£Ø¹Ø¬Ø¨Ù‡Ø§ Ø¬Ø¯Ø§Ù‹",
    createdAt: "2026-03-28T08:00:00",
    lossReason: null,
  },
  {
    id: "6",
    parentName: "Ø®Ø§Ù„Ø¯ Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡",
    parentPhone: "01066778899",
    childName: "Ø¢Ø¯Ù…",
    childAge: 7,
    stage: "offer_sent",
    temperature: "warm",
    source: "group",
    suggestedCourse: "scratch",
    assignedTo: "2",
    assignedToName: "Ø³Ù…Ø±",
    lastContactAt: "2026-04-05T10:00:00",
    nextFollowUpAt: "2026-04-06T18:00:00",
    notes: "Ø£Ø±Ø³Ù„Ù†Ø§ Ø§Ù„Ø¹Ø±Ø¶ â€” ÙŠÙ†ØªØ¸Ø± Ø±Ø¯ Ø§Ù„Ø£Ø¨",
    createdAt: "2026-03-25T14:00:00",
    lossReason: null,
  },
  {
    id: "7",
    parentName: "Ù†ÙˆØ±Ø§ Ø³Ø¹ÙŠØ¯",
    parentPhone: "01199887766",
    childName: "ÙƒØ±ÙŠÙ…",
    childAge: 9,
    stage: "won",
    temperature: "hot",
    source: "facebook_ad",
    suggestedCourse: "scratch",
    assignedTo: "1",
    assignedToName: "Ø§Ù„Ø§Ø¡",
    lastContactAt: "2026-04-04T16:00:00",
    nextFollowUpAt: null,
    notes: "ØªÙ… Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ â€” Ø¨Ø¯Ø£ Ø§Ù„ÙƒÙ„Ø§Ø³",
    createdAt: "2026-03-20T10:00:00",
    lossReason: null,
  },
  {
    id: "8",
    parentName: "Ø±ÙŠÙ… Ù…Ø­Ù…ÙˆØ¯",
    parentPhone: "01033445566",
    childName: "Ø³Ù„Ù…Ù‰",
    childAge: 6,
    stage: "lost",
    temperature: "cold",
    source: "instagram_ad",
    suggestedCourse: "scratch",
    assignedTo: "2",
    assignedToName: "Ø³Ù…Ø±",
    lastContactAt: "2026-04-02T13:00:00",
    nextFollowUpAt: null,
    notes: "Ø§Ù„Ø³Ø¹Ø± Ø¹Ø§Ù„ÙŠ â€” Ù…Ø¤Ø¬Ù„ Ù„Ù„Ø´Ù‡Ø± Ø§Ù„Ø¬Ø§ÙŠ",
    createdAt: "2026-03-15T11:00:00",
    lossReason: "price",
  },
];

export const MOCK_TEAM = [
  { id: "1", name: "Ø§Ù„Ø§Ø¡", role: "sales" as const },
  { id: "2", name: "Ø³Ù…Ø±", role: "sales" as const },
  { id: "3", name: "Ù‡Ø§Ø¬Ø±", role: "ops" as const },
];

export interface MockStudent {
  id: string;
  fullName: string;
  age: number;
  parentName: string;
  parentPhone: string;
  status: StudentStatus;
  currentCourse: CourseType | null;
  className: string | null;
  enrollmentDate: string;
  sessionsAttended: number;
  totalPaid: number;
}

export interface MockParent {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
  childrenCount: number;
  children: string[];
}

export interface MockTeacher {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  specialization: CourseType[];
  employment: "full_time" | "part_time" | "freelance";
  classesCount: number;
  studentsCount: number;
  isActive: boolean;
}

export const MOCK_STUDENTS: MockStudent[] = [
  { id: "1", fullName: "ÙŠÙˆØ³Ù Ø£Ø­Ù…Ø¯", age: 10, parentName: "Ø£Ø­Ù…Ø¯ Ù…Ø­Ù…Ø¯", parentPhone: "01012345678", status: "active", currentCourse: "scratch", className: "Scratch A", enrollmentDate: "2026-03-01", sessionsAttended: 12, totalPaid: 1500 },
  { id: "2", fullName: "Ù…Ù„Ùƒ Ø³Ø§Ø±Ø©", age: 14, parentName: "Ø³Ø§Ø±Ø© Ø£Ø­Ù…Ø¯", parentPhone: "01098765432", status: "active", currentCourse: "python", className: "Python B", enrollmentDate: "2026-02-15", sessionsAttended: 18, totalPaid: 2250 },
  { id: "3", fullName: "ÙƒØ±ÙŠÙ… Ù†ÙˆØ±Ø§", age: 9, parentName: "Ù†ÙˆØ±Ø§ Ø³Ø¹ÙŠØ¯", parentPhone: "01199887766", status: "trial", currentCourse: "scratch", className: null, enrollmentDate: "2026-04-01", sessionsAttended: 1, totalPaid: 0 },
  { id: "4", fullName: "Ø³Ù„Ù…Ù‰ Ø®Ø§Ù„Ø¯", age: 11, parentName: "Ø®Ø§Ù„Ø¯ Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡", parentPhone: "01066778899", status: "at_risk", currentCourse: "scratch", className: "Scratch A", enrollmentDate: "2026-01-10", sessionsAttended: 8, totalPaid: 750 },
  { id: "5", fullName: "Ø¹Ù…Ø± Ù…Ø­Ù…Ø¯", age: 8, parentName: "Ù…Ø­Ù…Ø¯ Ø¹Ù„ÙŠ", parentPhone: "01155544433", status: "paused", currentCourse: "scratch", className: "Scratch B", enrollmentDate: "2026-02-01", sessionsAttended: 6, totalPaid: 750 },
  { id: "6", fullName: "Ù„ÙŠÙ„Ù‰ Ù‡Ø¯Ù‰", age: 13, parentName: "Ù‡Ø¯Ù‰ Ø¥Ø¨Ø±Ø§Ù‡ÙŠÙ…", parentPhone: "01122334455", status: "active", currentCourse: "python", className: "Python A", enrollmentDate: "2026-03-15", sessionsAttended: 8, totalPaid: 1500 },
];

export const MOCK_PARENTS: MockParent[] = [
  { id: "1", fullName: "Ø£Ø­Ù…Ø¯ Ù…Ø­Ù…Ø¯", phone: "01012345678", whatsapp: "01012345678", email: "ahmed@gmail.com", city: "Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©", childrenCount: 1, children: ["ÙŠÙˆØ³Ù"] },
  { id: "2", fullName: "Ø³Ø§Ø±Ø© Ø£Ø­Ù…Ø¯", phone: "01098765432", whatsapp: "01098765432", email: "sara@gmail.com", city: "Ø§Ù„Ø¥Ø³ÙƒÙ†Ø¯Ø±ÙŠØ©", childrenCount: 1, children: ["Ù…Ù„Ùƒ"] },
  { id: "3", fullName: "Ù†ÙˆØ±Ø§ Ø³Ø¹ÙŠØ¯", phone: "01199887766", whatsapp: null, email: null, city: "Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©", childrenCount: 1, children: ["ÙƒØ±ÙŠÙ…"] },
  { id: "4", fullName: "Ø®Ø§Ù„Ø¯ Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡", phone: "01066778899", whatsapp: "01066778899", email: "khaled@gmail.com", city: "Ø§Ù„Ù…Ù†ØµÙˆØ±Ø©", childrenCount: 1, children: ["Ø³Ù„Ù…Ù‰"] },
  { id: "5", fullName: "Ù…Ø­Ù…Ø¯ Ø¹Ù„ÙŠ", phone: "01155544433", whatsapp: "01155544433", email: null, city: "Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©", childrenCount: 1, children: ["Ø¹Ù…Ø±"] },
  { id: "6", fullName: "Ù‡Ø¯Ù‰ Ø¥Ø¨Ø±Ø§Ù‡ÙŠÙ…", phone: "01122334455", whatsapp: "01122334455", email: "huda@gmail.com", city: "Ø·Ù†Ø·Ø§", childrenCount: 1, children: ["Ù„ÙŠÙ„Ù‰"] },
];

export const MOCK_TEACHERS: MockTeacher[] = [
  { id: "1", fullName: "Ø£. Ù…Ø­Ù…ÙˆØ¯ Ø­Ø³Ù†", phone: "01011112222", email: "mahmoud@skidyrein.com", specialization: ["scratch"], employment: "part_time", classesCount: 3, studentsCount: 15, isActive: true },
  { id: "2", fullName: "Ø£. Ø¯ÙŠÙ†Ø§ Ø³Ù…ÙŠØ±", phone: "01033334444", email: "dina@skidyrein.com", specialization: ["python", "ai"], employment: "full_time", classesCount: 4, studentsCount: 20, isActive: true },
  { id: "3", fullName: "Ø£. ÙƒØ±ÙŠÙ… ÙØªØ­ÙŠ", phone: "01055556666", email: "karim@skidyrein.com", specialization: ["scratch", "web"], employment: "freelance", classesCount: 2, studentsCount: 8, isActive: true },
];

export const MOCK_FOLLOW_UPS: FollowUpItem[] = [
  { id: "1", title: "Ù…ØªØ§Ø¨Ø¹Ø© ÙŠÙˆØ³Ù â€” Ø£ÙˆÙ„ ØªÙˆØ§ØµÙ„", leadId: "1", leadName: "ÙŠÙˆØ³Ù Ø£Ø­Ù…Ø¯", parentName: "Ø£Ø­Ù…Ø¯ Ù…Ø­Ù…Ø¯", type: "first_contact", channel: "whatsapp", priority: "high", scheduledAt: "2026-04-06T10:00:00", status: "pending", assignedTo: "Ø§Ù„Ø§Ø¡" },
  { id: "2", title: "ØªØ°ÙƒÙŠØ± Ø¨Ø§Ù„Ø³ÙŠØ´Ù† Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ© â€” Ø²ÙŠÙ†", leadId: "4", leadName: "Ø²ÙŠÙ† ÙØ§Ø·Ù…Ø©", parentName: "ÙØ§Ø·Ù…Ø© Ø­Ø³Ù†", type: "trial_reminder", channel: "whatsapp", priority: "urgent", scheduledAt: "2026-04-06T14:00:00", status: "pending", assignedTo: "Ø³Ù…Ø±" },
  { id: "3", title: "Ù…ØªØ§Ø¨Ø¹Ø© Ø¨Ø¹Ø¯ Ø§Ù„Ø³ÙŠØ´Ù† â€” Ù„ÙŠÙ„Ù‰", leadId: "5", leadName: "Ù„ÙŠÙ„Ù‰ Ù‡Ø¯Ù‰", parentName: "Ù‡Ø¯Ù‰ Ø¥Ø¨Ø±Ø§Ù‡ÙŠÙ…", type: "post_trial", channel: "call", priority: "high", scheduledAt: "2026-04-06T12:00:00", status: "pending", assignedTo: "Ø§Ù„Ø§Ø¡" },
  { id: "4", title: "Ø¥Ø¹Ø§Ø¯Ø© ØªÙˆØ§ØµÙ„ â€” Ø¹Ù…Ø±", leadId: "3", leadName: "Ø¹Ù…Ø± Ù…Ø­Ù…Ø¯", parentName: "Ù…Ø­Ù…Ø¯ Ø¹Ù„ÙŠ", type: "re_engagement", channel: "whatsapp", priority: "medium", scheduledAt: "2026-04-07T10:00:00", status: "pending", assignedTo: "Ø§Ù„Ø§Ø¡" },
  { id: "5", title: "Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø¯ÙØ¹ â€” Ø¢Ø¯Ù…", leadId: "6", leadName: "Ø¢Ø¯Ù… Ø®Ø§Ù„Ø¯", parentName: "Ø®Ø§Ù„Ø¯ Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡", type: "closing", channel: "whatsapp", priority: "high", scheduledAt: "2026-04-06T18:00:00", status: "pending", assignedTo: "Ø³Ù…Ø±" },
  { id: "6", title: "Ø£ÙˆÙ„ ØªÙˆØ§ØµÙ„ â€” Lead Ø¬Ø¯ÙŠØ¯", leadId: null, leadName: "Ø­Ø³Ù† Ø£ÙŠÙ…Ù†", parentName: "Ø£ÙŠÙ…Ù† Ø­Ø³Ù†", type: "first_contact", channel: "whatsapp", priority: "medium", scheduledAt: "2026-04-05T09:00:00", status: "overdue", assignedTo: "Ø³Ù…Ø±" },
  { id: "7", title: "Ù…ØªØ§Ø¨Ø¹Ø© Ù…Ù„Ùƒ â€” ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø¯ÙØ¹", leadId: "2", leadName: "Ù…Ù„Ùƒ Ø³Ø§Ø±Ø©", parentName: "Ø³Ø§Ø±Ø© Ø£Ø­Ù…Ø¯", type: "payment_reminder", channel: "call", priority: "medium", scheduledAt: "2026-04-04T15:00:00", status: "completed", assignedTo: "Ø³Ù…Ø±" },
];

export const MOCK_LEAD_ACTIVITIES: LeadActivityItem[] = [
  { id: "1", leadId: "1", action: "ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø§Ù„Ù…Ø­ØªÙ…Ù„", date: "2026-04-05T08:00:00", by: "Ø§Ù„Ø§Ø¡", type: "create" },
  { id: "2", leadId: "1", action: "Ø£ÙˆÙ„ ØªÙˆØ§ØµÙ„ Ø¹Ø¨Ø± ÙˆØ§ØªØ³Ø§Ø¨", date: "2026-04-05T09:30:00", by: "Ø§Ù„Ø§Ø¡", type: "contact" },
  { id: "3", leadId: "1", action: "ØªÙ… Ø§Ù„ØªØ£Ù‡ÙŠÙ„ â€” Ø³Ù† Ù…Ù†Ø§Ø³Ø¨ + Ù„Ø§Ø¨ØªÙˆØ¨", date: "2026-04-05T09:45:00", by: "Ø§Ù„Ø§Ø¡", type: "stage" },
  { id: "4", leadId: "1", action: "Ø¹ÙØ±Ø¶Øª Ø§Ù„Ø³ÙŠØ´Ù† Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ©", date: "2026-04-05T10:00:00", by: "Ø§Ù„Ø§Ø¡", type: "stage" },
  { id: "5", leadId: "5", action: "Ø­Ø¶Ø±Øª Ø§Ù„Ø³ÙŠØ´Ù† Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ© Ø¨Ù†Ø¬Ø§Ø­", date: "2026-04-05T17:00:00", by: "Ø§Ù„Ø§Ø¡", type: "stage" },
  { id: "6", leadId: "6", action: "ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø¹Ø±Ø¶ Ø§Ù„Ø³Ø¹Ø±ÙŠ", date: "2026-04-05T10:00:00", by: "Ø³Ù…Ø±", type: "stage" },
];
