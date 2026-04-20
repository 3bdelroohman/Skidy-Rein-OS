const fs = require('fs');
const f = 'src/services/schedule.service.ts';
let c = fs.readFileSync(f, 'utf8');

c = c.replace(
  /const VALID_COURSES: CourseType_fix7.js_fix7.js = _fix7.js[^_fix7.js]*\];/,
  'const VALID_COURSES: CourseType[] = ["scratch", "app_inventor", "robotics_basic", "ai_intro", "python", "godot", "robotics_iot", "fastapi", "html_css", "javascript_tailwind", "front_end", "ai_ml", "data_science", "back_end", "raspberry_pi"];'
);

fs.writeFileSync(f, c, 'utf8');
console.log('Updated VALID_COURSES in schedule.service.ts');
