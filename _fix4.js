const fs = require('fs');

// ============================================
// FIX 1: Schedule - trim time HH:MM:SS to HH:MM
// ============================================
const f1 = 'src/services/schedule.service.ts';
let c1 = fs.readFileSync(f1, 'utf8');

// Add trimTime helper after asCourse function
const trimTimeFn = 
function trimTime(value: string): string {
  // "10:00:00" -> "10:00"
  const parts = value.split(':');
  if (parts.length >= 2) return parts[0] + ':' + parts[1];
  return value;
}

function cleanClassName(value: string): string {
  // "JavaScript(Sun 6:30 PM)" -> "JavaScript"
  return value.replace(/\s*\([^)]*\)\s*/g, '').trim() || value;
}
;

// Insert after asCourse function
c1 = c1.replace(
  /function asCourse\([^}]+\}/,
  (match) => match + '\n' + trimTimeFn
);

// Apply trimTime to mapSessionFromSession
c1 = c1.replace(
  /startTime: asString\(row\.start_time, "16:00"\)/g,
  'startTime: trimTime(asString(row.start_time, "16:00"))'
);
c1 = c1.replace(
  /endTime: asString\(row\.end_time, "17:00"\)/g,
  'endTime: trimTime(asString(row.end_time, "17:00"))'
);

// Apply cleanClassName
c1 = c1.replace(
  /className: asString\(classRow\?\.name \?\? row\.topic, "Session"\)/g,
  'className: cleanClassName(asString(classRow?.name ?? row.topic, "Session"))'
);
c1 = c1.replace(
  /className: asString\(row\.name, "Class"\)/g,
  'className: cleanClassName(asString(row.name, "Class"))'
);

fs.writeFileSync(f1, c1, 'utf8');
console.log('Fixed: schedule.service.ts (time + className)');

// ============================================
// FIX 2: Schedule page - remove bullet from session card
// ============================================
const f2 = 'src/app/(dashboard)/schedule/page.tsx';
let c2 = fs.readFileSync(f2, 'utf8');

// Replace all remaining bullet-like separators with " | "
c2 = c2.replace(/ - /g, ' | ');

// Fix any remaining encoded bullets
c2 = c2.replace(/\u2022/g, '|');
c2 = c2.replace(/\u2219/g, '|');

fs.writeFileSync(f2, c2, 'utf8');
console.log('Fixed: schedule/page.tsx (separators)');

// ============================================
// FIX 3: Teachers page phone dir=ltr (re-check)
// ============================================
const f3 = 'src/app/(dashboard)/teachers/page.tsx';
let c3 = fs.readFileSync(f3, 'utf8');

// Find the Phone line and check its current state
const phoneLines = c3.split('\n').filter(l => l.includes('teacher.phone') && l.includes('Phone'));
console.log('Phone lines:', phoneLines.map(l => l.trim()));

const mailLines = c3.split('\n').filter(l => l.includes('teacher.email') && l.includes('Mail'));
console.log('Mail lines:', mailLines.map(l => l.trim()));

console.log('\nAll done. Run: npm run build');
