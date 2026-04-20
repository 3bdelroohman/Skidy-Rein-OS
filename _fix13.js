const fs = require('fs');
const ALL = '["scratch", "app_inventor", "robotics_basic", "ai_intro", "python", "godot", "robotics_iot", "fastapi", "html_css", "javascript_tailwind", "front_end", "ai_ml", "data_science", "back_end", "raspberry_pi"]';
const OLD = '["scratch", "python", "web", "ai"]';

// Find ALL files still using old course array
const files = [
  'src/components/schedule/schedule-entry-form.tsx',
  'src/components/teachers/teacher-form.tsx',
  'src/services/teachers.service.ts',
  'src/services/schedule.service.ts',
];

for (const f of files) {
  try {
    let c = fs.readFileSync(f, 'utf8');
    const lines = c.split('\n');
    let changed = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('"web"') || lines[i].includes('"ai"')) {
        if (lines[i].includes('CourseType[]') || lines[i].includes('COURSE_OPTIONS') || lines[i].includes('VALID_COURSES')) {
          lines[i] = lines[i].replace(/clip[^clip]*\]/, ALL);
          changed = true;
          console.log(f + ' line ' + (i+1) + ': fixed');
        }
      }
    }
    if (changed) fs.writeFileSync(f, lines.join('\n'), 'utf8');
  } catch(e) { console.log('Skip ' + f); }
}

// Also fix getCourseLabel inside schedule-entry-form if it has inline labels
const sef = 'src/components/schedule/schedule-entry-form.tsx';
try {
  let c = fs.readFileSync(sef, 'utf8');
  // Check if there's an inline labels object with web/ai keys
  if (c.includes('web: {') && c.includes('ai: {')) {
    c = c.replace(/web: \{ ar: "[^"]*", en: "[^"]*" \},?/g, 'html_css: { ar: "HTML / CSS", en: "HTML / CSS" },');
    c = c.replace(/ai: \{ ar: "[^"]*", en: "[^"]*" \},?/g, 'ai_ml: { ar: "AI & Machine Learning", en: "AI & Machine Learning" },');
    // Add missing courses
    if (!c.includes('app_inventor:')) {
      c = c.replace(
        /const labels: Record<CourseType, \{ ar: string; en: string \}> = \{/,
        'const labels: Record<CourseType, { ar: string; en: string }> = {\n    app_inventor: { ar: "App Inventor", en: "App Inventor" },\n    robotics_basic: { ar: "\u0631\u0648\u0628\u0648\u062A\u0643\u0633", en: "Robotics Basic" },\n    ai_intro: { ar: "\u0645\u0642\u062F\u0645\u0629 AI", en: "AI Intro" },\n    godot: { ar: "Godot", en: "Godot" },\n    robotics_iot: { ar: "Robotics / IoT", en: "Robotics / IoT" },\n    fastapi: { ar: "FastAPI", en: "FastAPI" },\n    javascript_tailwind: { ar: "JavaScript / Tailwind", en: "JavaScript / Tailwind" },\n    front_end: { ar: "Front End", en: "Front End" },\n    data_science: { ar: "Data Science", en: "Data Science" },\n    back_end: { ar: "Back End", en: "Back End" },\n    raspberry_pi: { ar: "Raspberry Pi", en: "Raspberry Pi" },'
      );
    }
    fs.writeFileSync(sef, c, 'utf8');
    console.log('Fixed inline labels in schedule-entry-form');
  }
} catch(e) { console.log('schedule-entry-form labels: ' + e.message); }

// Same for teacher-form
const tff = 'src/components/teachers/teacher-form.tsx';
try {
  let c = fs.readFileSync(tff, 'utf8');
  if (c.includes('web: {') || c.includes('"web"')) {
    // Just show what needs fixing
    c.split('\n').forEach((l,i) => {
      if (l.includes('web') || (l.includes('"ai"') && !l.includes('ai_')))
        console.log(tff + ':' + (i+1) + ': ' + l.trim());
    });
  }
} catch(e) {}

console.log('\nDone. Run: npm run build');
