const fs = require('fs');

// ============================================
// Fix 1: Phone dir=ltr in teachers list
// ============================================
function fixTeachersPage() {
  const f = 'src/app/(dashboard)/teachers/page.tsx';
  let c = fs.readFileSync(f, 'utf8');

  // Wrap phone in dir=ltr span
  c = c.replace(
    '<Phone size={14} />{teacher.phone}',
    '<Phone size={14} /><span dir="ltr">{teacher.phone}</span>'
  );

  // Wrap email similarly
  c = c.replace(
    '<Mail size={14} />{teacher.email',
    '<Mail size={14} /><span dir="ltr">{teacher.email}</span'
  );

  fs.writeFileSync(f, c, 'utf8');
  console.log('Fixed: teachers/page.tsx');
}

// ============================================
// Fix 2: Phone dir=ltr in teacher [id] page
// ============================================
function fixTeacherDetails() {
  const f = 'src/app/(dashboard)/teachers/[id]/page.tsx';
  let c = fs.readFileSync(f, 'utf8');

  // Replace Info component to support ltr prop
  c = c.replace(
    'function Info({ icon: Icon, label, value, href }: { icon: typeof Phone; label: string; value: string; href?: string }) {',
    'function Info({ icon: Icon, label, value, href, ltr }: { icon: typeof Phone; label: string; value: string; href?: string; ltr?: boolean }) {'
  );

  // Add dir to value paragraph
  c = c.replace(
    '<p className="mt-1 font-semibold text-foreground">{value}</p>',
    '<p className="mt-1 font-semibold text-foreground" dir={ltr ? "ltr" : undefined}>{value}</p>'
  );

  // Add ltr to Phone Info calls
  c = c.replace(
    '<Info icon={Phone} label={t(locale, "\u0627\u0644\u0647\u0627\u062A\u0641", "Phone")} value={teacher.phone} href={`tel:${teacher.phone}`} />',
    '<Info icon={Phone} label={t(locale, "\u0627\u0644\u0647\u0627\u062A\u0641", "Phone")} value={teacher.phone} href={`tel:${teacher.phone}`} ltr />'
  );

  // Add ltr to Mail Info calls
  c = c.replace(
    '<Info icon={Mail} label={t(locale, "\u0627\u0644\u0628\u0631\u064A\u062F", "Email")} value={teacher.email ?? t(locale, "\u063A\u064A\u0631 \u0645\u062A\u0627\u062D", "N/A")} href={teacher.email ? `mailto:${teacher.email}` : undefined} />',
    '<Info icon={Mail} label={t(locale, "\u0627\u0644\u0628\u0631\u064A\u062F", "Email")} value={teacher.email ?? t(locale, "\u063A\u064A\u0631 \u0645\u062A\u0627\u062D", "N/A")} href={teacher.email ? `mailto:${teacher.email}` : undefined} ltr />'
  );

  fs.writeFileSync(f, c, 'utf8');
  console.log('Fixed: teachers/[id]/page.tsx');
}

// ============================================
// Fix 3: Phone dir=ltr in parent [id] page
// ============================================
function fixParentDetails() {
  const f = 'src/app/(dashboard)/parents/[id]/page.tsx';
  let c = fs.readFileSync(f, 'utf8');

  // Fix subtitle phone
  c = c.replace(
    '<p className="text-sm text-muted-foreground">{parent.phone}</p>',
    '<p className="text-sm text-muted-foreground" dir="ltr">{parent.phone}</p>'
  );

  fs.writeFileSync(f, c, 'utf8');
  console.log('Fixed: parents/[id]/page.tsx');
}

// ============================================
// Fix 4: Schedule - split busiest day metric
// ============================================
function fixSchedule() {
  const f = 'src/app/(dashboard)/schedule/page.tsx';
  let c = fs.readFileSync(f, 'utf8');

  // Remove any remaining bullet characters
  c = c.replace(/\u2022/g, '-');

  // Change grid to 5 cols (already done but let's make sure)
  c = c.replace('xl:grid-cols-4', 'xl:grid-cols-5');

  // Find the busiest day MiniMetric and fix it
  // Look for the pattern with getDayLabel and busiestDayCount together
  const busiestPattern = /(<MiniMetric\s+label=\{t\(locale,\s*"[^"]*",\s*"Busiest day"\)\}\s+value=\{)[^}]*(busiestDayCount)[^}]*(\}\s*\/>)/;
  
  if (busiestPattern.test(c)) {
    c = c.replace(busiestPattern, 
      '\$1getDayLabel(overview.busiestDay, locale)\$3\n        <MiniMetric label={t(locale, "\u0639\u062F\u062F \u0627\u0644\u062D\u0635\u0635", "Sessions")} value={overview.busiestDayCount} />'
    );
  } else {
    // Try simpler approach - find the line with busiestDay value
    const lines = c.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Busiest day') && lines[i].includes('MiniMetric')) {
        // Found the busiest day metric line, check next lines too
        let block = '';
        let j = i;
        while (j < lines.length && !lines[j].includes('/>')) {
          block += lines[j] + '\n';
          j++;
        }
        block += lines[j];
        
        // Check if the value has busiestDayCount mixed in
        if (block.includes('busiestDayCount') || block.includes('getDayLabel')) {
          console.log('Found busiest day block at line ' + (i+1));
        }
      }
    }
  }

  fs.writeFileSync(f, c, 'utf8');
  console.log('Fixed: schedule/page.tsx');
}

// Run
try { fixTeachersPage(); } catch(e) { console.log('Skip teachers: ' + e.message); }
try { fixTeacherDetails(); } catch(e) { console.log('Skip teacher details: ' + e.message); }
try { fixParentDetails(); } catch(e) { console.log('Skip parent details: ' + e.message); }
try { fixSchedule(); } catch(e) { console.log('Skip schedule: ' + e.message); }

console.log('\nDone! Run: npm run build');