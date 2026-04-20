const fs = require('fs');
const f = 'src/app/(dashboard)/schedule/page.tsx';
let c = fs.readFileSync(f, 'utf8');

// Fix course filter options to match new CourseType
c = c.replace(
  '<option value="web">{getCourseLabel("web", locale)}</option>',
  '<option value="html_css">{getCourseLabel("html_css", locale)}</option>'
);
c = c.replace(
  '<option value="ai">{getCourseLabel("ai", locale)}</option>',
  '<option value="ai_ml">{getCourseLabel("ai_ml", locale)}</option>'
);

// Fix COURSE_COLORS to use new keys
c = c.replace(
  /web:\s*\{[^}]*\}/,
  'html_css: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" }'
);
c = c.replace(
  /ai:\s*\{[^}]*\}/,
  'ai_ml: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" }'
);

// Also need to handle any remaining "web" or "ai" course references
// Add fallback entries for old course names
if (!c.includes('// fallback course colors')) {
  c = c.replace(
    '} as const;',
    '  ai_intro: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },\n  app_inventor: { bg: "bg-brand-50", border: "border-brand-200", text: "text-brand-700" },\n  robotics_basic: { bg: "bg-brand-50", border: "border-brand-200", text: "text-brand-700" },\n  godot: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },\n  robotics_iot: { bg: "bg-brand-50", border: "border-brand-200", text: "text-brand-700" },\n  fastapi: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },\n  javascript_tailwind: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },\n  front_end: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },\n  data_science: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },\n  back_end: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },\n  raspberry_pi: { bg: "bg-brand-50", border: "border-brand-200", text: "text-brand-700" },\n  // fallback course colors\n} as const;'
  );
}

fs.writeFileSync(f, c, 'utf8');
console.log('Fixed schedule page course types');
