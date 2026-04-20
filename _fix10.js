const fs = require('fs');
const ALL_COURSES = '["scratch", "app_inventor", "robotics_basic", "ai_intro", "python", "godot", "robotics_iot", "fastapi", "html_css", "javascript_tailwind", "front_end", "ai_ml", "data_science", "back_end", "raspberry_pi"]';
const OLD = '["scratch", "python", "web", "ai"]';

const files = [
  'src/app/(dashboard)/teachers/[id]/page.tsx',
  'src/components/schedule/schedule-entry-form.tsx',
  'src/components/teachers/teacher-form.tsx',
  'src/services/schedule.service.ts',
  'src/services/teachers.service.ts',
];

let count = 0;
for (const f of files) {
  try {
    let c = fs.readFileSync(f, 'utf8');
    if (c.includes(OLD)) {
      c = c.split(OLD).join(ALL_COURSES);
      fs.writeFileSync(f, c, 'utf8');
      count++;
      console.log('Fixed: ' + f);
    } else {
      console.log('Skip (already done): ' + f);
    }
  } catch (e) {
    console.log('Error: ' + f + ' - ' + e.message);
  }
}

// Fix DEFAULT_SCHEDULE demo data (web -> html_css, ai -> ai_ml)
const sf = 'src/services/schedule.service.ts';
let sc = fs.readFileSync(sf, 'utf8');
sc = sc.replace(/course: "ai"/g, 'course: "ai_ml"');
sc = sc.replace(/course: "web"/g, 'course: "html_css"');
fs.writeFileSync(sf, sc, 'utf8');
console.log('Fixed demo data courses in schedule.service.ts');

// Fix teacher finance TRACKS
const tf = 'src/app/(dashboard)/teachers/[id]/page.tsx';
let tc = fs.readFileSync(tf, 'utf8');
tc = tc.replace(
  /const TRACKS: CourseTypeconst{readdirSync:r,statSync:s,readFileSync:rf}=require('fs'),{join:j}=require('path');let hits=[];function walk(d){try{r(d).forEach(e=>{const p=j(d,e);if(s(p).isDirectory()&&!p.includes('node_modules')&&!p.includes('.next'))walk(p);else if(p.endsWith('.ts')||p.endsWith('.tsx')){const c=rf(p,'utf8');const lines=c.split('\n');lines.forEach((l,i)=>{if(l.match(/['\x22]web['\x22]/)&&(l.includes('course')||l.includes('Course')))hits.push(p+':'+(i+1)+': '+l.trim());if(l.match(/['\x22]ai['\x22]/)&&(l.includes('course')||l.includes('Course'))&&!l.includes('ai_'))hits.push(p+':'+(i+1)+': '+l.trim())})}})}catch(e){}}walk('src');require('child_process').spawn('clip').stdin.end(hits.join('\n'))const{readdirSync:r,statSync:s,readFileSync:rf}=require('fs'),{join:j}=require('path');let hits=[];function walk(d){try{r(d).forEach(e=>{const p=j(d,e);if(s(p).isDirectory()&&!p.includes('node_modules')&&!p.includes('.next'))walk(p);else if(p.endsWith('.ts')||p.endsWith('.tsx')){const c=rf(p,'utf8');const lines=c.split('\n');lines.forEach((l,i)=>{if(l.match(/['\x22]web['\x22]/)&&(l.includes('course')||l.includes('Course')))hits.push(p+':'+(i+1)+': '+l.trim());if(l.match(/['\x22]ai['\x22]/)&&(l.includes('course')||l.includes('Course'))&&!l.includes('ai_'))hits.push(p+':'+(i+1)+': '+l.trim())})}})}catch(e){}}walk('src');require('child_process').spawn('clip').stdin.end(hits.join('\n')) = const{readdirSync:r,statSync:s,readFileSync:rf}=require('fs'),{join:j}=require('path');let hits=[];function walk(d){try{r(d).forEach(e=>{const p=j(d,e);if(s(p).isDirectory()&&!p.includes('node_modules')&&!p.includes('.next'))walk(p);else if(p.endsWith('.ts')||p.endsWith('.tsx')){const c=rf(p,'utf8');const lines=c.split('\n');lines.forEach((l,i)=>{if(l.match(/['\x22]web['\x22]/)&&(l.includes('course')||l.includes('Course')))hits.push(p+':'+(i+1)+': '+l.trim());if(l.match(/['\x22]ai['\x22]/)&&(l.includes('course')||l.includes('Course'))&&!l.includes('ai_'))hits.push(p+':'+(i+1)+': '+l.trim())})}})}catch(e){}}walk('src');require('child_process').spawn('clip').stdin.end(hits.join('\n'))[^const{readdirSync:r,statSync:s,readFileSync:rf}=require('fs'),{join:j}=require('path');let hits=[];function walk(d){try{r(d).forEach(e=>{const p=j(d,e);if(s(p).isDirectory()&&!p.includes('node_modules')&&!p.includes('.next'))walk(p);else if(p.endsWith('.ts')||p.endsWith('.tsx')){const c=rf(p,'utf8');const lines=c.split('\n');lines.forEach((l,i)=>{if(l.match(/['\x22]web['\x22]/)&&(l.includes('course')||l.includes('Course')))hits.push(p+':'+(i+1)+': '+l.trim());if(l.match(/['\x22]ai['\x22]/)&&(l.includes('course')||l.includes('Course'))&&!l.includes('ai_'))hits.push(p+':'+(i+1)+': '+l.trim())})}})}catch(e){}}walk('src');require('child_process').spawn('clip').stdin.end(hits.join('\n'))]*\];/,
  'const TRACKS: CourseType[] = ' + ALL_COURSES + ';'
);
fs.writeFileSync(tf, tc, 'utf8');
console.log('Fixed TRACKS in teacher [id] page');

// Fix teacher-finance.service.ts DEFAULT_TRACK
const ff = 'src/services/teacher-finance.service.ts';
try {
  let fc = fs.readFileSync(ff, 'utf8');
  fc = fc.replace(
    /const DEFAULT_TRACK: Record<CourseType, number> = \{[^}]*\};/,
    'const DEFAULT_TRACK: Record<CourseType, number> = {\n  scratch: 0,\n  app_inventor: 0,\n  robotics_basic: 0,\n  ai_intro: 20,\n  python: 20,\n  godot: 20,\n  robotics_iot: 20,\n  fastapi: 30,\n  html_css: 30,\n  javascript_tailwind: 30,\n  front_end: 30,\n  ai_ml: 40,\n  data_science: 40,\n  back_end: 40,\n  raspberry_pi: 40,\n};'
  );
  // Fix defaultConfig trackAdjustments
  fc = fc.replace(
    /trackAdjustments: \{ \.\.\.DEFAULT_TRACK \}/g,
    'trackAdjustments: { ...DEFAULT_TRACK }'
  );
  // Fix all hardcoded track references in the service
  fc = fc.replace(/scratch: safe\(cached\.trackAdjustments\?\.scratch[^}]*\}/,
    '...Object.fromEntries(Object.keys(DEFAULT_TRACK).map(k => [k, safe((cached.trackAdjustments as any)?.[k], DEFAULT_TRACK[k as CourseType])])) as Record<CourseType, number>'
  );
  fs.writeFileSync(ff, fc, 'utf8');
  console.log('Fixed: teacher-finance.service.ts');
} catch(e) {
  console.log('teacher-finance error: ' + e.message);
}

console.log('\nTotal files fixed: ' + count);
console.log('Run: npm run build');
