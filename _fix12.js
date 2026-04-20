const fs = require('fs');
const f = 'src/app/(dashboard)/teachers/[id]/page.tsx';
let c = fs.readFileSync(f, 'utf8');

// Fix trackAdjustments state init
c = c.replace(
  /useState<Record<CourseType, string>>\(\{ scratch: "0", python: "20", web: "30", ai: "40" \}\)/,
  'useState<Record<CourseType, string>>({ scratch: "0", app_inventor: "0", robotics_basic: "0", ai_intro: "20", python: "20", godot: "20", robotics_iot: "20", fastapi: "30", html_css: "30", javascript_tailwind: "30", front_end: "30", ai_ml: "40", data_science: "40", back_end: "40", raspberry_pi: "40" })'
);

// Fix all setTrackAdjustments with old keys
c = c.replace(
  /scratch: String\(finance\.trackAdjustments\.scratch \?\? 0\),\s*python: String\(finance\.trackAdjustments\.python \?\? 20\),\s*web: String\(finance\.trackAdjustments\.web \?\? 30\),\s*ai: String\(finance\.trackAdjustments\.ai \?\? 40\),/g,
  'scratch: String(finance.trackAdjustments.scratch ?? 0), app_inventor: String(finance.trackAdjustments.app_inventor ?? 0), robotics_basic: String(finance.trackAdjustments.robotics_basic ?? 0), ai_intro: String(finance.trackAdjustments.ai_intro ?? 20), python: String(finance.trackAdjustments.python ?? 20), godot: String(finance.trackAdjustments.godot ?? 20), robotics_iot: String(finance.trackAdjustments.robotics_iot ?? 20), fastapi: String(finance.trackAdjustments.fastapi ?? 30), html_css: String(finance.trackAdjustments.html_css ?? 30), javascript_tailwind: String(finance.trackAdjustments.javascript_tailwind ?? 30), front_end: String(finance.trackAdjustments.front_end ?? 30), ai_ml: String(finance.trackAdjustments.ai_ml ?? 40), data_science: String(finance.trackAdjustments.data_science ?? 40), back_end: String(finance.trackAdjustments.back_end ?? 40), raspberry_pi: String(finance.trackAdjustments.raspberry_pi ?? 40),'
);

// Fix handleSaveFinance trackAdjustments
c = c.replace(
  /scratch: Number\(trackAdjustments\.scratch\) \|\| 0,\s*python: Number\(trackAdjustments\.python\) \|\| 20,\s*web: Number\(trackAdjustments\.web\) \|\| 30,\s*ai: Number\(trackAdjustments\.ai\) \|\| 40,/g,
  '...Object.fromEntries(Object.entries(trackAdjustments).map(([k, v]) => [k, Number(v) || 0])) as Record<CourseType, number>,'
);

// Fix computeTeacherFinanceSummary call trackAdjustments
c = c.replace(
  /trackAdjustments: \{\s*scratch: Number\(trackAdjustments\.scratch\) \|\| 0,\s*python: Number\(trackAdjustments\.python\) \|\| 20,\s*web: Number\(trackAdjustments\.web\) \|\| 30,\s*ai: Number\(trackAdjustments\.ai\) \|\| 40,\s*\}/g,
  'trackAdjustments: Object.fromEntries(Object.entries(trackAdjustments).map(([k, v]) => [k, Number(v) || 0])) as Record<CourseType, number>'
);

fs.writeFileSync(f, c, 'utf8');

// Verify no old keys remain
const remaining = c.match(/\bweb\b.*track|track.*\bweb\b/gi) || [];
const aiRemaining = c.match(/[^_]ai[^_].*track|track.*[^_]ai[^_]/gi) || [];
console.log('Remaining web refs:', remaining.length);
console.log('Remaining ai refs:', aiRemaining.length);
console.log('Done');
