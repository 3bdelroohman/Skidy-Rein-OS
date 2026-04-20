const fs = require('fs');
const f = 'src/components/teachers/teacher-form.tsx';
let c = fs.readFileSync(f, 'utf8');
const oldLine = 'const COURSE_OPTIONS: CourseType[] = ["scratch", "python", "web", "ai"];';
const newLine = 'const COURSE_OPTIONS: CourseType[] = ["scratch", "app_inventor", "robotics_basic", "ai_intro", "python", "godot", "robotics_iot", "fastapi", "html_css", "javascript_tailwind", "front_end", "ai_ml", "data_science", "back_end", "raspberry_pi"];';

if (c.includes(oldLine)) {
  c = c.replace(oldLine, newLine);
  fs.writeFileSync(f, c, 'utf8');
  console.log('REPLACED in teacher-form.tsx');
} else {
  console.log('NOT FOUND - trying char by char');
  // Force replace on line containing COURSE_OPTIONS
  const lines = c.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('COURSE_OPTIONS') && lines[i].includes('web')) {
      lines[i] = newLine;
      console.log('Force fixed line ' + (i+1));
    }
  }
  fs.writeFileSync(f, lines.join('\n'), 'utf8');
}

// Verify
const v = fs.readFileSync(f, 'utf8');
console.log('Verify has web:', v.includes('"web"'));
console.log('Verify has html_css:', v.includes('"html_css"'));
