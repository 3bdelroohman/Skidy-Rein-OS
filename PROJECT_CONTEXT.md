# Skidy Rein OS — Full Context for New Chat

## Tech
Next.js 16 + TypeScript strict + Supabase + Tailwind + Zustand
Repo: 3bdelroohman/Skidy-Rein-OS

## DB Tables (Supabase)
app_settings, attendance, audit_log, class_enrollments, classes,
courses, follow_ups, lead_activities, leads, notifications,
parents, payments, profiles, referrals, sessions, students,
teacher_finance_config, teachers, trials

IMPORTANT: schedule table = "sessions" (NOT schedule_sessions)
IMPORTANT: courses table has 4 rows: scratch, python, web, ai

## Data
leads: 96 (85 won, 11 new) | parents: 71 | students: 85
teachers: 10 | sessions: 32 | courses: 4

## Auth Users (all role=admin now)
alaa@skidyrain.com, 3bdelroohman@gmail.com, samar@skidyrain.com,
hagar@skidyrain.com, khaled@skidyrain.com

## Routes: src/app/(dashboard)/...
leads, parents, students, teachers, schedule, payments, reports,
follow-ups, action-center, settings
teachers/finance, teachers/[id], students/[id]/report

## Course Options (from student-form dropdown)
scratch, app_inventor, robotics_basic, ai_intro, python, godot,
robotics_iot, fastapi, html_css, javascript_tailwind, front_end,
ai_ml, data_science, back_end, raspberry_pi

## Completed
- Build clean 22/22 pages
- CRUD all entities
- RLS 30 policies + 19 temp_read policies + Audit 24 triggers
- Teacher finance in Supabase (teacher_finance_config table)
- Duplicate prevention + Auto-enrollment (lead won -> parent+student)
- Pre-push quality gate

## Current Issues (TODO)
1. Schedule: times show HH:MM:SS instead of HH:MM
2. Schedule: class names include dates like "JavaScript(Sun 6:30 PM)"
3. Schedule: cards overflow their boxes
4. Teacher finance: needs duration dropdown + course dropdown (from DB) + editable price
5. Payments/new: student names show in dropdown (WORKING) but need verify

## Rules
1. No schema assumptions - ask first
2. Node.js scripts for Arabic files (not PowerShell)
3. SQL runs in Supabase SQL Editor only (NOT PowerShell)
4. Every fix must keep npm run build clean
5. Big batches not line-by-line
6. PowerShell breaks Arabic UTF-8 - use Node scripts
7. [id] in paths breaks PowerShell - use Node scripts

## How to get any file
node -e "require('child_process').spawn('clip').stdin.end(require('fs').readFileSync('FILE_PATH','utf8'))"

## How to get multiple files
node -e "let o='';['file1','file2'].forEach(f=>{o+='\n=== '+f+' ===\n';try{o+=require('fs').readFileSync(f,'utf8')}catch(e){o+='NOT FOUND'}});require('child_process').spawn('clip').stdin.end(o)"

## How to list all pages
node -e "const{readdirSync:r,statSync:s}=require('fs'),{join:j}=require('path');function walk(d,f=[]){try{r(d).forEach(e=>{const p=j(d,e);s(p).isDirectory()?walk(p,f):e==='page.tsx'&&f.push(p)})}catch(e){}return f}console.log(walk('src').join('\n'))"

