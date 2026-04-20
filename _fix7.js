const fs = require('fs');
const f = 'src/types/common.types.ts';
let c = fs.readFileSync(f, 'utf8');

// Find and replace CourseType
const oldPattern = /export type CourseType\s*=\s*[^;]+;/;
const newType = 'export type CourseType = "scratch" | "app_inventor" | "robotics_basic" | "ai_intro" | "python" | "godot" | "robotics_iot" | "fastapi" | "html_css" | "javascript_tailwind" | "front_end" | "ai_ml" | "data_science" | "back_end" | "raspberry_pi";';

if (oldPattern.test(c)) {
  c = c.replace(oldPattern, newType);
  console.log('Updated CourseType in common.types.ts');
} else {
  console.log('CourseType not found - check manually');
  // Show what exists
  c.split('\n').forEach((l, i) => {
    if (l.includes('CourseType')) console.log((i+1) + ': ' + l.trim());
  });
}

fs.writeFileSync(f, c, 'utf8');
