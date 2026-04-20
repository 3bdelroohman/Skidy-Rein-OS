const fs = require('fs');
const f = 'src/services/schedule.service.ts';
let c = fs.readFileSync(f, 'utf8');

// Check if trimTime already exists
if (c.includes('function trimTime')) {
  console.log('trimTime already exists - skipping insert');
} else {
  // Add helpers BEFORE mapSessionFromClass function
  const marker = 'function mapSessionFromClass(';
  const helpers = [
    '',
    'function trimTime(v: string): string {',
    '  const p = v.split(":");',
    '  return p.length >= 2 ? p[0] + ":" + p[1] : v;',
    '}',
    '',
    'function cleanClassName(v: string): string {',
    '  return v.replace(/\\s*\\([^)]*\\)\\s*/g, "").trim() || v;',
    '}',
    '',
  ].join('\n');

  const idx = c.indexOf(marker);
  if (idx > 0) {
    c = c.slice(0, idx) + helpers + c.slice(idx);
    console.log('Inserted trimTime + cleanClassName helpers');
  } else {
    console.log('ERROR: could not find mapSessionFromClass marker');
  }
}

// Now apply trimTime and cleanClassName in mapSessionFromSession
// Find: startTime: asString(row.start_time, "16:00"),
// Replace: startTime: trimTime(asString(row.start_time, "16:00")),
const replacements = [
  ['asString(row.start_time, "16:00")', 'trimTime(asString(row.start_time, "16:00"))'],
  ['asString(row.end_time, "17:00")', 'trimTime(asString(row.end_time, "17:00"))'],
  ['asString(classRow?.name ?? row.topic, "Session")', 'cleanClassName(asString(classRow?.name ?? row.topic, "Session"))'],
  ['asString(row.name, "Class")', 'cleanClassName(asString(row.name, "Class"))'],
];

let count = 0;
for (const [from, to] of replacements) {
  // Don't double-wrap
  if (c.includes(to)) {
    console.log('Already applied: ' + to.slice(0, 40) + '...');
    continue;
  }
  if (c.includes(from)) {
    c = c.split(from).join(to);
    count++;
    console.log('Replaced: ' + from.slice(0, 40) + '...');
  } else {
    console.log('Not found: ' + from.slice(0, 40) + '...');
  }
}

fs.writeFileSync(f, c, 'utf8');
console.log('Done. ' + count + ' replacements made.');
