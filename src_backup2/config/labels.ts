import type {
  CommChannel,
  CourseType,
  EmploymentType,
  FollowUpType,
  LeadSource,
  LeadStage,
  LeadTemperature,
  LossReason,
  PaymentMethod,
  PaymentStatus,
  Priority,
  StudentStatus,
} from "@/types/common.types";

export const TEMPERATURE_LABELS: Record<LeadTemperature, string> = {
  hot: "Ù…Ù‡ØªÙ… Ø¬Ø¯Ø§Ù‹",
  warm: "Ù…Ù‡ØªÙ…",
  cold: "ØºÙŠØ± Ø¬Ø§Ù‡Ø² Ø­Ø§Ù„ÙŠØ§Ù‹",
};

export const TEMPERATURE_EN_LABELS: Record<LeadTemperature, string> = {
  hot: "Very interested",
  warm: "Interested",
  cold: "Not ready yet",
};

export const STAGE_LABELS: Record<LeadStage, string> = {
  new: "Ø¬Ø¯ÙŠØ¯",
  qualified: "Ù…Ù‡ØªÙ…",
  trial_proposed: "Ø¹ÙØ±Ø¶ Ø¹Ù„ÙŠÙ‡ Ø³ÙŠØ´Ù† ØªØ¬Ø±ÙŠØ¨ÙŠØ©",
  trial_booked: "Ø­Ø¬Ø² Ø³ÙŠØ´Ù† ØªØ¬Ø±ÙŠØ¨ÙŠØ©",
  trial_attended: "Ø­Ø¶Ø± Ø§Ù„Ø³ÙŠØ´Ù† Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ©",
  offer_sent: "ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø¹Ø±Ø¶",
  won: "Ù…Ø´ØªØ±Ùƒ",
  lost: "Ù„Ù… ÙŠØ´ØªØ±Ùƒ",
};

export const STAGE_EN_LABELS: Record<LeadStage, string> = {
  new: "New",
  qualified: "Interested",
  trial_proposed: "Trial proposed",
  trial_booked: "Trial booked",
  trial_attended: "Trial attended",
  offer_sent: "Offer sent",
  won: "Enrolled",
  lost: "Did not enroll",
};

export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  trial: "ÙÙŠ Ø­ØµØ© ØªØ¬Ø±ÙŠØ¨ÙŠØ©",
  active: "Ù†Ø´Ø·",
  paused: "Ù…ØªÙˆÙ‚Ù Ù…Ø¤Ù‚ØªØ§Ù‹",
  at_risk: "Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©",
  completed: "Ø£Ù†Ù‡Ù‰ Ø§Ù„Ø¯ÙˆØ±Ø©",
  churned: "Ø§Ù†Ø³Ø­Ø¨",
};

export const STUDENT_STATUS_EN_LABELS: Record<StudentStatus, string> = {
  trial: "In trial class",
  active: "Active",
  paused: "Paused",
  at_risk: "Needs attention",
  completed: "Completed",
  churned: "Dropped",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  urgent: "Ø¹Ø§Ø¬Ù„ Ø¬Ø¯Ø§Ù‹",
  high: "Ø¹Ø§Ø¬Ù„",
  medium: "Ù…Ù‡Ù…",
  low: "ØºÙŠØ± Ù…Ø³ØªØ¹Ø¬Ù„",
};

export const PRIORITY_EN_LABELS: Record<Priority, string> = {
  urgent: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const LOSS_REASON_LABELS: Record<LossReason, string> = {
  price: "Ø§Ù„Ø³Ø¹Ø± ØºÙŠØ± Ù…Ù†Ø§Ø³Ø¨",
  wants_offline: "ÙŠÙØ¶Ù‘Ù„ ÙƒÙˆØ±Ø³ Ø­Ø¶ÙˆØ±ÙŠ",
  no_laptop: "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø¬Ù‡Ø§Ø² Ù…Ù†Ø§Ø³Ø¨",
  age_mismatch: "Ø§Ù„Ø¹Ù…Ø± ØºÙŠØ± Ù…Ù†Ø§Ø³Ø¨ Ù„Ù„ÙƒÙˆØ±Ø³",
  no_response: "Ù„Ø§ ÙŠØ±Ø¯ Ø¹Ù„Ù‰ Ø§Ù„ØªÙˆØ§ØµÙ„",
  exams_deferred: "Ù…Ø¤Ø¬Ù‘Ù„ Ø¥Ù„Ù‰ Ø¨Ø¹Ø¯ Ø§Ù„Ø§Ù…ØªØ­Ø§Ù†Ø§Øª",
  not_convinced_online: "ØºÙŠØ± Ù…Ù‚ØªÙ†Ø¹ Ø¨Ø§Ù„ØªØ¹Ù„Ù‘Ù… Ø£ÙˆÙ†Ù„Ø§ÙŠÙ†",
  chose_competitor: "Ø§Ù†Ø¶Ù… Ù„Ù…Ø±ÙƒØ²/Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø£Ø®Ø±Ù‰",
  other: "Ø³Ø¨Ø¨ Ø¢Ø®Ø±",
};

export const LOSS_REASON_EN_LABELS: Record<LossReason, string> = {
  price: "Price is not suitable",
  wants_offline: "Prefers offline course",
  no_laptop: "No suitable device",
  age_mismatch: "Age does not fit the course",
  no_response: "Not responding",
  exams_deferred: "Postponed until after exams",
  not_convinced_online: "Not convinced by online learning",
  chose_competitor: "Joined another academy",
  other: "Other reason",
};

export const FOLLOW_UP_TYPE_LABELS: Record<FollowUpType, string> = {
  first_contact: "Ø£ÙˆÙ„ ØªÙˆØ§ØµÙ„",
  qualification: "ØªØ£Ù‡ÙŠÙ„ Ø§Ù„Ø¹Ù…ÙŠÙ„",
  trial_reminder: "ØªØ°ÙƒÙŠØ± Ø¨Ø§Ù„Ø³ÙŠØ´Ù† Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ©",
  post_trial: "Ù…ØªØ§Ø¨Ø¹Ø© Ø¨Ø¹Ø¯ Ø§Ù„Ø³ÙŠØ´Ù† Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ©",
  no_show: "Ù…ØªØ§Ø¨Ø¹Ø© Ø¹Ø¯Ù… Ø§Ù„Ø­Ø¶ÙˆØ±",
  closing: "Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ",
  payment_reminder: "ØªØ°ÙƒÙŠØ± Ø¨Ø§Ù„Ø¯ÙØ¹",
  re_engagement: "Ø¥Ø¹Ø§Ø¯Ø© ØªÙˆØ§ØµÙ„",
};

export const FOLLOW_UP_TYPE_EN_LABELS: Record<FollowUpType, string> = {
  first_contact: "First contact",
  qualification: "Qualification",
  trial_reminder: "Trial reminder",
  post_trial: "Post-trial follow-up",
  no_show: "No-show follow-up",
  closing: "Closing",
  payment_reminder: "Payment reminder",
  re_engagement: "Re-engagement",
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  facebook_ad: "Ø¥Ø¹Ù„Ø§Ù† ÙÙŠØ³Ø¨ÙˆÙƒ",
  instagram_ad: "Ø¥Ø¹Ù„Ø§Ù† Ø¥Ù†Ø³ØªØ¬Ø±Ø§Ù…",
  group: "Ø¬Ø±ÙˆØ¨",
  referral: "ØªØ±Ø´ÙŠØ­",
  direct: "Ù…Ø¨Ø§Ø´Ø±",
  website: "Ø§Ù„Ù…ÙˆÙ‚Ø¹",
  other: "Ø£Ø®Ø±Ù‰",
};

export const LEAD_SOURCE_EN_LABELS: Record<LeadSource, string> = {
  facebook_ad: "Facebook ad",
  instagram_ad: "Instagram ad",
  group: "Group",
  referral: "Referral",
  direct: "Direct",
  website: "Website",
  other: "Other",
};

export const COMM_CHANNEL_LABELS: Record<CommChannel, string> = {
  whatsapp: "ÙˆØ§ØªØ³Ø§Ø¨",
  email: "Ø¨Ø±ÙŠØ¯ Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ",
  call: "Ù…ÙƒØ§Ù„Ù…Ø©",
  sms: "Ø±Ø³Ø§Ù„Ø© Ù†ØµÙŠØ©",
};

export const COMM_CHANNEL_EN_LABELS: Record<CommChannel, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  call: "Call",
  sms: "SMS",
};

export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  scratch: "Scratch",
  app_inventor: "App Inventor",
  robotics_basic: "Robotics Basic",
  ai_intro: "AI Intro",
  python: "Python",
  godot: "Godot",
  robotics_iot: "Robotics / IoT",
  fastapi: "FastAPI",
  html_css: "HTML / CSS",
  javascript_tailwind: "JavaScript / Tailwind",
  front_end: "Front End",
  ai_ml: "AI & ML",
  data_science: "Data Science",
  back_end: "Back End",
  raspberry_pi: "Raspberry Pi",
  web: "Web Development",
  ai: "AI & Machine Learning",
};

export const COURSE_TYPE_EN_LABELS: Record<CourseType, string> = {
  scratch: "Scratch",
  app_inventor: "App Inventor",
  robotics_basic: "Robotics Basic",
  ai_intro: "AI Intro",
  python: "Python",
  godot: "Godot",
  robotics_iot: "Robotics / IoT",
  fastapi: "FastAPI",
  html_css: "HTML / CSS",
  javascript_tailwind: "JavaScript / Tailwind",
  front_end: "Front End",
  ai_ml: "AI & ML",
  data_science: "Data Science",
  back_end: "Back End",
  raspberry_pi: "Raspberry Pi",
  web: "Web Development",
  ai: "AI & Machine Learning",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "Ù…Ø¯ÙÙˆØ¹",
  pending: "Ù‚ÙŠØ¯ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±",
  overdue: "Ù…ØªØ£Ø®Ø±",
  refunded: "Ù…Ø³ØªØ±Ø¯",
  partial: "Ù…Ø¯ÙÙˆØ¹ Ø¬Ø²Ø¦ÙŠÙ‹Ø§",
};

export const PAYMENT_STATUS_EN_LABELS: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  refunded: "Refunded",
  partial: "Partially paid",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: "ØªØ­ÙˆÙŠÙ„ Ø¨Ù†ÙƒÙŠ",
  card: "Ø¨Ø·Ø§Ù‚Ø©",
  wallet: "Ù…Ø­ÙØ¸Ø© Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ©",
  cash: "Ù†Ù‚Ø¯ÙŠ",
  instapay: "Ø¥Ù†Ø³ØªØ§Ø¨Ø§ÙŠ",
};

export const PAYMENT_METHOD_EN_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: "Bank transfer",
  card: "Card",
  wallet: "Wallet",
  cash: "Cash",
  instapay: "Instapay",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: "Ø¯ÙˆØ§Ù… ÙƒØ§Ù…Ù„",
  part_time: "Ø¯ÙˆØ§Ù… Ø¬Ø²Ø¦ÙŠ",
  freelance: "ØªØ¹Ø§Ù‚Ø¯ Ø­Ø±",
};

export const EMPLOYMENT_TYPE_EN_LABELS: Record<EmploymentType, string> = {
  full_time: "Full time",
  part_time: "Part time",
  freelance: "Freelance",
};

export const FILTER_LABELS = {
  allStages: "ÙƒÙ„ Ø§Ù„Ù…Ø±Ø§Ø­Ù„",
  allTemperatures: "ÙƒÙ„ Ø§Ù„ØªØµÙ†ÙŠÙØ§Øª",
  allStudentStatuses: "ÙƒÙ„ Ø§Ù„Ø­Ø§Ù„Ø§Øª",
  allPriorities: "ÙƒÙ„ Ø§Ù„Ø£ÙˆÙ„ÙˆÙŠØ§Øª",
} as const;

export const FILTER_EN_LABELS = {
  allStages: "All stages",
  allTemperatures: "All temperatures",
  allStudentStatuses: "All statuses",
  allPriorities: "All priorities",
} as const;

export const DAY_LABELS = ["Ø§Ù„Ø£Ø­Ø¯", "Ø§Ù„Ø¥Ø«Ù†ÙŠÙ†", "Ø§Ù„Ø«Ù„Ø§Ø«Ø§Ø¡", "Ø§Ù„Ø£Ø±Ø¨Ø¹Ø§Ø¡", "Ø§Ù„Ø®Ù…ÙŠØ³", "Ø§Ù„Ø¬Ù…Ø¹Ø©", "Ø§Ù„Ø³Ø¨Øª"] as const;
export const DAY_EN_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export const CONVERSION_TERMS = {
  conversionRate: "Ù…Ø¹Ø¯Ù„ Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ",
  successfulConversion: "Ø§Ø´ØªØ±Ø§Ùƒ Ù†Ø§Ø¬Ø­",
  averageConversionTime: "Ù…ØªÙˆØ³Ø· ÙˆÙ‚Øª Ù‚Ø±Ø§Ø± Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ",
} as const;

export const CONVERSION_EN_TERMS = {
  conversionRate: "Enrollment rate",
  successfulConversion: "Successful enrollment",
  averageConversionTime: "Average enrollment decision time",
} as const;
