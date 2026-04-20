const fs = require('fs');
const ALL = '["scratch", "app_inventor", "robotics_basic", "ai_intro", "python", "godot", "robotics_iot", "fastapi", "html_css", "javascript_tailwind", "front_end", "ai_ml", "data_science", "back_end", "raspberry_pi"]';
const f = 'src/app/(dashboard)/teachers/[id]/page.tsx';
let c = fs.readFileSync(f, 'utf8');
const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const TRACKS') && lines[i].includes('CourseType')) {
    lines[i] = 'const TRACKS: CourseType[] = ' + ALL + ';';
    console.log('Fixed line ' + (i+1));
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('Done');
