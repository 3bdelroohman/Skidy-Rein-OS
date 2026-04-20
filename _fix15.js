const fs = require('fs');
const f = 'src/components/schedule/schedule-entry-form.tsx';
const c = fs.readFileSync(f, 'utf8');
const lines = c.split('\n');
lines[26] = 'const COURSE_OPTIONS: CourseType[] = ["scratch", "app_inventor", "robotics_basic", "ai_intro", "python", "godot", "robotics_iot", "fastapi", "html_css", "javascript_tailwind", "front_end", "ai_ml", "data_science", "back_end", "raspberry_pi"];';
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('Line 27 is now: ' + lines[26].trim().slice(0, 60) + '...');
