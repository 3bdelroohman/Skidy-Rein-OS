const fs = require("fs");

const file = "src/app/(dashboard)/schedule/page.tsx";
let c = fs.readFileSync(file, "utf8");

const oldPattern = /const COURSE_COLORS = \{[\s\S]*?\} as const;/;
const match = c.match(oldPattern);

if (!match) {
  console.error("ERROR: COURSE_COLORS block not found in file");
  process.exit(1);
}

console.log("Found COURSE_COLORS block, length:", match[0].length);

const newBlock = [
  'const COURSE_COLORS: Record<CourseType, { bg: string; border: string; text: string }> = {',
  '  scratch: { bg: "bg-brand-50", border: "border-brand-200", text: "text-brand-700" },',
  '  python: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },',
  '  html_css: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },',
  '  ai_ml: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },',
  '  ai_intro: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },',
  '  app_inventor: { bg: "bg-brand-50", border: "border-brand-200", text: "text-brand-700" },',
  '  robotics_basic: { bg: "bg-brand-50", border: "border-brand-200", text: "text-brand-700" },',
  '  godot: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },',
  '  robotics_iot: { bg: "bg-brand-50", border: "border-brand-200", text: "text-brand-700" },',
  '  fastapi: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },',
  '  javascript_tailwind: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },',
  '  front_end: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },',
  '  data_science: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },',
  '  back_end: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },',
  '  raspberry_pi: { bg: "bg-brand-50", border: "border-brand-200", text: "text-brand-700" },',
  '  web: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },',
  '  ai: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },',
  '};',
].join("\n");

c = c.replace(oldPattern, newBlock);
fs.writeFileSync(file, c, "utf8");
console.log("FIXED:", file);