// _batch1_fix.js — Batch 1: restore clean build by completing CourseType migration
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
let changed = 0;

function fix(relPath, replacements) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    console.error("MISSING:", relPath);
    process.exit(1);
  }
  let content = fs.readFileSync(abs, "utf8");
  const original = content;
  for (const [search, replace] of replacements) {
    if (!content.includes(search)) {
      console.error("SEARCH NOT FOUND in", relPath, ":", JSON.stringify(search).slice(0, 80));
      process.exit(1);
    }
    content = content.replace(search, replace);
  }
  if (content !== original) {
    fs.writeFileSync(abs, content, "utf8");
    changed++;
    console.log("FIXED:", relPath);
  } else {
    console.log("NO CHANGE:", relPath);
  }
}

// ──────────────────────────────────────────────
// FIX 1: common.types.ts — add "web" | "ai" back to CourseType
// ──────────────────────────────────────────────
fix("src/types/common.types.ts", [
  [
    'export type CourseType = "scratch" | "app_inventor" | "robotics_basic" | "ai_intro" | "python" | "godot" | "robotics_iot" | "fastapi" | "html_css" | "javascript_tailwind" | "front_end" | "ai_ml" | "data_science" | "back_end" | "raspberry_pi";',
    'export type CourseType = "scratch" | "app_inventor" | "robotics_basic" | "ai_intro" | "python" | "godot" | "robotics_iot" | "fastapi" | "html_css" | "javascript_tailwind" | "front_end" | "ai_ml" | "data_science" | "back_end" | "raspberry_pi" | "web" | "ai";'
  ]
]);

// ──────────────────────────────────────────────
// FIX 2: teacher-form.tsx — expand getCourseLabel to cover all 17 CourseType values
// ──────────────────────────────────────────────
const OLD_LABELS = `const labels: Record<CourseType, { ar: string; en: string }> = {
    scratch: { ar: "Scratch", en: "Scratch" },
    python: { ar: "Python", en: "Python" },
    web: { ar: "Web", en: "Web" },
    ai: { ar: "AI", en: "AI" },
  };`;

const NEW_LABELS = `const labels: Record<CourseType, { ar: string; en: string }> = {
    scratch: { ar: "Scratch", en: "Scratch" },
    app_inventor: { ar: "App Inventor", en: "App Inventor" },
    robotics_basic: { ar: "Robotics Basic", en: "Robotics Basic" },
    ai_intro: { ar: "AI Intro", en: "AI Intro" },
    python: { ar: "Python", en: "Python" },
    godot: { ar: "Godot", en: "Godot" },
    robotics_iot: { ar: "Robotics / IoT", en: "Robotics / IoT" },
    fastapi: { ar: "FastAPI", en: "FastAPI" },
    html_css: { ar: "HTML / CSS", en: "HTML / CSS" },
    javascript_tailwind: { ar: "JS / Tailwind", en: "JS / Tailwind" },
    front_end: { ar: "Front End", en: "Front End" },
    ai_ml: { ar: "AI & ML", en: "AI & ML" },
    data_science: { ar: "Data Science", en: "Data Science" },
    back_end: { ar: "Back End", en: "Back End" },
    raspberry_pi: { ar: "Raspberry Pi", en: "Raspberry Pi" },
    web: { ar: "Web", en: "Web" },
    ai: { ar: "AI", en: "AI" },
  };`;

fix("src/components/teachers/teacher-form.tsx", [
  [OLD_LABELS, NEW_LABELS]
]);

console.log("\\nDone. " + changed + " file(s) changed.");
console.log("Next: run  npm run build  to verify clean build.");