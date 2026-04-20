const fs = require('fs');

// ============================================
// FIX 1: Schedule service - 12-hour time format
// ============================================
const f1 = 'src/services/schedule.service.ts';
let c1 = fs.readFileSync(f1, 'utf8');

// Replace trimTime with 12-hour format version
c1 = c1.replace(
  /function trimTime\(v: string\): string \{[^}]*\}/,
  unction trimTime(v: string): string {
  const p = v.split(':');
  if (p.length < 2) return v;
  let h = parseInt(p[0], 10);
  const m = p[1].padStart(2, '0');
  if (isNaN(h)) return v;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + m + ' ' + ampm;
}
);

fs.writeFileSync(f1, c1, 'utf8');
console.log('FIX 1: schedule service - 12h time');

// ============================================
// FIX 2: Schedule page - fix card overflow + layout
// ============================================
const f2 = 'src/app/(dashboard)/schedule/page.tsx';
let c2 = fs.readFileSync(f2, 'utf8');

// Fix desktop grid card - add overflow-hidden and min-height
c2 = c2.replace(
  'className="rounded-2xl border border-border bg-card p-2.5">',
  'className="rounded-2xl border border-border bg-card p-2.5 min-h-[120px]">'
);

// Fix session card - add overflow-hidden and word-break
c2 = c2.replace(
  /block rounded-xl border p-2\.5 transition-all hover:-translate-y-0\.5 hover:shadow-sm/g,
  'block rounded-xl border p-2 transition-all hover:-translate-y-0.5 hover:shadow-sm overflow-hidden'
);

// Fix class name text - limit lines
c2 = c2.replace(
  /text-clip13pxclip font-bold leading-5/g,
  'text-[12px] font-bold leading-4 line-clamp-2'
);

// Fix time badge - smaller
c2 = c2.replace(
  'rounded-lg bg-white/70 px-2 py-1 text-[10px]',
  'rounded-md bg-white/70 px-1.5 py-0.5 text-[9px] shrink-0'
);

// Fix the details text inside card - truncate
c2 = c2.replace(
  /text-clip10pxclip text-muted-foreground">\{getCourseLabel/g,
  'text-[9px] text-muted-foreground truncate">{getCourseLabel'
);

// Fix teacher+students line - truncate
c2 = c2.replace(
  /<div className="flex items-center gap-1\.5"><Users size=\{12\} \/>/g,
  '<div className="flex items-center gap-1 truncate"><Users size={10} />'
);

c2 = c2.replace(
  /<div className="flex items-center gap-1\.5"><Clock size=\{12\} \/>/g,
  '<div className="flex items-center gap-1 truncate"><Clock size={10} />'
);

// Fix the time separator
c2 = c2.replace(/\?\s/g, '- ');

fs.writeFileSync(f2, c2, 'utf8');
console.log('FIX 2: schedule page - card overflow + 12h');

// ============================================
// FIX 3: Update COURSE_TYPE_LABELS to match full course list
// ============================================
const f3 = 'src/config/labels.ts';
let c3 = fs.readFileSync(f3, 'utf8');

// Replace COURSE_TYPE_LABELS with full list
c3 = c3.replace(
  /export const COURSE_TYPE_LABELS: Record<CourseType, string> = \{[^}]*\};/,
  export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  scratch: "Scratch",
  app_inventor: "App Inventor",
  robotics_basic: "\u0631\u0648\u0628\u0648\u062A\u0643\u0633 \u0623\u0633\u0627\u0633\u064A",
  ai_intro: "\u0645\u0642\u062F\u0645\u0629 \u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064A",
  python: "Python",
  godot: "Godot",
  robotics_iot: "Robotics / IoT",
  fastapi: "FastAPI",
  html_css: "HTML / CSS",
  javascript_tailwind: "JavaScript / Tailwind",
  front_end: "Front End",
  ai_ml: "AI & Machine Learning",
  data_science: "Data Science",
  back_end: "Back End",
  raspberry_pi: "Raspberry Pi",
};
);

c3 = c3.replace(
  /export const COURSE_TYPE_EN_LABELS: Record<CourseType, string> = \{[^}]*\};/,
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
  ai_ml: "AI & Machine Learning",
  data_science: "Data Science",
  back_end: "Back End",
  raspberry_pi: "Raspberry Pi",
};
);

fs.writeFileSync(f3, c3, 'utf8');
console.log('FIX 3: labels - full course list');

console.log('\nAll fixes done. Run: npm run build');
