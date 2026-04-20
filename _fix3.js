const fs = require('fs');

// FIX schedule
const f1 = 'src/app/(dashboard)/schedule/page.tsx';
const c1 = fs.readFileSync(f1, 'utf8').split('\n');
for (let i = 0; i < c1.length; i++) {
  if (c1[i].includes('Busiest day') && c1[i].includes('MiniMetric')) {
    c1[i] = '        <MiniMetric label={t(locale, "\u0623\u0643\u062b\u0631 \u064a\u0648\u0645 \u0627\u0632\u062f\u062d\u0627\u0645\u064b\u0627", "Busiest day")} value={getDayLabel(overview.busiestDay, locale) + " (" + overview.busiestDayCount + ")"} />';
    console.log('schedule fixed line ' + (i + 1));
  }
}
fs.writeFileSync(f1, c1.join('\n'), 'utf8');

// FIX teachers
const f2 = 'src/app/(dashboard)/teachers/page.tsx';
const c2 = fs.readFileSync(f2, 'utf8').split('\n');
for (let i = 0; i < c2.length; i++) {
  if (c2[i].includes('Mail') && c2[i].includes('teacher.email')) {
    c2[i] = '                <div className="flex items-center gap-2"><Mail size={14} /><span dir="ltr">{teacher.email ?? t(locale, "\u063a\u064a\u0631 \u0645\u062a\u0648\u0641\u0631", "N/A")}</span></div>';
    console.log('teachers fixed line ' + (i + 1));
  }
}
fs.writeFileSync(f2, c2.join('\n'), 'utf8');

console.log('All done');
