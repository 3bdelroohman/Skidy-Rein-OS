import type { CourseType, Locale } from "@/types/common.types";

export interface CourseRoadmapOption {
  value: CourseType;
  shortLabelAr: string;
  shortLabelEn: string;
  formLabelAr: string;
  formLabelEn: string;
  descriptionAr: string;
  descriptionEn: string;
  tracksAr: string[];
  tracksEn: string[];
}

export interface CourseTrackOption {
  id: string;
  family: CourseType;
  labelAr: string;
  labelEn: string;
  descriptionAr: string;
  descriptionEn: string;
}


export interface CourseTrackGroup {
  family: CourseType;
  label: string;
  description: string;
  options: Array<{ value: string; label: string; description: string }>
}

export const COURSE_ROADMAP_OPTIONS: CourseRoadmapOption[] = [
  {
    value: "scratch",
    shortLabelAr: "Scratch",
    shortLabelEn: "Scratch",
    formLabelAr: "Ù…Ø±Ø­Ù„Ø© Ø§Ù„ØªØ£Ø³ÙŠØ³ Ø§Ù„Ø¥Ø¨Ø¯Ø§Ø¹ÙŠ",
    formLabelEn: "Creative foundations",
    descriptionAr: "Ù…Ø¯Ø®Ù„ Ù…Ù†Ø§Ø³Ø¨ Ù„Ù„Ù…Ø¨ØªØ¯Ø¦ÙŠÙ† Ù‚Ø¨Ù„ Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø¨Ø±Ù…Ø¬ÙŠØ© Ø§Ù„Ø£Ø¹Ù…Ù‚.",
    descriptionEn: "Best starting family for beginners before deeper programming tracks.",
    tracksAr: ["Scratch", "App Inventor", "Ø±ÙˆØ¨ÙˆØªÙƒØ³ Ø£Ø³Ø§Ø³ÙŠ", "Ù…Ù‚Ø¯Ù…Ø© ÙÙŠ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ"],
    tracksEn: ["Scratch", "App Inventor", "Basic Robotics", "Intro to AI"],
  },
  {
    value: "python",
    shortLabelAr: "Python",
    shortLabelEn: "Python",
    formLabelAr: "Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ø¨Ø±Ù…Ø¬Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ©",
    formLabelEn: "Practical programming",
    descriptionAr: "Ø¹Ø§Ø¦Ù„Ø© ØªØ·ÙˆÙŠØ± Ù…Ù†Ø·Ù‚ Ø§Ù„Ø¨Ø±Ù…Ø¬Ø© ÙˆØ¨Ù†Ø§Ø¡ Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹ Ø§Ù„Ø¹Ù…Ù„ÙŠØ© ÙˆØ§Ù„Ù…ØªÙˆØ³Ø·Ø©.",
    descriptionEn: "Programming-logic family for practical and intermediate projects.",
    tracksAr: ["Python", "Godot", "Robotics / IoT", "FastAPI"],
    tracksEn: ["Python", "Godot", "Robotics / IoT", "FastAPI"],
  },
  {
    value: "web",
    shortLabelAr: "Front-End",
    shortLabelEn: "Front-End",
    formLabelAr: "Ù…Ø±Ø­Ù„Ø© Ø§Ù„ØªØ·Ø¨ÙŠÙ‚Ø§Øª ÙˆØ§Ù„ÙˆÙŠØ¨",
    formLabelEn: "Apps and web",
    descriptionAr: "Ø¹Ø§Ø¦Ù„Ø© Ø§Ù„ÙˆÙŠØ¨ ÙˆØ§Ù„ØªØ·Ø¨ÙŠÙ‚Ø§Øª ÙˆØ§Ù„ÙˆØ§Ø¬Ù‡Ø§Øª Ù„Ù„Ù…Ø³ØªÙˆÙ‰ Ø§Ù„Ù…ØªÙˆØ³Ø· Ø¥Ù„Ù‰ Ø§Ù„Ù…ØªÙ‚Ø¯Ù….",
    descriptionEn: "Web, apps, and interface-building family for intermediate to advanced learners.",
    tracksAr: ["HTML / CSS", "JavaScript / Tailwind", "Front End"],
    tracksEn: ["HTML / CSS", "JavaScript / Tailwind", "Front End"],
  },
  {
    value: "ai",
    shortLabelAr: "AI / Data",
    shortLabelEn: "AI / Data",
    formLabelAr: "Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙˆØ§Ù„Ø¨ÙŠØ§Ù†Ø§Øª",
    formLabelEn: "AI and data",
    descriptionAr: "Ø¹Ø§Ø¦Ù„Ø© Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ù…ØªÙ‚Ø¯Ù…Ø© Ù„Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙˆØ§Ù„Ø¨ÙŠØ§Ù†Ø§Øª ÙˆØ§Ù„Ø¨Ø§Ùƒ Ø¥Ù†Ø¯.",
    descriptionEn: "Advanced family for AI, data, and back-end oriented tracks.",
    tracksAr: ["AI & Machine Learning", "Data Science", "Back End", "Raspberry Pi"],
    tracksEn: ["AI & Machine Learning", "Data Science", "Back End", "Raspberry Pi"],
  },
];

export const COURSE_TRACK_OPTIONS: CourseTrackOption[] = [
  { id: "scratch", family: "scratch", labelAr: "Scratch", labelEn: "Scratch", descriptionAr: "Ø¨Ø¯Ø§ÙŠØ© Ù…Ù†Ø§Ø³Ø¨Ø© Ù„Ù„Ø£Ø·ÙØ§Ù„ ÙÙŠ Ø§Ù„Ø¨Ø±Ù…Ø¬Ø© Ø§Ù„Ù…Ø±Ø¦ÙŠØ©.", descriptionEn: "A visual coding starting point for kids." },
  { id: "app_inventor", family: "scratch", labelAr: "App Inventor", labelEn: "App Inventor", descriptionAr: "Ø¨Ù†Ø§Ø¡ ØªØ·Ø¨ÙŠÙ‚Ø§Øª Ø¨Ø³ÙŠØ·Ø© Ù„Ù„Ù…Ø¨ØªØ¯Ø¦ÙŠÙ†.", descriptionEn: "Build simple beginner-friendly apps." },
  { id: "robotics_basic", family: "scratch", labelAr: "Ø±ÙˆØ¨ÙˆØªÙƒØ³ Ø£Ø³Ø§Ø³ÙŠ", labelEn: "Basic Robotics", descriptionAr: "Ù…Ø¯Ø®Ù„ Ø¹Ù…Ù„ÙŠ Ù„Ù„Ù‡Ø§Ø±Ø¯ÙˆÙŠØ± ÙˆØ§Ù„Ù…Ù†Ø·Ù‚ Ø§Ù„Ø­Ø±ÙƒÙŠ.", descriptionEn: "A practical introduction to hardware and motion logic." },
  { id: "ai_intro", family: "scratch", labelAr: "Ù…Ù‚Ø¯Ù…Ø© ÙÙŠ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ", labelEn: "Intro to AI", descriptionAr: "ØªØ¹Ø±ÙŠÙ Ù…Ø¨Ø³Ø· Ø¨Ù…ÙØ§Ù‡ÙŠÙ… Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ.", descriptionEn: "A simplified introduction to AI concepts." },
  { id: "python", family: "python", labelAr: "Python", labelEn: "Python", descriptionAr: "Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ Ù„Ù„Ø¨Ø±Ù…Ø¬Ø© Ø§Ù„Ù†ØµÙŠØ© ÙˆØ§Ù„Ù…Ù†Ø·Ù‚.", descriptionEn: "Core text-based programming and logic track." },
  { id: "godot", family: "python", labelAr: "Godot", labelEn: "Godot", descriptionAr: "Ù…Ø¯Ø®Ù„ Ù„ØªØ·ÙˆÙŠØ± Ø§Ù„Ø£Ù„Ø¹Ø§Ø¨ ÙˆØ§Ù„Ù…Ø´Ø§Ù‡Ø¯ Ø§Ù„ØªÙØ§Ø¹Ù„ÙŠØ©.", descriptionEn: "An introduction to game development and interactive scenes." },
  { id: "robotics_iot", family: "python", labelAr: "Robotics / IoT", labelEn: "Robotics / IoT", descriptionAr: "Ù…Ø´Ø§Ø±ÙŠØ¹ ØªØ¬Ù…Ø¹ Ø¨ÙŠÙ† Ø§Ù„Ø¨Ø±Ù…Ø¬Ø© ÙˆØ§Ù„Ù‡Ø§Ø±Ø¯ÙˆÙŠØ± ÙˆØ§Ù„Ø§ØªØµØ§Ù„.", descriptionEn: "Projects that combine code, hardware, and connectivity." },
  { id: "fastapi", family: "python", labelAr: "FastAPI", labelEn: "FastAPI", descriptionAr: "Ø®Ø·ÙˆØ© Ø£ÙˆÙ„Ù‰ ÙÙŠ Ø¨Ù†Ø§Ø¡ ÙˆØ§Ø¬Ù‡Ø§Øª back-end Ø¨Ø³ÙŠØ·Ø©.", descriptionEn: "A first step into simple back-end API building." },
  { id: "html_css", family: "web", labelAr: "HTML / CSS", labelEn: "HTML / CSS", descriptionAr: "Ø£Ø³Ø§Ø³ ØªØµÙ…ÙŠÙ… ØµÙØ­Ø§Øª Ø§Ù„ÙˆÙŠØ¨.", descriptionEn: "The foundation of web page design." },
  { id: "javascript_tailwind", family: "web", labelAr: "JavaScript / Tailwind", labelEn: "JavaScript / Tailwind", descriptionAr: "Ø§Ù„ØªÙØ§Ø¹Ù„ ÙˆØ§Ù„ÙˆØ§Ø¬Ù‡Ø§Øª Ø§Ù„Ø­Ø¯ÙŠØ«Ø© Ø¹Ù„Ù‰ Ø§Ù„ÙˆÙŠØ¨.", descriptionEn: "Interactivity and modern web interfaces." },
  { id: "front_end", family: "web", labelAr: "Front End", labelEn: "Front End", descriptionAr: "Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ù…ØªÙƒØ§Ù…Ù„ Ù„Ø¨Ù†Ø§Ø¡ Ø§Ù„ÙˆØ§Ø¬Ù‡Ø§Øª Ø§Ù„Ø£Ù…Ø§Ù…ÙŠØ©.", descriptionEn: "A complete front-end engineering path." },
  { id: "ai_ml", family: "ai", labelAr: "AI & Machine Learning", labelEn: "AI & Machine Learning", descriptionAr: "Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ù…ØªÙ‚Ø¯Ù… Ù„Ø¨Ù†Ø§Ø¡ Ù†Ù…Ø§Ø°Ø¬ ÙˆØªØ·Ø¨ÙŠÙ‚Ø§Øª Ø°ÙƒÙŠØ©.", descriptionEn: "An advanced path for intelligent models and apps." },
  { id: "data_science", family: "ai", labelAr: "Data Science", labelEn: "Data Science", descriptionAr: "ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª ÙˆØ¨Ù†Ø§Ø¡ Ù‚ØµØµ ÙˆÙ‚Ø±Ø§Ø¡Ø§Øª Ù…Ù†Ù‡Ø§.", descriptionEn: "Analyze data and turn it into insights." },
  { id: "back_end", family: "ai", labelAr: "Back End", labelEn: "Back End", descriptionAr: "Ø¨Ù†Ø§Ø¡ Ø§Ù„Ù…Ù†Ø·Ù‚ Ø§Ù„Ø®Ù„ÙÙŠ ÙˆØ±Ø¨Ø· Ø§Ù„Ø®Ø¯Ù…Ø§Øª.", descriptionEn: "Build back-end logic and connect services." },
  { id: "raspberry_pi", family: "ai", labelAr: "Raspberry Pi", labelEn: "Raspberry Pi", descriptionAr: "Ù…Ø´Ø§Ø±ÙŠØ¹ ÙˆØ§Ù‚Ø¹ÙŠØ© ØªØ±Ø¨Ø· Ø§Ù„Ø¨Ø±Ù…Ø¬Ø© Ø¨Ø§Ù„Ø£Ø¬Ù‡Ø²Ø©.", descriptionEn: "Real-world projects linking code with devices." },
];

export function getCourseRoadmapOption(value: CourseType | null | undefined): CourseRoadmapOption | null {
  if (!value) return null;
  return COURSE_ROADMAP_OPTIONS.find((item) => item.value === value) ?? null;
}

export function getCourseFormLabel(value: CourseType, locale: Locale = "ar"): string {
  const option = getCourseRoadmapOption(value);
  if (!option) return value;
  return locale === "ar" ? option.formLabelAr : option.formLabelEn;
}

export function getCourseTracks(value: CourseType, locale: Locale = "ar"): string[] {
  const option = getCourseRoadmapOption(value);
  if (!option) return [];
  return locale === "ar" ? option.tracksAr : option.tracksEn;
}

export function getCourseTrackOptions(locale: Locale = "ar"): Array<{ value: string; label: string; family: CourseType; description: string }> {
  return COURSE_TRACK_OPTIONS.map((item) => ({
    value: item.id,
    family: item.family,
    label: locale === "ar" ? item.labelAr : item.labelEn,
    description: locale === "ar" ? item.descriptionAr : item.descriptionEn,
  }));
}

export function getCourseFamilyFromTrack(trackId: string | null | undefined): CourseType | null {
  if (!trackId) return null;
  return COURSE_TRACK_OPTIONS.find((item) => item.id === trackId)?.family ?? null;
}

export function getDefaultTrackIdForFamily(family: CourseType | null | undefined): string {
  return COURSE_TRACK_OPTIONS.find((item) => item.family === family)?.id ?? "";
}

export function getCourseTrackLabel(trackId: string | null | undefined, locale: Locale = "ar"): string {
  const track = COURSE_TRACK_OPTIONS.find((item) => item.id === trackId);
  if (!track) return "";
  return locale === "ar" ? track.labelAr : track.labelEn;
}

export function suggestCourseByAge(age: number, hasPriorExperience = false): CourseType {
  if (age <= 11) return "scratch";
  if (age <= 14) return hasPriorExperience ? "python" : "scratch";
  if (age <= 16) return hasPriorExperience ? "web" : "python";
  return hasPriorExperience ? "ai" : "web";
}


export function getCourseTrackGroups(locale: Locale = "ar"): CourseTrackGroup[] {
  return COURSE_ROADMAP_OPTIONS.map((family) => ({
    family: family.value,
    label: locale === "ar" ? family.formLabelAr : family.formLabelEn,
    description: locale === "ar" ? family.descriptionAr : family.descriptionEn,
    options: COURSE_TRACK_OPTIONS.filter((item) => item.family === family.value).map((item) => ({
      value: item.id,
      label: locale === "ar" ? item.labelAr : item.labelEn,
      description: locale === "ar" ? item.descriptionAr : item.descriptionEn,
    })),
  }));
}

export function getCourseTrackMeta(trackId: string | null | undefined): CourseTrackOption | null {
  if (!trackId) return null;
  return COURSE_TRACK_OPTIONS.find((item) => item.id === trackId) ?? null;
}
