const fs = require("fs");

let totalFixed = 0;

function fixFile(filePath, transforms) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;
  for (const [label, search, replace] of transforms) {
    if (!content.includes(search)) {
      console.error("NOT FOUND in " + filePath + ": " + label);
      console.error("Search was:", JSON.stringify(search).slice(0, 120));
      process.exit(1);
    }
    content = content.replace(search, replace);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    totalFixed++;
    console.log("FIXED: " + filePath);
  }
}

// ═══════════════════════════════════════════════
// FIX 1: teachers/[id]/page.tsx — add web + ai to both Record<CourseType,string> objects
// ═══════════════════════════════════════════════
fixFile("src/app/(dashboard)/teachers/[id]/page.tsx", [
  [
    "useState initial trackAdjustments",
    'raspberry_pi: "40" });',
    'raspberry_pi: "40", web: "30", ai: "40" });'
  ],
  [
    "setTrackAdjustments load",
    "raspberry_pi: String(finance.trackAdjustments.raspberry_pi ?? 40),\n      });",
    "raspberry_pi: String(finance.trackAdjustments.raspberry_pi ?? 40), web: String(finance.trackAdjustments.web ?? 30), ai: String(finance.trackAdjustments.ai ?? 40),\n      });"
  ],
]);

// ═══════════════════════════════════════════════
// FIX 2: schedule-entry-form.tsx — add web + ai to getCourseLabel
// ═══════════════════════════════════════════════
fixFile("src/components/schedule/schedule-entry-form.tsx", [
  [
    "getCourseLabel missing web+ai",
    '    ai_ml: { ar: "AI & Machine Learning", en: "AI & Machine Learning" },\n  };',
    '    ai_ml: { ar: "AI & Machine Learning", en: "AI & Machine Learning" },\n    web: { ar: "Web", en: "Web" },\n    ai: { ar: "AI", en: "AI" },\n  };'
  ],
]);

// ═══════════════════════════════════════════════
// FIX 3: labels.ts — expand COURSE_TYPE_LABELS and COURSE_TYPE_EN_LABELS from 4 to 17
// ═══════════════════════════════════════════════
const FULL_LABELS = `export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
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
};`;

const FULL_EN_LABELS = `export const COURSE_TYPE_EN_LABELS: Record<CourseType, string> = {
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
};`;

fixFile("src/config/labels.ts", [
  [
    "COURSE_TYPE_LABELS expand",
    'export const COURSE_TYPE_LABELS: Record<CourseType, string> = {\n  scratch: "Scratch",\n  python: "Python",\n  web: "Web Development",\n  ai: "AI & Machine Learning",\n};',
    FULL_LABELS
  ],
  [
    "COURSE_TYPE_EN_LABELS expand",
    'export const COURSE_TYPE_EN_LABELS: Record<CourseType, string> = {\n  scratch: "Scratch",\n  python: "Python",\n  web: "Web Development",\n  ai: "AI & Machine Learning",\n};',
    FULL_EN_LABELS
  ],
]);

// ═══════════════════════════════════════════════
// FIX 4: teacher-finance.service.ts — expand DEFAULT_TRACK + spread into all Record objects
// ═══════════════════════════════════════════════
const NEW_DEFAULT_TRACK = `const DEFAULT_TRACK: Record<CourseType, number> = {
  scratch: 0,
  app_inventor: 0,
  robotics_basic: 0,
  ai_intro: 0,
  python: 20,
  godot: 20,
  robotics_iot: 20,
  fastapi: 20,
  html_css: 30,
  javascript_tailwind: 30,
  front_end: 30,
  ai_ml: 40,
  data_science: 40,
  back_end: 40,
  raspberry_pi: 0,
  web: 30,
  ai: 40,
};`;

fixFile("src/services/teacher-finance.service.ts", [
  [
    "DEFAULT_TRACK expand",
    'const DEFAULT_TRACK: Record<CourseType, number> = {\n  scratch: 0,\n  python: 20,\n  web: 30,\n  ai: 40,\n};',
    NEW_DEFAULT_TRACK
  ],
  [
    "rowToConfig trackAdjustments",
    "trackAdjustments: {\n      scratch: safe(row.adj_scratch, 0),\n      python: safe(row.adj_python, 20),\n      web: safe(row.adj_web, 30),\n      ai: safe(row.adj_ai, 40),\n    },",
    "trackAdjustments: {\n      ...DEFAULT_TRACK,\n      scratch: safe(row.adj_scratch, 0),\n      python: safe(row.adj_python, 20),\n      web: safe(row.adj_web, 30),\n      ai: safe(row.adj_ai, 40),\n    },"
  ],
  [
    "cached fallback trackAdjustments",
    "trackAdjustments: {\n        scratch: safe(cached.trackAdjustments?.scratch, base.trackAdjustments.scratch),\n        python: safe(cached.trackAdjustments?.python, base.trackAdjustments.python),\n        web: safe(cached.trackAdjustments?.web, base.trackAdjustments.web),\n        ai: safe(cached.trackAdjustments?.ai, base.trackAdjustments.ai),\n      },",
    "trackAdjustments: {\n        ...DEFAULT_TRACK,\n        scratch: safe(cached.trackAdjustments?.scratch, base.trackAdjustments.scratch),\n        python: safe(cached.trackAdjustments?.python, base.trackAdjustments.python),\n        web: safe(cached.trackAdjustments?.web, base.trackAdjustments.web),\n        ai: safe(cached.trackAdjustments?.ai, base.trackAdjustments.ai),\n      },"
  ],
  [
    "saveTeacherFinanceConfig trackAdjustments",
    "trackAdjustments: {\n      scratch: safe(input.trackAdjustments.scratch, 0),\n      python: safe(input.trackAdjustments.python, 20),\n      web: safe(input.trackAdjustments.web, 30),\n      ai: safe(input.trackAdjustments.ai, 40),\n    },",
    "trackAdjustments: {\n      ...DEFAULT_TRACK,\n      scratch: safe(input.trackAdjustments.scratch, 0),\n      python: safe(input.trackAdjustments.python, 20),\n      web: safe(input.trackAdjustments.web, 30),\n      ai: safe(input.trackAdjustments.ai, 40),\n    },"
  ],
]);

console.log("\nDone. " + totalFixed + " files fixed.");
console.log("Run: npm run build");