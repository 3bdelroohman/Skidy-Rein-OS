# Skidy Rein OS — Full AI Handover Current

Generated at: 2026-05-15 16:36:33
Project path: C:\Users\3bdel\Documents\Skidy Rein OS
Generator: v1.3

Purpose:
This pack gives another AI model a current, code-grounded understanding of Skidy Rein OS as a product, internal operations system, and possible future Nexo SaaS/productized service.

Safety:
- Read-only source scanner.
- No .env files included.
- Secret-like values masked.
- No production data touched.
- No migrations run.

# Git State
# Git State
Generated at: 2026-05-15 16:36:33


## Current Branch

Command:
```powershell
git branch --show-current
```

Output:
```text
main

```


## Status Short

Command:
```powershell
git status --short
```

Output:
```text
?? .ai-handover-pack/

```


## Status Branch

Command:
```powershell
git status -sb
```

Output:
```text
## main...origin/main
?? .ai-handover-pack/

```


## Current HEAD

Command:
```powershell
git rev-parse HEAD
```

Output:
```text
5545ce5cd94b5e181b09508ca7f50d5cc467267a

```


## Last 20 Commits

Command:
```powershell
git log --oneline -20
```

Output:
```text
5545ce5 feat(students): finalize student edit profile flow
58b8379 perf(db): add missing FK indexes on sessions, payments, class_enrollments (Sprint 5 Batch 5.1)
7f6ed85 fix(groups): remove hardcoded session count from error message (Tech Debt #19) fix(schedule): simplify redundant daysUntil ternary (Tech Debt #20)
c25e707 Merge pull request #1 from 3bdelroohman/feature/sprint-4-navigation-refactor
46144db feat(navigation): clarify sidebar labels and regroup centers (Sprint 4 Batch 4.1)
ac7c078 fix(groups): use type cast to resolve sessionDate TypeScript overload error
4cc07de fix(groups): filter nextSession to future dates only
7a739bd fix(dashboard): decode Unicode escape sequences to native Arabic text
148df1a chore: merge sprint-3-batch-3.14-dashboard-tokens into main
220eadd fix(dashboard): replace hardcoded hex with CSS design tokens in page.tsx
9a745c4 fix: replace hardcoded hex with CSS tokens in dashboard service
56c3949 chore: add patch_*.py to .gitignore
f3d5f8c chore: ignore patch_*.py scripts
a22b450 chore: remove patch scripts from repo
04cf697 fix(payments): dark-mode-safe badge colors, reduce statusCounts to single loop
33672b6 fix(types): register delete_student_cascade RPC in database types
47aabdc fix(students): atomic delete via delete_student_cascade RPC to prevent partial data corruption
fe6faa6 fix(payments): harden invoice number generation with random suffix to prevent race condition duplicates
528e53b fix(leads): clear stale search state, fix subtitle template literal, fix hot leads tone
27d8ecd chore: remove fix_all.py script from repo

```


## Remote URLs

Command:
```powershell
git remote -v
```

Output:
```text
origin	https://github.com/3bdelroohman/Skidy-Rein-OS.git (fetch)
origin	https://github.com/3bdelroohman/Skidy-Rein-OS.git (push)

```


## Uncommitted Changed Files

Command:
```powershell
git diff --name-only
```

Output:
```text
[NO OUTPUT]
```


## Staged Files

Command:
```powershell
git diff --cached --name-only
```

Output:
```text
[NO OUTPUT]
```


## Diff Stat

Command:
```powershell
git diff --stat
```

Output:
```text
[NO OUTPUT]
```


# Package / Stack Snapshot

```json
{
  "name": "skidy-rein-os",
  "version": "1.0.0",
  "description": "Skidy Rein OS — academy management and operations system for education businesses",
  "author": "Abdelrahman",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "check": "npm run lint -- --max-warnings 0 && npm run typecheck && npm run build"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@hookform/resolvers": "^5.2.2",
    "@supabase/ssr": "^0.10.0",
    "@supabase/supabase-js": "^2.101.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "date-fns-jalali": "^4.1.0-0",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.7.0",
    "next": "16.2.2",
    "next-intl": "^4.9.0",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.4.3",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hook-form": "^7.72.0",
    "recharts": "^3.8.1",
    "shadcn": "^4.1.2",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0",
    "zod": "^4.3.6",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20.19.37",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.2",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

```


# Primary Memory and Key Config Files


# File: PROJECT_MEMORY_CURRENT.md

NOT FOUND


# File: README.md

```md
# Skidy Rein OS

لوحة تحكم CRM عربية (RTL) لأكاديمية Skidy Rein لتعليم البرمجة للأطفال أونلاين.

## ما الذي تم في هذه الحزمة؟
- توحيد الترجمات والحالات داخل `src/config/labels.ts`
- إضافة metadata مركزية للألوان والحالات داخل `src/config/status-meta.ts`
- إصلاح `database.types.ts` وتحويله لملف UTF-8 صحيح بدل placeholder معطوب
- إنشاء طبقة خدمات قابلة للتوسعة:
  - `src/services/leads.service.ts`
  - `src/services/follow-ups.service.ts`
  - `src/services/students.service.ts`
  - `src/services/reports.service.ts`
  - `src/services/dashboard.service.ts`
- تحويل صفحات `dashboard / leads / lead details / follow-ups / students / reports` لاستخدام نفس الطبقة
- تشغيل fallback محلي عبر `localStorage` بحيث يستمر النظام بالعمل حتى لو تعطل الاتصال بـ Supabase أو لم تكتمل الـ schema بعد
- إضافة quality gates:
  - `npm run typecheck`
  - `npm run check`
  - GitHub Actions workflow داخل `.github/workflows/ci.yml`

## المبدأ الحالي
المشروع الآن ليس Demo صِرف، وليس Production مكتمل 100%.
هو الآن في مرحلة **Foundation + Realistic Data Flow**:
- يقرأ من Supabase إذا كان الجدول/الأعمدة متاحة
- ويرجع تلقائياً إلى `localStorage + mock data` عند الفشل

هذا يسمح لك بالتطوير التدريجي بدون كسر الواجهة كل مرة.

## التشغيل المحلي
```bash
npm install
npm run dev
```

## فحص الجودة قبل أي push
```bash
npm run typecheck
npm run build
```
أو:
```bash
npm run check
```

## الملفات الأهم للمرحلة القادمة
- `src/config/labels.ts`
- `src/config/status-meta.ts`
- `src/services/leads.service.ts`
- `src/services/follow-ups.service.ts`
- `src/services/dashboard.service.ts`
- `src/services/reports.service.ts`

## المرحلة القادمة المقترحة
1. ربط أعمدة Supabase الحقيقية 1:1 بعد استخراج schema النهائي.
2. بناء Add/Edit Lead على جداول حقيقية بالكامل.
3. إنشاء Activity Timeline كامل من قاعدة البيانات.
4. تحويل Payments وParents وTeachers لنفس طبقة الخدمات.
5. إضافة Server Actions أو Route Handlers للوصول الأكثر أماناً.

```


# File: package.json

```json
{
  "name": "skidy-rein-os",
  "version": "1.0.0",
  "description": "Skidy Rein OS — academy management and operations system for education businesses",
  "author": "Abdelrahman",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "check": "npm run lint -- --max-warnings 0 && npm run typecheck && npm run build"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@hookform/resolvers": "^5.2.2",
    "@supabase/ssr": "^0.10.0",
    "@supabase/supabase-js": "^2.101.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "date-fns-jalali": "^4.1.0-0",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.7.0",
    "next": "16.2.2",
    "next-intl": "^4.9.0",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.4.3",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hook-form": "^7.72.0",
    "recharts": "^3.8.1",
    "shadcn": "^4.1.2",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0",
    "zod": "^4.3.6",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20.19.37",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.2",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

```


# File: tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": [
    "node_modules",
    "_ops/**",
    ".next",
    "src_backup2",
    "src_backup3"
  ]
}
```


# File: next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

```


# File: next.config.mjs

NOT FOUND


# File: tailwind.config.ts

NOT FOUND


# File: postcss.config.mjs

```mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```


# File: eslint.config.mjs

```mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Default ignores of eslint-config-next
    ".next/**",
    "out/**",
    "build/**",
    "_ops/**", "src_backup2/**", "src_backup3/**",
    "next-env.d.ts",

    // Local temp / AI / batch artifacts
    "_*.js",
    "_*.txt",
    "BATCH*_RESULT.txt",
    "CLAUDE_*BUNDLE*.txt",
    "_backup_batch*/**",
  ]),
]);

export default eslintConfig;
```


# Project Tree

```text
.gitattributes
.github/workflows/ci.yml
.gitignore
.husky/pre-push
.vscode/settings.json
_ops/apply-skidy-payments-batch-1.ps1
_ops/cleanup-artifacts.ps1
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
AGENTS.md
CLAUDE.md
components.json
deploy-site.ps1
docs/archive/AUDIT_DUMP.md
docs/archive/IMPLEMENTATION-NOTES.md
docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md
docs/archive/PAYMENTS-UPGRADE-NOTES.md
docs/archive/PHASE7-9-COMBINED-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PHASE-NEXT-NAV-CLEANUP-NOTES.md
docs/archive/PHASE-NEXT-SECURITY-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/FINANCE_RULES.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/migrations/sprint-5-batch-5.1-fk-indexes.sql
docs/NEW-CHAT-PROMPT.txt
docs/NEXT_DEVELOPMENT_BACKLOG.md
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
eslint.config.mjs
next.config.ts
package.json
package-lock.json
postcss.config.mjs
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
README.md
scripts/cleanup-artifacts.ps1
scripts/project-inventory.ps1
src/app/(auth)/login/auth.ts
src/app/(auth)/login/layout.tsx
src/app/(auth)/login/page.tsx
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/follow-ups/page.tsx
src/app/(dashboard)/groups/[id]/edit/page.tsx
src/app/(dashboard)/groups/[id]/page.tsx
src/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/leads/[id]/edit/page.tsx
src/app/(dashboard)/leads/[id]/page.tsx
src/app/(dashboard)/leads/new/page.tsx
src/app/(dashboard)/leads/page.tsx
src/app/(dashboard)/loading.tsx
src/app/(dashboard)/not-found.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/parents/[id]/edit/page.tsx
src/app/(dashboard)/parents/[id]/page.tsx
src/app/(dashboard)/parents/new/page.tsx
src/app/(dashboard)/parents/page.tsx
src/app/(dashboard)/payments/[id]/edit/page.tsx
src/app/(dashboard)/payments/[id]/invoice/page.tsx
src/app/(dashboard)/payments/[id]/page.tsx
src/app/(dashboard)/payments/invoice/[id]/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/app/(dashboard)/reports/page.tsx
src/app/(dashboard)/schedule/[id]/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/settings/page.tsx
src/app/(dashboard)/students/[id]/edit/page.tsx
src/app/(dashboard)/students/[id]/page.tsx
src/app/(dashboard)/students/[id]/report/page.tsx
src/app/(dashboard)/students/new/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/(dashboard)/teachers/[id]/edit/page.tsx
src/app/(dashboard)/teachers/[id]/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/(dashboard)/teachers/new/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/app/error.tsx
src/app/globals.css
src/app/layout.tsx
src/app/not-found.tsx
src/components/groups/group-tasks-panel.tsx
src/components/groups/student-notes-inline.tsx
src/components/layout/dashboard-shell.tsx
src/components/layout/global-search.tsx
src/components/layout/mobile-nav.tsx
src/components/layout/sidebar.tsx
src/components/layout/top-navbar.tsx
src/components/leads/lead-form.tsx
src/components/leads/leads-kanban.tsx
src/components/leads/stage-badge.tsx
src/components/leads/temperature-badge.tsx
src/components/parents/parent-form.tsx
src/components/payments/invoice-toolbar.tsx
src/components/payments/payment-invoice-view.tsx
src/components/providers/theme-provider.tsx
src/components/schedule/schedule-entry-form.tsx
src/components/shared/page-state.tsx
src/components/students/student-form.tsx
src/components/teachers/teacher-form.tsx
src/components/ui/badge.tsx
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/empty-state.tsx
src/components/ui/input.tsx
src/components/ui/label.tsx
src/components/ui/page-header.tsx
src/components/ui/search-bar.tsx
src/components/ui/stat-card.tsx
src/config/course-roadmap.ts
src/config/labels.ts
src/config/navigation.ts
src/config/roles.ts
src/config/stages.ts
src/config/status-meta.ts
src/lib/actions/auth.actions.ts
src/lib/auth.ts
src/lib/formatters.ts
src/lib/locale.ts
src/lib/mock-data.ts
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/teacher-course-utils.ts
src/lib/utils.ts
src/providers/user-provider.tsx
src/services/academic-transfer.service.ts
src/services/account-center.service.ts
src/services/basic-edit.service.ts
src/services/dashboard.service.ts
src/services/data-quality.service.ts
src/services/duplicate-guard.service.ts
src/services/enrollment.service.ts
src/services/follow-ups.service.ts
src/services/group-operations.service.ts
src/services/group-tasks.service.ts
src/services/leads.service.ts
src/services/operations.service.ts
src/services/operations-center.service.ts
src/services/ownership-center.service.ts
src/services/owner-summary.service.ts
src/services/parent-report.service.ts
src/services/parents.service.ts
src/services/payments.service.ts
src/services/relations.service.ts
src/services/reports.service.ts
src/services/schedule.service.ts
src/services/storage.ts
src/services/student-basic-edit.service.ts
src/services/student-enrollment-control.service.ts
src/services/student-finance.service.ts
src/services/student-journey.service.ts
src/services/student-payment-sessions.service.ts
src/services/student-progress-notes.service.ts
src/services/student-report.service.ts
src/services/students.service.ts
src/services/teacher-evaluations.service.ts
src/services/teacher-finance.service.ts
src/services/teacher-reassignment.service.ts
src/services/teachers.service.ts
src/services/teacher-specialization.service.ts
src/stores/ui-store.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src/types/modules.d.ts
src_backup2/app/(auth)/login/auth.ts
src_backup2/app/(auth)/login/layout.tsx
src_backup2/app/(auth)/login/page.tsx
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/follow-ups/page.tsx
src_backup2/app/(dashboard)/groups/[id]/edit/page.tsx
src_backup2/app/(dashboard)/groups/[id]/page.tsx
src_backup2/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/app/(dashboard)/layout.tsx
src_backup2/app/(dashboard)/leads/[id]/edit/page.tsx
src_backup2/app/(dashboard)/leads/[id]/page.tsx
src_backup2/app/(dashboard)/leads/new/page.tsx
src_backup2/app/(dashboard)/leads/page.tsx
src_backup2/app/(dashboard)/loading.tsx
src_backup2/app/(dashboard)/not-found.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/ownership-center/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/app/(dashboard)/parents/[id]/edit/page.tsx
src_backup2/app/(dashboard)/parents/[id]/page.tsx
src_backup2/app/(dashboard)/parents/new/page.tsx
src_backup2/app/(dashboard)/parents/page.tsx
src_backup2/app/(dashboard)/payments/[id]/edit/page.tsx
src_backup2/app/(dashboard)/payments/[id]/invoice/page.tsx
src_backup2/app/(dashboard)/payments/[id]/page.tsx
src_backup2/app/(dashboard)/payments/invoice/[id]/page.tsx
src_backup2/app/(dashboard)/payments/new/page.tsx
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/app/(dashboard)/reports/page.tsx
src_backup2/app/(dashboard)/schedule/[id]/page.tsx
src_backup2/app/(dashboard)/schedule/new/page.tsx
src_backup2/app/(dashboard)/schedule/page.tsx
src_backup2/app/(dashboard)/settings/page.tsx
src_backup2/app/(dashboard)/students/[id]/edit/page.tsx
src_backup2/app/(dashboard)/students/[id]/page.tsx
src_backup2/app/(dashboard)/students/[id]/report/page.tsx
src_backup2/app/(dashboard)/students/new/page.tsx
src_backup2/app/(dashboard)/students/page.tsx
src_backup2/app/(dashboard)/teachers/[id]/edit/page.tsx
src_backup2/app/(dashboard)/teachers/[id]/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
src_backup2/app/(dashboard)/teachers/new/page.tsx
src_backup2/app/(dashboard)/teachers/page.tsx
src_backup2/app/error.tsx
src_backup2/app/globals.css
src_backup2/app/layout.tsx
src_backup2/app/not-found.tsx
src_backup2/components/groups/group-tasks-panel.tsx
src_backup2/components/groups/student-notes-inline.tsx
src_backup2/components/layout/dashboard-shell.tsx
src_backup2/components/layout/global-search.tsx
src_backup2/components/layout/mobile-nav.tsx
src_backup2/components/layout/sidebar.tsx
src_backup2/components/layout/top-navbar.tsx
src_backup2/components/leads/lead-form.tsx
src_backup2/components/leads/leads-kanban.tsx
src_backup2/components/leads/stage-badge.tsx
src_backup2/components/leads/temperature-badge.tsx
src_backup2/components/parents/parent-form.tsx
src_backup2/components/payments/invoice-toolbar.tsx
src_backup2/components/payments/payment-invoice-view.tsx
src_backup2/components/providers/theme-provider.tsx
src_backup2/components/schedule/schedule-entry-form.tsx
src_backup2/components/shared/page-state.tsx
src_backup2/components/students/student-form.tsx
src_backup2/components/teachers/teacher-form.tsx
src_backup2/components/ui/badge.tsx
src_backup2/components/ui/button.tsx
src_backup2/components/ui/card.tsx
src_backup2/components/ui/empty-state.tsx
src_backup2/components/ui/input.tsx
src_backup2/components/ui/label.tsx
src_backup2/components/ui/page-header.tsx
src_backup2/components/ui/search-bar.tsx
src_backup2/components/ui/stat-card.tsx
src_backup2/config/course-roadmap.ts
src_backup2/config/labels.ts
src_backup2/config/navigation.ts
src_backup2/config/roles.ts
src_backup2/config/stages.ts
src_backup2/config/status-meta.ts
src_backup2/lib/actions/auth.actions.ts
src_backup2/lib/auth.ts
src_backup2/lib/formatters.ts
src_backup2/lib/locale.ts
src_backup2/lib/mock-data.ts
src_backup2/lib/supabase/client.ts
src_backup2/lib/supabase/server.ts
src_backup2/lib/teacher-course-utils.ts
src_backup2/lib/utils.ts
src_backup2/providers/user-provider.tsx
src_backup2/services/academic-transfer.service.ts
src_backup2/services/account-center.service.ts
src_backup2/services/basic-edit.service.ts
src_backup2/services/dashboard.service.ts
src_backup2/services/data-quality.service.ts
src_backup2/services/duplicate-guard.service.ts
src_backup2/services/enrollment.service.ts
src_backup2/services/follow-ups.service.ts
src_backup2/services/group-operations.service.ts
src_backup2/services/group-tasks.service.ts
src_backup2/services/leads.service.ts
src_backup2/services/operations.service.ts
src_backup2/services/operations-center.service.ts
src_backup2/services/ownership-center.service.ts
src_backup2/services/owner-summary.service.ts
src_backup2/services/parent-report.service.ts
src_backup2/services/parents.service.ts
src_backup2/services/payments.service.ts
src_backup2/services/relations.service.ts
src_backup2/services/reports.service.ts
src_backup2/services/schedule.service.ts
src_backup2/services/storage.ts
src_backup2/services/student-basic-edit.service.ts
src_backup2/services/student-enrollment-control.service.ts
src_backup2/services/student-finance.service.ts
src_backup2/services/student-journey.service.ts
src_backup2/services/student-payment-sessions.service.ts
src_backup2/services/student-progress-notes.service.ts
src_backup2/services/student-report.service.ts
src_backup2/services/students.service.ts
src_backup2/services/teacher-evaluations.service.ts
src_backup2/services/teacher-finance.service.ts
src_backup2/services/teacher-reassignment.service.ts
src_backup2/services/teachers.service.ts
src_backup2/services/teacher-specialization.service.ts
src_backup2/stores/ui-store.ts
src_backup2/types/common.types.ts
src_backup2/types/crm.ts
src_backup2/types/database.types.ts
src_backup2/types/modules.d.ts
src_backup3/app/(auth)/login/auth.ts
src_backup3/app/(auth)/login/layout.tsx
src_backup3/app/(auth)/login/page.tsx
src_backup3/app/(dashboard)/account-center/page.tsx
src_backup3/app/(dashboard)/action-center/page.tsx
src_backup3/app/(dashboard)/follow-ups/page.tsx
src_backup3/app/(dashboard)/groups/[id]/edit/page.tsx
src_backup3/app/(dashboard)/groups/[id]/page.tsx
src_backup3/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src_backup3/app/(dashboard)/groups/new/page.tsx
src_backup3/app/(dashboard)/groups/page.tsx
src_backup3/app/(dashboard)/layout.tsx
src_backup3/app/(dashboard)/leads/[id]/edit/page.tsx
src_backup3/app/(dashboard)/leads/[id]/page.tsx
src_backup3/app/(dashboard)/leads/new/page.tsx
src_backup3/app/(dashboard)/leads/page.tsx
src_backup3/app/(dashboard)/loading.tsx
src_backup3/app/(dashboard)/not-found.tsx
src_backup3/app/(dashboard)/operations-center/page.tsx
src_backup3/app/(dashboard)/ownership-center/page.tsx
src_backup3/app/(dashboard)/page.tsx
src_backup3/app/(dashboard)/parents/[id]/edit/page.tsx
src_backup3/app/(dashboard)/parents/[id]/page.tsx
src_backup3/app/(dashboard)/parents/new/page.tsx
src_backup3/app/(dashboard)/parents/page.tsx
src_backup3/app/(dashboard)/payments/[id]/edit/page.tsx
src_backup3/app/(dashboard)/payments/[id]/invoice/page.tsx
src_backup3/app/(dashboard)/payments/[id]/page.tsx
src_backup3/app/(dashboard)/payments/invoice/[id]/page.tsx
src_backup3/app/(dashboard)/payments/new/page.tsx
src_backup3/app/(dashboard)/payments/page.tsx
src_backup3/app/(dashboard)/reports/page.tsx
src_backup3/app/(dashboard)/schedule/[id]/page.tsx
src_backup3/app/(dashboard)/schedule/new/page.tsx
src_backup3/app/(dashboard)/schedule/page.tsx
src_backup3/app/(dashboard)/settings/page.tsx
src_backup3/app/(dashboard)/students/[id]/edit/page.tsx
src_backup3/app/(dashboard)/students/[id]/page.tsx
src_backup3/app/(dashboard)/students/[id]/report/page.tsx
src_backup3/app/(dashboard)/students/new/page.tsx
src_backup3/app/(dashboard)/students/page.tsx
src_backup3/app/(dashboard)/teachers/[id]/edit/page.tsx
src_backup3/app/(dashboard)/teachers/[id]/page.tsx
src_backup3/app/(dashboard)/teachers/finance/page.tsx
src_backup3/app/(dashboard)/teachers/new/page.tsx
src_backup3/app/(dashboard)/teachers/page.tsx
src_backup3/app/error.tsx
src_backup3/app/globals.css
src_backup3/app/layout.tsx
src_backup3/app/not-found.tsx
src_backup3/components/groups/group-tasks-panel.tsx
src_backup3/components/groups/student-notes-inline.tsx
src_backup3/components/layout/dashboard-shell.tsx
src_backup3/components/layout/global-search.tsx
src_backup3/components/layout/mobile-nav.tsx
src_backup3/components/layout/sidebar.tsx
src_backup3/components/layout/top-navbar.tsx
src_backup3/components/leads/lead-form.tsx
src_backup3/components/leads/leads-kanban.tsx
src_backup3/components/leads/stage-badge.tsx
src_backup3/components/leads/temperature-badge.tsx
src_backup3/components/parents/parent-form.tsx
src_backup3/components/payments/invoice-toolbar.tsx
src_backup3/components/payments/payment-invoice-view.tsx
src_backup3/components/providers/theme-provider.tsx
src_backup3/components/schedule/schedule-entry-form.tsx
src_backup3/components/shared/page-state.tsx
src_backup3/components/students/student-form.tsx
src_backup3/components/teachers/teacher-form.tsx
src_backup3/components/ui/badge.tsx
src_backup3/components/ui/button.tsx
src_backup3/components/ui/card.tsx
src_backup3/components/ui/empty-state.tsx
src_backup3/components/ui/input.tsx
src_backup3/components/ui/label.tsx
src_backup3/components/ui/page-header.tsx
src_backup3/components/ui/search-bar.tsx
src_backup3/components/ui/stat-card.tsx
src_backup3/config/course-roadmap.ts
src_backup3/config/labels.ts
src_backup3/config/navigation.ts
src_backup3/config/roles.ts
src_backup3/config/stages.ts
src_backup3/config/status-meta.ts
src_backup3/lib/actions/auth.actions.ts
src_backup3/lib/auth.ts
src_backup3/lib/formatters.ts
src_backup3/lib/locale.ts
src_backup3/lib/mock-data.ts
src_backup3/lib/supabase/client.ts
src_backup3/lib/supabase/server.ts
src_backup3/lib/teacher-course-utils.ts
src_backup3/lib/utils.ts
src_backup3/providers/user-provider.tsx
src_backup3/services/academic-transfer.service.ts
src_backup3/services/account-center.service.ts
src_backup3/services/basic-edit.service.ts
src_backup3/services/dashboard.service.ts
src_backup3/services/data-quality.service.ts
src_backup3/services/duplicate-guard.service.ts
src_backup3/services/enrollment.service.ts
src_backup3/services/follow-ups.service.ts
src_backup3/services/group-operations.service.ts
src_backup3/services/group-tasks.service.ts
src_backup3/services/leads.service.ts
src_backup3/services/operations.service.ts
src_backup3/services/operations-center.service.ts
src_backup3/services/ownership-center.service.ts
src_backup3/services/owner-summary.service.ts
src_backup3/services/parent-report.service.ts
src_backup3/services/parents.service.ts
src_backup3/services/payments.service.ts
src_backup3/services/relations.service.ts
src_backup3/services/reports.service.ts
src_backup3/services/schedule.service.ts
src_backup3/services/storage.ts
src_backup3/services/student-basic-edit.service.ts
src_backup3/services/student-enrollment-control.service.ts
src_backup3/services/student-finance.service.ts
src_backup3/services/student-journey.service.ts
src_backup3/services/student-payment-sessions.service.ts
src_backup3/services/student-progress-notes.service.ts
src_backup3/services/student-report.service.ts
src_backup3/services/students.service.ts
src_backup3/services/teacher-evaluations.service.ts
src_backup3/services/teacher-finance.service.ts
src_backup3/services/teacher-reassignment.service.ts
src_backup3/services/teachers.service.ts
src_backup3/services/teacher-specialization.service.ts
src_backup3/stores/ui-store.ts
src_backup3/types/common.types.ts
src_backup3/types/crm.ts
src_backup3/types/database.types.ts
src_backup3/types/modules.d.ts
supabase/migrations/20250101000001_duplicate_constraints.sql
supabase/migrations/20250101000002_teacher_finance_table.sql
supabase/migrations/20250101000004_fix_teacher_finance_cols.sql
supabase/migrations/20250101000005_rls_policies.sql
supabase/migrations/20250101000006_cleanup_old_policies.sql
supabase/migrations/20250101000007_audit_triggers.sql
supabase/migrations/20250101000008_extend_course_type_enum.sql
supabase/migrations/20250101000009_rls_safe_foundation.sql
supabase/migrations/20250101000010_remove_temp_read_parents_profiles.sql
supabase/migrations/20250101000011_remove_temp_read_students.sql
supabase/migrations/20250101000012_remove_temp_read_payments.sql
supabase/migrations/20250101000013_remove_temp_read_leads.sql
supabase/migrations/20250101000014_followups_ops_safe_foundation.sql
supabase/migrations/20250101000015_remove_temp_read_followups.sql
supabase/migrations/20250101000016_remove_temp_read_courses.sql
supabase/migrations/20250101000017_academic_read_foundation.sql
supabase/migrations/20250101000018_remove_temp_read_academic_ops.sql
supabase/migrations/20250101000019_teachers_read_and_remove_temp.sql
supabase/migrations/20250101000020_trials_referrals_notifications_foundation.sql
supabase/migrations/20250101000021_remove_temp_read_trials_referrals_notifications.sql
supabase/migrations/20250101000022_remove_final_temp_read_policies.sql
supabase/migrations/20250101000023_allow_sales_parent_student_write.sql
supabase/migrations/20250101000024_manual_group_finance_collection_fields.sql
tsconfig.json
```


# Routes and App Structure
# Routes and App Structure
Generated at: 2026-05-15 16:36:33


## App Router Files
```text
src/app/(auth)/login/layout.tsx
src/app/(auth)/login/page.tsx
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/follow-ups/page.tsx
src/app/(dashboard)/groups/[id]/edit/page.tsx
src/app/(dashboard)/groups/[id]/page.tsx
src/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/leads/[id]/edit/page.tsx
src/app/(dashboard)/leads/[id]/page.tsx
src/app/(dashboard)/leads/new/page.tsx
src/app/(dashboard)/leads/page.tsx
src/app/(dashboard)/loading.tsx
src/app/(dashboard)/not-found.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/parents/[id]/edit/page.tsx
src/app/(dashboard)/parents/[id]/page.tsx
src/app/(dashboard)/parents/new/page.tsx
src/app/(dashboard)/parents/page.tsx
src/app/(dashboard)/payments/[id]/edit/page.tsx
src/app/(dashboard)/payments/[id]/invoice/page.tsx
src/app/(dashboard)/payments/[id]/page.tsx
src/app/(dashboard)/payments/invoice/[id]/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/app/(dashboard)/reports/page.tsx
src/app/(dashboard)/schedule/[id]/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/settings/page.tsx
src/app/(dashboard)/students/[id]/edit/page.tsx
src/app/(dashboard)/students/[id]/page.tsx
src/app/(dashboard)/students/[id]/report/page.tsx
src/app/(dashboard)/students/new/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/(dashboard)/teachers/[id]/edit/page.tsx
src/app/(dashboard)/teachers/[id]/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/(dashboard)/teachers/new/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/app/error.tsx
src/app/layout.tsx
src/app/not-found.tsx
```


## Approximate Page Routes
```text
/
/account-center
/action-center
/follow-ups
/groups
/groups/[id]
/groups/[id]/edit
/groups/[id]/report/[studentId]
/groups/new
/leads
/leads/[id]
/leads/[id]/edit
/leads/new
/login
/operations-center
/ownership-center
/parents
/parents/[id]
/parents/[id]/edit
/parents/new
/payments
/payments/[id]
/payments/[id]/edit
/payments/[id]/invoice
/payments/invoice/[id]
/payments/new
/reports
/schedule
/schedule/[id]
/schedule/new
/settings
/students
/students/[id]
/students/[id]/edit
/students/[id]/report
/students/new
/teachers
/teachers/[id]
/teachers/[id]/edit
/teachers/finance
/teachers/new
```


# Product and Domain Signals
# Product and Domain Signals
Generated at: 2026-05-15 16:36:33

Mode: DeepProductScan


## Keyword in paths: lead
```text
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
src/app/(dashboard)/leads/[id]/edit/page.tsx
src/app/(dashboard)/leads/[id]/page.tsx
src/app/(dashboard)/leads/new/page.tsx
src/app/(dashboard)/leads/page.tsx
src/components/leads/lead-form.tsx
src/components/leads/leads-kanban.tsx
src/components/leads/stage-badge.tsx
src/components/leads/temperature-badge.tsx
src/services/leads.service.ts
src_backup2/app/(dashboard)/leads/[id]/edit/page.tsx
src_backup2/app/(dashboard)/leads/[id]/page.tsx
src_backup2/app/(dashboard)/leads/new/page.tsx
src_backup2/app/(dashboard)/leads/page.tsx
src_backup2/components/leads/lead-form.tsx
src_backup2/components/leads/leads-kanban.tsx
src_backup2/components/leads/stage-badge.tsx
src_backup2/components/leads/temperature-badge.tsx
src_backup2/services/leads.service.ts
src_backup3/app/(dashboard)/leads/[id]/edit/page.tsx
src_backup3/app/(dashboard)/leads/[id]/page.tsx
src_backup3/app/(dashboard)/leads/new/page.tsx
src_backup3/app/(dashboard)/leads/page.tsx
src_backup3/components/leads/lead-form.tsx
src_backup3/components/leads/leads-kanban.tsx
src_backup3/components/leads/stage-badge.tsx
src_backup3/components/leads/temperature-badge.tsx
src_backup3/services/leads.service.ts
supabase/migrations/20250101000013_remove_temp_read_leads.sql
```


## Keyword in paths: leads
```text
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
src/app/(dashboard)/leads/[id]/edit/page.tsx
src/app/(dashboard)/leads/[id]/page.tsx
src/app/(dashboard)/leads/new/page.tsx
src/app/(dashboard)/leads/page.tsx
src/components/leads/lead-form.tsx
src/components/leads/leads-kanban.tsx
src/components/leads/stage-badge.tsx
src/components/leads/temperature-badge.tsx
src/services/leads.service.ts
src_backup2/app/(dashboard)/leads/[id]/edit/page.tsx
src_backup2/app/(dashboard)/leads/[id]/page.tsx
src_backup2/app/(dashboard)/leads/new/page.tsx
src_backup2/app/(dashboard)/leads/page.tsx
src_backup2/components/leads/lead-form.tsx
src_backup2/components/leads/leads-kanban.tsx
src_backup2/components/leads/stage-badge.tsx
src_backup2/components/leads/temperature-badge.tsx
src_backup2/services/leads.service.ts
src_backup3/app/(dashboard)/leads/[id]/edit/page.tsx
src_backup3/app/(dashboard)/leads/[id]/page.tsx
src_backup3/app/(dashboard)/leads/new/page.tsx
src_backup3/app/(dashboard)/leads/page.tsx
src_backup3/components/leads/lead-form.tsx
src_backup3/components/leads/leads-kanban.tsx
src_backup3/components/leads/stage-badge.tsx
src_backup3/components/leads/temperature-badge.tsx
src_backup3/services/leads.service.ts
supabase/migrations/20250101000013_remove_temp_read_leads.sql
```


## Keyword in paths: student
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
src/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src/app/(dashboard)/students/[id]/edit/page.tsx
src/app/(dashboard)/students/[id]/page.tsx
src/app/(dashboard)/students/[id]/report/page.tsx
src/app/(dashboard)/students/new/page.tsx
src/app/(dashboard)/students/page.tsx
src/components/groups/student-notes-inline.tsx
src/components/students/student-form.tsx
src/services/student-basic-edit.service.ts
src/services/student-enrollment-control.service.ts
src/services/student-finance.service.ts
src/services/student-journey.service.ts
src/services/student-payment-sessions.service.ts
src/services/student-progress-notes.service.ts
src/services/student-report.service.ts
src/services/students.service.ts
src_backup2/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src_backup2/app/(dashboard)/students/[id]/edit/page.tsx
src_backup2/app/(dashboard)/students/[id]/page.tsx
src_backup2/app/(dashboard)/students/[id]/report/page.tsx
src_backup2/app/(dashboard)/students/new/page.tsx
src_backup2/app/(dashboard)/students/page.tsx
src_backup2/components/groups/student-notes-inline.tsx
src_backup2/components/students/student-form.tsx
src_backup2/services/student-basic-edit.service.ts
src_backup2/services/student-enrollment-control.service.ts
src_backup2/services/student-finance.service.ts
src_backup2/services/student-journey.service.ts
src_backup2/services/student-payment-sessions.service.ts
src_backup2/services/student-progress-notes.service.ts
src_backup2/services/student-report.service.ts
src_backup2/services/students.service.ts
src_backup3/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src_backup3/app/(dashboard)/students/[id]/edit/page.tsx
src_backup3/app/(dashboard)/students/[id]/page.tsx
src_backup3/app/(dashboard)/students/[id]/report/page.tsx
src_backup3/app/(dashboard)/students/new/page.tsx
src_backup3/app/(dashboard)/students/page.tsx
src_backup3/components/groups/student-notes-inline.tsx
src_backup3/components/students/student-form.tsx
src_backup3/services/student-basic-edit.service.ts
src_backup3/services/student-enrollment-control.service.ts
src_backup3/services/student-finance.service.ts
src_backup3/services/student-journey.service.ts
src_backup3/services/student-payment-sessions.service.ts
src_backup3/services/student-progress-notes.service.ts
src_backup3/services/student-report.service.ts
src_backup3/services/students.service.ts
supabase/migrations/20250101000011_remove_temp_read_students.sql
supabase/migrations/20250101000023_allow_sales_parent_student_write.sql
```


## Keyword in paths: students
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
src/app/(dashboard)/students/[id]/edit/page.tsx
src/app/(dashboard)/students/[id]/page.tsx
src/app/(dashboard)/students/[id]/report/page.tsx
src/app/(dashboard)/students/new/page.tsx
src/app/(dashboard)/students/page.tsx
src/components/students/student-form.tsx
src/services/students.service.ts
src_backup2/app/(dashboard)/students/[id]/edit/page.tsx
src_backup2/app/(dashboard)/students/[id]/page.tsx
src_backup2/app/(dashboard)/students/[id]/report/page.tsx
src_backup2/app/(dashboard)/students/new/page.tsx
src_backup2/app/(dashboard)/students/page.tsx
src_backup2/components/students/student-form.tsx
src_backup2/services/students.service.ts
src_backup3/app/(dashboard)/students/[id]/edit/page.tsx
src_backup3/app/(dashboard)/students/[id]/page.tsx
src_backup3/app/(dashboard)/students/[id]/report/page.tsx
src_backup3/app/(dashboard)/students/new/page.tsx
src_backup3/app/(dashboard)/students/page.tsx
src_backup3/components/students/student-form.tsx
src_backup3/services/students.service.ts
supabase/migrations/20250101000011_remove_temp_read_students.sql
```


## Keyword in paths: parent
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
src/app/(dashboard)/parents/[id]/edit/page.tsx
src/app/(dashboard)/parents/[id]/page.tsx
src/app/(dashboard)/parents/new/page.tsx
src/app/(dashboard)/parents/page.tsx
src/components/parents/parent-form.tsx
src/services/parent-report.service.ts
src/services/parents.service.ts
src_backup2/app/(dashboard)/parents/[id]/edit/page.tsx
src_backup2/app/(dashboard)/parents/[id]/page.tsx
src_backup2/app/(dashboard)/parents/new/page.tsx
src_backup2/app/(dashboard)/parents/page.tsx
src_backup2/components/parents/parent-form.tsx
src_backup2/services/parent-report.service.ts
src_backup2/services/parents.service.ts
src_backup3/app/(dashboard)/parents/[id]/edit/page.tsx
src_backup3/app/(dashboard)/parents/[id]/page.tsx
src_backup3/app/(dashboard)/parents/new/page.tsx
src_backup3/app/(dashboard)/parents/page.tsx
src_backup3/components/parents/parent-form.tsx
src_backup3/services/parent-report.service.ts
src_backup3/services/parents.service.ts
supabase/migrations/20250101000010_remove_temp_read_parents_profiles.sql
supabase/migrations/20250101000023_allow_sales_parent_student_write.sql
```


## Keyword in paths: parents
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
src/app/(dashboard)/parents/[id]/edit/page.tsx
src/app/(dashboard)/parents/[id]/page.tsx
src/app/(dashboard)/parents/new/page.tsx
src/app/(dashboard)/parents/page.tsx
src/components/parents/parent-form.tsx
src/services/parents.service.ts
src_backup2/app/(dashboard)/parents/[id]/edit/page.tsx
src_backup2/app/(dashboard)/parents/[id]/page.tsx
src_backup2/app/(dashboard)/parents/new/page.tsx
src_backup2/app/(dashboard)/parents/page.tsx
src_backup2/components/parents/parent-form.tsx
src_backup2/services/parents.service.ts
src_backup3/app/(dashboard)/parents/[id]/edit/page.tsx
src_backup3/app/(dashboard)/parents/[id]/page.tsx
src_backup3/app/(dashboard)/parents/new/page.tsx
src_backup3/app/(dashboard)/parents/page.tsx
src_backup3/components/parents/parent-form.tsx
src_backup3/services/parents.service.ts
supabase/migrations/20250101000010_remove_temp_read_parents_profiles.sql
```


## Keyword in paths: teacher
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
src/app/(dashboard)/teachers/[id]/edit/page.tsx
src/app/(dashboard)/teachers/[id]/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/(dashboard)/teachers/new/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/components/teachers/teacher-form.tsx
src/lib/teacher-course-utils.ts
src/services/teacher-evaluations.service.ts
src/services/teacher-finance.service.ts
src/services/teacher-reassignment.service.ts
src/services/teachers.service.ts
src/services/teacher-specialization.service.ts
src_backup2/app/(dashboard)/teachers/[id]/edit/page.tsx
src_backup2/app/(dashboard)/teachers/[id]/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
src_backup2/app/(dashboard)/teachers/new/page.tsx
src_backup2/app/(dashboard)/teachers/page.tsx
src_backup2/components/teachers/teacher-form.tsx
src_backup2/lib/teacher-course-utils.ts
src_backup2/services/teacher-evaluations.service.ts
src_backup2/services/teacher-finance.service.ts
src_backup2/services/teacher-reassignment.service.ts
src_backup2/services/teachers.service.ts
src_backup2/services/teacher-specialization.service.ts
src_backup3/app/(dashboard)/teachers/[id]/edit/page.tsx
src_backup3/app/(dashboard)/teachers/[id]/page.tsx
src_backup3/app/(dashboard)/teachers/finance/page.tsx
src_backup3/app/(dashboard)/teachers/new/page.tsx
src_backup3/app/(dashboard)/teachers/page.tsx
src_backup3/components/teachers/teacher-form.tsx
src_backup3/lib/teacher-course-utils.ts
src_backup3/services/teacher-evaluations.service.ts
src_backup3/services/teacher-finance.service.ts
src_backup3/services/teacher-reassignment.service.ts
src_backup3/services/teachers.service.ts
src_backup3/services/teacher-specialization.service.ts
supabase/migrations/20250101000002_teacher_finance_table.sql
supabase/migrations/20250101000004_fix_teacher_finance_cols.sql
supabase/migrations/20250101000019_teachers_read_and_remove_temp.sql
```


## Keyword in paths: teachers
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
src/app/(dashboard)/teachers/[id]/edit/page.tsx
src/app/(dashboard)/teachers/[id]/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/(dashboard)/teachers/new/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/components/teachers/teacher-form.tsx
src/services/teachers.service.ts
src_backup2/app/(dashboard)/teachers/[id]/edit/page.tsx
src_backup2/app/(dashboard)/teachers/[id]/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
src_backup2/app/(dashboard)/teachers/new/page.tsx
src_backup2/app/(dashboard)/teachers/page.tsx
src_backup2/components/teachers/teacher-form.tsx
src_backup2/services/teachers.service.ts
src_backup3/app/(dashboard)/teachers/[id]/edit/page.tsx
src_backup3/app/(dashboard)/teachers/[id]/page.tsx
src_backup3/app/(dashboard)/teachers/finance/page.tsx
src_backup3/app/(dashboard)/teachers/new/page.tsx
src_backup3/app/(dashboard)/teachers/page.tsx
src_backup3/components/teachers/teacher-form.tsx
src_backup3/services/teachers.service.ts
supabase/migrations/20250101000019_teachers_read_and_remove_temp.sql
```


## Keyword in paths: group
```text
src/app/(dashboard)/groups/[id]/edit/page.tsx
src/app/(dashboard)/groups/[id]/page.tsx
src/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/components/groups/group-tasks-panel.tsx
src/components/groups/student-notes-inline.tsx
src/services/group-operations.service.ts
src/services/group-tasks.service.ts
src_backup2/app/(dashboard)/groups/[id]/edit/page.tsx
src_backup2/app/(dashboard)/groups/[id]/page.tsx
src_backup2/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/components/groups/group-tasks-panel.tsx
src_backup2/components/groups/student-notes-inline.tsx
src_backup2/services/group-operations.service.ts
src_backup2/services/group-tasks.service.ts
src_backup3/app/(dashboard)/groups/[id]/edit/page.tsx
src_backup3/app/(dashboard)/groups/[id]/page.tsx
src_backup3/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src_backup3/app/(dashboard)/groups/new/page.tsx
src_backup3/app/(dashboard)/groups/page.tsx
src_backup3/components/groups/group-tasks-panel.tsx
src_backup3/components/groups/student-notes-inline.tsx
src_backup3/services/group-operations.service.ts
src_backup3/services/group-tasks.service.ts
supabase/migrations/20250101000024_manual_group_finance_collection_fields.sql
```


## Keyword in paths: groups
```text
src/app/(dashboard)/groups/[id]/edit/page.tsx
src/app/(dashboard)/groups/[id]/page.tsx
src/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/components/groups/group-tasks-panel.tsx
src/components/groups/student-notes-inline.tsx
src_backup2/app/(dashboard)/groups/[id]/edit/page.tsx
src_backup2/app/(dashboard)/groups/[id]/page.tsx
src_backup2/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/components/groups/group-tasks-panel.tsx
src_backup2/components/groups/student-notes-inline.tsx
src_backup3/app/(dashboard)/groups/[id]/edit/page.tsx
src_backup3/app/(dashboard)/groups/[id]/page.tsx
src_backup3/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src_backup3/app/(dashboard)/groups/new/page.tsx
src_backup3/app/(dashboard)/groups/page.tsx
src_backup3/components/groups/group-tasks-panel.tsx
src_backup3/components/groups/student-notes-inline.tsx
```


## Keyword in paths: class
No path matches.


## Keyword in paths: classes
No path matches.


## Keyword in paths: center
```text
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/services/account-center.service.ts
src/services/operations-center.service.ts
src/services/ownership-center.service.ts
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/ownership-center/page.tsx
src_backup2/services/account-center.service.ts
src_backup2/services/operations-center.service.ts
src_backup2/services/ownership-center.service.ts
src_backup3/app/(dashboard)/account-center/page.tsx
src_backup3/app/(dashboard)/action-center/page.tsx
src_backup3/app/(dashboard)/operations-center/page.tsx
src_backup3/app/(dashboard)/ownership-center/page.tsx
src_backup3/services/account-center.service.ts
src_backup3/services/operations-center.service.ts
src_backup3/services/ownership-center.service.ts
```


## Keyword in paths: centers
No path matches.


## Keyword in paths: course
```text
src/config/course-roadmap.ts
src/lib/teacher-course-utils.ts
src_backup2/config/course-roadmap.ts
src_backup2/lib/teacher-course-utils.ts
src_backup3/config/course-roadmap.ts
src_backup3/lib/teacher-course-utils.ts
supabase/migrations/20250101000008_extend_course_type_enum.sql
supabase/migrations/20250101000016_remove_temp_read_courses.sql
```


## Keyword in paths: courses
```text
supabase/migrations/20250101000016_remove_temp_read_courses.sql
```


## Keyword in paths: payment
```text
_ops/apply-skidy-payments-batch-1.ps1
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md
docs/archive/PAYMENTS-UPGRADE-NOTES.md
src/app/(dashboard)/payments/[id]/edit/page.tsx
src/app/(dashboard)/payments/[id]/invoice/page.tsx
src/app/(dashboard)/payments/[id]/page.tsx
src/app/(dashboard)/payments/invoice/[id]/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/components/payments/invoice-toolbar.tsx
src/components/payments/payment-invoice-view.tsx
src/services/payments.service.ts
src/services/student-payment-sessions.service.ts
src_backup2/app/(dashboard)/payments/[id]/edit/page.tsx
src_backup2/app/(dashboard)/payments/[id]/invoice/page.tsx
src_backup2/app/(dashboard)/payments/[id]/page.tsx
src_backup2/app/(dashboard)/payments/invoice/[id]/page.tsx
src_backup2/app/(dashboard)/payments/new/page.tsx
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/components/payments/invoice-toolbar.tsx
src_backup2/components/payments/payment-invoice-view.tsx
src_backup2/services/payments.service.ts
src_backup2/services/student-payment-sessions.service.ts
src_backup3/app/(dashboard)/payments/[id]/edit/page.tsx
src_backup3/app/(dashboard)/payments/[id]/invoice/page.tsx
src_backup3/app/(dashboard)/payments/[id]/page.tsx
src_backup3/app/(dashboard)/payments/invoice/[id]/page.tsx
src_backup3/app/(dashboard)/payments/new/page.tsx
src_backup3/app/(dashboard)/payments/page.tsx
src_backup3/components/payments/invoice-toolbar.tsx
src_backup3/components/payments/payment-invoice-view.tsx
src_backup3/services/payments.service.ts
src_backup3/services/student-payment-sessions.service.ts
supabase/migrations/20250101000012_remove_temp_read_payments.sql
```


## Keyword in paths: payments
```text
_ops/apply-skidy-payments-batch-1.ps1
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md
docs/archive/PAYMENTS-UPGRADE-NOTES.md
src/app/(dashboard)/payments/[id]/edit/page.tsx
src/app/(dashboard)/payments/[id]/invoice/page.tsx
src/app/(dashboard)/payments/[id]/page.tsx
src/app/(dashboard)/payments/invoice/[id]/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/components/payments/invoice-toolbar.tsx
src/components/payments/payment-invoice-view.tsx
src/services/payments.service.ts
src_backup2/app/(dashboard)/payments/[id]/edit/page.tsx
src_backup2/app/(dashboard)/payments/[id]/invoice/page.tsx
src_backup2/app/(dashboard)/payments/[id]/page.tsx
src_backup2/app/(dashboard)/payments/invoice/[id]/page.tsx
src_backup2/app/(dashboard)/payments/new/page.tsx
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/components/payments/invoice-toolbar.tsx
src_backup2/components/payments/payment-invoice-view.tsx
src_backup2/services/payments.service.ts
src_backup3/app/(dashboard)/payments/[id]/edit/page.tsx
src_backup3/app/(dashboard)/payments/[id]/invoice/page.tsx
src_backup3/app/(dashboard)/payments/[id]/page.tsx
src_backup3/app/(dashboard)/payments/invoice/[id]/page.tsx
src_backup3/app/(dashboard)/payments/new/page.tsx
src_backup3/app/(dashboard)/payments/page.tsx
src_backup3/components/payments/invoice-toolbar.tsx
src_backup3/components/payments/payment-invoice-view.tsx
src_backup3/services/payments.service.ts
supabase/migrations/20250101000012_remove_temp_read_payments.sql
```


## Keyword in paths: invoice
```text
src/app/(dashboard)/payments/[id]/invoice/page.tsx
src/app/(dashboard)/payments/invoice/[id]/page.tsx
src/components/payments/invoice-toolbar.tsx
src/components/payments/payment-invoice-view.tsx
src_backup2/app/(dashboard)/payments/[id]/invoice/page.tsx
src_backup2/app/(dashboard)/payments/invoice/[id]/page.tsx
src_backup2/components/payments/invoice-toolbar.tsx
src_backup2/components/payments/payment-invoice-view.tsx
src_backup3/app/(dashboard)/payments/[id]/invoice/page.tsx
src_backup3/app/(dashboard)/payments/invoice/[id]/page.tsx
src_backup3/components/payments/invoice-toolbar.tsx
src_backup3/components/payments/payment-invoice-view.tsx
```


## Keyword in paths: invoices
No path matches.


## Keyword in paths: follow
```text
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
src/app/(dashboard)/follow-ups/page.tsx
src/services/follow-ups.service.ts
src_backup2/app/(dashboard)/follow-ups/page.tsx
src_backup2/services/follow-ups.service.ts
src_backup3/app/(dashboard)/follow-ups/page.tsx
src_backup3/services/follow-ups.service.ts
supabase/migrations/20250101000014_followups_ops_safe_foundation.sql
supabase/migrations/20250101000015_remove_temp_read_followups.sql
```


## Keyword in paths: follow-up
```text
src/app/(dashboard)/follow-ups/page.tsx
src/services/follow-ups.service.ts
src_backup2/app/(dashboard)/follow-ups/page.tsx
src_backup2/services/follow-ups.service.ts
src_backup3/app/(dashboard)/follow-ups/page.tsx
src_backup3/services/follow-ups.service.ts
```


## Keyword in paths: schedule
```text
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
src/app/(dashboard)/schedule/[id]/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/components/schedule/schedule-entry-form.tsx
src/services/schedule.service.ts
src_backup2/app/(dashboard)/schedule/[id]/page.tsx
src_backup2/app/(dashboard)/schedule/new/page.tsx
src_backup2/app/(dashboard)/schedule/page.tsx
src_backup2/components/schedule/schedule-entry-form.tsx
src_backup2/services/schedule.service.ts
src_backup3/app/(dashboard)/schedule/[id]/page.tsx
src_backup3/app/(dashboard)/schedule/new/page.tsx
src_backup3/app/(dashboard)/schedule/page.tsx
src_backup3/components/schedule/schedule-entry-form.tsx
src_backup3/services/schedule.service.ts
```


## Keyword in paths: session
```text
src/services/student-payment-sessions.service.ts
src_backup2/services/student-payment-sessions.service.ts
src_backup3/services/student-payment-sessions.service.ts
```


## Keyword in paths: attendance
No path matches.


## Keyword in paths: report
```text
src/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src/app/(dashboard)/reports/page.tsx
src/app/(dashboard)/students/[id]/report/page.tsx
src/services/parent-report.service.ts
src/services/reports.service.ts
src/services/student-report.service.ts
src_backup2/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src_backup2/app/(dashboard)/reports/page.tsx
src_backup2/app/(dashboard)/students/[id]/report/page.tsx
src_backup2/services/parent-report.service.ts
src_backup2/services/reports.service.ts
src_backup2/services/student-report.service.ts
src_backup3/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src_backup3/app/(dashboard)/reports/page.tsx
src_backup3/app/(dashboard)/students/[id]/report/page.tsx
src_backup3/services/parent-report.service.ts
src_backup3/services/reports.service.ts
src_backup3/services/student-report.service.ts
```


## Keyword in paths: dashboard
```text
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/follow-ups/page.tsx
src/app/(dashboard)/groups/[id]/edit/page.tsx
src/app/(dashboard)/groups/[id]/page.tsx
src/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/leads/[id]/edit/page.tsx
src/app/(dashboard)/leads/[id]/page.tsx
src/app/(dashboard)/leads/new/page.tsx
src/app/(dashboard)/leads/page.tsx
src/app/(dashboard)/loading.tsx
src/app/(dashboard)/not-found.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/parents/[id]/edit/page.tsx
src/app/(dashboard)/parents/[id]/page.tsx
src/app/(dashboard)/parents/new/page.tsx
src/app/(dashboard)/parents/page.tsx
src/app/(dashboard)/payments/[id]/edit/page.tsx
src/app/(dashboard)/payments/[id]/invoice/page.tsx
src/app/(dashboard)/payments/[id]/page.tsx
src/app/(dashboard)/payments/invoice/[id]/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/app/(dashboard)/reports/page.tsx
src/app/(dashboard)/schedule/[id]/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/settings/page.tsx
src/app/(dashboard)/students/[id]/edit/page.tsx
src/app/(dashboard)/students/[id]/page.tsx
src/app/(dashboard)/students/[id]/report/page.tsx
src/app/(dashboard)/students/new/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/(dashboard)/teachers/[id]/edit/page.tsx
src/app/(dashboard)/teachers/[id]/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/(dashboard)/teachers/new/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/components/layout/dashboard-shell.tsx
src/services/dashboard.service.ts
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/follow-ups/page.tsx
src_backup2/app/(dashboard)/groups/[id]/edit/page.tsx
src_backup2/app/(dashboard)/groups/[id]/page.tsx
src_backup2/app/(dashboard)/groups/[id]/report/[studentId]/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/app/(dashboard)/layout.tsx
src_backup2/app/(dashboard)/leads/[id]/edit/page.tsx
src_backup2/app/(dashboard)/leads/[id]/page.tsx
src_backup2/app/(dashboard)/leads/new/page.tsx
src_backup2/app/(dashboard)/leads/page.tsx
src_backup2/app/(dashboard)/loading.tsx
src_backup2/app/(dashboard)/not-found.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/ownership-center/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/app/(dashboard)/parents/[id]/edit/page.tsx
src_backup2/app/(dashboard)/parents/[id]/page.tsx
src_backup2/app/(dashboard)/parents/new/page.tsx
src_backup2/app/(dashboard)/parents/page.tsx
src_backup2/app/(dashboard)/payments/[id]/edit/page.tsx
src_backup2/app/(dashboard)/payments/[id]/invoice/page.tsx
src_backup2/app/(dashboard)/payments/[id]/page.tsx
src_backup2/app/(dashboard)/payments/invoice/[id]/page.tsx
src_backup2/app/(dashboard)/payments/new/page.tsx
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/app/(dashboard)/reports/page.tsx
src_backup2/app/(dashboard)/schedule/[id]/page.tsx
src_backup2/app/(dashboard)/schedule/new/page.tsx
src_backup2/app/(dashboard)/schedule/page.tsx
src_backup2/app/(dashboard)/settings/page.tsx
src_backup2/app/(dashboard)/students/[id]/edit/page.tsx
src_backup2/app/(dashboard)/students/[id]/page.tsx
```
More matches omitted: 55


## Keyword in paths: trial
```text
supabase/migrations/20250101000020_trials_referrals_notifications_foundation.sql
supabase/migrations/20250101000021_remove_temp_read_trials_referrals_notifications.sql
```


## Keyword in paths: enrollment
```text
src/services/enrollment.service.ts
src/services/student-enrollment-control.service.ts
src_backup2/services/enrollment.service.ts
src_backup2/services/student-enrollment-control.service.ts
src_backup3/services/enrollment.service.ts
src_backup3/services/student-enrollment-control.service.ts
```


## Keyword in paths: enrolled
No path matches.


## Keyword in paths: qualified
No path matches.


## Keyword in paths: price
No path matches.


## Keyword in paths: pricing
No path matches.


## Keyword in paths: role
```text
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
src/config/roles.ts
src_backup2/config/roles.ts
src_backup3/config/roles.ts
```


## Keyword in paths: roles
```text
src/config/roles.ts
src_backup2/config/roles.ts
src_backup3/config/roles.ts
```


## Keyword in paths: auth
```text
src/app/(auth)/login/auth.ts
src/app/(auth)/login/layout.tsx
src/app/(auth)/login/page.tsx
src/lib/actions/auth.actions.ts
src/lib/auth.ts
src_backup2/app/(auth)/login/auth.ts
src_backup2/app/(auth)/login/layout.tsx
src_backup2/app/(auth)/login/page.tsx
src_backup2/lib/actions/auth.actions.ts
src_backup2/lib/auth.ts
src_backup3/app/(auth)/login/auth.ts
src_backup3/app/(auth)/login/layout.tsx
src_backup3/app/(auth)/login/page.tsx
src_backup3/lib/actions/auth.actions.ts
src_backup3/lib/auth.ts
```


## Keyword in paths: rls
```text
supabase/migrations/20250101000005_rls_policies.sql
supabase/migrations/20250101000009_rls_safe_foundation.sql
```


## Keyword in paths: supabase
```text
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src_backup2/lib/supabase/client.ts
src_backup2/lib/supabase/server.ts
src_backup3/lib/supabase/client.ts
src_backup3/lib/supabase/server.ts
supabase/migrations/20250101000001_duplicate_constraints.sql
supabase/migrations/20250101000002_teacher_finance_table.sql
supabase/migrations/20250101000004_fix_teacher_finance_cols.sql
supabase/migrations/20250101000005_rls_policies.sql
supabase/migrations/20250101000006_cleanup_old_policies.sql
supabase/migrations/20250101000007_audit_triggers.sql
supabase/migrations/20250101000008_extend_course_type_enum.sql
supabase/migrations/20250101000009_rls_safe_foundation.sql
supabase/migrations/20250101000010_remove_temp_read_parents_profiles.sql
supabase/migrations/20250101000011_remove_temp_read_students.sql
supabase/migrations/20250101000012_remove_temp_read_payments.sql
supabase/migrations/20250101000013_remove_temp_read_leads.sql
supabase/migrations/20250101000014_followups_ops_safe_foundation.sql
supabase/migrations/20250101000015_remove_temp_read_followups.sql
supabase/migrations/20250101000016_remove_temp_read_courses.sql
supabase/migrations/20250101000017_academic_read_foundation.sql
supabase/migrations/20250101000018_remove_temp_read_academic_ops.sql
supabase/migrations/20250101000019_teachers_read_and_remove_temp.sql
supabase/migrations/20250101000020_trials_referrals_notifications_foundation.sql
supabase/migrations/20250101000021_remove_temp_read_trials_referrals_notifications.sql
supabase/migrations/20250101000022_remove_final_temp_read_policies.sql
supabase/migrations/20250101000023_allow_sales_parent_student_write.sql
supabase/migrations/20250101000024_manual_group_finance_collection_fields.sql
```


## Keyword in paths: tenant
No path matches.


## Keyword in paths: settings
```text
.vscode/settings.json
src/app/(dashboard)/settings/page.tsx
src_backup2/app/(dashboard)/settings/page.tsx
src_backup3/app/(dashboard)/settings/page.tsx
```


# Bounded Deep Content Scan


## Keyword in content: lead
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
docs/archive/IMPLEMENTATION-NOTES.md
docs/archive/PHASE7-9-COMBINED-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/NEW-CHAT-PROMPT.txt
docs/NEXT_DEVELOPMENT_BACKLOG.md
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
README.md
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/follow-ups/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/leads/new/page.tsx
src/app/(dashboard)/leads/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/parents/page.tsx
src/app/(dashboard)/reports/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/settings/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/app/globals.css
src/components/groups/group-tasks-panel.tsx
src/components/groups/student-notes-inline.tsx
src/components/layout/global-search.tsx
src/components/layout/sidebar.tsx
src/components/leads/lead-form.tsx
src/components/leads/leads-kanban.tsx
src/components/leads/stage-badge.tsx
src/components/leads/temperature-badge.tsx
src/components/parents/parent-form.tsx
src/components/payments/payment-invoice-view.tsx
src/components/shared/page-state.tsx
src/components/students/student-form.tsx
src/components/ui/card.tsx
src/components/ui/label.tsx
src/config/labels.ts
src/config/navigation.ts
src/config/roles.ts
src/config/stages.ts
src/config/status-meta.ts
src/lib/formatters.ts
src/lib/locale.ts
src/lib/mock-data.ts
src/services/account-center.service.ts
src/services/dashboard.service.ts
src/services/data-quality.service.ts
src/services/duplicate-guard.service.ts
src/services/enrollment.service.ts
src/services/follow-ups.service.ts
src/services/leads.service.ts
src/services/operations.service.ts
src/services/operations-center.service.ts
src/services/ownership-center.service.ts
src/services/owner-summary.service.ts
src/services/relations.service.ts
src/services/reports.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/follow-ups/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
```


## Keyword in content: leads
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
docs/archive/IMPLEMENTATION-NOTES.md
docs/archive/PHASE7-9-COMBINED-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/NEW-CHAT-PROMPT.txt
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
README.md
src/app/(dashboard)/leads/new/page.tsx
src/app/(dashboard)/leads/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/reports/page.tsx
src/components/layout/global-search.tsx
src/components/leads/lead-form.tsx
src/components/leads/leads-kanban.tsx
src/components/leads/stage-badge.tsx
src/config/labels.ts
src/config/navigation.ts
src/config/roles.ts
src/config/stages.ts
src/lib/formatters.ts
src/lib/locale.ts
src/lib/mock-data.ts
src/services/dashboard.service.ts
src/services/data-quality.service.ts
src/services/duplicate-guard.service.ts
src/services/enrollment.service.ts
src/services/follow-ups.service.ts
src/services/leads.service.ts
src/services/operations.service.ts
src/services/ownership-center.service.ts
src/services/owner-summary.service.ts
src/services/relations.service.ts
src/services/reports.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/leads/new/page.tsx
src_backup2/app/(dashboard)/leads/page.tsx
src_backup2/app/(dashboard)/ownership-center/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/app/(dashboard)/reports/page.tsx
src_backup2/components/layout/global-search.tsx
src_backup2/components/leads/lead-form.tsx
src_backup2/components/leads/leads-kanban.tsx
src_backup2/components/leads/stage-badge.tsx
```


## Keyword in content: student
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/IMPLEMENTATION-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/migrations/sprint-5-batch-5.1-fk-indexes.sql
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
README.md
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/parents/new/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/students/new/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/components/groups/group-tasks-panel.tsx
src/components/groups/student-notes-inline.tsx
src/components/layout/global-search.tsx
src/components/parents/parent-form.tsx
src/components/payments/payment-invoice-view.tsx
src/components/students/student-form.tsx
src/config/labels.ts
src/config/navigation.ts
src/config/roles.ts
src/config/status-meta.ts
src/lib/locale.ts
src/lib/mock-data.ts
src/services/academic-transfer.service.ts
src/services/account-center.service.ts
src/services/dashboard.service.ts
src/services/data-quality.service.ts
src/services/duplicate-guard.service.ts
src/services/enrollment.service.ts
src/services/group-operations.service.ts
src/services/group-tasks.service.ts
src/services/operations.service.ts
src/services/operations-center.service.ts
src/services/ownership-center.service.ts
src/services/owner-summary.service.ts
src/services/parent-report.service.ts
src/services/parents.service.ts
src/services/payments.service.ts
src/services/relations.service.ts
src/services/reports.service.ts
src/services/schedule.service.ts
src/services/student-basic-edit.service.ts
src/services/student-enrollment-control.service.ts
src/services/student-finance.service.ts
src/services/student-journey.service.ts
src/services/student-payment-sessions.service.ts
src/services/student-progress-notes.service.ts
src/services/student-report.service.ts
src/services/students.service.ts
src/services/teacher-evaluations.service.ts
src/services/teachers.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
```


## Keyword in content: students
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
docs/archive/IMPLEMENTATION-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/HOTFIX_LOG.md
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
README.md
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/parents/new/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/students/new/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/components/layout/global-search.tsx
src/components/students/student-form.tsx
src/config/labels.ts
src/config/navigation.ts
src/config/roles.ts
src/config/status-meta.ts
src/lib/locale.ts
src/lib/mock-data.ts
src/services/academic-transfer.service.ts
src/services/account-center.service.ts
src/services/dashboard.service.ts
src/services/data-quality.service.ts
src/services/duplicate-guard.service.ts
src/services/enrollment.service.ts
src/services/group-operations.service.ts
src/services/operations.service.ts
src/services/operations-center.service.ts
src/services/ownership-center.service.ts
src/services/owner-summary.service.ts
src/services/parent-report.service.ts
src/services/parents.service.ts
src/services/payments.service.ts
src/services/relations.service.ts
src/services/reports.service.ts
src/services/schedule.service.ts
src/services/student-basic-edit.service.ts
src/services/student-enrollment-control.service.ts
src/services/student-progress-notes.service.ts
src/services/students.service.ts
src/services/teachers.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/ownership-center/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/app/(dashboard)/parents/new/page.tsx
src_backup2/app/(dashboard)/payments/new/page.tsx
src_backup2/app/(dashboard)/schedule/page.tsx
src_backup2/app/(dashboard)/students/new/page.tsx
src_backup2/app/(dashboard)/students/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
src_backup2/app/(dashboard)/teachers/page.tsx
src_backup2/components/layout/global-search.tsx
src_backup2/components/students/student-form.tsx
```


## Keyword in content: parent
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/HOTFIX_LOG.md
docs/NEW-CHAT-PROMPT.txt
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
README.md
src/app/(auth)/login/page.tsx
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/follow-ups/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/leads/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/parents/new/page.tsx
src/app/(dashboard)/parents/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/app/(dashboard)/students/new/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/globals.css
src/components/groups/group-tasks-panel.tsx
src/components/groups/student-notes-inline.tsx
src/components/layout/global-search.tsx
src/components/leads/lead-form.tsx
src/components/leads/leads-kanban.tsx
src/components/parents/parent-form.tsx
src/components/payments/payment-invoice-view.tsx
src/components/schedule/schedule-entry-form.tsx
src/components/students/student-form.tsx
src/components/teachers/teacher-form.tsx
src/components/ui/badge.tsx
src/components/ui/input.tsx
src/config/navigation.ts
src/config/roles.ts
src/lib/mock-data.ts
src/services/account-center.service.ts
src/services/basic-edit.service.ts
src/services/data-quality.service.ts
src/services/duplicate-guard.service.ts
src/services/enrollment.service.ts
src/services/follow-ups.service.ts
src/services/group-operations.service.ts
src/services/leads.service.ts
src/services/operations.service.ts
src/services/operations-center.service.ts
src/services/ownership-center.service.ts
src/services/owner-summary.service.ts
src/services/parent-report.service.ts
src/services/parents.service.ts
src/services/payments.service.ts
src/services/relations.service.ts
src/services/schedule.service.ts
src/services/students.service.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(auth)/login/page.tsx
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/follow-ups/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/leads/page.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/ownership-center/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/app/(dashboard)/parents/new/page.tsx
src_backup2/app/(dashboard)/parents/page.tsx
src_backup2/app/(dashboard)/payments/new/page.tsx
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/app/(dashboard)/students/new/page.tsx
src_backup2/app/(dashboard)/students/page.tsx
src_backup2/app/globals.css
src_backup2/components/groups/group-tasks-panel.tsx
```


## Keyword in content: parents
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/HOTFIX_LOG.md
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
README.md
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/parents/new/page.tsx
src/app/(dashboard)/parents/page.tsx
src/app/(dashboard)/students/new/page.tsx
src/app/(dashboard)/students/page.tsx
src/components/layout/global-search.tsx
src/components/parents/parent-form.tsx
src/config/navigation.ts
src/config/roles.ts
src/lib/mock-data.ts
src/services/basic-edit.service.ts
src/services/duplicate-guard.service.ts
src/services/enrollment.service.ts
src/services/ownership-center.service.ts
src/services/owner-summary.service.ts
src/services/parents.service.ts
src/services/payments.service.ts
src/services/relations.service.ts
src/services/schedule.service.ts
src/services/students.service.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/ownership-center/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/app/(dashboard)/parents/new/page.tsx
src_backup2/app/(dashboard)/parents/page.tsx
src_backup2/app/(dashboard)/students/new/page.tsx
src_backup2/app/(dashboard)/students/page.tsx
src_backup2/components/layout/global-search.tsx
src_backup2/components/parents/parent-form.tsx
```


## Keyword in content: teacher
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/FINANCE_RULES.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/migrations/sprint-5-batch-5.1-fk-indexes.sql
docs/NEXT_DEVELOPMENT_BACKLOG.md
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
README.md
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/(dashboard)/teachers/new/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/components/groups/group-tasks-panel.tsx
src/components/layout/global-search.tsx
src/components/layout/mobile-nav.tsx
src/components/layout/sidebar.tsx
src/components/schedule/schedule-entry-form.tsx
src/components/teachers/teacher-form.tsx
src/config/navigation.ts
src/config/roles.ts
src/lib/mock-data.ts
src/lib/teacher-course-utils.ts
src/services/basic-edit.service.ts
src/services/dashboard.service.ts
src/services/group-operations.service.ts
src/services/group-tasks.service.ts
src/services/operations.service.ts
src/services/parent-report.service.ts
src/services/relations.service.ts
src/services/reports.service.ts
src/services/schedule.service.ts
src/services/student-enrollment-control.service.ts
src/services/student-journey.service.ts
src/services/student-report.service.ts
src/services/teacher-evaluations.service.ts
src/services/teacher-finance.service.ts
src/services/teacher-reassignment.service.ts
src/services/teachers.service.ts
src/services/teacher-specialization.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/app/(dashboard)/schedule/new/page.tsx
src_backup2/app/(dashboard)/schedule/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
src_backup2/app/(dashboard)/teachers/new/page.tsx
src_backup2/app/(dashboard)/teachers/page.tsx
src_backup2/components/groups/group-tasks-panel.tsx
src_backup2/components/layout/global-search.tsx
src_backup2/components/layout/mobile-nav.tsx
src_backup2/components/layout/sidebar.tsx
src_backup2/components/schedule/schedule-entry-form.tsx
src_backup2/components/teachers/teacher-form.tsx
```


## Keyword in content: teachers
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_HANDOFF.md
docs/FINAL_LOCK_SUMMARY.md
docs/HOTFIX_LOG.md
docs/RELEASE_NOTES.md
README.md
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/(dashboard)/teachers/new/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/components/layout/global-search.tsx
src/components/layout/mobile-nav.tsx
src/components/layout/sidebar.tsx
src/components/schedule/schedule-entry-form.tsx
src/components/teachers/teacher-form.tsx
src/config/navigation.ts
src/config/roles.ts
src/lib/mock-data.ts
src/lib/teacher-course-utils.ts
src/services/basic-edit.service.ts
src/services/dashboard.service.ts
src/services/group-operations.service.ts
src/services/relations.service.ts
src/services/reports.service.ts
src/services/schedule.service.ts
src/services/student-enrollment-control.service.ts
src/services/student-report.service.ts
src/services/teacher-finance.service.ts
src/services/teacher-reassignment.service.ts
src/services/teachers.service.ts
src/services/teacher-specialization.service.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/app/(dashboard)/schedule/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
src_backup2/app/(dashboard)/teachers/new/page.tsx
src_backup2/app/(dashboard)/teachers/page.tsx
src_backup2/components/layout/global-search.tsx
src_backup2/components/layout/mobile-nav.tsx
src_backup2/components/layout/sidebar.tsx
src_backup2/components/schedule/schedule-entry-form.tsx
src_backup2/components/teachers/teacher-form.tsx
```


## Keyword in content: group
```text
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/FINANCE_RULES.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/migrations/sprint-5-batch-5.1-fk-indexes.sql
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/leads/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/parents/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/components/groups/group-tasks-panel.tsx
src/components/groups/student-notes-inline.tsx
src/components/layout/mobile-nav.tsx
src/components/layout/sidebar.tsx
src/components/layout/top-navbar.tsx
src/components/leads/lead-form.tsx
src/components/leads/leads-kanban.tsx
src/components/parents/parent-form.tsx
src/components/students/student-form.tsx
src/components/ui/label.tsx
src/config/course-roadmap.ts
src/config/labels.ts
src/config/navigation.ts
src/lib/mock-data.ts
src/services/academic-transfer.service.ts
src/services/account-center.service.ts
src/services/basic-edit.service.ts
src/services/group-operations.service.ts
src/services/group-tasks.service.ts
src/services/operations.service.ts
src/services/operations-center.service.ts
src/services/parent-report.service.ts
src/services/schedule.service.ts
src/services/student-progress-notes.service.ts
src/types/common.types.ts
src/types/crm.ts
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/app/(dashboard)/leads/page.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/app/(dashboard)/parents/page.tsx
src_backup2/app/(dashboard)/schedule/new/page.tsx
src_backup2/app/(dashboard)/schedule/page.tsx
src_backup2/app/(dashboard)/students/page.tsx
src_backup2/app/(dashboard)/teachers/page.tsx
src_backup2/components/groups/group-tasks-panel.tsx
src_backup2/components/groups/student-notes-inline.tsx
src_backup2/components/layout/mobile-nav.tsx
src_backup2/components/layout/sidebar.tsx
src_backup2/components/layout/top-navbar.tsx
src_backup2/components/leads/lead-form.tsx
src_backup2/components/leads/leads-kanban.tsx
src_backup2/components/parents/parent-form.tsx
src_backup2/components/students/student-form.tsx
src_backup2/components/ui/label.tsx
src_backup2/config/course-roadmap.ts
```


## Keyword in content: groups
```text
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/FINANCE_RULES.md
docs/HOTFIX_LOG.md
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/components/layout/mobile-nav.tsx
src/components/layout/sidebar.tsx
src/components/layout/top-navbar.tsx
src/components/leads/lead-form.tsx
src/components/parents/parent-form.tsx
src/components/students/student-form.tsx
src/config/course-roadmap.ts
src/config/navigation.ts
src/services/academic-transfer.service.ts
src/services/group-operations.service.ts
src/services/operations-center.service.ts
src/services/parent-report.service.ts
src/services/student-progress-notes.service.ts
src/types/crm.ts
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/schedule/new/page.tsx
src_backup2/components/layout/mobile-nav.tsx
src_backup2/components/layout/sidebar.tsx
src_backup2/components/layout/top-navbar.tsx
src_backup2/components/leads/lead-form.tsx
src_backup2/components/parents/parent-form.tsx
src_backup2/components/students/student-form.tsx
src_backup2/config/course-roadmap.ts
```


## Keyword in content: class
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/FINAL_LOCK_SUMMARY.md
docs/HOTFIX_LOG.md
docs/migrations/sprint-5-batch-5.1-fk-indexes.sql
package.json
src/app/(auth)/login/layout.tsx
src/app/(auth)/login/page.tsx
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/follow-ups/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/leads/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/parents/new/page.tsx
src/app/(dashboard)/parents/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/app/(dashboard)/reports/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/settings/page.tsx
src/app/(dashboard)/students/new/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/app/error.tsx
src/app/layout.tsx
src/app/not-found.tsx
src/components/groups/group-tasks-panel.tsx
src/components/groups/student-notes-inline.tsx
src/components/layout/dashboard-shell.tsx
src/components/layout/global-search.tsx
src/components/layout/mobile-nav.tsx
src/components/layout/sidebar.tsx
src/components/layout/top-navbar.tsx
src/components/leads/lead-form.tsx
src/components/leads/leads-kanban.tsx
src/components/leads/stage-badge.tsx
src/components/leads/temperature-badge.tsx
src/components/parents/parent-form.tsx
src/components/payments/invoice-toolbar.tsx
src/components/payments/payment-invoice-view.tsx
src/components/schedule/schedule-entry-form.tsx
src/components/shared/page-state.tsx
src/components/students/student-form.tsx
src/components/teachers/teacher-form.tsx
src/components/ui/badge.tsx
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/empty-state.tsx
src/components/ui/input.tsx
src/components/ui/label.tsx
src/components/ui/page-header.tsx
src/components/ui/search-bar.tsx
src/components/ui/stat-card.tsx
src/config/labels.ts
src/config/navigation.ts
src/config/status-meta.ts
src/lib/mock-data.ts
src/lib/utils.ts
src/services/academic-transfer.service.ts
src/services/account-center.service.ts
src/services/basic-edit.service.ts
src/services/data-quality.service.ts
src/services/group-operations.service.ts
src/services/operations.service.ts
src/services/operations-center.service.ts
src/services/relations.service.ts
src/services/schedule.service.ts
src/services/student-enrollment-control.service.ts
src/services/student-journey.service.ts
src/services/student-report.service.ts
src/services/students.service.ts
src/services/teacher-finance.service.ts
```


## Keyword in content: classes
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/FINAL_LOCK_SUMMARY.md
docs/HOTFIX_LOG.md
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/components/layout/global-search.tsx
src/components/ui/stat-card.tsx
src/config/navigation.ts
src/lib/mock-data.ts
src/lib/utils.ts
src/services/academic-transfer.service.ts
src/services/basic-edit.service.ts
src/services/data-quality.service.ts
src/services/group-operations.service.ts
src/services/relations.service.ts
src/services/schedule.service.ts
src/services/students.service.ts
src/services/teacher-reassignment.service.ts
src/services/teachers.service.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/schedule/page.tsx
src_backup2/app/(dashboard)/teachers/page.tsx
src_backup2/components/layout/global-search.tsx
src_backup2/components/ui/stat-card.tsx
```


## Keyword in content: center
```text
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PHASE-NEXT-NAV-CLEANUP-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/FINANCE_RULES.md
docs/HOTFIX_LOG.md
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
src/app/(auth)/login/layout.tsx
src/app/(auth)/login/page.tsx
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/follow-ups/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/leads/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/parents/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/app/(dashboard)/reports/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/settings/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/app/error.tsx
src/app/layout.tsx
src/app/not-found.tsx
src/components/groups/group-tasks-panel.tsx
src/components/groups/student-notes-inline.tsx
src/components/layout/global-search.tsx
src/components/layout/mobile-nav.tsx
src/components/layout/sidebar.tsx
src/components/layout/top-navbar.tsx
src/components/leads/lead-form.tsx
src/components/leads/leads-kanban.tsx
src/components/leads/stage-badge.tsx
src/components/leads/temperature-badge.tsx
src/components/parents/parent-form.tsx
src/components/payments/invoice-toolbar.tsx
src/components/payments/payment-invoice-view.tsx
src/components/schedule/schedule-entry-form.tsx
src/components/shared/page-state.tsx
src/components/students/student-form.tsx
src/components/teachers/teacher-form.tsx
src/components/ui/badge.tsx
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/empty-state.tsx
src/components/ui/label.tsx
src/components/ui/page-header.tsx
src/components/ui/stat-card.tsx
src/config/navigation.ts
src/services/account-center.service.ts
src/services/dashboard.service.ts
src/services/data-quality.service.ts
src/services/operations.service.ts
src/services/operations-center.service.ts
src/services/ownership-center.service.ts
src/types/crm.ts
src_backup2/app/(auth)/login/layout.tsx
src_backup2/app/(auth)/login/page.tsx
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/follow-ups/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/app/(dashboard)/leads/page.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/ownership-center/page.tsx
src_backup2/app/(dashboard)/page.tsx
```


## Keyword in content: centers
```text
docs/HOTFIX_LOG.md
src/app/(dashboard)/account-center/page.tsx
src/services/account-center.service.ts
src_backup2/app/(dashboard)/account-center/page.tsx
```


## Keyword in content: course
```text
docs/archive/PROJECT_CONTEXT.md
docs/FINANCE_RULES.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/OPERATIONS_PLAYBOOK.md
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/parents/new/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/students/new/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/(dashboard)/teachers/page.tsx
src/components/layout/global-search.tsx
src/components/leads/lead-form.tsx
src/components/leads/leads-kanban.tsx
src/components/parents/parent-form.tsx
src/components/schedule/schedule-entry-form.tsx
src/components/students/student-form.tsx
src/components/teachers/teacher-form.tsx
src/config/course-roadmap.ts
src/config/labels.ts
src/lib/formatters.ts
src/lib/locale.ts
src/lib/mock-data.ts
src/lib/teacher-course-utils.ts
src/services/academic-transfer.service.ts
src/services/data-quality.service.ts
src/services/enrollment.service.ts
src/services/group-operations.service.ts
src/services/leads.service.ts
src/services/operations.service.ts
src/services/operations-center.service.ts
src/services/ownership-center.service.ts
src/services/parent-report.service.ts
src/services/relations.service.ts
src/services/schedule.service.ts
src/services/student-enrollment-control.service.ts
src/services/student-journey.service.ts
src/services/student-report.service.ts
src/services/students.service.ts
src/services/teacher-finance.service.ts
src/services/teachers.service.ts
src/services/teacher-specialization.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/parents/new/page.tsx
src_backup2/app/(dashboard)/schedule/new/page.tsx
src_backup2/app/(dashboard)/schedule/page.tsx
src_backup2/app/(dashboard)/students/new/page.tsx
src_backup2/app/(dashboard)/students/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
src_backup2/app/(dashboard)/teachers/page.tsx
src_backup2/components/layout/global-search.tsx
src_backup2/components/leads/lead-form.tsx
src_backup2/components/leads/leads-kanban.tsx
src_backup2/components/parents/parent-form.tsx
src_backup2/components/schedule/schedule-entry-form.tsx
src_backup2/components/students/student-form.tsx
src_backup2/components/teachers/teacher-form.tsx
src_backup2/config/course-roadmap.ts
```


## Keyword in content: courses
```text
docs/archive/PROJECT_CONTEXT.md
docs/FINANCE_RULES.md
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/lib/teacher-course-utils.ts
src/services/academic-transfer.service.ts
src/services/group-operations.service.ts
src/services/relations.service.ts
src/services/schedule.service.ts
src/services/teacher-finance.service.ts
src/services/teachers.service.ts
src/services/teacher-specialization.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/schedule/page.tsx
src_backup2/app/(dashboard)/students/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
```


## Keyword in content: payment
```text
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md
docs/archive/PAYMENTS-UPGRADE-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/FINANCE_RULES.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/migrations/sprint-5-batch-5.1-fk-indexes.sql
docs/NEXT_DEVELOPMENT_BACKLOG.md
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
README.md
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/components/layout/global-search.tsx
src/components/payments/payment-invoice-view.tsx
src/config/labels.ts
src/config/navigation.ts
src/config/roles.ts
src/lib/locale.ts
src/lib/mock-data.ts
src/services/account-center.service.ts
src/services/basic-edit.service.ts
src/services/dashboard.service.ts
src/services/follow-ups.service.ts
src/services/operations.service.ts
src/services/operations-center.service.ts
src/services/payments.service.ts
src/services/reports.service.ts
src/services/student-finance.service.ts
src/services/student-journey.service.ts
src/services/student-payment-sessions.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/app/(dashboard)/payments/new/page.tsx
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/components/layout/global-search.tsx
src_backup2/components/payments/payment-invoice-view.tsx
```


## Keyword in content: payments
```text
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md
docs/archive/PAYMENTS-UPGRADE-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/FINANCE_RULES.md
docs/HOTFIX_LOG.md
docs/migrations/sprint-5-batch-5.1-fk-indexes.sql
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
README.md
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/components/layout/global-search.tsx
src/components/payments/payment-invoice-view.tsx
src/config/labels.ts
src/config/navigation.ts
src/config/roles.ts
src/lib/locale.ts
src/services/account-center.service.ts
src/services/basic-edit.service.ts
src/services/dashboard.service.ts
src/services/operations.service.ts
src/services/operations-center.service.ts
src/services/payments.service.ts
src/services/reports.service.ts
src/services/student-finance.service.ts
src/services/student-journey.service.ts
src/services/student-payment-sessions.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/app/(dashboard)/payments/new/page.tsx
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/components/layout/global-search.tsx
src_backup2/components/payments/payment-invoice-view.tsx
```


## Keyword in content: invoice
```text
docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md
docs/archive/PAYMENTS-UPGRADE-NOTES.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_HANDOFF.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/HOTFIX_LOG.md
docs/QA_CHECKLIST.md
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/components/payments/invoice-toolbar.tsx
src/components/payments/payment-invoice-view.tsx
src/services/basic-edit.service.ts
src/services/payments.service.ts
src/services/student-finance.service.ts
src/types/crm.ts
src_backup2/app/(dashboard)/payments/new/page.tsx
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/components/payments/invoice-toolbar.tsx
src_backup2/components/payments/payment-invoice-view.tsx
```


## Keyword in content: invoices
```text
docs/CLIENT_HANDOFF.md
docs/FINAL_LOCK_SUMMARY.md
src/app/(dashboard)/payments/page.tsx
src/services/payments.service.ts
src_backup2/app/(dashboard)/payments/page.tsx
```


## Keyword in content: follow
```text
docs/archive/IMPLEMENTATION-NOTES.md
docs/archive/PHASE7-9-COMBINED-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/NEXT_DEVELOPMENT_BACKLOG.md
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
README.md
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/follow-ups/page.tsx
src/app/(dashboard)/page.tsx
src/components/leads/lead-form.tsx
src/components/leads/leads-kanban.tsx
src/config/labels.ts
src/config/navigation.ts
src/config/roles.ts
src/config/status-meta.ts
src/lib/locale.ts
src/lib/mock-data.ts
src/services/dashboard.service.ts
src/services/follow-ups.service.ts
src/services/leads.service.ts
src/services/operations.service.ts
src/services/reports.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/follow-ups/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/components/leads/lead-form.tsx
src_backup2/components/leads/leads-kanban.tsx
```


## Keyword in content: follow-up
```text
docs/archive/IMPLEMENTATION-NOTES.md
docs/archive/PHASE7-9-COMBINED-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/NEXT_DEVELOPMENT_BACKLOG.md
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
README.md
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/follow-ups/page.tsx
src/app/(dashboard)/page.tsx
src/components/leads/leads-kanban.tsx
src/config/labels.ts
src/config/navigation.ts
src/services/dashboard.service.ts
src/services/follow-ups.service.ts
src/services/operations.service.ts
src/services/reports.service.ts
src/types/common.types.ts
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/follow-ups/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/components/leads/leads-kanban.tsx
```


## Keyword in content: schedule
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/PHASE7-9-COMBINED-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/migrations/sprint-5-batch-5.1-fk-indexes.sql
docs/NEW-CHAT-PROMPT.txt
docs/OPERATIONS_PLAYBOOK.md
docs/RELEASE_NOTES.md
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/follow-ups/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/components/layout/global-search.tsx
src/components/schedule/schedule-entry-form.tsx
src/config/navigation.ts
src/config/roles.ts
src/lib/mock-data.ts
src/services/basic-edit.service.ts
src/services/dashboard.service.ts
src/services/follow-ups.service.ts
src/services/group-operations.service.ts
src/services/operations.service.ts
src/services/relations.service.ts
src/services/reports.service.ts
src/services/schedule.service.ts
src/services/student-enrollment-control.service.ts
src/services/student-report.service.ts
src/services/teacher-finance.service.ts
src/services/teacher-reassignment.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/follow-ups/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/app/(dashboard)/schedule/new/page.tsx
src_backup2/app/(dashboard)/schedule/page.tsx
src_backup2/components/layout/global-search.tsx
src_backup2/components/schedule/schedule-entry-form.tsx
```


## Keyword in content: session
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md
docs/archive/PAYMENTS-UPGRADE-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PHASE-NEXT-SECURITY-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_ACCEPTANCE_CHECKLIST.md
docs/CLIENT_TRAINING_GUIDE.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/FINANCE_RULES.md
docs/HOTFIX_LOG.md
docs/migrations/sprint-5-batch-5.1-fk-indexes.sql
docs/OPERATIONS_PLAYBOOK.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/app/(dashboard)/schedule/new/page.tsx
src/app/(dashboard)/schedule/page.tsx
src/app/(dashboard)/settings/page.tsx
src/app/(dashboard)/students/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/components/layout/global-search.tsx
src/components/payments/payment-invoice-view.tsx
src/components/schedule/schedule-entry-form.tsx
src/lib/mock-data.ts
src/services/academic-transfer.service.ts
src/services/account-center.service.ts
src/services/basic-edit.service.ts
src/services/dashboard.service.ts
src/services/enrollment.service.ts
src/services/group-operations.service.ts
src/services/operations.service.ts
src/services/operations-center.service.ts
src/services/parent-report.service.ts
src/services/payments.service.ts
src/services/relations.service.ts
src/services/reports.service.ts
src/services/schedule.service.ts
src/services/student-enrollment-control.service.ts
src/services/student-journey.service.ts
src/services/student-payment-sessions.service.ts
src/services/student-report.service.ts
src/services/students.service.ts
src/services/teacher-finance.service.ts
src/services/teacher-reassignment.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/payments/new/page.tsx
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/app/(dashboard)/schedule/new/page.tsx
src_backup2/app/(dashboard)/schedule/page.tsx
src_backup2/app/(dashboard)/settings/page.tsx
src_backup2/app/(dashboard)/students/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
src_backup2/components/layout/global-search.tsx
src_backup2/components/payments/payment-invoice-view.tsx
src_backup2/components/schedule/schedule-entry-form.tsx
```


## Keyword in content: attendance
```text
docs/archive/PROJECT_CONTEXT.md
docs/KNOWN_LIMITATIONS.md
docs/OPERATIONS_PLAYBOOK.md
src/app/(dashboard)/operations-center/page.tsx
src/services/dashboard.service.ts
src/services/group-operations.service.ts
src/services/parent-report.service.ts
src/services/schedule.service.ts
src/services/student-payment-sessions.service.ts
src/services/student-report.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/operations-center/page.tsx
```


## Keyword in content: report
```text
docs/archive/IMPLEMENTATION-NOTES.md
docs/archive/PAYMENTS-UPGRADE-NOTES.md
docs/archive/PHASE7-9-COMBINED-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PHASE-NEXT-NAV-CLEANUP-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_HANDOFF.md
docs/CLIENT_TRAINING_GUIDE.md
docs/KNOWN_LIMITATIONS.md
docs/NEXT_DEVELOPMENT_BACKLOG.md
docs/RELEASE_NOTES.md
README.md
src/app/(dashboard)/payments/page.tsx
src/app/(dashboard)/reports/page.tsx
src/config/navigation.ts
src/config/roles.ts
src/services/dashboard.service.ts
src/services/data-quality.service.ts
src/services/parent-report.service.ts
src/services/reports.service.ts
src/services/student-journey.service.ts
src/services/student-report.service.ts
src/services/teacher-evaluations.service.ts
src/types/common.types.ts
src/types/crm.ts
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/app/(dashboard)/reports/page.tsx
```


## Keyword in content: dashboard
```text
_ops/PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
docs/archive/IMPLEMENTATION-NOTES.md
docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md
docs/archive/PAYMENTS-UPGRADE-NOTES.md
docs/archive/PHASE7-9-COMBINED-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PHASE-NEXT-NAV-CLEANUP-NOTES.md
docs/archive/PHASE-NEXT-SECURITY-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/HOTFIX_LOG.md
README.md
src/app/(auth)/login/page.tsx
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/loading.tsx
src/app/(dashboard)/not-found.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/payments/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/not-found.tsx
src/components/layout/dashboard-shell.tsx
src/components/layout/mobile-nav.tsx
src/components/layout/top-navbar.tsx
src/config/navigation.ts
src/config/roles.ts
src/config/status-meta.ts
src/services/dashboard.service.ts
src/services/operations.service.ts
src/types/crm.ts
src_backup2/app/(auth)/login/page.tsx
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/layout.tsx
src_backup2/app/(dashboard)/loading.tsx
src_backup2/app/(dashboard)/not-found.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/ownership-center/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
src_backup2/app/not-found.tsx
src_backup2/components/layout/dashboard-shell.tsx
src_backup2/components/layout/mobile-nav.tsx
src_backup2/components/layout/top-navbar.tsx
```


## Keyword in content: trial
```text
docs/archive/PHASE7-9-COMBINED-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PROJECT_CONTEXT.md
src/app/(dashboard)/students/page.tsx
src/config/labels.ts
src/config/stages.ts
src/config/status-meta.ts
src/lib/mock-data.ts
src/services/dashboard.service.ts
src/services/follow-ups.service.ts
src/services/leads.service.ts
src/services/operations.service.ts
src/services/relations.service.ts
src/services/schedule.service.ts
src/services/student-basic-edit.service.ts
src/services/students.service.ts
src/types/common.types.ts
src_backup2/app/(dashboard)/students/page.tsx
```


## Keyword in content: enrollment
```text
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/migrations/sprint-5-batch-5.1-fk-indexes.sql
docs/RELEASE_NOTES.md
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/reports/page.tsx
src/config/labels.ts
src/lib/mock-data.ts
src/services/academic-transfer.service.ts
src/services/dashboard.service.ts
src/services/data-quality.service.ts
src/services/enrollment.service.ts
src/services/group-operations.service.ts
src/services/leads.service.ts
src/services/relations.service.ts
src/services/reports.service.ts
src/services/schedule.service.ts
src/services/student-basic-edit.service.ts
src/services/student-enrollment-control.service.ts
src/services/student-journey.service.ts
src/services/students.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/reports/page.tsx
```


## Keyword in content: enrolled
```text
src/app/(dashboard)/students/page.tsx
src/config/labels.ts
src/services/academic-transfer.service.ts
src/services/group-operations.service.ts
src/services/leads.service.ts
src/services/reports.service.ts
src/services/students.service.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/students/page.tsx
```


## Keyword in content: qualified
```text
docs/OPERATIONS_PLAYBOOK.md
src/config/labels.ts
src/config/stages.ts
src/lib/mock-data.ts
src/services/dashboard.service.ts
src/services/follow-ups.service.ts
src/services/leads.service.ts
src/types/common.types.ts
```


## Keyword in content: price
```text
docs/archive/PROJECT_CONTEXT.md
src/config/labels.ts
src/lib/mock-data.ts
src/services/leads.service.ts
src/services/reports.service.ts
src/services/teacher-finance.service.ts
src/types/common.types.ts
src/types/database.types.ts
```


## Keyword in content: pricing
```text
docs/CLIENT_TRAINING_GUIDE.md
docs/FINANCE_RULES.md
docs/QA_CHECKLIST.md
src/app/(dashboard)/teachers/finance/page.tsx
src/types/common.types.ts
src_backup2/app/(dashboard)/teachers/finance/page.tsx
```


## Keyword in content: role
```text
docs/archive/IMPLEMENTATION-NOTES.md
docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md
docs/archive/PAYMENTS-UPGRADE-NOTES.md
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/CLIENT_HANDOFF.md
docs/DEMO_SCRIPT.md
docs/FINAL_LOCK_SUMMARY.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
src/app/(auth)/login/auth.ts
src/app/(auth)/login/page.tsx
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/action-center/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/app/globals.css
src/components/layout/mobile-nav.tsx
src/components/layout/sidebar.tsx
src/components/layout/top-navbar.tsx
src/components/leads/lead-form.tsx
src/config/navigation.ts
src/config/roles.ts
src/lib/auth.ts
src/lib/mock-data.ts
src/providers/user-provider.tsx
src/services/dashboard.service.ts
src/services/operations.service.ts
src/types/common.types.ts
src/types/crm.ts
src/types/database.types.ts
src_backup2/app/(auth)/login/auth.ts
src_backup2/app/(auth)/login/page.tsx
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/action-center/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/ownership-center/page.tsx
src_backup2/app/(dashboard)/page.tsx
src_backup2/app/(dashboard)/payments/new/page.tsx
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
src_backup2/app/globals.css
src_backup2/components/layout/mobile-nav.tsx
src_backup2/components/layout/sidebar.tsx
src_backup2/components/layout/top-navbar.tsx
src_backup2/components/leads/lead-form.tsx
```


## Keyword in content: roles
```text
docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md
docs/archive/PAYMENTS-UPGRADE-NOTES.md
docs/HOTFIX_LOG.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
src/app/(auth)/login/page.tsx
src/app/(dashboard)/account-center/page.tsx
src/app/(dashboard)/groups/new/page.tsx
src/app/(dashboard)/groups/page.tsx
src/app/(dashboard)/operations-center/page.tsx
src/app/(dashboard)/ownership-center/page.tsx
src/app/(dashboard)/payments/new/page.tsx
src/app/(dashboard)/payments/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/components/layout/mobile-nav.tsx
src/components/layout/sidebar.tsx
src/config/navigation.ts
src/lib/auth.ts
src_backup2/app/(auth)/login/page.tsx
src_backup2/app/(dashboard)/account-center/page.tsx
src_backup2/app/(dashboard)/groups/new/page.tsx
src_backup2/app/(dashboard)/groups/page.tsx
src_backup2/app/(dashboard)/operations-center/page.tsx
src_backup2/app/(dashboard)/ownership-center/page.tsx
src_backup2/app/(dashboard)/payments/new/page.tsx
src_backup2/app/(dashboard)/payments/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
src_backup2/components/layout/mobile-nav.tsx
src_backup2/components/layout/sidebar.tsx
```


## Keyword in content: auth
```text
docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md
docs/archive/PHASE-NEXT-SECURITY-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/KNOWN_LIMITATIONS.md
docs/QA_CHECKLIST.md
docs/RELEASE_NOTES.md
package.json
src/app/(auth)/login/auth.ts
src/app/(auth)/login/layout.tsx
src/app/(auth)/login/page.tsx
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/settings/page.tsx
src/components/layout/mobile-nav.tsx
src/components/layout/sidebar.tsx
src/components/providers/theme-provider.tsx
src/components/ui/badge.tsx
src/components/ui/button.tsx
src/config/navigation.ts
src/config/roles.ts
src/lib/actions/auth.actions.ts
src/lib/auth.ts
src/lib/utils.ts
src/services/leads.service.ts
src/types/common.types.ts
src_backup2/app/(auth)/login/auth.ts
src_backup2/app/(auth)/login/layout.tsx
src_backup2/app/(auth)/login/page.tsx
src_backup2/app/(dashboard)/layout.tsx
src_backup2/app/(dashboard)/settings/page.tsx
src_backup2/components/layout/mobile-nav.tsx
src_backup2/components/layout/sidebar.tsx
src_backup2/components/providers/theme-provider.tsx
src_backup2/components/ui/badge.tsx
src_backup2/components/ui/button.tsx
```


## Keyword in content: rls
```text
docs/archive/PROJECT_CONTEXT.md
docs/FINAL_LOCK_SUMMARY.md
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/NEW-CHAT-PROMPT.txt
docs/RELEASE_NOTES.md
src/lib/auth.ts
src/services/teachers.service.ts
```


## Keyword in content: supabase
```text
_ops/PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
docs/archive/IMPLEMENTATION-NOTES.md
docs/archive/PAYMENTS-UPGRADE-NOTES.md
docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md
docs/archive/PHASE-NEXT-SECURITY-NOTES.md
docs/archive/PROJECT_CONTEXT.md
docs/FINAL_LOCK_SUMMARY.md
docs/KNOWN_LIMITATIONS.md
docs/NEW-CHAT-PROMPT.txt
docs/RELEASE_NOTES.md
package.json
README.md
src/app/(auth)/login/page.tsx
src/app/(dashboard)/settings/page.tsx
src/lib/actions/auth.actions.ts
src/lib/auth.ts
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/services/academic-transfer.service.ts
src/services/basic-edit.service.ts
src/services/data-quality.service.ts
src/services/enrollment.service.ts
src/services/follow-ups.service.ts
src/services/group-operations.service.ts
src/services/leads.service.ts
src/services/parents.service.ts
src/services/payments.service.ts
src/services/schedule.service.ts
src/services/student-basic-edit.service.ts
src/services/student-enrollment-control.service.ts
src/services/student-payment-sessions.service.ts
src/services/students.service.ts
src/services/teacher-finance.service.ts
src/services/teacher-reassignment.service.ts
src/services/teachers.service.ts
src/services/teacher-specialization.service.ts
src/types/database.types.ts
src_backup2/app/(auth)/login/page.tsx
src_backup2/app/(dashboard)/settings/page.tsx
```


## Keyword in content: tenant
```text
docs/HOTFIX_LOG.md
docs/KNOWN_LIMITATIONS.md
docs/NEXT_DEVELOPMENT_BACKLOG.md
docs/RELEASE_NOTES.md
```


## Keyword in content: settings
```text
docs/archive/PHASE-NEXT-SECURITY-NOTES.md
docs/archive/PROJECT_CONTEXT.md
src/app/(dashboard)/settings/page.tsx
src/app/(dashboard)/teachers/finance/page.tsx
src/components/leads/lead-form.tsx
src/config/navigation.ts
src/config/roles.ts
src/types/database.types.ts
src_backup2/app/(dashboard)/settings/page.tsx
src_backup2/app/(dashboard)/teachers/finance/page.tsx
src_backup2/components/leads/lead-form.tsx
```


# TODO / FIXME / HACK / RISK Scan
```text
docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md:19: - See: students at risk, overdue/due payments, today sessions, trial students, weekly load
docs/archive/PROJECT_CONTEXT.md:42: ## Current Issues (TODO)
docs/HOTFIX_LOG.md:85: `[System.IO.File]::WriteAllText` with Unicode escapes (`\uXXXX`).
src/app/(dashboard)/students/page.tsx:106: at_risk: "danger",
src/components/groups/group-tasks-panel.tsx:13: import { CheckCircle2, Circle, ListTodo, PlusCircle, Trash2 } from "lucide-react";
src/components/groups/group-tasks-panel.tsx:217: <ListTodo size={18} className="text-brand-600" />
src/config/labels.ts:160: at_risk: "بحاجة متابعة",
src/config/labels.ts:187: at_risk: "Needs attention",
src/config/status-meta.ts:193: at_risk: { label: STUDENT_STATUS_LABELS.at_risk, labelEn: STUDENT_STATUS_EN_LABELS.at_risk, color: "#DC2626", bg: "#FEF2F2" },
src/lib/mock-data.ts:715: { id: "4", fullName: "سلمى خالد", age: 11, parentName: "خالد عبدالله", parentPhone: "01066778899", status: "at_risk", currentCourse: "scratch", className: "Scratch A", enrollmentDate: "2026-01-10", sessionsAttended: 8, totalPaid: 750 },
src/services/dashboard.service.ts:1051: label: t(locale, "بحاجة متابعة", "At risk"),
src/services/dashboard.service.ts:1054: value: atRiskStudents,
src/services/dashboard.service.ts:1057: pct: `${Math.round((atRiskStudents / opsFunnelBase) * 100)}%`,
src/services/dashboard.service.ts:202: const atRiskStudents = students.filter((student) => student.status === "at_risk").length;
src/services/dashboard.service.ts:328: atRiskStudents > 0
src/services/dashboard.service.ts:337: text: t(locale, `${atRiskStudents} طلاب بحاجة متابعة`, `${atRiskStudents} students need attention`),
src/services/dashboard.service.ts:412: title: t(locale, "طلاب بحاجة متابعة", "Students at risk"),
src/services/dashboard.service.ts:415: value: atRiskStudents.toLocaleString("en-US"),
src/services/dashboard.service.ts:421: tone: atRiskStudents > 0 ? "warning" : "success",
src/services/dashboard.service.ts:658: description: t(locale, "راجع الطلاب المعرضين للخطر والحالات التجريبية", "Review at-risk and trial students"),
src/services/dashboard.service.ts:787: isOps && atRiskStudents > 0 ? t(locale, "ابدأ بالطلاب المعرضين للخطر لأنهم أقرب خسارة تشغيلية الآن", "Start with at-risk students because they are the nearest operational risk right now") : null,
src/services/dashboard.service.ts:868: label: t(locale, "طلاب بحاجة متابعة", "Students at risk"),
src/services/dashboard.service.ts:871: value: atRiskStudents.toLocaleString("en-US"),
src/services/dashboard.service.ts:874: change: atRiskStudents > 0 ? t(locale, "+مهم", "+Important") : "0",
src/services/dashboard.service.ts:973: { label: t(locale, "طلاب بحاجة متابعة", "Students at risk"), value: atRiskStudents.toLocaleString("en-US"), icon: "warning", bg: "var(--color-danger-50)", color: "var(--color-danger-600)" },
src/services/dashboard.service.ts:991: { label: t(locale, "طلاب بحاجة متابعة", "Students at risk"), value: atRiskStudents.toLocaleString("en-US"), icon: "warning", bg: "var(--color-danger-50)", color: "var(--color-danger-600)" },
src/services/operations.service.ts:286: const atRiskStudents = students.filter((student) => student.status === "at_risk");
src/services/operations.service.ts:481: ...atRiskStudents.map((student) => ({
src/services/operations.service.ts:484: id: `student-risk-${student.id}`,
src/services/operations.service.ts:487: title: t(locale, `طالب بحاجة متابعة: ${student.fullName}`, `Student at risk: ${student.fullName}`),
src/services/operations.service.ts:619: label: t(locale, "طلاب بحاجة متابعة", "Students at risk"),
src/services/operations.service.ts:622: value: atRiskStudents.length.toLocaleString("en-US"),
src/services/operations.service.ts:625: tone: atRiskStudents.length > 0 ? "warning" : "success",
src/services/reports.service.ts:190: const atRiskStudents = students.filter((student) => student.status === "at_risk").length;
src/services/reports.service.ts:349: title: t(locale, "طلاب بحاجة متابعة", "Students at risk"),
src/services/reports.service.ts:352: value: atRiskStudents.toLocaleString("en-US"),
src/services/reports.service.ts:358: tone: atRiskStudents > 0 ? "warning" : "success",
src/services/student-basic-edit.service.ts:34: "at_risk",
src/services/students.service.ts:22: const VALID_STATUSES: StudentStatus[] = ["trial", "active", "paused", "at_risk", "completed", "churned"];
src/types/common.types.ts:175: | "at_risk"
src_backup2/app/(dashboard)/students/page.tsx:71: at_risk: "danger",
src_backup2/components/groups/group-tasks-panel.tsx:145: <ListTodo size={18} className="text-brand-600" />
src_backup2/components/groups/group-tasks-panel.tsx:9: import { CheckCircle2, Circle, ListTodo, PlusCircle, Trash2 } from "lucide-react";
src_backup2/config/labels.ts:107: at_risk: "Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©",
src_backup2/config/labels.ts:125: at_risk: "Needs attention",
src_backup2/config/status-meta.ts:129: at_risk: { label: STUDENT_STATUS_LABELS.at_risk, labelEn: STUDENT_STATUS_EN_LABELS.at_risk, color: "#DC2626", bg: "#FEF2F2" },
src_backup2/lib/mock-data.ts:477: { id: "4", fullName: "Ø³Ù„Ù…Ù‰ Ø®Ø§Ù„Ø¯", age: 11, parentName: "Ø®Ø§Ù„Ø¯ Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡", parentPhone: "01066778899", status: "at_risk", currentCourse: "scratch", className: "Scratch A", enrollmentDate: "2026-01-10", sessionsAttended: 8, totalPaid: 750 },
src_backup2/services/dashboard.service.ts:135: const atRiskStudents = students.filter((student) => student.status === "at_risk").length;
src_backup2/services/dashboard.service.ts:219: atRiskStudents > 0
src_backup2/services/dashboard.service.ts:225: text: t(locale, `${atRiskStudents} Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©`, `${atRiskStudents} students need attention`),
src_backup2/services/dashboard.service.ts:275: title: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"),
src_backup2/services/dashboard.service.ts:277: value: atRiskStudents.toLocaleString("en-US"),
src_backup2/services/dashboard.service.ts:281: tone: atRiskStudents > 0 ? "warning" : "success",
src_backup2/services/dashboard.service.ts:439: description: t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„Ù…Ø¹Ø±Ø¶ÙŠÙ† Ù„Ù„Ø®Ø·Ø± ÙˆØ§Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ©", "Review at-risk and trial students"),
src_backup2/services/dashboard.service.ts:525: isOps && atRiskStudents > 0 ? t(locale, "Ø§Ø¨Ø¯Ø£ Ø¨Ø§Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„Ù…Ø¹Ø±Ø¶ÙŠÙ† Ù„Ù„Ø®Ø·Ø± Ù„Ø£Ù†Ù‡Ù… Ø£Ù‚Ø±Ø¨ Ø®Ø³Ø§Ø±Ø© ØªØ´ØºÙŠÙ„ÙŠØ© Ø§Ù„Ø¢Ù†", "Start with at-risk students because they are the nearest operational risk right now") : null,
src_backup2/services/dashboard.service.ts:579: label: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"),
src_backup2/services/dashboard.service.ts:581: value: atRiskStudents.toLocaleString("en-US"),
src_backup2/services/dashboard.service.ts:583: change: atRiskStudents > 0 ? t(locale, "+Ù…Ù‡Ù…", "+Important") : "0",
src_backup2/services/dashboard.service.ts:649: { label: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"), value: atRiskStudents.toLocaleString("en-US"), icon: "warning", bg: "#FEF2F2", color: "#DC2626" },
src_backup2/services/dashboard.service.ts:661: { label: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"), value: atRiskStudents.toLocaleString("en-US"), icon: "warning", bg: "#FEF2F2", color: "#DC2626" },
src_backup2/services/dashboard.service.ts:701: label: t(locale, "Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "At risk"),
src_backup2/services/dashboard.service.ts:703: value: atRiskStudents,
src_backup2/services/dashboard.service.ts:705: pct: `${Math.round((atRiskStudents / opsFunnelBase) * 100)}%`,
src_backup2/services/operations.service.ts:191: const atRiskStudents = students.filter((student) => student.status === "at_risk");
src_backup2/services/operations.service.ts:321: ...atRiskStudents.map((student) => ({
src_backup2/services/operations.service.ts:323: id: `student-risk-${student.id}`,
src_backup2/services/operations.service.ts:325: title: t(locale, `Ø·Ø§Ù„Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©: ${student.fullName}`, `Student at risk: ${student.fullName}`),
src_backup2/services/operations.service.ts:413: label: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"),
src_backup2/services/operations.service.ts:415: value: atRiskStudents.length.toLocaleString("en-US"),
src_backup2/services/operations.service.ts:417: tone: atRiskStudents.length > 0 ? "warning" : "success",
src_backup2/services/reports.service.ts:127: const atRiskStudents = students.filter((student) => student.status === "at_risk").length;
src_backup2/services/reports.service.ts:233: title: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"),
src_backup2/services/reports.service.ts:235: value: atRiskStudents.toLocaleString("en-US"),
src_backup2/services/reports.service.ts:239: tone: atRiskStudents > 0 ? "warning" : "success",
src_backup2/services/student-basic-edit.service.ts:34: "at_risk",
src_backup2/services/students.service.ts:15: const VALID_STATUSES: StudentStatus[] = ["trial", "active", "paused", "at_risk", "completed", "churned"];
```


# Source Snapshot Location

```text
C:\Users\3bdel\Documents\Skidy Rein OS\.ai-handover-pack\handover-20260515-163633\SOURCE_SNAPSHOT_MASKED.md
```


# Important Files Quick View


# File: src/config/navigation.ts

```ts
import {
  Layers3,
  LayoutDashboard,
  Zap,
  Users,
  GraduationCap,
  UserCircle,
  BookOpen,
  Wallet,
  CircleDollarSign,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types/common.types";

/**
 * Sidebar navigation — single source of truth
 * Owner = same access as Admin
 * @author Abdelrahman
 */

export interface NavigationItem {
  titleAr: string;
  titleEn: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  badge?: number;
}

export interface NavigationGroup {
  labelAr: string;
  labelEn: string;
  items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    labelAr: "الرئيسية",
    labelEn: "Overview",
    items: [
      {
        titleAr: "لوحة التحكم",
        titleEn: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        roles: ["admin", "owner", "sales", "ops"],
      },
    ],
  },
  {
    labelAr: "المبيعات",
    labelEn: "Sales",
    items: [
      {
        titleAr: "العملاء المحتملون",
        titleEn: "Leads",
        href: "/leads",
        icon: Users,
        roles: ["admin", "owner", "sales"],
      },
      {
        titleAr: "المتابعات",
        titleEn: "Follow-ups",
        href: "/follow-ups",
        icon: ClipboardCheck,
        roles: ["admin", "owner", "sales", "ops"],
      },
      {
        titleAr: "المهام العاجلة",
        titleEn: "Action Center",
        href: "/action-center",
        icon: Zap,
        roles: ["admin", "owner", "sales", "ops"],
      },
    ],
  },
  {
    labelAr: "الأكاديمية",
    labelEn: "Academy",
    items: [
      {
        titleAr: "الطلاب",
        titleEn: "Students",
        href: "/students",
        icon: GraduationCap,
        roles: ["admin", "owner", "sales", "ops"],
      },
      {
        titleAr: "أولياء الأمور",
        titleEn: "Parents",
        href: "/parents",
        icon: UserCircle,
        roles: ["admin", "owner", "ops"],
      },
      {
        titleAr: "المدرسون",
        titleEn: "Teachers",
        href: "/teachers",
        icon: BookOpen,
        roles: ["admin", "owner", "ops"],
      },
      {
        titleAr: "الفصول",
        titleEn: "Classes",
        href: "/groups",
        icon: Layers3,
        roles: ["admin", "owner", "ops"],
      },
      {
        titleAr: "الجدول",
        titleEn: "Schedule",
        href: "/schedule",
        icon: CalendarDays,
        roles: ["admin", "owner", "ops"],
      },
    ],
  },
  {
    labelAr: "المالية",
    labelEn: "Finance",
    items: [
      {
        titleAr: "المدفوعات",
        titleEn: "Payments",
        href: "/payments",
        icon: Wallet,
        roles: ["admin", "owner", "sales", "ops"],
      },
      {
        titleAr: "مراجعة المالية",
        titleEn: "Finance Review",
        href: "/account-center",
        icon: CircleDollarSign,
        roles: ["admin", "owner", "sales"],
      },
    ],
  },
  {
    labelAr: "التشغيل",
    labelEn: "Operations",
    items: [
      {
        titleAr: "صحة النظام",
        titleEn: "Ops Health",
        href: "/operations-center",
        icon: ClipboardList,
        roles: ["admin", "owner", "ops"],
      },
    ],
  },
  {
    labelAr: "التحليلات",
    labelEn: "Analytics",
    items: [
      {
        titleAr: "التقارير",
        titleEn: "Reports",
        href: "/reports",
        icon: BarChart3,
        roles: ["admin", "owner"],
      },
      {
        titleAr: "مراجعة المالك",
        titleEn: "Owner Review",
        href: "/ownership-center",
        icon: ShieldCheck,
        roles: ["admin", "owner"],
      },
    ],
  },
  {
    labelAr: "النظام",
    labelEn: "System",
    items: [
      {
        titleAr: "الإعدادات",
        titleEn: "Settings",
        href: "/settings",
        icon: Settings,
        roles: ["admin", "owner"],
      },
    ],
  },
];
```


# File: src/config/roles.ts

```ts
import { type UserRole } from "@/types/common.types";

/**
 * Role-based access control
 * Owner = same as Admin (business owner sees everything)
 * @author Abdelrahman
 */

export interface RolePermissions {
  labelAr: string;
  labelEn: string;
  canViewDashboard: boolean;
  canViewLeads: boolean;
  canCreateLeads: boolean;
  canEditLeads: boolean;
  canDeleteLeads: boolean;
  canViewStudents: boolean;
  canCreateStudents: boolean;
  canEditStudents: boolean;
  canViewParents: boolean;
  canManageParents: boolean;
  canViewTeachers: boolean;
  canManageTeachers: boolean;
  canViewSchedule: boolean;
  canManageSchedule: boolean;
  canViewPayments: boolean;
  canManagePayments: boolean;
  canViewFollowUps: boolean;
  canManageFollowUps: boolean;
  canViewReports: boolean;
  canViewNotifications: boolean;
  canViewSettings: boolean;
  canManageSettings: boolean;
  canManageUsers: boolean;
}

const FULL_ACCESS: RolePermissions = {
  labelAr: "",
  labelEn: "",
  canViewDashboard: true,
  canViewLeads: true,
  canCreateLeads: true,
  canEditLeads: true,
  canDeleteLeads: true,
  canViewStudents: true,
  canCreateStudents: true,
  canEditStudents: true,
  canViewParents: true,
  canManageParents: true,
  canViewTeachers: true,
  canManageTeachers: true,
  canViewSchedule: true,
  canManageSchedule: true,
  canViewPayments: true,
  canManagePayments: true,
  canViewFollowUps: true,
  canManageFollowUps: true,
  canViewReports: true,
  canViewNotifications: true,
  canViewSettings: true,
  canManageSettings: true,
  canManageUsers: true,
};

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    ...FULL_ACCESS,
    labelAr: "مدير النظام",
    labelEn: "Admin",
  },
  owner: {
    ...FULL_ACCESS,
    labelAr: "المالك",
    labelEn: "Owner",
  },
  sales: {
    labelAr: "مبيعات",
    labelEn: "Sales",
    canViewDashboard: true,
    canViewLeads: true,
    canCreateLeads: true,
    canEditLeads: true,
    canDeleteLeads: false,
    canViewStudents: true,
    canCreateStudents: false,
    canEditStudents: false,
    canViewParents: false,
    canManageParents: false,
    canViewTeachers: false,
    canManageTeachers: false,
    canViewSchedule: false,
    canManageSchedule: false,
    canViewPayments: true,
    canManagePayments: true,
    canViewFollowUps: true,
    canManageFollowUps: true,
    canViewReports: false,
    canViewNotifications: true,
    canViewSettings: false,
    canManageSettings: false,
    canManageUsers: false,
  },
  ops: {
    labelAr: "عمليات",
    labelEn: "Operations",
    canViewDashboard: true,
    canViewLeads: false,
    canCreateLeads: false,
    canEditLeads: false,
    canDeleteLeads: false,
    canViewStudents: true,
    canCreateStudents: true,
    canEditStudents: true,
    canViewParents: true,
    canManageParents: true,
    canViewTeachers: true,
    canManageTeachers: true,
    canViewSchedule: true,
    canManageSchedule: true,
    canViewPayments: true,
    canManagePayments: false,
    canViewFollowUps: true,
    canManageFollowUps: true,
    canViewReports: false,
    canViewNotifications: true,
    canViewSettings: false,
    canManageSettings: false,
    canManageUsers: false,
  },
};

/** Check if a role has a specific permission */
export function hasPermission(
  role: UserRole,
  permission: keyof RolePermissions
): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  const value = permissions[permission];
  return typeof value === "boolean" ? value : false;
}

interface PaymentResponsibleUser {
  email?: string | null;
  fullName?: string | null;
  fullNameAr?: string | null;
  role?: UserRole | null;
}

function normalizePaymentIdentity(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[اأإآ]/g, "ا")
    .replace(/[\-_.]/g, "");
}

const ALAA_PAYMENT_EMAILS = ["alaa@skidyrain.com"];

export function canManagePaymentsForUser(user: PaymentResponsibleUser | null | undefined): boolean {
  if (!user) return false;
  if (user.role === "admin" || user.role === "owner") return true;
  if (user.role !== "sales") return false;

  const email = normalizePaymentIdentity(user.email);
  return ALAA_PAYMENT_EMAILS.some((allowedEmail) => email === normalizePaymentIdentity(allowedEmail));
}

export function canAccessPaymentsForUser(user: PaymentResponsibleUser | null | undefined): boolean {
  return canManagePaymentsForUser(user);
}

interface TeacherResponsibleUser {
  email?: string | null;
  fullName?: string | null;
  fullNameAr?: string | null;
  role?: UserRole | null;
}

const HAGAR_TEACHER_EMAILS = ["hagar@skidyrain.com"];

export function canManageTeachersForUser(user: TeacherResponsibleUser | null | undefined): boolean {
  if (!user) return false;
  if (user.role === "admin" || user.role === "owner") return true;
  if (user.role !== "ops") return false;

  const email = normalizePaymentIdentity(user.email);
  return HAGAR_TEACHER_EMAILS.some((allowedEmail) => email === normalizePaymentIdentity(allowedEmail));
}

export function canAccessTeachersForUser(user: TeacherResponsibleUser | null | undefined): boolean {
  return canManageTeachersForUser(user);
}

export function canManageTeacherFinanceForUser(user: TeacherResponsibleUser | null | undefined): boolean {
  return canManageTeachersForUser(user);
}

```


# File: src/stores/ui-store.ts

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Locale } from "@/types/common.types";

export type CurrencyCode = "EGP" | "SAR";

/**
 * UI state management store
 * Handles sidebar state, locale, currency, and global UI preferences
 */
interface UIState {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  locale: Locale;
  currency: CurrencyCode;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: CurrencyCode) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileSidebarOpen: false,
      locale: "ar",
      currency: "EGP",

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleMobileSidebar: () =>
        set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),

      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

      setLocale: (locale) => set({ locale }),

      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "skidy-rein-ui",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        locale: state.locale,
        currency: state.currency,
      }),
    }
  )
);

```


# File: src/app/(dashboard)/layout.tsx

```tsx
import { requireAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { UserProvider } from "@/providers/user-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <UserProvider user={user}>
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  );
}

```


# File: src/app/globals.css

```css
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");
/* =============================================
   Skidy Rein OS — Design System v1
   Tailwind 4 / @theme directive
   ============================================= */

@import "tailwindcss";

/* Fonts */
@theme {
  /* ---------- Brand ---------- */
  --color-brand-50:  #F4F1FE;
  --color-brand-100: #E5DEFD;
  --color-brand-200: #CCBFFB;
  --color-brand-300: #A992F7;
  --color-brand-400: #8567F2;
  --color-brand-500: #5F39FE;
  --color-brand-600: #4B2FB8;
  --color-brand-700: #3D258F;
  --color-brand-800: #2E1C6B;
  --color-brand-900: #1F1347;
  --color-brand-950: #110A26;

  /* ---------- Cream ---------- */
  --color-cream-50:  #FFFAF3;
  --color-cream-100: #FFEFE0;
  --color-cream-200: #FFE2C7;
  --color-cream-300: #FFD0A4;

  /* ---------- Neutrals ---------- */
  --color-neutral-0:   #FFFFFF;
  --color-neutral-50:  #F8FAFC;
  --color-neutral-100: #F1F5F9;
  --color-neutral-200: #E2E8F0;
  --color-neutral-300: #CBD5E1;
  --color-neutral-400: #94A3B8;
  --color-neutral-500: #64748B;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1E293B;
  --color-neutral-900: #0F172A;
  --color-neutral-950: #020617;

  /* ---------- Semantic ---------- */
  --color-success-50:  #ECFDF5;
  --color-success-100: #D1FAE5;
  --color-success-500: #10B981;
  --color-success-600: #059669;
  --color-success-700: #047857;

  --color-warning-50:  #FFFBEB;
  --color-warning-100: #FEF3C7;
  --color-warning-500: #F59E0B;
  --color-warning-600: #D97706;
  --color-warning-700: #B45309;

  --color-danger-50:   #FFF1F2;
  --color-danger-100:  #FFE4E6;
  --color-danger-500:  #F43F5E;
  --color-danger-600:  #E11D48;
  --color-danger-700:  #BE123C;

  --color-info-50:     #F0F9FF;
  --color-info-100:    #E0F2FE;
  --color-info-500:    #0EA5E9;
  --color-info-600:    #0284C7;
  --color-info-700:    #0369A1;

  /* ---------- Surfaces (semantic aliases) ---------- */
  --color-bg:            var(--color-neutral-50);
  --color-surface:       var(--color-neutral-0);
  --color-surface-2:     var(--color-neutral-100);
  --color-border:        var(--color-neutral-200);
  --color-border-strong: var(--color-neutral-300);
  --color-fg:            var(--color-neutral-900);
  --color-fg-muted:      var(--color-neutral-500);
  --color-fg-subtle:     var(--color-neutral-400);
  --color-primary:       var(--color-brand-500);
  --color-primary-fg:    var(--color-neutral-0);
  --color-primary-hover: var(--color-brand-600);

  /* ---------- Typography ---------- */
  --font-sans-arabic: "IBM Plex Sans Arabic", system-ui, -apple-system, sans-serif;
  --font-sans-latin:  "Inter", system-ui, -apple-system, sans-serif;
  --font-mono:        "JetBrains Mono", ui-monospace, monospace;

  --text-display: 2rem;
  --text-title:   1.5rem;
  --text-heading: 1.125rem;
  --text-body:    0.875rem;
  --text-caption: 0.75rem;

  --leading-display: 2.5rem;
  --leading-title:   2rem;
  --leading-heading: 1.75rem;
  --leading-body:    1.25rem;
  --leading-caption: 1rem;

  /* ---------- Radii ---------- */
  --radius-sm:  0.25rem;
  --radius-md:  0.375rem;
  --radius-lg:  0.5rem;
  --radius-xl:  0.75rem;
  --radius-2xl: 1rem;

  /* ---------- Shadows ---------- */
  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 8px -2px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 12px 24px -4px rgba(15, 23, 42, 0.10);
  --shadow-xl: 0 24px 48px -12px rgba(15, 23, 42, 0.18);

  /* ---------- Motion ---------- */
  --duration-fast:   100ms;
  --duration-normal: 200ms;
  --duration-slow:   300ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);

  /* ---------- Z-index ---------- */
  --z-dropdown: 1000;
  --z-sticky:   1100;
  --z-overlay:  1200;
  --z-dialog:   1300;
  --z-toast:    1400;
}

/* ---------- Base ---------- */
:root {
  font-family: var(--font-sans-arabic);
  color: var(--color-fg);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

html[lang="en"] {
  font-family: var(--font-sans-latin);
}

body {
  font-size: var(--text-body);
  line-height: var(--leading-body);
}

.font-mono,
[data-numeric] {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

:where(button, a, input, select, textarea, [role="button"]):focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

::selection {
  background: var(--color-brand-100);
  color: var(--color-brand-900);
}

::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--color-neutral-300);
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-neutral-400);
  background-clip: padding-box;
}


/* =============================================
   shadcn/ui compatibility layer
   Maps shadcn's standard token names to our design system.
   Uses @theme inline so utilities resolve to CSS vars at build time.
   ============================================= */
@theme inline {
  --color-background:           var(--color-bg);
  --color-foreground:           var(--color-fg);

  --color-card:                 var(--color-surface);
  --color-card-foreground:      var(--color-fg);

  --color-popover:              var(--color-surface);
  --color-popover-foreground:   var(--color-fg);

  --color-primary-foreground:   var(--color-neutral-0);

  --color-secondary:            var(--color-neutral-100);
  --color-secondary-foreground: var(--color-fg);

  --color-muted:                var(--color-neutral-100);
  --color-muted-foreground:     var(--color-fg-muted);

  --color-accent:               var(--color-brand-50);
  --color-accent-foreground:    var(--color-brand-700);

  --color-destructive:          var(--color-danger-500);
  --color-destructive-foreground: var(--color-neutral-0);

  --color-input:                var(--color-neutral-200);
  --color-ring:                 var(--color-brand-500);

  --radius: 0.5rem;
}
```


# File: src/middleware.ts

NOT FOUND


# File: middleware.ts

NOT FOUND


# File: src/lib/auth.ts

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types/common.types";

const VALID_ROLES: UserRole[] = ["admin", "sales", "ops", "owner"];

async function getSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Can't set cookies in Server Components — expected
          }
        },
      },
    }
  );
}

export async function getCurrentUser() {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Query profile — depends on RLS SELECT policy
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Log errors without leaking PII (no email/role in logs)
  if (profileError) {
    console.error("[auth] Profile query error:", profileError.message);
    return null;
  }

  if (!profile) {
    console.warn("[auth] No profile found for authenticated user");
    return null;
  }

  // Validate role — must exist and be valid; no fallback to elevated roles
  const dbRole = profile.role as string | undefined;
  if (!dbRole || !VALID_ROLES.includes(dbRole as UserRole)) {
    console.error("[auth] Invalid or missing role on profile");
    return null;
  }

  const role: UserRole = dbRole as UserRole;

  return {
    id: user.id,
    email: user.email ?? "",
    fullName:
      profile?.full_name ??
      user.email?.split("@")[0] ??
      "User",
    fullNameAr:
      profile?.full_name_ar ??
      "مستخدم",
    role,
    avatarUrl: profile?.avatar_url ?? null,
    isActive: profile?.is_active !== false,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) redirect("/");
  return user;
}

```


# File: src/lib/supabase.ts

NOT FOUND


# File: src/lib/supabase/client.ts

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

```


# File: src/lib/supabase/server.ts

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component
          }
        },
      },
    }
  );
}

```


# File: src/components/layout/sidebar.tsx

```tsx
"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useCurrentUser } from "@/providers/user-provider";
import { signOutClient } from "@/lib/actions/auth.actions";
import { navigationGroups } from "@/config/navigation";
import { canAccessTeachersForUser, ROLE_PERMISSIONS } from "@/config/roles";

const sidebarVariants = {
  expanded: { width: 260 },
  collapsed: { width: 72 },
};

const textVariants = {
  show: { opacity: 1, x: 0, display: "block" },
  hide: { opacity: 0, x: -10, transitionEnd: { display: "none" } },
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, locale } = useUIStore();
  const isAr = locale === "ar";
  const user = useCurrentUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = isAr ? user.fullNameAr : user.fullName;
  const initial = user.fullName.charAt(0).toUpperCase();
  const roleLabel = isAr ? ROLE_PERMISSIONS[user.role].labelAr : ROLE_PERMISSIONS[user.role].labelEn;

  const filteredGroupsBase = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.roles.includes(user.role)) return false;
        if (item.href.startsWith("/teachers")) return canAccessTeachersForUser(user);
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);

  const filteredGroups = filteredGroupsBase;

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOutClient();
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={sidebarOpen ? "expanded" : "collapsed"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "hidden lg:flex fixed top-0 h-screen z-40 flex-col bg-brand-950",
        isAr ? "right-0 border-l border-white/10" : "left-0 border-r border-white/10",
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <div className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center" style={{ background: "#4338CA" }}>
          <span className="text-sm font-bold text-white">SR</span>
        </div>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div variants={textVariants} initial="hide" animate="show" exit="hide" transition={{ duration: 0.2 }}>
              <p className="text-sm font-bold leading-tight text-white">Skidy Rein OS</p>
              <p className="text-[10px] text-white/50">{isAr ? "نظام تشغيل الأكاديمية" : "Academy Operating System"}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {filteredGroups.map((group) => (
          <div key={group.labelEn}>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.p
                  variants={textVariants}
                  initial="hide"
                  animate="show"
                  exit="hide"
                  className={cn(
                    "mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/40",
                    !isAr && "text-left",
                  )}
                >
                  {isAr ? group.labelAr : group.labelEn}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl text-sm transition-all duration-200",
                      sidebarOpen ? "px-3 py-2.5" : "justify-center px-0 py-2.5",
                      active
                        ? "bg-brand-700 text-white shadow-lg shadow-brand-700/30"
                        : "text-white/60 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <Icon
                      className={cn(
                        "shrink-0 transition-colors",
                        active ? "text-cream-200" : "text-white/50 group-hover:text-white",
                      )}
                      size={20}
                    />

                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span variants={textVariants} initial="hide" animate="show" exit="hide" transition={{ duration: 0.15 }}>
                          {isAr ? item.titleAr : item.titleEn}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {!sidebarOpen && (
                      <div
                        className={cn(
                          "pointer-events-none absolute px-2 py-1 text-xs whitespace-nowrap rounded-lg bg-gray-900 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                          isAr ? "right-full mr-2" : "left-full ml-2",
                        )}
                      >
                        {isAr ? item.titleAr : item.titleEn}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-2">
        <button
          onClick={toggleSidebar}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl py-2 text-white/40 transition-colors hover:bg-white/8 hover:text-white",
            sidebarOpen ? "px-3" : "justify-center",
          )}
        >
          {isAr ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {sidebarOpen && (
            <motion.span variants={textVariants} initial="hide" animate="show" exit="hide" className="text-xs">
              {isAr ? "طي القائمة" : "Collapse"}
            </motion.span>
          )}
        </button>

        <div className={cn("flex items-center gap-3 rounded-xl bg-white/5 p-2", !sidebarOpen && "justify-center")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "#4338CA" }}>
            <span className="text-xs font-bold text-white">{initial}</span>
          </div>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div variants={textVariants} initial="hide" animate="show" exit="hide" className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{displayName}</p>
                <p className="text-[10px] text-white/40">{roleLabel}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {sidebarOpen && (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={cn("text-white/30 transition-colors hover:text-red-400", isLoggingOut && "cursor-not-allowed opacity-50")}
              title={isAr ? "تسجيل الخروج" : "Sign out"}
            >
              {isLoggingOut ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <LogOut size={16} />}
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

```


# File: src/components/layout/navbar.tsx

NOT FOUND


# File: src/components/shared/page-state.tsx

```tsx
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ArrowLeft, Inbox, SearchX, ShieldAlert } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { t } from "@/lib/locale";
import { cn } from "@/lib/utils";

interface PageStateProps {
  icon?: LucideIcon;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  actionHref?: string;
  actionLabelAr?: string;
  actionLabelEn?: string;
  secondaryAction?: ReactNode;
  variant?: "default" | "warning" | "danger";
  compact?: boolean;
}

const VARIANT_STYLES: Record<NonNullable<PageStateProps["variant"]>, string> = {
  default: "border-border bg-card text-foreground",
  warning: "border-warning-200 bg-warning-50/60 text-foreground dark:border-warning-900 dark:bg-warning-950/30",
  danger: "border-destructive/20 bg-destructive/5 text-foreground dark:bg-destructive/10",
};

const DEFAULT_ICONS: Record<NonNullable<PageStateProps["variant"]>, LucideIcon> = {
  default: Inbox,
  warning: AlertTriangle,
  danger: ShieldAlert,
};

export function PageStateCard({
  icon,
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  actionHref,
  actionLabelAr,
  actionLabelEn,
  secondaryAction,
  variant = "default",
  compact = false,
}: PageStateProps) {
  const locale = useUIStore((state) => state.locale);
  const isAr = locale === "ar";
  const Icon = icon ?? DEFAULT_ICONS[variant];

  return (
    <div
      className={cn(
        "rounded-2xl border text-center shadow-sm",
        compact ? "p-6" : "p-10",
        VARIANT_STYLES[variant],
      )}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background/80 text-brand-600 shadow-sm ring-1 ring-border/60">
        <Icon size={24} />
      </div>

      <h2 className="mt-4 text-lg font-bold text-foreground">{t(locale, titleAr, titleEn)}</h2>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
        {t(locale, descriptionAr, descriptionEn)}
      </p>

      {(actionHref || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              {isAr ? null : <ArrowLeft size={16} />}
              {t(locale, actionLabelAr ?? "العودة", actionLabelEn ?? "Go back")}
              {isAr ? <ArrowLeft size={16} /> : null}
            </Link>
          ) : null}

          {secondaryAction}
        </div>
      )}
    </div>
  );
}

export function LoadingState({
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
}: Omit<PageStateProps, "variant">) {
  const locale = useUIStore((state) => state.locale);

  return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
      <h2 className="mt-4 text-lg font-bold text-foreground">{t(locale, titleAr, titleEn)}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{t(locale, descriptionAr, descriptionEn)}</p>
    </div>
  );
}

export function EmptySearchState() {
  return (
    <PageStateCard
      icon={SearchX}
      titleAr="لا توجد نتائج مطابقة"
      titleEn="No matching results"
      descriptionAr="جرّب تعديل كلمة البحث أو تخفيف الفلاتر للحصول على نتائج أفضل."
      descriptionEn="Try adjusting the search term or easing the filters to get better results."
      compact
    />
  );
}

```


# File: src/types/common.types.ts

```ts
/**
 * Common TypeScript types used across the application
 * Updated to reflect simplified sales system (8-stage pipeline)
 * @author Abdelrahman
 */

/** Supported UI languages */
export type Locale = "ar" | "en";

/** Application user role */
export type UserRole = "admin" | "sales" | "ops" | "owner";

/**
 * Lead pipeline stage — 8 stages (simplified from 12)
 * Decision: simpler pipeline = higher team compliance
 */
export type LeadStage =
  | "new"
  | "qualified"
  | "trial_proposed"
  | "trial_booked"
  | "trial_attended"
  | "offer_sent"
  | "won"
  | "lost";

/** Lead temperature — simplified scoring (3 levels) */
export type LeadTemperature = "hot" | "warm" | "cold";

/**
 * Loss reason — Dropdown (not free text)
 * Critical for diagnosing: pricing? ads? objections?
 */
export type LossReason =
  | "price"
  | "wants_offline"
  | "no_laptop"
  | "age_mismatch"
  | "no_response"
  | "exams_deferred"
  | "not_convinced_online"
  | "chose_competitor"
  | "other";

/** Trial session status */
export type TrialStatus =
  | "scheduled"
  | "reminded"
  | "attended"
  | "no_show"
  | "rescheduled"
  | "cancelled";

/** Student enrollment status */
export type StudentStatus =
  | "trial"
  | "active"
  | "paused"
  | "at_risk"
  | "completed"
  | "churned";

/** Payment status */
export type PaymentStatus =
  | "paid"
  | "pending"
  | "overdue"
  | "refunded"
  | "partial";

/** Teacher employment type */
export type EmploymentType = "full_time" | "part_time" | "freelance";

/** Communication channel */
export type CommChannel = "whatsapp" | "email" | "call" | "sms";

/** Lead source */
export type LeadSource =
  | "facebook_ad"
  | "instagram_ad"
  | "group"
  | "referral"
  | "direct"
  | "website"
  | "other";

/** Objection type from sales system */
export type ObjectionType =
  | "price"
  | "timing"
  | "online"
  | "uncertain"
  | "hyperactive_child"
  | "certificate"
  | "other";

/** Attendance status */
export type AttendanceStatus = "present" | "absent" | "late" | "excused";

/** Payment method */
export type PaymentMethod =
  | "bank_transfer"
  | "card"
  | "wallet"
  | "cash"
  | "instapay";

/** Feedback type */
export type FeedbackType = "complaint" | "suggestion" | "praise" | "general";

/** Priority levels */
export type Priority = "low" | "medium" | "high" | "urgent";

/** Follow-up type */
export type FollowUpType =
  | "first_contact"
  | "qualification"
  | "trial_reminder"
  | "post_trial"
  | "no_show"
  | "closing"
  | "payment_reminder"
  | "re_engagement";

/** Course type based on age placement logic */
export type CourseType = "scratch" | "app_inventor" | "robotics_basic" | "ai_intro" | "python" | "godot" | "robotics_iot" | "fastapi" | "html_css" | "javascript_tailwind" | "front_end" | "ai_ml" | "data_science" | "back_end" | "raspberry_pi" | "web" | "ai";


/** Course stage — 4 curriculum stages for finance/reporting */
export type CourseStage = "foundation" | "practical" | "web_apps" | "ai_data";

/** Maps each course to its stage */
export const COURSE_STAGE_MAP: Record<CourseType, CourseStage> = {
  scratch: "foundation",
  app_inventor: "foundation",
  robotics_basic: "foundation",
  ai_intro: "foundation",
  python: "practical",
  godot: "practical",
  robotics_iot: "practical",
  fastapi: "practical",
  html_css: "web_apps",
  javascript_tailwind: "web_apps",
  front_end: "web_apps",
  ai_ml: "ai_data",
  data_science: "ai_data",
  back_end: "ai_data",
  raspberry_pi: "ai_data",
  web: "web_apps",
  ai: "ai_data",
};

/** Labels for CourseStage */
export const COURSE_STAGE_LABELS: Record<CourseStage, { ar: string; en: string }> = {
  foundation: { ar: "التأسيس الإبداعي", en: "Creative Foundation" },
  practical: { ar: "البرمجة العملية", en: "Practical Programming" },
  web_apps: { ar: "التطبيقات والويب", en: "Web & Apps" },
  ai_data: { ar: "AI والبيانات", en: "AI & Data" },
};

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/** Pagination parameters */
export interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Filter and sort options for data tables */
export interface DataTableParams {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  filters?: Record<string, string | string[]>;
}

```


# Docs Snapshot


# File: docs/archive/AUDIT_DUMP.md

```md
# AUDIT DUMP - 04/14/2026 18:48:37
## 1. PROJECT STRUCTURE
.github\workflows\ci.yml
.vscode\settings.json
docs\NEW-CHAT-PROMPT.txt
password_note_fix\src\app\(dashboard)\settings\page.tsx
scripts\cleanup-artifacts.ps1
scripts\project-inventory.ps1
src\app\(auth)\login\auth.ts
src\app\(auth)\login\layout.tsx
src\app\(auth)\login\page.tsx
src\app\(dashboard)\action-center\page.tsx
src\app\(dashboard)\follow-ups\page.tsx
src\app\(dashboard)\leads\new\page.tsx
src\app\(dashboard)\leads\[id]\edit\page.tsx
src\app\(dashboard)\leads\[id]\page.tsx
src\app\(dashboard)\leads\page.tsx
src\app\(dashboard)\parents\new\page.tsx
src\app\(dashboard)\parents\[id]\page.tsx
src\app\(dashboard)\parents\page.tsx
src\app\(dashboard)\payments\invoice\[id]\page.tsx
src\app\(dashboard)\payments\new\page.tsx
src\app\(dashboard)\payments\[id]\invoice\page.tsx
src\app\(dashboard)\payments\[id]\page.tsx
src\app\(dashboard)\payments\page.tsx
src\app\(dashboard)\reports\page.tsx
src\app\(dashboard)\schedule\new\page.tsx
src\app\(dashboard)\schedule\[id]\page.tsx
src\app\(dashboard)\schedule\page.tsx
src\app\(dashboard)\settings\page.tsx
src\app\(dashboard)\students\new\page.tsx
src\app\(dashboard)\students\[id]\report\page.tsx
src\app\(dashboard)\students\[id]\page.tsx
src\app\(dashboard)\students\page.tsx
src\app\(dashboard)\teachers\finance\page.tsx
src\app\(dashboard)\teachers\new\page.tsx
src\app\(dashboard)\teachers\[id]\page.tsx
src\app\(dashboard)\teachers\page.tsx
src\app\(dashboard)\layout.tsx
src\app\(dashboard)\loading.tsx
src\app\(dashboard)\not-found.tsx
src\app\(dashboard)\page.tsx
src\app\error.tsx
src\app\globals.css
src\app\layout.tsx
src\app\not-found.tsx
src\app\page.backup.tsx
src\components\layout\dashboard-shell.tsx
src\components\layout\global-search.tsx
src\components\layout\mobile-nav.tsx
src\components\layout\sidebar.tsx
src\components\layout\top-navbar.tsx
src\components\leads\lead-form.tsx
src\components\leads\leads-kanban.tsx
src\components\leads\stage-badge.tsx
src\components\leads\temperature-badge.tsx
src\components\parents\parent-form.tsx
src\components\payments\invoice-toolbar.tsx
src\components\payments\payment-invoice-view.tsx
src\components\providers\theme-provider.tsx
src\components\schedule\schedule-entry-form.tsx
src\components\shared\page-state.tsx
src\components\students\student-form.tsx
src\components\teachers\teacher-form.tsx
src\components\ui\button.tsx
src\config\course-roadmap.ts
src\config\labels.ts
src\config\navigation.ts
src\config\roles.ts
src\config\stages.ts
src\config\status-meta.ts
src\lib\actions\auth.actions.ts
src\lib\supabase\client.ts
src\lib\supabase\server.ts
src\lib\auth.ts
src\lib\formatters.ts
src\lib\locale.ts
src\lib\mock-data.ts
src\lib\utils.ts
src\providers\user-provider.tsx
src\services\dashboard.service.ts
src\services\duplicate-guard.service.ts
src\services\enrollment.service.ts
src\services\follow-ups.service.ts
src\services\leads.service.ts
src\services\operations.service.ts
src\services\owner-summary.service.ts
src\services\parents.service.ts
src\services\payments.service.ts
src\services\relations.service.ts
src\services\reports.service.ts
src\services\schedule.service.ts
src\services\schedule_service_repaired.ts
src\services\storage.ts
src\services\student-enrollment-control.service.ts
src\services\student-finance.service.ts
src\services\student-journey.service.ts
src\services\student-report.service.ts
src\services\students.service.ts
src\services\teacher-evaluations.service.ts
src\services\teacher-finance.service.ts
src\services\teacher-reassignment.service.ts
src\services\teachers.service.ts
src\stores\ui-store.ts
src\types\common.types.ts
src\types\crm.ts
src\types\database.types.ts
src\types\modules.d.ts
src\middleware.ts
supabase\migrations\client.ts
_ops\rogue-root-files\page.tsx.bak
_ops\route-backups\page.backup.tsx
_ops\apply-skidy-payments-batch-1.ps1
_ops\cleanup-artifacts.ps1
_ops\PHASE7-BATCH2-STUDENTS-PARENTS-TEACHERS-NOTES.md
_ops\PHASE7-BATCH3-PAYMENTS-SCHEDULE-NOTES.md
.env.example
.env.local
.gitignore
AGENTS.md
apply-delete-teacher.js
apply-global-search-teacher-email-fix.js
apply-parent-null-fix.js
apply-teacher-email-null-fix.js
apply-vercel-service-exports-fix.js
AUDIT_DUMP.md
CLAUDE.md
components.json
eslint.config.mjs
fix-crm-barrel-exports.js
fix-route-types.js
IMPLEMENTATION-NOTES.md
next-env.d.ts
next.config.ts
package-lock.json
package.json
PAYMENTS-PERMISSIONS-BILLING-NOTES.md
PAYMENTS-UPGRADE-NOTES.md
PHASE-NEXT-NAV-CLEANUP-NOTES.md
PHASE-NEXT-SECURITY-NOTES.md
PHASE7-9-COMBINED-NOTES.md
PHASE7-LEADS-FOLLOWUPS-NOTES.md
PHASE8-9-ROLE-FILTERING-FIX-NOTES.md
postcss.config.mjs
README.md
README.txt
remove-rogue-root-page.js
tsconfig.json
tsconfig.tsbuildinfo
## 2. SERVICES

### FILE: src\services\dashboard.service.ts
```ts

import { STAGE_CONFIGS } from "@/config/stages";
import { DASHBOARD_TASK_STATUS_META, PRIORITY_META } from "@/config/status-meta";
import { formatCurrencyEgp, formatTime } from "@/lib/formatters";
import { getConversionTerm, t } from "@/lib/locale";
import { listFollowUps } from "@/services/follow-ups.service";
import { listLeads } from "@/services/leads.service";
import { getPaymentsSummary, listPayments } from "@/services/payments.service";
import { getScheduleOverview, listScheduleSessions } from "@/services/schedule.service";
import { listStudents } from "@/services/students.service";
import type { DashboardActionItem, DashboardContext, DashboardFollowUpItem, DashboardOverview, DashboardOperationItem } from "@/types/crm";
import type { Locale } from "@/types/common.types";

function isManagementRole(role: DashboardContext["role"]): boolean {
  return role === "admin" || role === "owner";
}

function isOpsRole(role: DashboardContext["role"]): boolean {
  return role === "ops";
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function matchesAssignee(nameAr: string, ctx: DashboardContext): boolean {
  const targets = [normalizeName(ctx.fullNameAr), normalizeName(ctx.fullName)];
  return targets.includes(normalizeName(nameAr));
}

function getToneBg(tone: DashboardOperationItem["tone"]): string {
  switch (tone) {
    case "success":
      return "#ECFDF5";
    case "warning":
      return "#FFFBEB";
    case "danger":
      return "#FEF2F2";
    case "info":
      return "#EFF6FF";
    default:
      return "#EEF2FF";
  }
}

export async function getDashboardOverview(
  context: DashboardContext,
  locale: Locale = "ar",
): Promise<DashboardOverview> {
  const [leads, students, followUps, payments, paymentsSummary, scheduleOverview, sessions] = await Promise.all([
    listLeads(),
    listStudents(),
    listFollowUps(),
    listPayments(),
    getPaymentsSummary(),
    getScheduleOverview(),
    listScheduleSessions(),
  ]);

  const isOps = isOpsRole(context.role);
  const activeStudents = students.filter((student) => student.status === "active").length;
  const recentLeads = leads.filter((lead) => {
    const createdAt = new Date(lead.createdAt).getTime();
    const threshold = Date.now() - 1000 * 60 * 60 * 24 * 7;
    return createdAt >= threshold;
  }).length;
  const monthlyRevenue = students.reduce((sum, student) => sum + student.totalPaid, 0);
  const atRiskStudents = students.filter((student) => student.status === "at_risk").length;
  const trialStudents = students.filter((student) => student.status === "trial").length;
  const bookedTrials = leads.filter((lead) => lead.stage === "trial_booked").length;
  const attendedTrials = leads.filter((lead) => lead.stage === "trial_attended").length;
  const overdueFollowUps = followUps.filter((item) => item.status === "overdue").length;
  const conversionRate = leads.length > 0 ? Math.round((leads.filter((lead) => lead.stage === "won").length / leads.length) * 100) : 0;
  const leadsMissingFollowUp = leads.filter((lead) => lead.stage !== "won" && lead.stage !== "lost" && !lead.nextFollowUpAt).length;
  const trialNoShows = leads.filter((lead) => lead.stage === "trial_booked" && !lead.lastContactAt).length;
  const overduePaymentsCount = payments.filter((payment) => payment.status === "overdue").length;
  const pendingPaymentsCount = payments.filter((payment) => payment.status === "pending").length;

  const allTasks: DashboardFollowUpItem[] = followUps.map((item) => ({
    id: item.id,
    name: item.leadName,
    reason: item.title,
    assignee: item.assignedTo,
    dot: PRIORITY_META[item.priority].color,
    time: formatTime(item.scheduledAt, locale),
    status: item.status === "overdue" ? "urgent" : item.status === "completed" ? "completed" : "pending",
  }));

  const employeeTasks = isManagementRole(context.role)
    ? allTasks
    : isOps
      ? []
      : allTasks.filter((task) => matchesAssignee(task.assignee, context));

  const alerts = [
    !isOps && overdueFollowUps > 0
      ? {
          icon: "warning",
          text: t(locale, `${overdueFollowUps} Ù…ØªØ§Ø¨Ø¹Ø§Øª Ù…ØªØ£Ø®Ø±Ø© ØªØ­ØªØ§Ø¬ ØªØ¯Ø®Ù„ Ø§Ù„Ø¢Ù†`, `${overdueFollowUps} overdue follow-ups need immediate action`),
          type: "danger" as const,
        }
      : null,
    overduePaymentsCount > 0
      ? {
          icon: "wallet",
          text: t(locale, `${overduePaymentsCount} Ø¯ÙØ¹Ø§Øª Ù…ØªØ£Ø®Ø±Ø© Ø¨Ù‚ÙŠÙ…Ø© ${formatCurrencyEgp(paymentsSummary.totalOverdue, locale)}`, `${overduePaymentsCount} overdue payments worth ${formatCurrencyEgp(paymentsSummary.totalOverdue, locale)}`),
          type: "warning" as const,
        }
      : null,
    atRiskStudents > 0
      ? {
          icon: "notification",
          text: t(locale, `${atRiskStudents} Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©`, `${atRiskStudents} students need attention`),
          type: "warning" as const,
        }
      : null,
    !isOps && recentLeads > 0
      ? {
          icon: "success",
          text: t(locale, `${recentLeads} Ø¹Ù…Ù„Ø§Ø¡ Ø¬Ø¯Ø¯ Ø®Ù„Ø§Ù„ Ø¢Ø®Ø± 7 Ø£ÙŠØ§Ù…`, `${recentLeads} new leads over the last 7 days`),
          type: "success" as const,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  const salesFunnelBase = Math.max(1, leads.length);
  const opsFunnelBase = Math.max(1, students.length);
  const numberLocale = locale === "ar" ? "ar-EG" : "en-US";

  const operations: DashboardOperationItem[] = isOps
    ? [
        {
          title: t(locale, "Ø¬Ù„Ø³Ø§Øª Ù‡Ø°Ø§ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹", "Sessions this week"),
          value: scheduleOverview.sessionsCount.toLocaleString(numberLocale),
          subtitle: t(locale, `${scheduleOverview.uniqueTeachers} Ù…Ø¯Ø±Ø³ÙŠÙ† â€¢ ${scheduleOverview.totalStudents} Ù…Ù‚Ø¹Ø¯`, `${scheduleOverview.uniqueTeachers} teachers â€¢ ${scheduleOverview.totalStudents} seats`),
          tone: "info",
        },
        {
          title: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"),
          value: atRiskStudents.toLocaleString(numberLocale),
          subtitle: t(locale, "Ù…Ù„ÙØ§Øª ØªØ­ØªØ§Ø¬ ØªØ¯Ø®Ù„Ù‹Ø§ ØªØ´ØºÙŠÙ„ÙŠÙ‹Ø§ Ø§Ù„Ø¢Ù†", "Student files that need operational intervention"),
          tone: atRiskStudents > 0 ? "warning" : "success",
        },
        {
          title: t(locale, "Ø§Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠÙˆÙ†", "Trial students"),
          value: trialStudents.toLocaleString(numberLocale),
          subtitle: t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø­Ø¶ÙˆØ± ÙˆØ§Ù„ØªØ­ÙˆÙŠÙ„ Ø¥Ù„Ù‰ Ø§Ø´ØªØ±Ø§Ùƒ", "Review attendance and conversion to enrollment"),
          tone: trialStudents > 0 ? "brand" : "info",
        },
        {
          title: t(locale, "ØªØ­ØµÙŠÙ„ Ø§Ù„Ø´Ù‡Ø±", "Collection this month"),
          value: `${paymentsSummary.collectionRate}%`,
          subtitle: t(locale, `${formatCurrencyEgp(paymentsSummary.totalCollected, locale)} Ù…Ù† ${formatCurrencyEgp(paymentsSummary.totalExpected, locale)}`, `${formatCurrencyEgp(paymentsSummary.totalCollected, locale)} out of ${formatCurrencyEgp(paymentsSummary.totalExpected, locale)}`),
          tone: paymentsSummary.collectionRate >= 80 ? "success" : paymentsSummary.collectionRate >= 60 ? "warning" : "danger",
        },
      ]
    : [
        {
          title: t(locale, "ØªØ­ØµÙŠÙ„ Ø§Ù„Ø´Ù‡Ø±", "Collection this month"),
          value: `${paymentsSummary.collectionRate}%`,
          subtitle: t(locale, `${formatCurrencyEgp(paymentsSummary.totalCollected, locale)} Ù…Ù† ${formatCurrencyEgp(paymentsSummary.totalExpected, locale)}`, `${formatCurrencyEgp(paymentsSummary.totalCollected, locale)} out of ${formatCurrencyEgp(paymentsSummary.totalExpected, locale)}`),
          tone: paymentsSummary.collectionRate >= 80 ? "success" : paymentsSummary.collectionRate >= 60 ? "warning" : "danger",
        },
        {
          title: t(locale, "Ø¬Ù„Ø³Ø§Øª Ù‡Ø°Ø§ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹", "Sessions this week"),
          value: scheduleOverview.sessionsCount.toLocaleString(numberLocale),
          subtitle: t(locale, `${scheduleOverview.uniqueTeachers} Ù…Ø¯Ø±Ø³ÙŠÙ† â€¢ ${scheduleOverview.totalStudents} Ù…Ù‚Ø¹Ø¯`, `${scheduleOverview.uniqueTeachers} teachers â€¢ ${scheduleOverview.totalStudents} seats`),
          tone: "info",
        },
        {
          title: t(locale, "Ø¹Ù…Ù„Ø§Ø¡ Ø¨Ù„Ø§ Ù…ØªØ§Ø¨Ø¹Ø© Ù‚Ø§Ø¯Ù…Ø©", "Leads without next follow-up"),
          value: leadsMissingFollowUp.toLocaleString(numberLocale),
          subtitle: t(locale, "Ø§Ø­ØªÙƒØ§Ùƒ ØªØ´ØºÙŠÙ„ÙŠ ÙŠØ¬Ø¨ ØªÙ†Ø¸ÙŠÙÙ‡", "Operational friction that needs cleanup"),
          tone: leadsMissingFollowUp > 0 ? "warning" : "success",
        },
        {
          title: t(locale, "Ø§Ù„Ø­ØµØµ Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ© Ø§Ù„Ù…Ø­Ø¬ÙˆØ²Ø©", "Booked trial sessions"),
          value: bookedTrials.toLocaleString(numberLocale),
          subtitle: t(locale, `${attendedTrials.toLocaleString(numberLocale)} Ø­Ø¶Ø±ÙˆØ§ Ø¨Ø§Ù„ÙØ¹Ù„`, `${attendedTrials.toLocaleString(numberLocale)} already attended`),
          tone: bookedTrials > attendedTrials ? "brand" : "success",
        },
      ];

  const quickActions: DashboardActionItem[] = isManagementRole(context.role)
    ? [
        {
          title: t(locale, "Ù„ÙˆØ­Ø© Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡", "Leads board"),
          description: t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ù…Ø±Ø§Ø­Ù„ Ø§Ù„Ù…ØªÙˆÙ‚ÙØ© ÙˆØ§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ø£Ù‚Ø±Ø¨ Ù„Ù„Ø§Ø´ØªØ±Ø§Ùƒ", "Review stalled stages and the leads closest to enrollment"),
          href: "/leads",
          tone: "brand",
        },
        {
          title: t(locale, "Ù…Ø±ÙƒØ² Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª", "Action center"),
          description: t(locale, "Ø´Ø§Ù‡Ø¯ ÙƒÙ„ Ø§Ù„Ø¹Ù†Ø§ØµØ± Ø§Ù„Ø­Ø±Ø¬Ø© ÙˆØ§Ù„ØªÙ†ÙÙŠØ°ÙŠØ© ÙÙŠ Ù…ÙƒØ§Ù† ÙˆØ§Ø­Ø¯", "See all critical and operational items in one place"),
          href: "/action-center",
          tone: "warning",
        },
        {
          title: t(locale, "Ø§Ù„ØªØ­ØµÙŠÙ„ ÙˆØ§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª", "Collections & payments"),
          description: t(locale, "Ø£ØºÙ„Ù‚ Ø§Ù„Ù…ØªØ£Ø®Ø±Ø§Øª ÙˆØ§Ø±ÙØ¹ Ù…Ø¹Ø¯Ù„ Ø§Ù„ØªØ­ØµÙŠÙ„", "Close overdue balances and improve collection rate"),
          href: "/payments",
          tone: "success",
        },
        {
          title: t(locale, "Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„ØªÙ†ÙÙŠØ°ÙŠØ©", "Executive reports"),
          description: t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø³Ø±Ø¹Ø©ØŒ Ø§Ù„Ù‚Ù…Ø¹ØŒ ÙˆØ§Ù„ÙØ±Øµ Ø§Ù„Ø¶Ø§Ø¦Ø¹Ø©", "Review velocity, funnel, and missed opportunities"),
          href: "/reports",
          tone: "info",
        },
      ]
    : isOps
      ? [
          {
            title: t(locale, "Ù…Ø±ÙƒØ² Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª", "Action center"),
            description: t(locale, "Ø§ÙØªØ­ Ø§Ù„Ù…Ù‡Ø§Ù… Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠØ© Ø§Ù„Ø¹Ø§Ø¬Ù„Ø© ÙÙŠ Ø´Ø§Ø´Ø© ÙˆØ§Ø­Ø¯Ø©", "Open urgent operational tasks in one screen"),
            href: "/action-center",
            tone: "warning",
          },
          {
            title: t(locale, "Ø§Ù„Ø·Ù„Ø§Ø¨", "Students"),
            description: t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„Ù…Ø¹Ø±Ø¶ÙŠÙ† Ù„Ù„Ø®Ø·Ø± ÙˆØ§Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ©", "Review at-risk and trial students"),
            href: "/students",
            tone: "brand",
          },
          {
            title: t(locale, "Ø§Ù„Ø¬Ø¯ÙˆÙ„", "Schedule"),
            description: t(locale, "Ø±Ø§Ø¬Ø¹ Ø¬Ù„Ø³Ø§Øª Ø§Ù„ÙŠÙˆÙ… ÙˆØ§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ† Ø§Ù„Ù…Ø±ØªØ¨Ø·ÙŠÙ†", "Review today's sessions and linked teachers"),
            href: "/schedule",
            tone: "info",
          },
          {
            title: t(locale, "Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª", "Payments"),
            description: t(locale, "ØªØ§Ø¨Ø¹ Ø§Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„Ù…ØªØ£Ø®Ø±Ø© ÙˆØ§Ù„Ù…Ø³ØªØ­Ù‚Ø© Ø§Ù„ÙŠÙˆÙ…", "Follow overdue and due-today payments"),
            href: "/payments",
            tone: "success",
          },
        ]
      : [
          {
            title: t(locale, "Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ù…Ø­ØªÙ…Ù„ÙˆÙ†", "Leads"),
            description: t(locale, "Ø­Ø¯Ù‘Ø« Ø§Ù„Ù…Ø±Ø§Ø­Ù„ ÙˆØ³Ø¬Ù‘Ù„ Ø¢Ø®Ø± ØªÙˆØ§ØµÙ„", "Update stages and capture the latest contact"),
            href: "/leads",
            tone: "brand",
          },
          {
            title: t(locale, "Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø§Øª", "Follow-ups"),
            description: t(locale, "Ø£ØºÙ„Ù‚ Ø§Ù„Ù…Ù‡Ø§Ù… Ø§Ù„Ù…ÙØªÙˆØ­Ø© Ù‚Ø¨Ù„ Ù†Ù‡Ø§ÙŠØ© Ø§Ù„ÙŠÙˆÙ…", "Close open tasks before the day ends"),
            href: "/follow-ups",
            tone: "warning",
          },
          {
            title: t(locale, "Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª", "Payments"),
            description: t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„Ù…Ø¹Ù„Ù‚Ø© ÙˆØ§Ù„Ù…ØªØ£Ø®Ø±Ø©", "Review pending and overdue payments"),
            href: "/payments",
            tone: "success",
          },
        ];

  const recommendations = [
    !isOps && overdueFollowUps > 0 ? t(locale, "Ø§Ø¨Ø¯Ø£ Ù…Ù† Ù…Ø±ÙƒØ² Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ù„Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø§Øª Ø§Ù„Ù…ØªØ£Ø®Ø±Ø© Ø£ÙˆÙ„Ø§Ù‹", "Start from the action center to close overdue follow-ups first") : null,
    overduePaymentsCount > 0 ? t(locale, "Ø£Ø±Ø³Ù„ ØªØ°ÙƒÙŠØ±Ø§Øª Ø¯ÙØ¹ Ù…Ø±ÙƒØ²Ø© Ù„Ù„Ø¹Ø§Ø¦Ù„Ø§Øª Ø§Ù„Ù…ØªØ£Ø®Ø±Ø© Ø§Ù„ÙŠÙˆÙ…", "Send focused payment reminders to overdue families today") : null,
    !isOps && trialNoShows > 0 ? t(locale, "Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø­ØµØµ Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ© ØºÙŠØ± Ø§Ù„Ù…Ø¤ÙƒØ¯Ø© Ù„ØªÙ‚Ù„ÙŠÙ„ Ø§Ù„Ù€ no-show", "Review unconfirmed trial sessions to reduce no-shows") : null,
    !isOps && leadsMissingFollowUp > 0 ? t(locale, "Ø£Ø¶Ù Ù…ÙˆØ§Ø¹ÙŠØ¯ Ù…ØªØ§Ø¨Ø¹Ø© Ù„Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ù…ÙØªÙˆØ­ÙŠÙ† Ø­ØªÙ‰ Ù„Ø§ ÙŠØªØ³Ø±Ø¨ÙˆØ§ Ù…Ù† Ø§Ù„Ù‚Ù…Ø¹", "Add follow-up dates for open leads so they do not leak from the funnel") : null,
    isOps && atRiskStudents > 0 ? t(locale, "Ø§Ø¨Ø¯Ø£ Ø¨Ø§Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„Ù…Ø¹Ø±Ø¶ÙŠÙ† Ù„Ù„Ø®Ø·Ø± Ù„Ø£Ù†Ù‡Ù… Ø£Ù‚Ø±Ø¨ Ø®Ø³Ø§Ø±Ø© ØªØ´ØºÙŠÙ„ÙŠØ© Ø§Ù„Ø¢Ù†", "Start with at-risk students because they are the nearest operational risk right now") : null,
    isOps && scheduleOverview.sessionsCount > 0 ? t(locale, "Ø±Ø§Ø¬Ø¹ Ø¬Ø¯ÙˆÙ„ Ø§Ù„ÙŠÙˆÙ… ÙˆØªØ£ÙƒØ¯ Ù…Ù† Ø§ÙƒØªÙ…Ø§Ù„ Ø§Ù„Ø±Ø¨Ø· Ø¨ÙŠÙ† Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ† ÙˆØ§Ù„Ø·Ù„Ø§Ø¨", "Review today's schedule and confirm teacher-student assignment completeness") : null,
    sessions.length === 0 ? t(locale, "Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¬Ù„Ø³Ø§Øª Ù…Ø³Ø¬Ù„Ø© Ø­Ø§Ù„ÙŠØ§Ù‹ØŒ Ø±Ø§Ø¬Ø¹ Ø±Ø¨Ø· Ø§Ù„Ø¬Ø¯Ø§ÙˆÙ„ Ø¨Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª", "No sessions are registered right now, review schedule data mapping") : null,
  ].filter((item): item is string => Boolean(item));

  return {
    managementStats: isOps
      ? [
          {
            label: t(locale, "Ø·Ù„Ø§Ø¨ Ù†Ø´Ø·ÙˆÙ†", "Active students"),
            value: activeStudents.toLocaleString(numberLocale),
            change: trialStudents > 0 ? `+${trialStudents}` : "0",
            bg: "#4F46E5",
          },
          {
            label: t(locale, "Ø¬Ù„Ø³Ø§Øª Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹", "Weekly sessions"),
            value: scheduleOverview.sessionsCount.toLocaleString(numberLocale),
            change: scheduleOverview.uniqueTeachers > 0 ? `+${scheduleOverview.uniqueTeachers}` : "0",
            bg: "#8B5CF6",
          },
          {
            label: t(locale, "Ø¥ÙŠØ±Ø§Ø¯ Ø§Ù„Ø´Ù‡Ø±", "Monthly revenue"),
            value: formatCurrencyEgp(monthlyRevenue, locale),
            change: monthlyRevenue > 0 ? t(locale, "+Ù…Ø­Ø³ÙˆØ¨", "+Calculated") : "0",
            bg: "#10B981",
          },
          {
            label: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"),
            value: atRiskStudents.toLocaleString(numberLocale),
            change: atRiskStudents > 0 ? t(locale, "+Ù…Ù‡Ù…", "+Important") : "0",
            bg: "#0D9488",
          },
        ]
      : [
          {
            label: t(locale, "Ø·Ù„Ø§Ø¨ Ù†Ø´Ø·ÙˆÙ†", "Active students"),
            value: activeStudents.toLocaleString(numberLocale),
            change: recentLeads > 0 ? `+${recentLeads}` : "0",
            bg: "#4F46E5",
          },
          {
            label: t(locale, "Ø¹Ù…Ù„Ø§Ø¡ Ø¬Ø¯Ø¯", "New leads"),
            value: recentLeads.toLocaleString(numberLocale),
            change: recentLeads > 0 ? t(locale, "+Ù†Ø´Ø·", "+Active") : "0",
            bg: "#8B5CF6",
          },
          {
            label: t(locale, "Ø¥ÙŠØ±Ø§Ø¯ Ø§Ù„Ø´Ù‡Ø±", "Monthly revenue"),
            value: formatCurrencyEgp(monthlyRevenue, locale),
            change: monthlyRevenue > 0 ? t(locale, "+Ù…Ø­Ø³ÙˆØ¨", "+Calculated") : "0",
            bg: "#10B981",
          },
          {
            label: getConversionTerm("conversionRate", locale),
            value: `${conversionRate}%`,
            change: conversionRate > 0 ? t(locale, "+Ù…Ø­Ø¯Ø«", "+Updated") : "0",
            bg: "#0D9488",
          },
        ],
    secondaryStats: isOps
      ? [
          { label: t(locale, "Ø¬Ù„Ø³Ø§Øª Ø§Ù„ÙŠÙˆÙ…", "Today's sessions"), value: sessions.length.toLocaleString(numberLocale), icon: "calendar", bg: "#EFF6FF", color: "#2563EB" },
          { label: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"), value: atRiskStudents.toLocaleString(numberLocale), icon: "warning", bg: "#FEF2F2", color: "#DC2626" },
          { label: t(locale, "Ø·Ù„Ø§Ø¨ ØªØ¬Ø±ÙŠØ¨ÙŠÙˆÙ†", "Trial students"), value: trialStudents.toLocaleString(numberLocale), icon: "clock", bg: "#FFFBEB", color: "#D97706" },
          { label: t(locale, "Ù…Ø¯ÙÙˆØ¹Ø§Øª Ù…Ø¹Ù„Ù‚Ø©", "Pending payments"), value: pendingPaymentsCount.toLocaleString(numberLocale), icon: "wallet", bg: "#F5F3FF", color: "#7C3AED" },
        ]
      : [
          { label: t(locale, "Ø³ÙŠØ´Ù† ØªØ¬Ø±ÙŠØ¨ÙŠØ©", "Trial sessions"), value: bookedTrials.toLocaleString(numberLocale), icon: "calendar", bg: "#EFF6FF", color: "#2563EB" },
          { label: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"), value: atRiskStudents.toLocaleString(numberLocale), icon: "warning", bg: "#FEF2F2", color: "#DC2626" },
          { label: t(locale, "Ù…ØªØ§Ø¨Ø¹Ø§Øª Ù…ØªØ£Ø®Ø±Ø©", "Overdue follow-ups"), value: overdueFollowUps.toLocaleString(numberLocale), icon: "clock", bg: "#FFFBEB", color: "#D97706" },
          { label: t(locale, "Ù…Ø¯ÙÙˆØ¹Ø§Øª Ù…Ø¹Ù„Ù‚Ø©", "Pending payments"), value: pendingPaymentsCount.toLocaleString(numberLocale), icon: "wallet", bg: "#F5F3FF", color: "#7C3AED" },
        ],
    alerts,
    funnel: isOps
      ? [
          {
            label: t(locale, "Ù†Ø´Ø·", "Active"),
            value: activeStudents,
            pct: `${Math.round((activeStudents / opsFunnelBase) * 100)}%`,
            color: "#4F46E5",
          },
          {
            label: t(locale, "ØªØ¬Ø±ÙŠØ¨ÙŠ", "Trial"),
            value: trialStudents,
            pct: `${Math.round((trialStudents / opsFunnelBase) * 100)}%`,
            color: "#F59E0B",
          },
          {
            label: t(locale, "Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "At risk"),
            value: atRiskStudents,
            pct: `${Math.round((atRiskStudents / opsFunnelBase) * 100)}%`,
            color: "#EF4444",
          },
          {
            label: t(locale, "Ù…ÙƒØªÙ…Ù„", "Completed"),
            value: students.filter((student) => student.status === "completed").length,
            pct: `${Math.round((students.filter((student) => student.status === "completed").length / opsFunnelBase) * 100)}%`,
            color: "#10B981",
          },
        ]
      : (["new", "qualified", "trial_proposed", "trial_booked", "trial_attended", "won"] as const).map((stage) => {
          const count = leads.filter((lead) => lead.stage === stage).length;
          return {
            label: locale === "ar" ? STAGE_CONFIGS[stage].labelAr : STAGE_CONFIGS[stage].labelEn,
            value: count,
            pct: `${Math.round((count / salesFunnelBase) * 100)}%`,
            color: STAGE_CONFIGS[stage].color,
          };
        }),
    followUps: employeeTasks,
    operations,
    quickActions,
    recommendations,
  };
}

export function getDashboardTaskLabel(status: keyof typeof DASHBOARD_TASK_STATUS_META, locale: Locale): string {
  const meta = DASHBOARD_TASK_STATUS_META[status];
  return locale === "ar" ? meta.label : meta.labelEn;
}

export function getDashboardOperationToneStyles(tone: DashboardOperationItem["tone"]): { bg: string; color: string } {
  return {
    bg: getToneBg(tone),
    color:
      tone === "danger"
        ? "#DC2626"
        : tone === "warning"
          ? "#D97706"
          : tone === "success"
            ? "#059669"
            : tone === "info"
              ? "#2563EB"
              : "#4338CA",
  };
}
```

### FILE: src\services\duplicate-guard.service.ts
```ts
import { listLeads } from "@/services/leads.service";
import { listParents } from "@/services/parents.service";
import { listStudents } from "@/services/students.service";

function normalizeName(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[Ù‹-ÙŸ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePhone(value: string | null | undefined): string {
  const digits = (value ?? "").replace(/\D/g, "");
  if (digits.startsWith("20") && digits.length > 11) return digits.slice(2);
  if (digits.startsWith("2") && digits.length === 12) return digits.slice(1);
  return digits;
}

function sameName(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = normalizeName(a);
  const right = normalizeName(b);
  return left.length > 0 && left === right;
}

function samePhone(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = normalizePhone(a);
  const right = normalizePhone(b);
  return left.length > 0 && left === right;
}

export interface DuplicateCheckResult {
  blocking: boolean;
  messageAr: string;
  messageEn: string;
}

export async function guardLeadDuplicate(input: {
  childName: string;
  parentName: string;
  parentPhone: string;
  parentWhatsapp?: string | null;
}): Promise<DuplicateCheckResult | null> {
  const [leads, parents, students] = await Promise.all([listLeads(), listParents(), listStudents()]);

  const sameLeadPhone = leads.find((lead) => samePhone(lead.parentPhone, input.parentPhone) || samePhone(lead.parentPhone, input.parentWhatsapp));
  if (sameLeadPhone) {
    return {
      blocking: true,
      messageAr: `ÙŠÙˆØ¬Ø¯ Ø¹Ù…ÙŠÙ„ Ù…Ø­ØªÙ…Ù„ Ø¨Ù†ÙØ³ Ø±Ù‚Ù… ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø± Ø¨Ø§Ù„ÙØ¹Ù„: ${sameLeadPhone.parentName} / ${sameLeadPhone.childName}`,
      messageEn: `A lead with the same parent phone already exists: ${sameLeadPhone.parentName} / ${sameLeadPhone.childName}`,
    };
  }

  const sameParent = parents.find((parent) => samePhone(parent.phone, input.parentPhone) || samePhone(parent.whatsapp, input.parentWhatsapp));
  if (sameParent) {
    return {
      blocking: true,
      messageAr: `ÙŠÙˆØ¬Ø¯ ÙˆÙ„ÙŠ Ø£Ù…Ø± Ù…Ø³Ø¬Ù„ Ø¨Ø§Ù„ÙØ¹Ù„ Ø¨Ù†ÙØ³ Ø§Ù„Ø±Ù‚Ù…: ${sameParent.fullName}`,
      messageEn: `A parent with the same phone is already registered: ${sameParent.fullName}`,
    };
  }

  const sameStudent = students.find((student) => sameName(student.fullName, input.childName) && (samePhone(student.parentPhone, input.parentPhone) || sameName(student.parentName, input.parentName)));
  if (sameStudent) {
    return {
      blocking: true,
      messageAr: `ÙŠÙˆØ¬Ø¯ Ø·Ø§Ù„Ø¨ Ù…Ø³Ø¬Ù„ Ø¨Ø§Ù„ÙØ¹Ù„ Ø¨Ù†ÙØ³ Ø§Ù„Ø§Ø³Ù… ÙˆØ¨ÙŠØ§Ù†Ø§Øª ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±: ${sameStudent.fullName}`,
      messageEn: `A student with the same name and parent details already exists: ${sameStudent.fullName}`,
    };
  }

  return null;
}

export async function guardParentDuplicate(input: {
  fullName: string;
  phone: string;
  whatsapp?: string | null;
}): Promise<DuplicateCheckResult | null> {
  const [parents, leads] = await Promise.all([listParents(), listLeads()]);

  const sameParent = parents.find((parent) => samePhone(parent.phone, input.phone) || samePhone(parent.whatsapp, input.whatsapp));
  if (sameParent) {
    return {
      blocking: true,
      messageAr: `ÙŠÙˆØ¬Ø¯ ÙˆÙ„ÙŠ Ø£Ù…Ø± Ø¨Ù†ÙØ³ Ø§Ù„Ø±Ù‚Ù… Ø¨Ø§Ù„ÙØ¹Ù„: ${sameParent.fullName}`,
      messageEn: `A parent with the same phone already exists: ${sameParent.fullName}`,
    };
  }

  const sameLead = leads.find((lead) => samePhone(lead.parentPhone, input.phone) || sameName(lead.parentName, input.fullName));
  if (sameLead) {
    return {
      blocking: true,
      messageAr: `Ù‡Ø°Ø§ ÙˆÙ„ÙŠ Ø£Ù…Ø± Ù…ÙˆØ¬ÙˆØ¯ Ø¨Ø§Ù„ÙØ¹Ù„ Ø¯Ø§Ø®Ù„ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ù…Ø­ØªÙ…Ù„ÙŠÙ†: ${sameLead.parentName}`,
      messageEn: `This parent already exists in leads: ${sameLead.parentName}`,
    };
  }

  return null;
}

export async function guardStudentDuplicate(input: {
  fullName: string;
  parentName: string;
  parentPhone: string;
  parentId?: string | null;
}): Promise<DuplicateCheckResult | null> {
  const [students, leads] = await Promise.all([listStudents(), listLeads()]);

  const sameStudent = students.find((student) => {
    if (input.parentId && student.parentId && student.parentId === input.parentId && sameName(student.fullName, input.fullName)) return true;
    if (sameName(student.fullName, input.fullName) && samePhone(student.parentPhone, input.parentPhone)) return true;
    return sameName(student.fullName, input.fullName) && sameName(student.parentName, input.parentName);
  });

  if (sameStudent) {
    return {
      blocking: true,
      messageAr: `ÙŠÙˆØ¬Ø¯ Ø·Ø§Ù„Ø¨ Ù…Ø³Ø¬Ù„ Ø¨Ø§Ù„ÙØ¹Ù„ Ø¨Ù†ÙØ³ Ø§Ù„Ø§Ø³Ù… ØªØ­Øª Ù†ÙØ³ ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±: ${sameStudent.fullName}`,
      messageEn: `A student with the same name already exists under the same parent: ${sameStudent.fullName}`,
    };
  }

  const sameLead = leads.find((lead) => sameName(lead.childName, input.fullName) && (samePhone(lead.parentPhone, input.parentPhone) || sameName(lead.parentName, input.parentName)));
  if (sameLead) {
    return {
      blocking: true,
      messageAr: `Ù‡Ø°Ø§ Ø§Ù„Ø·Ø§Ù„Ø¨ Ù…ÙˆØ¬ÙˆØ¯ Ø¨Ø§Ù„ÙØ¹Ù„ ÙÙŠ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ù…Ø­ØªÙ…Ù„ÙŠÙ†: ${sameLead.childName}`,
      messageEn: `This student already exists in leads: ${sameLead.childName}`,
    };
  }

  return null;
}
```

### FILE: src\services\enrollment.service.ts
```ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || typeof window === "undefined") return null;
  return createBrowserClient<Database>(url, key);
}

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type ParentRow = Database["public"]["Tables"]["parents"]["Row"];
type StudentRow = Database["public"]["Tables"]["students"]["Row"];

function normalizePhone(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "").replace(/^20/, "");
}

function normalizeName(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function samePhone(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = normalizePhone(a);
  const right = normalizePhone(b);
  return left.length > 0 && left === right;
}

function sameName(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = normalizeName(a);
  const right = normalizeName(b);
  return left.length > 0 && left === right;
}

function requireParentIdentity(lead: LeadRow): void {
  if (!lead.parent_name || !lead.parent_phone) {
    throw new Error("Ù„Ø§ ÙŠÙ…ÙƒÙ† ØªØ­ÙˆÙŠÙ„ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø§Ù„Ø­Ø§Ù„ÙŠ Ù„Ø£Ù† Ø§Ø³Ù… ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø± Ø£Ùˆ Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ ØºÙŠØ± Ù…ÙƒØªÙ…Ù„.");
  }
}

function hasEnoughStudentIdentity(lead: LeadRow): boolean {
  return Boolean(lead.child_name && lead.child_age && lead.child_age >= 4);
}

async function getLeadById(leadId: string, supabase: ReturnType<typeof getSupabaseClient>) {
  const { data, error } = await supabase!
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .maybeSingle();

  if (error || !data) {
    throw new Error(error?.message || "ØªØ¹Ø°Ø± Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø§Ù„Ù…Ø­ØªÙ…Ù„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨.");
  }

  return data as LeadRow;
}

function findParent(lead: LeadRow, parents: ParentRow[]): ParentRow | null {
  return (
    parents.find((parent) => lead.parent_id && parent.id === lead.parent_id) ??
    parents.find((parent) => samePhone(parent.phone, lead.parent_phone)) ??
    parents.find((parent) => samePhone(parent.whatsapp, lead.parent_phone)) ??
    parents.find((parent) => sameName(parent.full_name, lead.parent_name)) ??
    null
  );
}

function findStudent(lead: LeadRow, parent: ParentRow, students: StudentRow[]): StudentRow | null {
  return (
    students.find((student) => student.parent_id && student.parent_id === parent.id && sameName(student.full_name, lead.child_name)) ??
    students.find((student) => sameName(student.full_name, lead.child_name) && samePhone(student.parent_phone, parent.phone ?? lead.parent_phone)) ??
    students.find((student) => sameName(student.full_name, lead.child_name) && sameName(student.parent_name, parent.full_name ?? lead.parent_name)) ??
    null
  );
}

async function refreshParentChildrenCount(supabase: ReturnType<typeof getSupabaseClient>, parent: ParentRow, students: StudentRow[]) {
  const linked = students.filter((student) => {
    if (student.parent_id && parent.id && student.parent_id === parent.id) return true;
    if (samePhone(student.parent_phone, parent.phone)) return true;
    return sameName(student.parent_name, parent.full_name);
  }).length;

  await supabase!
    .from("parents")
    .update({ children_count: linked })
    .eq("id", parent.id);
}

async function ensureLeadEnrollmentInternal(
  lead: LeadRow,
  supabase: ReturnType<typeof getSupabaseClient>,
  parents: ParentRow[],
  students: StudentRow[],
): Promise<{ parentId: string; studentId: string | null }> {
  requireParentIdentity(lead);

  let parent = findParent(lead, parents);

  if (!parent) {
    const { data, error } = await supabase!
      .from("parents")
      .insert({
        full_name: lead.parent_name,
        phone: lead.parent_phone,
        whatsapp: lead.parent_whatsapp ?? lead.parent_phone,
        children_count: 0,
        created_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "ØªØ¹Ø°Ø± Ø¥Ù†Ø´Ø§Ø¡ Ø³Ø¬Ù„ ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±.");
    }

    parent = data as ParentRow;
    parents.unshift(parent);
  }

  let student = hasEnoughStudentIdentity(lead) ? findStudent(lead, parent, students) : null;

  if (hasEnoughStudentIdentity(lead) && !student) {
    const { data, error } = await supabase!
      .from("students")
      .insert({
        full_name: lead.child_name,
        age: lead.child_age,
        parent_id: parent.id,
        parent_name: parent.full_name,
        parent_phone: parent.phone ?? lead.parent_phone,
        status: "active",
        current_course: lead.suggested_course ?? null,
        class_name: null,
        enrollment_date: lead.won_at ?? new Date().toISOString(),
        sessions_attended: 0,
        total_paid: 0,
        created_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "ØªØ¹Ø°Ø± Ø¥Ù†Ø´Ø§Ø¡ Ø³Ø¬Ù„ Ø§Ù„Ø·Ø§Ù„Ø¨.");
    }

    student = data as StudentRow;
    students.unshift(student);
  } else if (student && (!student.parent_id || student.parent_id !== parent.id)) {
    const { data, error } = await supabase!
      .from("students")
      .update({
        parent_id: parent.id,
        parent_name: parent.full_name,
        parent_phone: parent.phone ?? lead.parent_phone,
        current_course: student.current_course ?? lead.suggested_course ?? null,
      })
      .eq("id", student.id)
      .select("*")
      .single();

    if (!error && data) {
      student = data as StudentRow;
      const index = students.findIndex((item) => item.id === student!.id);
      if (index >= 0) students[index] = student;
    }
  }

  if (lead.parent_id !== parent.id || !lead.won_at) {
    await supabase!
      .from("leads")
      .update({
        parent_id: parent.id,
        won_at: lead.won_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", lead.id);
  }

  await refreshParentChildrenCount(supabase, parent, students);

  return { parentId: parent.id, studentId: student?.id ?? null };
}

export async function ensureLeadEnrollment(leadId: string): Promise<{ parentId: string; studentId: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("ØªØ¹Ø°Ø± Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª. ØªØ£ÙƒØ¯ Ù…Ù† Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Supabase Ø«Ù… Ø£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©.");
  }

  const lead = await getLeadById(leadId, supabase);
  const [{ data: parents, error: parentsError }, { data: students, error: studentsError }] = await Promise.all([
    supabase.from("parents").select("*"),
    supabase.from("students").select("*"),
  ]);

  if (parentsError || studentsError) {
    throw new Error(parentsError?.message || studentsError?.message || "ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø±Ø¨Ø· Ø§Ù„Ø­Ø§Ù„ÙŠØ©.");
  }

  return ensureLeadEnrollmentInternal(lead, supabase, parents ?? [], students ?? []);
}

export async function syncWonLeadsToEnrollments(): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) return 0;

  const [{ data: leads, error: leadsError }, { data: parents, error: parentsError }, { data: students, error: studentsError }] = await Promise.all([
    supabase.from("leads").select("*").eq("stage", "won").order("created_at", { ascending: false }),
    supabase.from("parents").select("*"),
    supabase.from("students").select("*"),
  ]);

  if (leadsError || parentsError || studentsError) {
    console.error("[enrollment] sync failed", leadsError || parentsError || studentsError);
    return 0;
  }

  let repaired = 0;
  const mutableParents = [...(parents ?? [])] as ParentRow[];
  const mutableStudents = [...(students ?? [])] as StudentRow[];

  for (const lead of leads ?? []) {
    try {
      const parentBefore = mutableParents.length;
      const studentBefore = mutableStudents.length;
      await ensureLeadEnrollmentInternal(lead as LeadRow, supabase, mutableParents, mutableStudents);
      if (mutableParents.length > parentBefore || mutableStudents.length > studentBefore) {
        repaired += 1;
      }
    } catch (error) {
      console.warn("[enrollment] skipped won lead during sync", lead.id, error);
    }
  }

  return repaired;
}


export async function getEnrollmentTargetsForLead(
  leadId: string,
): Promise<{ parentId: string | null; studentId: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { parentId: null, studentId: null };
  }

  try {
    const lead = await getLeadById(leadId, supabase);
    const [{ data: parents }, { data: students }] = await Promise.all([
      supabase.from("parents").select("*"),
      supabase.from("students").select("*"),
    ]);

    const parent = findParent(lead, (parents ?? []) as ParentRow[]);
    if (!parent) {
      return { parentId: lead.parent_id ?? null, studentId: null };
    }

    const student = findStudent(lead, parent, (students ?? []) as StudentRow[]);
    return { parentId: parent.id, studentId: student?.id ?? null };
  } catch (error) {
    console.warn("[enrollment] failed to resolve enrollment targets", leadId, error);
    return { parentId: null, studentId: null };
  }
}
```

### FILE: src\services\follow-ups.service.ts
```ts
import { createBrowserClient } from "@supabase/ssr";
import type { CommChannel, FollowUpType, LeadStage, Priority } from "@/types/common.types";
import type { Database } from "@/types/database.types";
import type { CreateFollowUpInput, FollowUpItem, LeadActivityItem, LeadListItem } from "@/types/crm";
import { MOCK_FOLLOW_UPS } from "@/lib/mock-data";
import { STAGE_LABELS } from "@/config/labels";
import { isBrowser, readStorage, sortByDateAsc, sortByDateDesc, writeStorage } from "@/services/storage";

const FOLLOW_UPS_KEY = "skidy.crm.follow-ups";
const LEADS_KEY = "skidy.crm.leads";
const ACTIVITIES_KEY = "skidy.crm.lead-activities";
const VALID_TYPES: FollowUpType[] = [
  "first_contact",
  "qualification",
  "trial_reminder",
  "post_trial",
  "no_show",
  "closing",
  "payment_reminder",
  "re_engagement",
];
const VALID_CHANNELS: CommChannel[] = ["whatsapp", "email", "call", "sms"];
const VALID_PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];

type FollowUpOpenStatus = Exclude<FollowUpItem["status"], "completed">;

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !isBrowser()) return null;
  return createBrowserClient<Database>(url, key);
}

function isDemoModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_DEMO_FALLBACK === "true";
}

function shouldUseDemoFallback(): boolean {
  return !getSupabaseClient() && isDemoModeEnabled();
}

function mockFollowUps(): FollowUpItem[] {
  return MOCK_FOLLOW_UPS.map((item) => ({ ...item }));
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function asType(value: unknown): FollowUpType {
  return VALID_TYPES.includes(value as FollowUpType) ? (value as FollowUpType) : "first_contact";
}

function asChannel(value: unknown): CommChannel {
  return VALID_CHANNELS.includes(value as CommChannel) ? (value as CommChannel) : "whatsapp";
}

function asPriority(value: unknown): Priority {
  return VALID_PRIORITIES.includes(value as Priority) ? (value as Priority) : "medium";
}

function resolveOpenStatus(scheduledAt: string): FollowUpOpenStatus {
  const timestamp = new Date(scheduledAt).getTime();
  return timestamp < Date.now() ? "overdue" : "pending";
}

function asStatus(value: unknown, scheduledAt: string): FollowUpItem["status"] {
  if (value === "completed") return "completed";
  return value === "overdue" ? "overdue" : resolveOpenStatus(scheduledAt);
}

function mapRow(row: Database["public"]["Tables"]["follow_ups"]["Row"] | Record<string, unknown>): FollowUpItem {
  const record = row as Record<string, unknown>;
  const scheduledAt = asString(record.scheduled_at ?? record.scheduledAt, new Date().toISOString());
  return {
    id: asString(record.id, crypto.randomUUID()),
    leadId: typeof record.lead_id === "string" ? record.lead_id : null,
    title: asString(record.title, "Ù…ØªØ§Ø¨Ø¹Ø©"),
    leadName: asString(record.lead_name ?? record.leadName, "Ø¹Ù…ÙŠÙ„ ØºÙŠØ± Ù…Ø­Ø¯Ø¯"),
    parentName: asString(record.parent_name ?? record.parentName, "ÙˆÙ„ÙŠ Ø£Ù…Ø± ØºÙŠØ± Ù…Ø­Ø¯Ø¯"),
    type: asType(record.type),
    channel: asChannel(record.channel),
    priority: asPriority(record.priority),
    scheduledAt,
    status: asStatus(record.status, scheduledAt),
    assignedTo: asString(record.assigned_to ?? record.assignedTo, "ØºÙŠØ± Ù…Ø®ØµØµ"),
  };
}

function getLocalFollowUps(): FollowUpItem[] {
  const seed = shouldUseDemoFallback() ? mockFollowUps() : ([] as FollowUpItem[]);
  return sortByDateAsc(readStorage(FOLLOW_UPS_KEY, seed), (item) => item.scheduledAt);
}

function saveLocalFollowUps(items: FollowUpItem[]): void {
  writeStorage(FOLLOW_UPS_KEY, sortByDateAsc(items, (item) => item.scheduledAt));
}

function clearLocalFollowUps(): void {
  writeStorage(FOLLOW_UPS_KEY, []);
}

function getLocalLeads(): LeadListItem[] {
  return sortByDateDesc(readStorage(LEADS_KEY, [] as LeadListItem[]), (lead) => lead.createdAt);
}

function saveLocalLeads(leads: LeadListItem[]): void {
  writeStorage(LEADS_KEY, sortByDateDesc(leads, (lead) => lead.createdAt));
}

function getLocalActivities(): LeadActivityItem[] {
  return sortByDateDesc(readStorage(ACTIVITIES_KEY, [] as LeadActivityItem[]), (activity) => activity.date);
}

function saveLocalActivities(activities: LeadActivityItem[]): void {
  writeStorage(ACTIVITIES_KEY, sortByDateDesc(activities, (activity) => activity.date));
}

function createLeadActivity(leadId: string | null | undefined, action: string, by: string, type: LeadActivityItem["type"]): LeadActivityItem | null {
  if (!leadId) return null;

  const activity: LeadActivityItem = {
    id: crypto.randomUUID(),
    leadId,
    action,
    by,
    type,
    date: new Date().toISOString(),
  };

  saveLocalActivities([activity, ...getLocalActivities()]);

  const supabase = getSupabaseClient();
  if (supabase) {
    void supabase.from("lead_activities").insert({
      lead_id: leadId,
      action: activity.action,
      by_name: activity.by,
      type: activity.type,
      created_at: activity.date,
    });
  }

  return activity;
}

function deriveNextFollowUpAt(leadId: string | null | undefined, items: FollowUpItem[]): string | null {
  if (!leadId) return null;
  const next = items
    .filter((item) => item.leadId === leadId && item.status !== "completed")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];
  return next?.scheduledAt ?? null;
}

async function syncLeadNextFollowUp(leadId: string | null | undefined, items: FollowUpItem[]): Promise<void> {
  if (!leadId) return;

  const leads = getLocalLeads();
  const existing = leads.find((lead) => lead.id === leadId);
  if (!existing) return;

  const nextFollowUpAt = deriveNextFollowUpAt(leadId, items);
  const updatedLead: LeadListItem = {
    ...existing,
    nextFollowUpAt,
    lastContactAt: existing.lastContactAt ?? new Date().toISOString(),
  };

  saveLocalLeads(leads.map((lead) => (lead.id === leadId ? updatedLead : lead)));

  const supabase = getSupabaseClient();
  if (!supabase) return;

  await supabase
    .from("leads")
    .update({
      next_follow_up_at: nextFollowUpAt,
      last_contact_at: updatedLead.lastContactAt,
    })
    .eq("id", leadId);
}

export async function listFollowUps(): Promise<FollowUpItem[]> {
  const demoFallback = shouldUseDemoFallback() ? getLocalFollowUps() : [];
  const supabase = getSupabaseClient();
  if (!supabase) return demoFallback;

  try {
    const { data, error } = await supabase
      .from("follow_ups")
      .select("*")
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("[follow-ups] failed to load from Supabase", error);
      clearLocalFollowUps();
      return [];
    }

    if (!data || data.length === 0) {
      clearLocalFollowUps();
      return [];
    }

    const mapped = data.map((row: Database["public"]["Tables"]["follow_ups"]["Row"]) => mapRow(row));
    saveLocalFollowUps(mapped);
    return mapped;
  } catch (error) {
    console.error("[follow-ups] unexpected load failure", error);
    clearLocalFollowUps();
    return [];
  }
}

export async function listFollowUpsByLead(leadId: string): Promise<FollowUpItem[]> {
  const demoFallback = shouldUseDemoFallback() ? getLocalFollowUps().filter((item) => item.leadId === leadId) : [];
  const supabase = getSupabaseClient();
  if (!supabase) return demoFallback;

  try {
    const { data, error } = await supabase
      .from("follow_ups")
      .select("*")
      .eq("lead_id", leadId)
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("[follow-ups] failed to load lead follow-ups", error);
      const rest = getLocalFollowUps().filter((item) => item.leadId !== leadId);
      saveLocalFollowUps(rest);
      return [];
    }

    if (!data || data.length === 0) {
      const rest = getLocalFollowUps().filter((item) => item.leadId !== leadId);
      saveLocalFollowUps(rest);
      return [];
    }

    const mapped = data.map((row: Database["public"]["Tables"]["follow_ups"]["Row"]) => mapRow(row));
    const rest = getLocalFollowUps().filter((item) => item.leadId !== leadId);
    saveLocalFollowUps([...rest, ...mapped]);
    return mapped;
  } catch (error) {
    console.error("[follow-ups] unexpected lead follow-ups failure", error);
    return [];
  }
}

export async function createFollowUp(input: CreateFollowUpInput): Promise<FollowUpItem> {
  const scheduledAt = input.scheduledAt;
  const item: FollowUpItem = {
    id: crypto.randomUUID(),
    leadId: input.leadId ?? null,
    leadName: input.leadName,
    parentName: input.parentName,
    title: input.title,
    type: input.type,
    channel: input.channel,
    priority: input.priority,
    scheduledAt,
    status: resolveOpenStatus(scheduledAt),
    assignedTo: input.assignedTo,
  };

  const current = getLocalFollowUps();
  const next = [...current, item];
  saveLocalFollowUps(next);

  const typeLabel = item.type === "trial_reminder" ? "ØªØ°ÙƒÙŠØ± Ø¨Ø§Ù„Ø³ÙŠØ´Ù† Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ©" : item.title;
  createLeadActivity(item.leadId, `ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ù…ØªØ§Ø¨Ø¹Ø© Ø¬Ø¯ÙŠØ¯Ø©: ${typeLabel}`, item.assignedTo, "contact");
  await syncLeadNextFollowUp(item.leadId, next);

  const supabase = getSupabaseClient();
  if (!supabase) {
    if (shouldUseDemoFallback()) return item;
    throw new Error("Supabase client is not available");
  }

  try {
    const { data, error } = await supabase
      .from("follow_ups")
      .insert({
        lead_id: item.leadId,
        title: item.title,
        lead_name: item.leadName,
        parent_name: item.parentName,
        type: item.type,
        channel: item.channel,
        priority: item.priority,
        scheduled_at: item.scheduledAt,
        status: item.status,
        assigned_to: item.assignedTo,
      })
      .select("*")
      .maybeSingle();

    if (!error && data) {
      const synced = mapRow(data);
      const merged = getLocalFollowUps().map((existing) => (existing.id === item.id ? synced : existing));
      saveLocalFollowUps(merged);
      await syncLeadNextFollowUp(item.leadId, merged);
      return synced;
    }
  } catch (error) {
    console.error("[follow-ups] create failed", error);
    if (shouldUseDemoFallback()) return item;
    throw error instanceof Error ? error : new Error("Failed to create follow-up");
  }

  return item;
}

async function updateFollowUpStatus(
  id: string,
  status: FollowUpItem["status"],
): Promise<FollowUpItem | null> {
  const current = getLocalFollowUps();
  const existing = current.find((item) => item.id === id);
  if (!existing) return null;

  const nextStatus = status === "completed" ? "completed" : resolveOpenStatus(existing.scheduledAt);
  const updated: FollowUpItem = { ...existing, status: nextStatus };
  const merged = current.map((item) => (item.id === id ? updated : item));
  saveLocalFollowUps(merged);

  if (updated.leadId) {
    const action = nextStatus === "completed"
      ? `ØªÙ… Ø¥Ù†Ù‡Ø§Ø¡ Ù…ØªØ§Ø¨Ø¹Ø© ${updated.title}`
      : `ØªÙ…Øª Ø¥Ø¹Ø§Ø¯Ø© ÙØªØ­ Ù…ØªØ§Ø¨Ø¹Ø© ${updated.title}`;
    createLeadActivity(updated.leadId, action, updated.assignedTo, nextStatus === "completed" ? "contact" : "note");
  }

  await syncLeadNextFollowUp(updated.leadId, merged);

  const supabase = getSupabaseClient();
  if (!supabase) {
    if (shouldUseDemoFallback()) return updated;
    throw new Error("Supabase client is not available");
  }

  try {
    await supabase
      .from("follow_ups")
      .update({
        status: nextStatus,
        completed_at: nextStatus === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", id);
  } catch (error) {
    console.error("[follow-ups] status update failed", error);
    if (shouldUseDemoFallback()) return updated;
    throw error instanceof Error ? error : new Error("Failed to update follow-up status");
  }

  return updated;
}

export async function markFollowUpCompleted(id: string): Promise<FollowUpItem | null> {
  return updateFollowUpStatus(id, "completed");
}

export async function reopenFollowUp(id: string): Promise<FollowUpItem | null> {
  return updateFollowUpStatus(id, "pending");
}

export function suggestFollowUpTypeByStage(stage: LeadStage): FollowUpType {
  switch (stage) {
    case "new":
      return "first_contact";
    case "qualified":
      return "qualification";
    case "trial_proposed":
    case "trial_booked":
      return "trial_reminder";
    case "trial_attended":
      return "post_trial";
    case "offer_sent":
      return "closing";
    case "lost":
      return "re_engagement";
    default:
      return "payment_reminder";
  }
}

export function suggestFollowUpTitle(stage: LeadStage, childName: string): string {
  switch (stage) {
    case "new":
      return `Ø£ÙˆÙ„ ØªÙˆØ§ØµÙ„ â€” ${childName}`;
    case "qualified":
      return `Ø§Ø³ØªÙƒÙ…Ø§Ù„ Ø§Ù„ØªØ£Ù‡ÙŠÙ„ â€” ${childName}`;
    case "trial_proposed":
      return `ØªØ£ÙƒÙŠØ¯ Ù…ÙˆØ¹Ø¯ Ø§Ù„Ø³ÙŠØ´Ù† â€” ${childName}`;
    case "trial_booked":
      return `ØªØ°ÙƒÙŠØ± Ø¨Ø§Ù„Ø³ÙŠØ´Ù† â€” ${childName}`;
    case "trial_attended":
      return `Ù…ØªØ§Ø¨Ø¹Ø© Ø¨Ø¹Ø¯ Ø§Ù„Ø³ÙŠØ´Ù† â€” ${childName}`;
    case "offer_sent":
      return `Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø¹Ø±Ø¶ â€” ${childName}`;
    case "lost":
      return `Ø¥Ø¹Ø§Ø¯Ø© ØªÙˆØ§ØµÙ„ â€” ${childName}`;
    default:
      return `Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø¯ÙØ¹ â€” ${childName}`;
  }
}
```

### FILE: src\services\leads.service.ts
```ts
import { createBrowserClient } from "@supabase/ssr";
import { STAGE_LABELS } from "@/config/labels";
import type { LeadStage, LeadTemperature, LossReason } from "@/types/common.types";
import type { Database } from "@/types/database.types";
import type {
  CreateLeadInput,
  LeadActivityItem,
  LeadListItem,
  UpdateLeadInput,
} from "@/types/crm";
import { MOCK_LEADS, MOCK_LEAD_ACTIVITIES, MOCK_TEAM } from "@/lib/mock-data";
import { isBrowser, readStorage, sortByDateDesc, writeStorage } from "@/services/storage";

const LEADS_KEY = "skidy.crm.leads";
const ACTIVITIES_KEY = "skidy.crm.lead-activities";

const VALID_STAGES: LeadStage[] = [
  "new",
  "qualified",
  "trial_proposed",
  "trial_booked",
  "trial_attended",
  "offer_sent",
  "won",
  "lost",
];

const VALID_TEMPERATURES: LeadTemperature[] = ["hot", "warm", "cold"];
const VALID_LOSS_REASONS: LossReason[] = [
  "price",
  "wants_offline",
  "no_laptop",
  "age_mismatch",
  "no_response",
  "exams_deferred",
  "not_convinced_online",
  "chose_competitor",
  "other",
];

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !isBrowser()) return null;
  return createBrowserClient<Database>(url, key);
}

function isDemoModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_DEMO_FALLBACK === "true";
}

function shouldUseDemoFallback(): boolean {
  return !getSupabaseClient() && isDemoModeEnabled();
}

function mockLeads(): LeadListItem[] {
  return MOCK_LEADS.map((lead) => ({ ...lead }));
}

function mockActivities(): LeadActivityItem[] {
  return MOCK_LEAD_ACTIVITIES.map((activity) => ({ ...activity }));
}

function getLocalLeads(): LeadListItem[] {
  const seed = shouldUseDemoFallback() ? mockLeads() : ([] as LeadListItem[]);
  return sortByDateDesc(readStorage(LEADS_KEY, seed), (lead) => lead.createdAt);
}

function saveLocalLeads(leads: LeadListItem[]): void {
  writeStorage(LEADS_KEY, sortByDateDesc(leads, (lead) => lead.createdAt));
}

function clearLocalLeads(): void {
  writeStorage(LEADS_KEY, []);
}

function getLocalActivities(): LeadActivityItem[] {
  const seed = shouldUseDemoFallback() ? mockActivities() : ([] as LeadActivityItem[]);
  return sortByDateDesc(readStorage(ACTIVITIES_KEY, seed), (activity) => activity.date);
}

function saveLocalActivities(activities: LeadActivityItem[]): void {
  writeStorage(ACTIVITIES_KEY, sortByDateDesc(activities, (activity) => activity.date));
}

function clearLocalActivities(): void {
  writeStorage(ACTIVITIES_KEY, []);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function asStage(value: unknown): LeadStage {
  return VALID_STAGES.includes(value as LeadStage) ? (value as LeadStage) : "new";
}

function asTemperature(value: unknown): LeadTemperature {
  return VALID_TEMPERATURES.includes(value as LeadTemperature)
    ? (value as LeadTemperature)
    : "warm";
}

function asLossReason(value: unknown): LossReason | null {
  return VALID_LOSS_REASONS.includes(value as LossReason)
    ? (value as LossReason)
    : null;
}

function isUuid(value: string | null | undefined): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function resolveAssignedToUuid(preferred: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return isUuid(preferred) ? preferred : null;

  if (isUuid(preferred)) return preferred;

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user?.id || !isUuid(user.id)) return null;
    return user.id;
  } catch {
    return null;
  }
}

function mapLeadRow(row: Database["public"]["Tables"]["leads"]["Row"] | Record<string, unknown>): LeadListItem {
  const record = row as Record<string, unknown>;
  return {
    id: asString(record.id, crypto.randomUUID()),
    parentName: asString(record.parent_name ?? record.parentName, "ÙˆÙ„ÙŠ Ø£Ù…Ø± ØºÙŠØ± Ù…Ø­Ø¯Ø¯"),
    parentPhone: asString(record.parent_phone ?? record.parentPhone, "â€”"),
    childName: asString(record.child_name ?? record.childName, "Ø·ÙÙ„ Ø¨Ø¯ÙˆÙ† Ø§Ø³Ù…"),
    childAge: asNumber(record.child_age ?? record.childAge, 0),
    stage: asStage(record.stage),
    temperature: asTemperature(record.temperature),
    source: asString(record.source, "other") as LeadListItem["source"],
    suggestedCourse: asNullableString(record.suggested_course ?? record.suggestedCourse) as LeadListItem["suggestedCourse"],
    assignedTo: asString(record.assigned_to ?? record.assignedTo, ""),
    assignedToName: asString(record.assigned_to_name ?? record.assignedToName, "ØºÙŠØ± Ù…Ø®ØµØµ"),
    lastContactAt: asNullableString(record.last_contact_at ?? record.lastContactAt),
    nextFollowUpAt: asNullableString(record.next_follow_up_at ?? record.nextFollowUpAt),
    notes: asNullableString(record.notes),
    createdAt: asString(record.created_at ?? record.createdAt, new Date().toISOString()),
    lossReason: asLossReason(record.loss_reason ?? record.lossReason),
  };
}

function mapActivityRow(row: Database["public"]["Tables"]["lead_activities"]["Row"] | Record<string, unknown>): LeadActivityItem {
  const record = row as Record<string, unknown>;
  return {
    id: asString(record.id, crypto.randomUUID()),
    leadId: asString(record.lead_id ?? record.leadId),
    action: asString(record.action, "ØªØ­Ø¯ÙŠØ« Ø¹Ù„Ù‰ Ø§Ù„Ø¹Ù…ÙŠÙ„"),
    date: asString(record.created_at ?? record.date, new Date().toISOString()),
    by: asString(record.by_name ?? record.by, "Ø§Ù„Ù†Ø¸Ø§Ù…"),
    type: (["create", "contact", "stage", "note"] as const).includes(record.type as LeadActivityItem["type"])
      ? (record.type as LeadActivityItem["type"])
      : "note",
  };
}

async function syncLeadsFromSupabase(): Promise<LeadListItem[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("[leads] failed to load from Supabase", error);
    clearLocalLeads();
    return [];
  }

  if (!data || data.length === 0) {
    clearLocalLeads();
    return [];
  }

  const mapped = data.map((row: Database["public"]["Tables"]["leads"]["Row"]) => mapLeadRow(row));
  saveLocalLeads(mapped);
  return mapped;
}

async function syncActivitiesFromSupabase(leadId: string): Promise<LeadActivityItem[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("lead_activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[lead_activities] failed to load from Supabase", error);
    const existing = getLocalActivities().filter((activity) => activity.leadId !== leadId);
    saveLocalActivities(existing);
    return [];
  }

  if (!data || data.length === 0) {
    const existing = getLocalActivities().filter((activity) => activity.leadId !== leadId);
    saveLocalActivities(existing);
    return [];
  }

  const mapped = data.map((row: Database["public"]["Tables"]["lead_activities"]["Row"]) => mapActivityRow(row));
  const existing = getLocalActivities().filter((activity) => activity.leadId !== leadId);
  saveLocalActivities([...existing, ...mapped]);
  return mapped;
}

export async function listLeads(): Promise<LeadListItem[]> {
  const demoFallback = shouldUseDemoFallback() ? getLocalLeads() : [];
  try {
    return (await syncLeadsFromSupabase()) ?? demoFallback;
  } catch (error) {
    console.error("[leads] unexpected load failure", error);
    clearLocalLeads();
    return [];
  }
}

export async function getLeadById(id: string): Promise<LeadListItem | null> {
  const local = getLocalLeads().find((lead) => lead.id === id);
  if (local) return local;

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
    if (error || !data) return null;
    const mapped = mapLeadRow(data);
    const next = [mapped, ...getLocalLeads().filter((lead) => lead.id !== id)];
    saveLocalLeads(next);
    return mapped;
  } catch {
    return null;
  }
}

export async function listLeadActivities(leadId: string): Promise<LeadActivityItem[]> {
  const demoFallback = shouldUseDemoFallback() ? getLocalActivities().filter((activity) => activity.leadId === leadId) : [];
  try {
    return (await syncActivitiesFromSupabase(leadId)) ?? demoFallback;
  } catch (error) {
    console.error("[lead_activities] unexpected load failure", error);
    return [];
  }
}

export async function createLead(input: CreateLeadInput): Promise<LeadListItem> {
  const createdAt = new Date().toISOString();
  const draftLead: LeadListItem = {
    id: crypto.randomUUID(),
    childName: input.childName,
    childAge: input.childAge,
    parentName: input.parentName,
    parentPhone: input.parentPhone,
    stage: "new",
    temperature: input.temperature,
    source: input.source,
    suggestedCourse: input.suggestedCourse,
    assignedTo: input.assignedTo,
    assignedToName:
      input.assignedToName ||
      MOCK_TEAM.find((member) => member.id === input.assignedTo)?.name ||
      "ØºÙŠØ± Ù…Ø®ØµØµ",
    lastContactAt: null,
    nextFollowUpAt: null,
    notes: input.notes ?? null,
    createdAt,
    lossReason: null,
  };

  const supabase = getSupabaseClient();

  if (!supabase) {
    if (!shouldUseDemoFallback()) {
      throw new Error("ØªØ¹Ø°Ø± Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª. Ø£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ø¨Ø¹Ø¯ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø£Ùˆ Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª.");
    }

    const current = getLocalLeads();
    saveLocalLeads([draftLead, ...current]);

    const demoActivity: LeadActivityItem = {
      id: crypto.randomUUID(),
      leadId: draftLead.id,
      action: "ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø§Ù„Ù…Ø­ØªÙ…Ù„",
      date: createdAt,
      by: draftLead.assignedToName,
      type: "create",
    };
    saveLocalActivities([demoActivity, ...getLocalActivities()]);

    return draftLead;
  }

  try {
    const assignedToUuid = await resolveAssignedToUuid(input.assignedTo);
    if (!assignedToUuid) {
      throw new Error("ØªØ¹Ø°Ø± ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„ Ø§Ù„ØµØ­ÙŠØ­ Ø¹Ù† Ø§Ù„Ø¹Ù…ÙŠÙ„. ØªØ£ÙƒØ¯ Ù…Ù† ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø£Ùˆ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„.");
    }

    const insertPayload: Database["public"]["Tables"]["leads"]["Insert"] = {
      parent_name: draftLead.parentName,
      parent_phone: draftLead.parentPhone,
      parent_whatsapp: input.parentWhatsapp ?? null,
      child_name: draftLead.childName,
      child_age: draftLead.childAge,
      stage: draftLead.stage,
      temperature: draftLead.temperature,
      source: draftLead.source as Database["public"]["Enums"]["lead_source"],
      has_laptop: input.hasLaptop ?? false,
      has_prior_experience: input.hasPriorExperience ?? false,
      child_interests: input.childInterests ?? null,
      suggested_course: draftLead.suggestedCourse as Database["public"]["Enums"]["course_type"] | null,
      price_range_shared: false,
      whatsapp_collected: Boolean((input.parentWhatsapp ?? input.parentPhone).trim()),
      assigned_to: assignedToUuid,
      notes: draftLead.notes,
      created_at: draftLead.createdAt,
    };

    const { data, error } = await supabase
      .from("leads")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) {
      console.error("[leads] create failed", error);
      throw new Error(error.message || "ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø§Ù„Ø¹Ù…ÙŠÙ„ ÙÙŠ Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª");
    }

    if (!data) {
      throw new Error("ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø·Ù„Ø¨ Ø§Ù„Ø­ÙØ¸ Ù„ÙƒÙ† Ù„Ù… ÙŠØ±Ø¬Ø¹ Ø£ÙŠ Ø³Ø¬Ù„ Ù…Ù† Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª");
    }

    const synced = mapLeadRow(data);
    const current = getLocalLeads().filter((item) => item.id !== synced.id);
    saveLocalLeads([{ ...synced, assignedToName: draftLead.assignedToName }, ...current]);

    const activityPayload: Database["public"]["Tables"]["lead_activities"]["Insert"] = {
      lead_id: synced.id,
      action: "ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø§Ù„Ù…Ø­ØªÙ…Ù„",
      type: "create",
      created_at: createdAt,
    };

    const { error: activityError } = await supabase.from("lead_activities").insert(activityPayload);
    if (activityError) {
      console.warn("[lead_activities] create activity failed", activityError);
    }

    return { ...synced, assignedToName: draftLead.assignedToName };
  } catch (error) {
    console.error("[leads] create failed", error);
    throw error instanceof Error ? error : new Error("ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø§Ù„Ø¹Ù…ÙŠÙ„");
  }
}

export async function updateLead(
  leadId: string,
  input: UpdateLeadInput,
  actorName = input.assignedToName || "Ø§Ù„Ù†Ø¸Ø§Ù…",
): Promise<LeadListItem | null> {
  const current = getLocalLeads();
  const existing = current.find((lead) => lead.id === leadId);
  if (!existing) return null;

  const updated: LeadListItem = {
    ...existing,
    childName: input.childName,
    childAge: input.childAge,
    parentName: input.parentName,
    parentPhone: input.parentPhone,
    source: input.source,
    temperature: input.temperature,
    suggestedCourse: input.suggestedCourse,
    assignedTo: input.assignedTo,
    assignedToName: input.assignedToName,
    notes: input.notes ?? null,
    stage: input.stage ?? existing.stage,
    lossReason: input.lossReason ?? existing.lossReason ?? null,
    nextFollowUpAt: input.nextFollowUpAt ?? existing.nextFollowUpAt,
    lastContactAt: new Date().toISOString(),
  };

  saveLocalLeads(current.map((lead) => (lead.id === leadId ? updated : lead)));

  const activity: LeadActivityItem = {
    id: crypto.randomUUID(),
    leadId,
    action: "ØªÙ… ØªØ­Ø¯ÙŠØ« Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¹Ù…ÙŠÙ„",
    date: new Date().toISOString(),
    by: actorName,
    type: "note",
  };
  saveLocalActivities([activity, ...getLocalActivities()]);

  const supabase = getSupabaseClient();
  if (!supabase) {
    if (shouldUseDemoFallback()) return updated;
    throw new Error("Supabase client is not available");
  }

  try {
    const assignedToUuid = await resolveAssignedToUuid(updated.assignedTo);
    if (!assignedToUuid) {
      throw new Error("ØªØ¹Ø°Ø± ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„ Ø§Ù„ØµØ­ÙŠØ­ Ø¹Ù† Ø§Ù„Ø¹Ù…ÙŠÙ„.");
    }

    const { error: updateError } = await supabase
      .from("leads")
      .update({
        parent_name: updated.parentName,
        parent_phone: updated.parentPhone,
        child_name: updated.childName,
        child_age: updated.childAge,
        stage: updated.stage,
        temperature: updated.temperature,
        source: updated.source as Database["public"]["Enums"]["lead_source"],
        suggested_course: updated.suggestedCourse as Database["public"]["Enums"]["course_type"] | null,
        assigned_to: assignedToUuid,
        notes: updated.notes,
        loss_reason: updated.lossReason,
        next_follow_up_at: updated.nextFollowUpAt,
        last_contact_at: updated.lastContactAt,
      })
      .eq("id", leadId);

    if (updateError) {
      throw updateError;
    }

    const { error: activityError } = await supabase.from("lead_activities").insert({
      lead_id: leadId,
      action: activity.action,
      type: activity.type,
      created_at: activity.date,
    });

    if (activityError) {
      console.warn("[lead_activities] update activity failed", activityError);
    }
  } catch (error) {
    console.error("[leads] update failed", error);
    if (shouldUseDemoFallback()) return updated;
    throw error instanceof Error ? error : new Error("Failed to update lead");
  }

  return updated;
}

export async function updateLeadStage(
  leadId: string,
  stage: LeadStage,
  actorName: string,
): Promise<LeadListItem | null> {
  const current = getLocalLeads();
  const existing = current.find((lead) => lead.id === leadId);
  if (!existing) return null;

  const updated: LeadListItem = {
    ...existing,
    stage,
    lastContactAt: new Date().toISOString(),
  };

  saveLocalLeads(current.map((lead) => (lead.id === leadId ? updated : lead)));

  const activity: LeadActivityItem = {
    id: crypto.randomUUID(),
    leadId,
    action: `ØªÙ… Ù†Ù‚Ù„ Ø§Ù„Ù…Ø±Ø­Ù„Ø© Ø¥Ù„Ù‰ ${STAGE_LABELS[stage]}`,
    date: new Date().toISOString(),
    by: actorName,
    type: "stage",
  };
  saveLocalActivities([activity, ...getLocalActivities()]);

  const supabase = getSupabaseClient();
  if (!supabase) {
    if (shouldUseDemoFallback()) return updated;
    throw new Error("Supabase client is not available");
  }

  try {
    await supabase
      .from("leads")
      .update({
        stage,
        last_contact_at: updated.lastContactAt,
      })
      .eq("id", leadId);

    await supabase.from("lead_activities").insert({
      lead_id: leadId,
      action: activity.action,
      type: activity.type,
      created_at: activity.date,
    });
  } catch (error) {
    console.error("[leads] stage update failed", error);
    if (shouldUseDemoFallback()) return updated;
    throw error instanceof Error ? error : new Error("Failed to update lead stage");
  }

  return updated;
}
```

### FILE: src\services\operations.service.ts
```ts

import { formatCurrencyEgp, formatDate } from "@/lib/formatters";
import { getDayLabel, t } from "@/lib/locale";
import { listFollowUps } from "@/services/follow-ups.service";
import { listLeads } from "@/services/leads.service";
import { getPaymentsSummary, listPayments } from "@/services/payments.service";
import { getScheduleOverview, listScheduleSessions } from "@/services/schedule.service";
import { listStudents } from "@/services/students.service";
import type {
  ActionCenterData,
  ActionCenterItem,
  ActionCenterMetric,
  AppNotificationItem,
  DashboardContext,
} from "@/types/crm";
import type { Locale } from "@/types/common.types";

function isManagementRole(role: DashboardContext["role"]): boolean {
  return role === "admin" || role === "owner";
}

function isSalesRole(role: DashboardContext["role"]): boolean {
  return role === "sales";
}

function isOpsRole(role: DashboardContext["role"]): boolean {
  return role === "ops";
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function matchesAssignee(nameAr: string, ctx: DashboardContext): boolean {
  const targets = [normalizeName(ctx.fullNameAr), normalizeName(ctx.fullName)];
  return targets.includes(normalizeName(nameAr));
}

function getNumberLocale(locale: Locale): string {
  return locale === "ar" ? "ar-EG" : "en-US";
}

export function getActionToneStyles(priority: ActionCenterItem["priority"]): { bg: string; color: string; border: string } {
  switch (priority) {
    case "critical":
      return { bg: "#FEF2F2", color: "#DC2626", border: "#FCA5A5" };
    case "high":
      return { bg: "#FFFBEB", color: "#D97706", border: "#FCD34D" };
    case "medium":
      return { bg: "#EEF2FF", color: "#4338CA", border: "#C7D2FE" };
    default:
      return { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" };
  }
}

export async function getActionCenterData(
  context: DashboardContext,
  locale: Locale = "ar",
): Promise<ActionCenterData> {
  const [leads, followUps, students, payments, paymentsSummary, sessions, scheduleOverview] = await Promise.all([
    listLeads(),
    listFollowUps(),
    listStudents(),
    listPayments(),
    getPaymentsSummary(),
    listScheduleSessions(),
    getScheduleOverview(),
  ]);

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayDay = new Date().getDay();
  const numberLocale = getNumberLocale(locale);

  const scopedFollowUps = isManagementRole(context.role)
    ? followUps
    : followUps.filter((item) => matchesAssignee(item.assignedTo, context));

  const overdueFollowUps = scopedFollowUps.filter((item) => item.status === "overdue");
  const dueTodayFollowUps = scopedFollowUps.filter((item) => {
    if (item.status === "completed") return false;
    return item.scheduledAt.slice(0, 10) === todayIso;
  });

  const scopedLeads = isManagementRole(context.role)
    ? leads
    : isSalesRole(context.role)
      ? leads.filter((lead) => matchesAssignee(lead.assignedToName, context))
      : [];

  const leadsWithoutFollowUp = scopedLeads.filter(
    (lead) => lead.stage !== "won" && lead.stage !== "lost" && !lead.nextFollowUpAt,
  );
  const trialBookedStale = scopedLeads.filter((lead) => lead.stage === "trial_booked" && !lead.nextFollowUpAt);

  const overduePayments = payments.filter((payment) => payment.status === "overdue");
  const dueTodayPayments = payments.filter(
    (payment) => payment.status === "pending" && payment.dueDate.slice(0, 10) === todayIso,
  );

  const atRiskStudents = students.filter((student) => student.status === "at_risk");
  const dueTodayTrials = students.filter((student) => student.status === "trial");
  const todaySessions = sessions.filter((session) => session.day === todayDay);

  const critical: ActionCenterItem[] = [];
  const mediumPriority: ActionCenterItem[] = [];
  const informational: ActionCenterItem[] = [];

  if (!isOpsRole(context.role)) {
    critical.push(
      ...overdueFollowUps.map((item) => ({
        id: `follow-up-overdue-${item.id}`,
        title: t(locale, `Ù…ØªØ§Ø¨Ø¹Ø© Ù…ØªØ£Ø®Ø±Ø©: ${item.leadName}`, `Overdue follow-up: ${item.leadName}`),
        description: t(locale, item.title, item.title),
        href: item.leadId ? `/leads/${item.leadId}` : "/follow-ups",
        category: "follow_up" as const,
        priority: "critical" as const,
        owner: item.assignedTo,
        meta: formatDate(item.scheduledAt, locale),
      })),
    );

    mediumPriority.push(
      ...dueTodayFollowUps.map((item) => ({
        id: `follow-up-today-${item.id}`,
        title: t(locale, `Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ÙŠÙˆÙ…: ${item.leadName}`, `Today follow-up: ${item.leadName}`),
        description: t(locale, item.title, item.title),
        href: item.leadId ? `/leads/${item.leadId}` : "/follow-ups",
        category: "follow_up" as const,
        priority: "high" as const,
        owner: item.assignedTo,
        meta: formatDate(item.scheduledAt, locale),
      })),
      ...leadsWithoutFollowUp.map((lead) => ({
        id: `lead-missing-next-${lead.id}`,
        title: t(locale, `Ø¹Ù…ÙŠÙ„ Ø¨Ù„Ø§ Ù…ØªØ§Ø¨Ø¹Ø© Ù‚Ø§Ø¯Ù…Ø©: ${lead.childName}`, `Lead without next follow-up: ${lead.childName}`),
        description: t(locale, `${lead.parentName} â€¢ ${lead.parentPhone}`, `${lead.parentName} â€¢ ${lead.parentPhone}`),
        href: `/leads/${lead.id}`,
        category: "lead" as const,
        priority: "high" as const,
        owner: lead.assignedToName,
        meta: t(locale, "ØºÙŠØ± Ù…Ø­Ø¯Ø¯", "Not scheduled"),
      })),
      ...trialBookedStale.map((lead) => ({
        id: `trial-stale-${lead.id}`,
        title: t(locale, `Ø³ÙŠØ´Ù† ØªØ¬Ø±ÙŠØ¨ÙŠØ© ØªØ­ØªØ§Ø¬ ØªØ£ÙƒÙŠØ¯: ${lead.childName}`, `Trial session needs confirmation: ${lead.childName}`),
        description: t(locale, `${lead.parentName} â€¢ ${lead.assignedToName}`, `${lead.parentName} â€¢ ${lead.assignedToName}`),
        href: `/leads/${lead.id}`,
        category: "lead" as const,
        priority: "medium" as const,
        owner: lead.assignedToName,
      })),
    );
  }

  critical.push(
    ...overduePayments.map((payment) => ({
      id: `payment-overdue-${payment.id}`,
      title: t(locale, `Ø¯ÙØ¹Ø© Ù…ØªØ£Ø®Ø±Ø©: ${payment.parentName}`, `Overdue payment: ${payment.parentName}`),
      description: t(locale, `${payment.studentName} â€¢ ${formatCurrencyEgp(payment.amount, locale)}`, `${payment.studentName} â€¢ ${formatCurrencyEgp(payment.amount, locale)}`),
      href: `/payments/${payment.id}`,
      category: "payment" as const,
      priority: "critical" as const,
      meta: formatDate(payment.dueDate, locale),
    })),
    ...atRiskStudents.map((student) => ({
      id: `student-risk-${student.id}`,
      title: t(locale, `Ø·Ø§Ù„Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©: ${student.fullName}`, `Student at risk: ${student.fullName}`),
      description: t(locale, `${student.parentName} â€¢ ${student.className ?? "Ø¨Ø¯ÙˆÙ† Ù…Ø¬Ù…ÙˆØ¹Ø©"}`, `${student.parentName} â€¢ ${student.className ?? "No group"}`),
      href: `/students/${student.id}`,
      category: "student" as const,
      priority: "high" as const,
      meta: student.currentCourse ?? undefined,
    })),
  );

  mediumPriority.push(
    ...dueTodayPayments.map((payment) => ({
      id: `payment-today-${payment.id}`,
      title: t(locale, `Ø§Ø³ØªØ­Ù‚Ø§Ù‚ Ø§Ù„ÙŠÙˆÙ…: ${payment.parentName}`, `Due today: ${payment.parentName}`),
      description: t(locale, `${payment.studentName} â€¢ ${formatCurrencyEgp(payment.amount, locale)}`, `${payment.studentName} â€¢ ${formatCurrencyEgp(payment.amount, locale)}`),
      href: `/payments/${payment.id}`,
      category: "payment" as const,
      priority: "medium" as const,
      meta: formatDate(payment.dueDate, locale),
    })),
    ...dueTodayTrials.map((student) => ({
      id: `trial-student-${student.id}`,
      title: t(locale, `Ø·Ø§Ù„Ø¨ ØªØ¬Ø±ÙŠØ¨ÙŠ ÙŠØ­ØªØ§Ø¬ Ù…ØªØ§Ø¨Ø¹Ø©: ${student.fullName}`, `Trial student needs follow-up: ${student.fullName}`),
      description: t(locale, `${student.parentName} â€¢ ${student.currentCourse ?? "Ø¨Ø¯ÙˆÙ† ÙƒÙˆØ±Ø³"}`, `${student.parentName} â€¢ ${student.currentCourse ?? "No course"}`),
      href: `/students/${student.id}`,
      category: "student" as const,
      priority: "medium" as const,
    })),
  );

  informational.push(
    ...todaySessions.map((session) => ({
      id: `session-${session.id}`,
      title: t(locale, `Ø¬Ù„Ø³Ø© Ø§Ù„ÙŠÙˆÙ…: ${session.className}`, `Today's session: ${session.className}`),
      description: t(locale, `${session.teacher} â€¢ ${session.startTime} - ${session.endTime}`, `${session.teacher} â€¢ ${session.startTime} - ${session.endTime}`),
      href: `/schedule/${session.id}`,
      category: "schedule" as const,
      priority: "info" as const,
      meta: getDayLabel(session.day, locale),
    })),
  );

  const metrics: ActionCenterMetric[] = isOpsRole(context.role)
    ? [
        {
          label: t(locale, "Ø·Ù„Ø§Ø¨ Ø¨Ø­Ø§Ø¬Ø© Ù…ØªØ§Ø¨Ø¹Ø©", "Students at risk"),
          value: atRiskStudents.length.toLocaleString(numberLocale),
          tone: atRiskStudents.length > 0 ? "warning" : "success",
        },
        {
          label: t(locale, "Ù…Ø¯ÙÙˆØ¹Ø§Øª Ù…ØªØ£Ø®Ø±Ø©", "Overdue payments"),
          value: overduePayments.length.toLocaleString(numberLocale),
          tone: overduePayments.length > 0 ? "danger" : "success",
        },
        {
          label: t(locale, "Ø¬Ù„Ø³Ø§Øª Ø§Ù„ÙŠÙˆÙ…", "Today's sessions"),
          value: todaySessions.length.toLocaleString(numberLocale),
          tone: "info",
        },
        {
          label: t(locale, "Ø­Ù…ÙˆÙ„Ø© Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹", "Weekly load"),
          value: scheduleOverview.sessionsCount.toLocaleString(numberLocale),
          tone: "brand",
        },
      ]
    : [
        {
          label: t(locale, "Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ø­Ø±Ø¬Ø©", "Critical actions"),
          value: critical.length.toLocaleString(numberLocale),
          tone: critical.length > 0 ? "danger" : "success",
        },
        {
          label: t(locale, "ØªØ­ØµÙŠÙ„ Ø§Ù„Ø´Ù‡Ø±", "Collection rate"),
          value: `${paymentsSummary.collectionRate}%`,
          tone: paymentsSummary.collectionRate >= 80 ? "success" : paymentsSummary.collectionRate >= 60 ? "warning" : "danger",
        },
        {
          label: t(locale, "Ø¬Ù„Ø³Ø§Øª Ø§Ù„ÙŠÙˆÙ…", "Today's sessions"),
          value: todaySessions.length.toLocaleString(numberLocale),
          tone: "info",
        },
        {
          label: t(locale, "Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ù…ÙØªÙˆØ­ÙˆÙ† Ø¨Ù„Ø§ Ù…ØªØ§Ø¨Ø¹Ø©", "Open leads without follow-up"),
          value: leadsWithoutFollowUp.length.toLocaleString(numberLocale),
          tone: leadsWithoutFollowUp.length > 0 ? "warning" : "success",
        },
      ];

  const notifications: AppNotificationItem[] = [...critical, ...mediumPriority]
    .slice(0, 6)
    .map((item, index) => ({
      id: item.id,
      title: item.title,
      timeLabel: item.meta ?? t(locale, "Ø§Ù„Ø¢Ù†", "Now"),
      href: item.href,
      type: item.priority === "critical" ? "warning" : item.priority === "high" ? "warning" : item.priority === "medium" ? "info" : "success",
      readDefault: index > 1,
    }));

  if (notifications.length === 0) {
    notifications.push({
      id: "healthy-system",
      title: t(locale, "Ù„Ø§ ØªÙˆØ¬Ø¯ ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ø­Ø±Ø¬Ø© Ø§Ù„Ø¢Ù†", "No urgent alerts right now"),
      timeLabel: t(locale, "Ø§Ù„Ø¢Ù†", "Now"),
      href: "/action-center",
      type: "success",
      readDefault: false,
    });
  }

  return {
    metrics,
    critical: critical.slice(0, 12),
    mediumPriority: mediumPriority.slice(0, 16),
    informational: informational.slice(0, 8),
    notifications,
  };
}
```

### FILE: src\services\owner-summary.service.ts
```ts
import { listLeads } from "@/services/leads.service";
import { listParentsWithRelations, listStudentsWithRelations } from "@/services/relations.service";

export interface OwnerSnapshotItem {
  key: string;
  displayName: string;
  leadCount: number;
  wonLeadCount: number;
  parentCount: number;
  studentCount: number;
}

function normalizeName(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function titleize(value: string | null | undefined): string {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : "Unassigned";
}

export async function getOwnerSnapshot(): Promise<OwnerSnapshotItem[]> {
  const [leads, students, parents] = await Promise.all([
    listLeads(),
    listStudentsWithRelations(),
    listParentsWithRelations(),
  ]);

  const bucket = new Map<string, OwnerSnapshotItem>();

  const ensure = (name: string | null | undefined) => {
    const key = normalizeName(name) || '__unassigned__';
    if (!bucket.has(key)) {
      bucket.set(key, {
        key,
        displayName: titleize(name),
        leadCount: 0,
        wonLeadCount: 0,
        parentCount: 0,
        studentCount: 0,
      });
    }
    return bucket.get(key)!;
  };

  leads.forEach((lead) => {
    const entry = ensure(lead.assignedToName);
    entry.leadCount += 1;
    if (lead.stage === 'won') entry.wonLeadCount += 1;
  });

  parents.forEach((parent) => {
    const entry = ensure(parent.ownerName);
    entry.parentCount += 1;
  });

  students.forEach((student) => {
    const entry = ensure(student.ownerName);
    entry.studentCount += 1;
  });

  return Array.from(bucket.values()).sort((a, b) => (b.studentCount + b.parentCount + b.leadCount) - (a.studentCount + a.parentCount + a.leadCount));
}
```

### FILE: src\services\parents.service.ts
```ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import type { CreateParentInput, ParentListItem } from "@/types/crm";
import { isBrowser, readStorage, writeStorage } from "@/services/storage";

const PARENTS_KEY = "skidy.crm.parents";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !isBrowser()) return null;
  return createBrowserClient<Database>(url, key);
}

function sortParents(items: ParentListItem[]): ParentListItem[] {
  return [...items].sort((a, b) => a.fullName.localeCompare(b.fullName, "ar"));
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function normalizePhone(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "").replace(/^20/, "");
}

function normalizeName(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function mapRow(
  row: Database["public"]["Tables"]["parents"]["Row"] | Record<string, unknown>,
): ParentListItem {
  const record = row as Record<string, unknown>;

  return {
    id: asString(record.id, crypto.randomUUID()),
    fullName: asString(record.full_name ?? record.fullName, "ÙˆÙ„ÙŠ Ø£Ù…Ø± ØºÙŠØ± Ù…Ø­Ø¯Ø¯"),
    phone: asString(record.phone, "â€”"),
    whatsapp: asNullableString(record.whatsapp),
    email: asNullableString(record.email),
    city: asNullableString(record.city),
    childrenCount: asNumber(record.children_count ?? record.childrenCount, 0),
    children: [],
  };
}

function getLocalParents(): ParentListItem[] {
  return sortParents(readStorage(PARENTS_KEY, [] as ParentListItem[]));
}

function saveLocalParents(items: ParentListItem[]): void {
  writeStorage(PARENTS_KEY, sortParents(items));
}

function clearLocalParents(): void {
  writeStorage(PARENTS_KEY, []);
}

function findExistingParent(items: ParentListItem[], input: CreateParentInput): ParentListItem | null {
  const phone = normalizePhone(input.phone);
  const whatsapp = normalizePhone(input.whatsapp);
  const name = normalizeName(input.fullName);

  return (
    items.find((parent) => phone.length > 0 && normalizePhone(parent.phone) === phone) ??
    items.find((parent) => whatsapp.length > 0 && normalizePhone(parent.whatsapp) === whatsapp) ??
    items.find((parent) => name.length > 0 && normalizeName(parent.fullName) === name && phone.length > 0 && normalizePhone(parent.phone) === phone) ??
    null
  );
}

export async function listParents(): Promise<ParentListItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    clearLocalParents();
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("parents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[parents] failed to load from Supabase", error);
      clearLocalParents();
      return [];
    }

    if (!data || data.length === 0) {
      clearLocalParents();
      return [];
    }

    const mapped = data.map((row: Database["public"]["Tables"]["parents"]["Row"]) => mapRow(row));
    saveLocalParents(mapped);
    return mapped;
  } catch (error) {
    console.error("[parents] unexpected load failure", error);
    clearLocalParents();
    return [];
  }
}

export async function getParentById(id: string): Promise<ParentListItem | null> {
  const items = await listParents();
  return items.find((parent) => parent.id === id) ?? null;
}

export async function createParent(input: CreateParentInput): Promise<ParentListItem> {
  const fullName = input.fullName.trim();
  const phone = input.phone.trim();

  if (!fullName || !phone) {
    throw new Error("Ø§Ø³Ù… ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø± ÙˆØ±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ Ù…Ø·Ù„ÙˆØ¨Ø§Ù†.");
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("ØªØ¹Ø°Ø± Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª. ØªØ£ÙƒØ¯ Ù…Ù† Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Supabase Ø«Ù… Ø£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©.");
  }

  const existing = findExistingParent(await listParents(), input);
  if (existing) {
    return existing;
  }

  const payload: Database["public"]["Tables"]["parents"]["Insert"] = {
    full_name: fullName,
    phone,
    whatsapp: input.whatsapp?.trim() || phone,
    email: input.email?.trim() || null,
    city: input.city?.trim() || null,
    children_count: input.childrenCount ?? 0,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("parents")
    .insert(payload)
    .select("*")
    .single();

  if (error || !data) {
    console.error("[parents] create failed", error);
    throw new Error(error?.message || "ØªØ¹Ø°Ø± Ø¥Ù†Ø´Ø§Ø¡ Ø³Ø¬Ù„ ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±.");
  }

  const created = mapRow(data);
  saveLocalParents([created, ...getLocalParents().filter((item) => item.id !== created.id)]);
  return created;
}
```

### FILE: src\services\payments.service.ts
```ts
import { createBrowserClient } from "@supabase/ssr";

import type { PaymentMethod, PaymentStatus } from "@/types/common.types";
import type { Database } from "@/types/database.types";
import type { CreatePaymentInput, PaymentDetails, PaymentItem } from "@/types/crm";
import { isBrowser, sortByDateAsc, sortByDateDesc } from "@/services/storage";
import { listParents } from "@/services/parents.service";
import { listStudents } from "@/services/students.service";

const VALID_METHODS: PaymentMethod[] = ["bank_transfer", "card", "wallet", "cash", "instapay"];
const VALID_STATUSES: PaymentStatus[] = ["paid", "pending", "overdue", "refunded", "partial"];
const PAYMENT_META_PREFIX = "__SKIDY_PAYMENT_META__:";
const DEFAULT_SESSION_BLOCK = 4;

type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];

interface PaymentMeta {
  sessionsCovered?: number;
  blockStartDate?: string | null;
  blockEndDate?: string | null;
  deferredUntil?: string | null;
  invoiceNumber?: string | null;
  invoiceIssuedAt?: string | null;
  publicNote?: string | null;
  archivedAt?: string | null;
  archivedBy?: string | null;
}

interface PaymentArchiveState {
  archived: boolean;
  archivedAt: string | null;
  archivedBy: string | null;
}

interface ListPaymentsOptions {
  includeArchived?: boolean;
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !isBrowser()) return null;
  return createBrowserClient<Database>(url, key);
}

function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function asStatus(value: unknown): PaymentStatus {
  return VALID_STATUSES.includes(value as PaymentStatus) ? (value as PaymentStatus) : "pending";
}

function asMethod(value: unknown): PaymentMethod | null {
  return VALID_METHODS.includes(value as PaymentMethod) ? (value as PaymentMethod) : null;
}

function normalizeDateKey(value: string | null | undefined): string | null {
  if (!value || typeof value !== "string") return null;
  return value.slice(0, 10);
}

function normalizeSessionBlock(value: number | null | undefined): number {
  const numeric = typeof value === "number" && Number.isFinite(value) ? value : DEFAULT_SESSION_BLOCK;
  return Math.max(DEFAULT_SESSION_BLOCK, Math.ceil(numeric / DEFAULT_SESSION_BLOCK) * DEFAULT_SESSION_BLOCK);
}

function parsePaymentMeta(raw: string | null | undefined): { publicNote: string | null; meta: PaymentMeta } {
  const value = typeof raw === "string" ? raw : "";
  if (!value.startsWith(PAYMENT_META_PREFIX)) {
    return { publicNote: value || null, meta: {} };
  }

  const [header, ...rest] = value.split("\n");
  let meta: PaymentMeta = {};
  try {
    meta = JSON.parse(header.slice(PAYMENT_META_PREFIX.length)) as PaymentMeta;
  } catch {
    meta = {};
  }

  const publicNote = rest.join("\n").trim();
  return {
    publicNote: publicNote || meta.publicNote || null,
    meta,
  };
}

function buildPaymentNotes(publicNote: string | null | undefined, meta: PaymentMeta): string {
  const compactMeta: PaymentMeta = {
    sessionsCovered: normalizeSessionBlock(meta.sessionsCovered ?? DEFAULT_SESSION_BLOCK),
    blockStartDate: meta.blockStartDate ?? null,
    blockEndDate: meta.blockEndDate ?? null,
    deferredUntil: meta.deferredUntil ?? null,
    invoiceNumber: meta.invoiceNumber ?? null,
    invoiceIssuedAt: meta.invoiceIssuedAt ?? null,
    publicNote: publicNote?.trim() ? publicNote.trim() : null,
    archivedAt: meta.archivedAt ?? null,
    archivedBy: meta.archivedBy ?? null,
  };

  const parts = [`${PAYMENT_META_PREFIX}${JSON.stringify(compactMeta)}`];
  if (publicNote?.trim()) parts.push(publicNote.trim());
  return parts.join("\n");
}

function getArchiveStateFromNotes(rawNotes: string | null | undefined): PaymentArchiveState {
  const { meta } = parsePaymentMeta(rawNotes);
  return {
    archived: Boolean(meta.archivedAt),
    archivedAt: meta.archivedAt ?? null,
    archivedBy: meta.archivedBy ?? null,
  };
}

function sortPayments(items: PaymentItem[]): PaymentItem[] {
  return sortByDateDesc(items, (payment) => getPaymentEffectiveDueDate(payment));
}

function generateInvoiceNumber(existing: PaymentItem[]): string {
  const year = new Date().getFullYear();
  const maxSequence = existing.reduce((max, payment) => {
    const source = payment.invoiceNumber ?? "";
    const match = source.match(/SKR-(\d{4})-(\d{4,})/);
    if (!match) return max;
    const [, rawYear, rawSequence] = match;
    if (Number(rawYear) !== year) return max;
    const next = Number(rawSequence);
    return Number.isFinite(next) ? Math.max(max, next) : max;
  }, 0);

  return `SKR-${year}-${String(maxSequence + 1).padStart(4, "0")}`;
}

function getEffectiveDueDate(payment: Pick<PaymentItem, "dueDate" | "deferredUntil">): string {
  return payment.deferredUntil && payment.deferredUntil.length > 0 ? payment.deferredUntil : payment.dueDate;
}

function isDeferredPayment(payment: Pick<PaymentItem, "status" | "deferredUntil">): boolean {
  if (!payment.deferredUntil) return false;
  return payment.status === "pending" || payment.status === "overdue";
}

function isPastDate(value: string): boolean {
  const dateKey = normalizeDateKey(value);
  if (!dateKey) return false;
  return dateKey < getTodayDateKey();
}

function mapPaymentRow(
  row: PaymentRow | Record<string, unknown>,
  studentsMap: Map<string, Awaited<ReturnType<typeof listStudents>>[number]>,
  parentsMap: Map<string, Awaited<ReturnType<typeof listParents>>[number]>,
): PaymentItem {
  const record = row as Record<string, unknown>;
  const studentId = asNullableString(record.student_id ?? record.studentId);
  const student = studentId ? studentsMap.get(studentId) ?? null : null;
  const parent = student?.parentId ? parentsMap.get(student.parentId) ?? null : null;
  const rawNotes = asNullableString(record.notes);
  const { publicNote, meta } = parsePaymentMeta(rawNotes);

  return {
    id: asString(record.id, crypto.randomUUID()),
    studentId,
    studentName: student?.fullName ?? asString(record.student_name ?? record.studentName, "Ø·Ø§Ù„Ø¨ ØºÙŠØ± Ù…Ø­Ø¯Ø¯"),
    parentId: student?.parentId ?? parent?.id ?? asNullableString(record.parent_id ?? record.parentId),
    parentName:
      parent?.fullName ?? student?.parentName ?? asString(record.parent_name ?? record.parentName, "ÙˆÙ„ÙŠ Ø£Ù…Ø± ØºÙŠØ± Ù…Ø­Ø¯Ø¯"),
    amount: asNumber(record.amount),
    status: asStatus(record.status),
    method: asMethod(record.method),
    dueDate: asString(record.due_date ?? record.dueDate, new Date().toISOString()),
    paidAt: asNullableString(record.paid_at ?? record.paidAt),
    notes: rawNotes,
    publicNote,
    sessionsCovered: normalizeSessionBlock(meta.sessionsCovered ?? DEFAULT_SESSION_BLOCK),
    blockStartDate: meta.blockStartDate ?? null,
    blockEndDate: meta.blockEndDate ?? null,
    deferredUntil: meta.deferredUntil ?? null,
    invoiceNumber: meta.invoiceNumber ?? null,
    invoiceIssuedAt: meta.invoiceIssuedAt ?? null,
  } satisfies PaymentItem;
}

async function buildMaps() {
  const [students, parents] = await Promise.all([listStudents(), listParents()]);
  return {
    students,
    parents,
    studentsMap: new Map(students.map((student) => [student.id, student] as const)),
    parentsMap: new Map(parents.map((parent) => [parent.id, parent] as const)),
  };
}

function assertSupabaseConfigured() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase client is not available in the current browser session.");
  }
  return supabase;
}

async function readPaymentRows(): Promise<PaymentRow[]> {
  const supabase = assertSupabaseConfigured();
  const { data, error } = await supabase.from("payments").select("*").order("due_date", { ascending: false });

  if (error) {
    console.error("[payments] failed to load from Supabase", error);
    throw new Error(error.message || "Failed to load payments");
  }

  return (data ?? []) as PaymentRow[];
}

function toPaymentInsert(input: {
  id: string;
  studentId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod | null;
  dueDate: string;
  paidAt: string | null;
  notes: string;
}): PaymentInsert {
  return {
    id: input.id,
    student_id: input.studentId,
    amount: input.amount,
    status: input.status,
    method: input.method,
    due_date: input.dueDate,
    paid_at: input.paidAt,
    notes: input.notes,
  } satisfies PaymentInsert;
}

function toPaymentStatusUpdate(payment: PaymentItem, status: PaymentStatus, method: PaymentMethod | null, paidAt: string | null): PaymentUpdate {
  return {
    status,
    method,
    paid_at: paidAt,
    notes: payment.notes,
  } satisfies PaymentUpdate;
}

export async function listPayments(options: ListPaymentsOptions = {}): Promise<PaymentItem[]> {
  const { includeArchived = false } = options;
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const [rows, { studentsMap, parentsMap }] = await Promise.all([readPaymentRows(), buildMaps()]);
    const mapped = rows.map((row) => mapPaymentRow(row, studentsMap, parentsMap));

    if (includeArchived) {
      return sortPayments(mapped);
    }

    return sortPayments(mapped.filter((payment) => !getPaymentArchiveState(payment).archived));
  } catch (error) {
    console.error("[payments] unexpected load failure", error);
    return [];
  }
}

export async function getPaymentById(id: string, options: ListPaymentsOptions = {}): Promise<PaymentItem | null> {
  const items = await listPayments({ includeArchived: options.includeArchived ?? true });
  return items.find((payment) => payment.id === id) ?? null;
}

export async function getPaymentDetails(id: string): Promise<PaymentDetails | null> {
  const [allPayments, activePayments, students, parents] = await Promise.all([
    listPayments({ includeArchived: true }),
    listPayments(),
    listStudents(),
    listParents(),
  ]);

  const payment = allPayments.find((item) => item.id === id) ?? null;
  if (!payment) return null;

  const archiveState = getPaymentArchiveState(payment);
  const student = payment.studentId ? students.find((item) => item.id === payment.studentId) ?? null : null;
  const parent = payment.parentId
    ? parents.find((item) => item.id === payment.parentId) ?? null
    : parents.find((item) => item.fullName === payment.parentName || item.phone === student?.parentPhone) ?? null;

  const siblingPayments = activePayments.filter((item) => {
    if (item.id === payment.id) return false;
    if (parent?.id && item.parentId === parent.id) return true;
    return item.parentName === payment.parentName;
  });

  const paymentHistory = sortPayments(
    activePayments.filter((item) => item.studentId && item.studentId === payment.studentId),
  );

  return {
    ...payment,
    notes: payment.notes,
    publicNote: payment.publicNote,
    student,
    parent,
    siblingPayments,
    paymentHistory: archiveState.archived ? paymentHistory.filter((item) => item.id !== payment.id) : paymentHistory,
  };
}

export async function listPaymentsByStudent(studentId: string): Promise<PaymentItem[]> {
  const payments = await listPayments();
  return payments.filter((payment) => payment.studentId === studentId);
}

export async function createPayment(input: CreatePaymentInput): Promise<PaymentItem> {
  if (!input.studentId) {
    throw new Error("Student is required before creating a payment.");
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  const supabase = assertSupabaseConfigured();
  const [{ studentsMap, parentsMap }, current] = await Promise.all([
    buildMaps(),
    listPayments({ includeArchived: true }),
  ]);
  const student = studentsMap.get(input.studentId) ?? null;
  const parent = student?.parentId ? parentsMap.get(student.parentId) ?? null : null;
  const now = new Date().toISOString();
  const paymentId = crypto.randomUUID();
  const invoiceNumber = generateInvoiceNumber(current);
  const sessionsCovered = normalizeSessionBlock(input.sessionsCovered ?? DEFAULT_SESSION_BLOCK);
  const notes = buildPaymentNotes(input.notes, {
    sessionsCovered,
    blockStartDate: input.blockStartDate ?? null,
    blockEndDate: input.blockEndDate ?? null,
    deferredUntil: input.deferredUntil ?? null,
    invoiceNumber,
    invoiceIssuedAt: now,
  });

  const payment: PaymentItem = {
    id: paymentId,
    studentId: input.studentId,
    studentName: student?.fullName ?? "Ø·Ø§Ù„Ø¨ ØºÙŠØ± Ù…Ø­Ø¯Ø¯",
    parentId: student?.parentId ?? parent?.id ?? null,
    parentName: parent?.fullName ?? student?.parentName ?? "ÙˆÙ„ÙŠ Ø£Ù…Ø± ØºÙŠØ± Ù…Ø­Ø¯Ø¯",
    amount: input.amount,
    status: input.status,
    method: input.method,
    dueDate: input.dueDate,
    paidAt: input.status === "paid" || input.status === "partial" ? now : null,
    notes,
    publicNote: input.notes?.trim() ? input.notes.trim() : null,
    sessionsCovered,
    blockStartDate: input.blockStartDate ?? null,
    blockEndDate: input.blockEndDate ?? null,
    deferredUntil: input.deferredUntil ?? null,
    invoiceNumber,
    invoiceIssuedAt: now,
  };

  const { error } = await supabase.from("payments").insert(
    toPaymentInsert({
      id: paymentId,
      studentId: input.studentId,
      amount: input.amount,
      status: input.status,
      method: input.method,
      dueDate: input.dueDate,
      paidAt: payment.paidAt,
      notes,
    }),
  );

  if (error) {
    console.error("[payments] create failed", error);
    throw new Error(error.message || "Failed to create payment");
  }

  return payment;
}

export async function updatePaymentStatus(id: string, status: PaymentStatus, method?: PaymentMethod | null): Promise<PaymentItem | null> {
  const current = await listPayments({ includeArchived: true });
  const existing = current.find((payment) => payment.id === id) ?? null;
  if (!existing) return null;

  const archiveState = getPaymentArchiveState(existing);
  if (archiveState.archived) {
    throw new Error("Archived payments cannot be updated until they are restored.");
  }

  const nextPaidAt = status === "paid" || status === "partial" ? new Date().toISOString() : null;
  const nextMethod = method === undefined ? existing.method : method;
  const nextDeferredUntil = status === "paid" ? null : existing.deferredUntil;
  const nextNotes = buildPaymentNotes(existing.publicNote, {
    sessionsCovered: existing.sessionsCovered,
    blockStartDate: existing.blockStartDate,
    blockEndDate: existing.blockEndDate,
    deferredUntil: nextDeferredUntil,
    invoiceNumber: existing.invoiceNumber,
    invoiceIssuedAt: existing.invoiceIssuedAt,
    archivedAt: null,
    archivedBy: null,
  });

  const nextItem: PaymentItem = {
    ...existing,
    status,
    method: nextMethod,
    paidAt: nextPaidAt,
    deferredUntil: nextDeferredUntil,
    notes: nextNotes,
  };

  const supabase = assertSupabaseConfigured();
  const { error } = await supabase
    .from("payments")
    .update(toPaymentStatusUpdate(nextItem, status, nextMethod, nextPaidAt))
    .eq("id", id);

  if (error) {
    console.error("[payments] status update failed", error);
    throw new Error(error.message || "Failed to update payment status");
  }

  return nextItem;
}

export async function archivePayment(id: string, archivedBy?: string | null): Promise<PaymentItem | null> {
  const current = await listPayments({ includeArchived: true });
  const existing = current.find((payment) => payment.id === id) ?? null;
  if (!existing) return null;

  const archiveState = getPaymentArchiveState(existing);
  if (archiveState.archived) return existing;

  const now = new Date().toISOString();
  const nextNotes = buildPaymentNotes(existing.publicNote, {
    sessionsCovered: existing.sessionsCovered,
    blockStartDate: existing.blockStartDate,
    blockEndDate: existing.blockEndDate,
    deferredUntil: existing.deferredUntil,
    invoiceNumber: existing.invoiceNumber,
    invoiceIssuedAt: existing.invoiceIssuedAt,
    archivedAt: now,
    archivedBy: archivedBy ?? null,
  });

  const nextItem: PaymentItem = {
    ...existing,
    notes: nextNotes,
  };

  const supabase = assertSupabaseConfigured();
  const { error } = await supabase.from("payments").update({ notes: nextNotes } satisfies PaymentUpdate).eq("id", id);

  if (error) {
    console.error("[payments] archive failed", error);
    throw new Error(error.message || "Failed to archive payment");
  }

  return nextItem;
}

export async function restoreArchivedPayment(id: string): Promise<PaymentItem | null> {
  const current = await listPayments({ includeArchived: true });
  const existing = current.find((payment) => payment.id === id) ?? null;
  if (!existing) return null;

  const archiveState = getPaymentArchiveState(existing);
  if (!archiveState.archived) return existing;

  const nextNotes = buildPaymentNotes(existing.publicNote, {
    sessionsCovered: existing.sessionsCovered,
    blockStartDate: existing.blockStartDate,
    blockEndDate: existing.blockEndDate,
    deferredUntil: existing.deferredUntil,
    invoiceNumber: existing.invoiceNumber,
    invoiceIssuedAt: existing.invoiceIssuedAt,
    archivedAt: null,
    archivedBy: null,
  });

  const nextItem: PaymentItem = {
    ...existing,
    notes: nextNotes,
  };

  const supabase = assertSupabaseConfigured();
  const { error } = await supabase.from("payments").update({ notes: nextNotes } satisfies PaymentUpdate).eq("id", id);

  if (error) {
    console.error("[payments] restore failed", error);
    throw new Error(error.message || "Failed to restore payment");
  }

  return nextItem;
}

export async function deletePayment(id: string): Promise<boolean> {
  const supabase = assertSupabaseConfigured();
  const { error } = await supabase.from("payments").delete().eq("id", id);

  if (error) {
    console.error("[payments] delete failed", error);
    throw new Error(error.message || "Failed to delete payment");
  }

  return true;
}

export function getPaymentArchiveState(payment: Pick<PaymentItem, "notes">): PaymentArchiveState {
  return getArchiveStateFromNotes(payment.notes);
}

export function buildInvoiceShareMessage(payment: PaymentItem, locale: "ar" | "en" = "ar"): string {
  const effectiveDueDate = getPaymentEffectiveDueDate(payment).slice(0, 10);

  if (locale === "ar") {
    return [
      `ÙØ§ØªÙˆØ±Ø© ${payment.invoiceNumber ?? payment.id}`,
      `Ø§Ù„Ø·Ø§Ù„Ø¨: ${payment.studentName}`,
      `ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±: ${payment.parentName}`,
      `Ø¹Ø¯Ø¯ Ø§Ù„Ø¬Ù„Ø³Ø§Øª: ${payment.sessionsCovered}`,
      `Ø§Ù„Ù…Ø¨Ù„Øº: ${payment.amount} Ø¬.Ù…`,
      `Ø§Ù„Ø§Ø³ØªØ­Ù‚Ø§Ù‚ Ø§Ù„ÙØ¹Ù„ÙŠ: ${effectiveDueDate}`,
      payment.deferredUntil ? `Ù…Ø¤Ø¬Ù„ Ø­ØªÙ‰: ${payment.deferredUntil.slice(0, 10)}` : null,
      `Ø´Ø±ÙƒØ© Skidy Rein`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `Invoice ${payment.invoiceNumber ?? payment.id}`,
    `Student: ${payment.studentName}`,
    `Parent: ${payment.parentName}`,
    `Sessions: ${payment.sessionsCovered}`,
    `Amount: EGP ${payment.amount}`,
    `Effective due date: ${effectiveDueDate}`,
    payment.deferredUntil ? `Deferred until: ${payment.deferredUntil.slice(0, 10)}` : null,
    `Skidy Rein`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function getPaymentsSummary() {
  const payments = await listPayments();
  const totalExpected = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalCollected = payments
    .filter((payment) => payment.status === "paid" || payment.status === "partial")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalOverdue = payments
    .filter((payment) => payment.status === "overdue")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const today = getTodayDateKey();
  const dueToday = payments.filter((payment) => normalizeDateKey(getEffectiveDueDate(payment)) === today).length;
  const deferredCount = payments.filter((payment) => isDeferredPayment(payment) && !isPastDate(getEffectiveDueDate(payment))).length;
  const upcoming = sortByDateAsc(
    payments.filter((payment) => {
      if (payment.status !== "pending" && payment.status !== "overdue") return false;
      const effectiveDue = normalizeDateKey(getEffectiveDueDate(payment));
      return Boolean(effectiveDue && effectiveDue >= today);
    }),
    (payment) => getEffectiveDueDate(payment),
  ).slice(0, 5);

  return {
    totalExpected,
    totalCollected,
    totalOverdue,
    dueToday,
    deferredCount,
    collectionRate: totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0,
    upcoming,
  };
}

export function getPaymentDisplayState(payment: PaymentItem): "paid" | "pending" | "overdue" | "partial" | "refunded" | "deferred" {
  if (isDeferredPayment(payment) && !isPastDate(getEffectiveDueDate(payment))) return "deferred";
  return payment.status;
}

export function getPaymentEffectiveDueDate(payment: Pick<PaymentItem, "dueDate" | "deferredUntil">): string {
  return getEffectiveDueDate({ dueDate: payment.dueDate, deferredUntil: payment.deferredUntil });
}

export function getBillingCycleText(
  payment: Pick<PaymentItem, "sessionsCovered" | "blockStartDate" | "blockEndDate" | "deferredUntil">,
  locale: "ar" | "en" = "ar",
): string {
  const sessions = normalizeSessionBlock(payment.sessionsCovered ?? DEFAULT_SESSION_BLOCK);

  if (locale === "ar") {
    const dateRange = payment.blockStartDate || payment.blockEndDate
      ? ` â€” ${payment.blockStartDate?.slice(0, 10) ?? "..."} â†’ ${payment.blockEndDate?.slice(0, 10) ?? "..."}`
      : "";
    const deferred = payment.deferredUntil ? ` â€” Ù…Ø¤Ø¬Ù„Ø© Ø­ØªÙ‰ ${payment.deferredUntil.slice(0, 10)}` : "";
    return `Ø¨Ø§Ù‚Ø© ${sessions} Ø¬Ù„Ø³Ø§Øª${dateRange}${deferred}`;
  }

  const dateRange = payment.blockStartDate || payment.blockEndDate
    ? ` â€” ${payment.blockStartDate?.slice(0, 10) ?? "..."} â†’ ${payment.blockEndDate?.slice(0, 10) ?? "..."}`
    : "";
  const deferred = payment.deferredUntil ? ` â€” deferred until ${payment.deferredUntil.slice(0, 10)}` : "";
  return `${sessions}-session billing block${dateRange}${deferred}`;
}
```

### FILE: src\services\relations.service.ts
```ts
import type { CourseType } from "@/types/common.types";
import type {
  LeadListItem,
  ParentDetails,
  ParentListItem,
  ScheduleSessionItem,
  StudentDetails,
  StudentListItem,
  TeacherDetails,
  TeacherListItem,
} from "@/types/crm";
import { listLeads } from "@/services/leads.service";
import { listParents } from "@/services/parents.service";
import { listScheduleSessions } from "@/services/schedule.service";
import { getStudentById, listStudents } from "@/services/students.service";
import { listTeachers } from "@/services/teachers.service";
import { getTeacherEvaluation } from "@/services/teacher-evaluations.service";

const LEAD_PARENT_PROJECTION_PREFIX = "lead-projection-parent:";
const LEAD_STUDENT_PROJECTION_PREFIX = "lead-projection-student:";

function normalizeName(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/Ø£\.?\s*/g, "")
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePhone(value: string | null | undefined): string {
  const digits = (value ?? "").replace(/\D/g, "");
  if (digits.startsWith("20") && digits.length > 11) return digits.slice(2);
  if (digits.startsWith("2") && digits.length === 12) return digits.slice(1);
  return digits;
}

function samePhone(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = normalizePhone(a);
  const right = normalizePhone(b);
  return left.length > 0 && left === right;
}

function sameName(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = normalizeName(a);
  const right = normalizeName(b);
  return left.length > 0 && left === right;
}

function findParentForStudent(student: StudentListItem, parents: ParentListItem[]): ParentListItem | null {
  if (student.parentId) {
    const direct = parents.find((parent) => parent.id === student.parentId);
    if (direct) return direct;
  }

  return (
    parents.find((parent) => samePhone(parent.phone, student.parentPhone)) ??
    parents.find((parent) => sameName(parent.fullName, student.parentName)) ??
    null
  );
}

function findStudentsForParent(parent: ParentListItem, students: StudentListItem[]): StudentListItem[] {
  return students.filter((student) => {
    if (student.parentId && student.parentId === parent.id) return true;
    if (samePhone(student.parentPhone, parent.phone)) return true;
    return sameName(student.parentName, parent.fullName);
  });
}

function scoreSessionForStudent(student: StudentListItem, session: ScheduleSessionItem): number {
  let score = 0;
  if (student.className && sameName(student.className, session.className)) score += 100;
  if (student.currentCourse && student.currentCourse === session.course) score += 10;
  return score;
}

function findSessionsForStudent(student: StudentListItem, sessions: ScheduleSessionItem[]):

[TRUNCATED: file longer than 120000 characters]
```


# File: docs/archive/IMPLEMENTATION-NOTES.md

```md
# Implementation Notes — Phase 1

## ما الذي يشتغل الآن
- Central labels + status metadata
- Leads list + lead details + stage change
- New lead form with local persistence fallback
- Follow-ups page with working "تم" button + local persistence
- Students page from shared data layer
- Reports page from computed data layer
- Dashboard page from shared computed overview
- Quality scripts + CI workflow

## كيف تعمل طبقة البيانات الآن
1. تحاول القراءة من Supabase عبر `createBrowserClient`
2. لو فشل الاتصال أو لم تكتمل الأعمدة، ترجع إلى `localStorage`
3. لو لا يوجد `localStorage` بعد، تستخدم mock data كبداية

## لماذا هذا مهم؟
هذا يجعل الواجهة قابلة للعمل فوراً، وفي نفس الوقت يفتح الطريق لربط Supabase الحقيقي تدريجياً بدون إعادة كتابة كل صفحة مرة ثانية.

## ما الذي ما زال يحتاج المرحلة التالية؟
- مطابقة أعمدة Supabase الحقيقية 1:1 بعد استخراج schema النهائي
- Add/Edit Lead كامل عبر قاعدة البيانات
- CRUD كامل للطلاب والآباء والمدفوعات والمعلمين
- Reports حقيقية من جداول المدفوعات والمتابعات بدل أي fallback
- Role-based server actions / route handlers

```


# File: docs/archive/PAYMENTS-PERMISSIONS-BILLING-NOTES.md

```md
# Payments Permissions + Billing Logic Batch

## Included
- Restrict payments management to Abdelrahman (admin), Khaled (owner), and Alaa only.
- Deny access to payments pages for other users.
- Show Add Payment button only for authorized users.
- Hide quick payment actions and invoice issuance from unauthorized users.
- Improve billing language around 4-session blocks.
- Treat deferred payments as a first-class display state.
- Improve payments summary to count deferred items and use effective due dates.
- Protect invoice routes server-side.
- Polish invoice design with stronger Skidy Rein identity.

## Files
- src/config/roles.ts
- src/services/payments.service.ts
- src/app/(dashboard)/payments/page.tsx
- src/app/(dashboard)/payments/new/page.tsx
- src/app/(dashboard)/payments/[id]/page.tsx
- src/app/(dashboard)/payments/[id]/invoice/page.tsx
- src/app/(dashboard)/payments/invoice/[id]/page.tsx
- src/components/payments/payment-invoice-view.tsx

```


# File: docs/archive/PAYMENTS-UPGRADE-NOTES.md

```md
# Payments Upgrade

## Includes
- `src/services/reports.service.ts` fix for `ReportsSummaryItem[]`
- Payment permissions helper: only Admin, Owner, and Alaa (sales identity match) can manage payments
- `src/app/(dashboard)/payments/page.tsx` upgraded list with clear Add Payment button and 4-session billing display
- `src/app/(dashboard)/payments/new/page.tsx` new payment creation form
- `src/app/(dashboard)/payments/[id]/page.tsx` invoice actions + gated status updates
- `src/app/(dashboard)/payments/[id]/invoice/page.tsx` branded printable invoice page
- `src/services/payments.service.ts` upgraded payment model with:
  - 4-session billing block
  - optional deferred due date
  - invoice number generation
  - WhatsApp/email share message
  - createPayment()
- `src/types/crm.ts` payment typing extensions
- `src/config/roles.ts` helper for payment manager identity

## Notes
- The invoice is rendered as a branded printable page.
- Save as PDF uses the browser print dialog.
- WhatsApp/email sending currently sends the invoice summary message; attaching a generated PDF automatically would require an extra backend/storage/email provider step.
- Extra billing metadata is persisted inside the existing `payments.notes` field using a structured prefix, so it works without changing the current Supabase table schema.

```


# File: docs/archive/PHASE7-9-COMBINED-NOTES.md

```md
# Phase 7–9 Combined Batch

## Included in this batch
- Dashboard real operational signals driven by services
- Reports expanded with collection summary, stage velocity, and recommendations
- Faster execution path by combining:
  - Phase 7 Batch 4: Dashboard + Reports real-data alignment
  - Phase 8: UX/operational polish for executive reading
  - Phase 9 (lightweight first pass): action-oriented recommendations and automation-style priorities

## Key improvements
- Dashboard now surfaces:
  - collection rate
  - schedule load
  - leads without next follow-up
  - booked vs attended trial snapshot
  - operational recommendations
  - fast execution cards
- Reports now surface:
  - collection summary
  - operational summary
  - stage velocity
  - recommended next moves

## Files changed
- src/types/crm.ts
- src/services/dashboard.service.ts
- src/services/reports.service.ts
- src/app/(dashboard)/page.tsx
- src/app/(dashboard)/reports/page.tsx

## Test after replace
- /
- /reports
- locale switch ar/en
- dashboard cards and quick action links
- reports summary cards and recommendations

```


# File: docs/archive/PHASE7-LEADS-FOLLOWUPS-NOTES.md

```md
# Phase 7 — Leads + Follow-ups (first real-data batch)

## What changed
- Added `CreateFollowUpInput` type in `src/types/crm.ts`
- Expanded `src/services/follow-ups.service.ts` to support:
  - `listFollowUpsByLead()`
  - `createFollowUp()`
  - smarter local/Supabase sync for linked leads
  - lead activity logging when follow-ups are created/completed/reopened
  - auto-updating `nextFollowUpAt` on the linked lead
  - stage-based default follow-up suggestions
- Updated `src/app/(dashboard)/leads/[id]/page.tsx` to include:
  - related follow-ups section
  - inline quick-create follow-up form
  - complete / reopen actions per follow-up
  - pipeline style build fix (`boxShadow` instead of invalid `ringColor`)
- Updated `src/types/database.types.ts` to include `Relationships: []` for current tables to avoid Supabase type narrowing issues in builds.

## Why this batch first
This is the safest Phase 7 entry point because Leads + Follow-ups are the operational core of the CRM. Once these two flows are solid, the same pattern can be applied to Students / Parents / Teachers / Payments / Schedule / Reports.

## Expected result
- Lead details now behaves more like a real operational CRM screen instead of a read-only profile.
- Follow-up actions affect both follow-up state and the linked lead's next follow-up field.
- Activity log becomes closer to the real operational timeline.

```


# File: docs/archive/PHASE8-9-ROLE-FILTERING-FIX-NOTES.md

```md
# Phase 8/9 Role Filtering Fix

## Fixed
- Notifications Bell now respects role scope more strictly.
- Ops users no longer receive sales-only alerts such as:
  - new leads waiting for response
  - overdue sales follow-ups
  - leads without next follow-up
  - trial confirmation alerts tied to sales pipeline
- Action Center keeps showing for ops, but with operational content instead of sales-heavy content.
- Dashboard signals, cards, quick actions, and recommendations are now role-aware.

## Updated files
- src/services/operations.service.ts
- src/services/dashboard.service.ts
- src/components/layout/top-navbar.tsx

## Expected result for Ops
- See: students at risk, overdue/due payments, today sessions, trial students, weekly load
- Do not see: sales pipeline alerts, lead follow-up pressure, lead cleanup tasks

## Expected result for Sales
- Still sees lead/follow-up pressure, pipeline-related signals, and sales execution alerts

## Expected result for Admin/Owner
- Continues to see the full cross-functional view

```


# File: docs/archive/PHASE-NEXT-NAV-CLEANUP-NOTES.md

```md
# Phase Next — Navigation Cleanup

## What changed
- Removed **Action Center / مركز العمليات** from the sidebar navigation.
- Kept the route `/action-center` available for access from:
  - notifications bell
  - dashboard quick actions
  - reports/action links

## Why
The Action Center is treated as an operational destination, not a primary sidebar section.
This keeps the sidebar cleaner while preserving fast access from contextual entry points.

```


# File: docs/archive/PHASE-NEXT-SECURITY-NOTES.md

```md
# Phase Next — Account Security

## Included in this batch
- Added a full password change section to Settings.
- Password update uses Supabase Auth `updateUser()` on the current logged-in account.
- Added password validation rules:
  - 8+ characters
  - contains letters
  - contains numbers
  - confirmation matches
- Added show/hide password toggles.
- Added operational security note explaining that the current session may need to be refreshed if expired.

## Updated file
- `src/app/(dashboard)/settings/page.tsx`

```


# File: docs/archive/PROJECT_CONTEXT.md

```md
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


```


# File: docs/CLIENT_ACCEPTANCE_CHECKLIST.md

```md
# Client Acceptance Checklist

## Must Pass

- Login works
- Leads can be created
- Students can be created
- Parents can be created
- Groups can be created
- Group teacher finance can be entered
- Payments can be created
- Covered sessions are manual
- Invoice opens
- Account Center opens
- Teacher Finance opens
- Teacher Finance uses group rate
- npm run check passes

```


# File: docs/CLIENT_HANDOFF.md

```md
# Client Handoff

Skidy Rein OS is ready for client handoff as a stable educational operations CRM.

## Included

- Leads
- Students
- Parents
- Groups
- Teachers
- Schedule
- Payments
- Invoices
- Account Center
- Teacher Finance
- Reports
- Role-based access

## Delivery Rule

Before client delivery, run:

npm run check

Expected:

- ESLint passes
- TypeScript passes
- Production build passes

```


# File: docs/CLIENT_TRAINING_GUIDE.md

```md
# Client Training Guide

## Sales

Daily:

1. Open Leads.
2. Add inquiries.
3. Add follow-ups.
4. Convert to students.
5. Create payments.
6. Review Account Center.

## Operations

Daily:

1. Open Groups.
2. Review active groups.
3. Check schedules.
4. Confirm teacher assignment.
5. Confirm student placement.

## Admin / Owner

Weekly:

1. Review payments.
2. Review Account Center.
3. Review teacher finance.
4. Review missing group pricing.
5. Review reports.

## Finance

1. Create payment manually.
2. Enter covered sessions.
3. Review Account Center.
4. Follow up before sessions run out.

```


# File: docs/DEMO_SCRIPT.md

```md
# Demo Script

## 1. Login
Show role-based access.

## 2. Leads
Show lead creation, follow-ups, and lead details.

## 3. Students and Parents
Show student profile, parent profile, and linking.

## 4. Groups
Show group creation, teacher assignment, students, and group teacher finance fields.

## 5. Payments
Show manual covered sessions, payment status, and invoice.

## 6. Account Center
Show collection queues: no payment, near renewal, needs renewal, overused, pending handoff, healthy.

## 7. Teacher Finance
Show that teacher payout comes from group rate.

```


# File: docs/FINAL_LOCK_SUMMARY.md

```md
# Skidy Rein OS — Final Project Lock

## Status

This project is now locked as a stable operational CRM for an educational center.

## Completed

- Leads management
- Students management
- Parents management
- Groups/classes management
- Teachers management
- Payments and invoices
- Manual collection tracking
- Account Center work queues
- Teacher finance from group-level rates
- Role-based access control
- Supabase RLS hardening
- Temporary read policies cleanup
- Production build stability

## Current Rule

No financial value should be calculated from hidden assumptions.

Teacher finance source of truth:

\\\	xt
classes.teacher_session_rate
classes.teacher_session_duration_minutes
classes.teacher_finance_notes
\\\

Manual collection source of truth:

\\\	xt
payments.sessionsCovered
payments.nextCollectionDueDate
payments.collectionStatus
payments.collectionNotes
\\\

## Final Checks

Before any release:

\\\ash
npm run check
\\\

Expected:

- 0 ESLint errors
- 0 ESLint warnings
- 0 TypeScript errors
- Successful Next.js production build

```


# File: docs/FINANCE_RULES.md

```md
# Finance Rules

## Teacher Finance

Teacher finance is calculated from group-level rates.

Formula:

\\\	xt
Teacher payout = taught sessions × group teacher session rate
\\\

The teacher profile is not the source of truth for payout.

## Why Group-Level Rates?

The same teacher can teach different courses, groups, and durations with different rates.

Examples:

- Python group: 60 min = 120 EGP
- Python group: 90 min = 180 EGP
- JavaScript group: 60 min = 150 EGP
- JavaScript group: 90 min = 200 EGP

## Missing Rate

If a group has no teacher rate:

- payout = 0
- matched = false
- the group needs pricing review

## Manual Collection

Collection is manual-first.

The system no longer forces payments into 8-session blocks.

Default covered sessions:

\\\	xt
4 sessions
\\\

Allowed:

\\\	xt
1 / 4 / 6 / 8 / 12 / any manually entered value
\\\

Account Center is a work queue. It should not auto-charge, auto-renew, or auto-create payments.

```


# File: docs/HOTFIX_LOG.md

```md
# Hotfix & Tech Debt Log

This file tracks features that bypassed the original Sprint plan
(usually due to urgent business needs) and the tech debt they introduced.
Every entry must reference a Sprint where it will be addressed.

---

## Format
[YYYY-MM-DD] Title
Type: Hotfix | Feature | DataRepair
Branch: name
Commits: abc123, def456
Reason for bypass: ...
Tech debt introduced: ...
Owed to: Sprint N

---

## Open Tech Debt Registry

| # | Description | Severity | Owed to |
|---|---|---|---|
| 2 | Per-payment currency in `payments.notes` JSON metadata | High | Sprint 2 |
| 3 | Mojibake in `src/lib/utils.ts` (`formatRelativeTime`) | Medium | Sprint 3 content batch |
| 4 | Mock-data WARNING in prod build | Low | Sprint 9 |
| 7 | Race condition in `generateInvoiceNumber` | High | Sprint 2 |
| 8 | `localStorage` caching stale data | Medium | Sprint 2 |
| 9 | Cascade delete `deleteStudent` non-atomic | High | Sprint 2 |
| 10 | `course_type` enum hardcoded | Low | Sprint 6 |
| 11 | No tests | Critical | Sprint 9 |
| 12 | `groups` URL = `classes` table naming confusion | Low | Sprint 4 |
| 13 | 4 centers in navigation confusing + weak naming | Low | Sprint 4 |
| 14 | Duplicate payments invoice paths | Low | Sprint 4 |
| 15 | Missing indexes on FK columns | Medium | Sprint 5 |
| 16 | Arabic content/i18n weak across system | Medium | Sprint 3 content batch |
| 17 | Mojibake in `schedule-entry-form.tsx` + `schedule/new/page.tsx` | Medium | Sprint 3 content batch |
| 18 | Student status data quality (87/87 = active, no audit process) | Medium | Sprint 5 |
| 19 | `completeGroupSessionSeries` error message hardcoded "8-session series" | Low | Sprint 3 |
| 20 | `daysUntil === 0` edge case in legacy fallback `createScheduleEntry` | Low | Sprint 3 |

### Closed

| # | Description | Closed | Commit |
|---|---|---|---|
| 1 | Line endings inconsistency in `relations.service.ts` | 2026-05-04 | `2b259d2` |
| 5 | Multi-tenant not implemented | Deferred to Sprint 6 | — |
| 6 | Hardcoded emails in `src/config/roles.ts` | Deferred to Sprint 6 | — |

---

## Changelog

---

### 2026-05-04 — Batch 3.9-3.14 (Sprint 3 UI Foundation)

**Type:** Planned UI
**Branches:** `sprint-3-batch-3.9-redo` through `sprint-3-batch-3.14-dashboard-home`
**HEAD at close:** `5188bfd`

#### What shipped

| Batch | Scope | Key commit |
|---|---|---|
| 3.2 | Design tokens (`globals.css`) | `623217f` |
| 3.3 | shadcn/ui base + 5 primitives | `c9d49cf` |
| 3.9 | 4 composites + `/students` redesign | `de9ec6a` |
| 3.9 | `.gitattributes` LF enforcement | `2b259d2` |
| 3.10 | `/teachers` + `/parents` + `/leads` | `525dbe1` |
| 3.11 | `/groups` | `74ae3c9` |
| 3.12 | `/payments` (minimal) | `a837051` |
| 3.13 | `/follow-ups` | `6ef6a7d` |
| 3.14 | `/page.tsx` dashboard home | `5188bfd` |

#### Tech debt closed this sprint

- **#1 Line endings** — `.gitattributes` forces LF for all text files,
  CRLF only for `*.ps1 / *.cmd / *.bat`. Closed `2b259d2`.

#### Lessons learned

1. **Mojibake files = full rewrite only.** String replacement on files
   with CP1252-encoded Arabic breaks silently. Always use
   `[System.IO.File]::WriteAllText` with Unicode escapes (`\uXXXX`).
2. **Financially complex pages get minimal approach.** `/payments` has
   invoice logic and currency handling — full redesign deferred to
   Sprint 2 currency migration (#2, #7).
3. **Audit before writing.** `TeacherListItem` fields differed from
   Handover docs. Always grep the real types first.

---

### 2026-05-03 — Sprint 3 batch (UI + multiple urgent features)

**Type:** Mixed (planned UI + 11 unplanned feature/fix commits)
**Branch:** `sprint-3-ui-foundation` -> merged to main (`dc677cf`)
**Reason for bypass:** Business features were needed in production
sooner than the Sprint plan permitted (group session tracking,
defer single session, complete-to-eight, move student between
groups, per-payment currency).

#### Tech debt introduced

2. **Per-payment currency stored in JSON metadata** (`payments.notes`
   under `__SKIDY_PAYMENT_META__:` prefix).
   - Cannot do `SUM(amount) GROUP BY currency` efficiently.
   - No RLS or indexes on currency.
   - **Owed to:** Sprint 2 — add `payments.currency text NOT NULL DEFAULT 'EGP'`
     column with backfill from metadata.

3. **Mojibake in `src/lib/utils.ts`**
   - `formatRelativeTime()` Arabic strings are broken UTF-8 (CP1252-encoded).
   - **Owed to:** Sprint 3 content rewrite batch.

4. **Mock-data WARNING printed during prod build**
   - Not a leak, but noisy.
   - **Owed to:** Sprint 9 — isolate mocks behind build-time flag.

#### Data repair performed

- 7 duplicate `classes` rows archived
- 7 duplicate `sessions` rows cancelled
- 0 deletes; original group `98208447-d445-43e4-b139-263efb1ed534` retained.
- Backup: `_ops/backups/20260503-015735-before-duplicate-groups-repair`

#### Manual QA at merge time (localhost)
- /groups: no duplicates ✓
- /groups/[id]: 8 sessions, defer single session works ✓
- /schedule/new with repeat: one group + 8 sessions ✓
- /payments/new: per-payment currency selector EGP/SAR works ✓
- Build: pass ✓

---

## Working agreement (effective 2026-05-03)

1. Urgent features go on `hotfix/...` or `feature/...` branches.
2. No data migration on production without staging tested first.
3. Every hotfix appends an entry to this log before merge.
4. A hotfix block is at most ~3 hours contiguous; longer scope pauses
   to re-plan against the Sprint roadmap.
```


# File: docs/KNOWN_LIMITATIONS.md

```md
# Known Limitations

## Not Multi-Tenant Yet

Before SaaS selling, add tenant isolation:

- organization_id
- tenant-aware RLS
- tenant-aware queries

## Teacher Portal Not Final

Future work:

- teacher schedule
- attendance actions
- own payout view
- limited teacher access

## Reporting Needs Expansion

Future reports:

- monthly revenue
- collection rate
- teacher payout
- student retention
- course profitability
- group profitability

## Notifications Need Expansion

Future:

- payment reminders
- follow-up reminders
- operations handoff reminders
- teacher schedule reminders

## Import/Export Needed

Future:

- CSV import
- Excel export
- payment export
- backup flow

## Encoding Cleanup

Some old Arabic source strings may contain mojibake from terminal encoding issues. Future cleanup should normalize Arabic strings.

## Tech Debt — Mock Data Removal (Sprint 1 Audit)

The following demo-data dependencies remain and should be replaced with
real Supabase queries in a later sprint (planned: Sprint 4 — Information
Architecture Fix).

### lead-form.tsx — uses MOCK_TEAM for sales rep dropdown
File: src/components/leads/lead-form.tsx
- Line 66: default `assignedTo` value
- Line 141: filtered list of sales reps shown in the form
- Line 207: lookup of the assignee display name

Replacement plan:
- Add `listSalesTeam()` in a new or existing service that queries
  `profiles` where `role = 'sales' AND is_active = true`.
- Update the form to load the team asynchronously.
- Verify RLS policy allows authenticated users to read team profiles
  (already added via migration 009 — `profiles_team_select`).

Until then, sales reps shown in the lead-form are seeded from
`src/lib/mock-data.ts` — this is acceptable internally because the UUID
that gets persisted to the DB is the authenticated user's own id (via
`resolveAssignedToUuid`), not the mock id. Only the display name is
sourced from mock data.
```


# File: docs/NEW-CHAT-PROMPT.txt

```txt
أنت Dev Partner Senior Full-Stack Developer خبير في Next.js 16 + TypeScript + Tailwind + Supabase.

المشروع: Skidy Rein OS
الهدف الحالي: استكمال المشروع بسرعة لكن بدون ترقيعات عشوائية.

قواعد العمل الإلزامية:
1) قبل أي تعديل، افترض أن المشكلة قد تكون من mismatch بين الكود والـ schema أو من artifact files دخلت داخل root المشروع.
2) لا ترسل ترقيعات متفرقة قبل أن تحدد الجذر الحقيقي للمشكلة.
3) عند أي خطأ build أو runtime:
   - حدد هل المشكلة من schema / types / exports / RLS / artifact folder / fallback demo logic.
   - اطلب أقل دليل تشخيصي ممكن.
4) إذا احتجت إصلاحًا، أرسل دائمًا:
   - ما المشكلة بالضبط
   - الملف/الملفات التي يجب استبدالها
   - أوامر التشغيل:
     npm run build
     npm run dev
   - وإذا اشتغل: أوامر الحفظ:
     git add -A
     git commit -m "..."
     git push origin main
5) لا تخلط أكثر من مشكلة في نفس الدفعة إلا إذا كانت مرتبطة مباشرة.
6) عند إرسال zip، تأكد أنه يحتوي فقط على الملفات المطلوبة داخل نفس المسارات الصحيحة، ولا يحتوي artifacts أو مجلدات إضافية داخل root.
7) افترض أن المستخدم يريد الحل العملي الأسرع، لكن مع دقة عالية.
8) إذا كان المشروع بطيئًا أو الشات طويلًا، ابدأ أولًا بتثبيت الحالة الحالية ثم أكمل.

ملخص ما حدث سابقًا في المشروع:
- كان هناك demo/mock fallback في بعض الخدمات، وتم إيقافه تدريجيًا ليظهر empty state الحقيقي بدل بيانات تجريبية.
- ظهرت مشاكل متكررة بسبب artifact folders / zip files دخلت داخل root المشروع وتسببت في build errors.
- ظهرت مشاكل schema mismatch في leads و schedule.
- جدول leads الحقيقي يحتوي parent_phone و parent_whatsapp وليس phone.
- تم التأكد أن حفظ lead صار يدخل في Supabase ويظهر في صفحة Leads.
- يوجد تعديلات قيد التثبيت حاليًا في:
  - src/services/leads.service.ts
  - src/services/schedule.service.ts
  - src/types/database.types.ts

أول شيء تفعله الآن في هذا الشات الجديد:
1) اطلب من المستخدم تشغيل inventory script أو إرسال ناتج أسماء الملفات الحالية في المشروع.
2) اطلب منه تأكيد آخر commit ونتيجة npm run build.
3) بعد ذلك فقط اقترح الإصلاح التالي.

إن احتجت inventory script، اطلب منه تشغيل:
  powershell -ExecutionPolicy Bypass -File .\scripts\project-inventory.ps1

وإن احتجت تنظيف artifacts، اطلب منه تشغيل:
  powershell -ExecutionPolicy Bypass -File .\scripts\cleanup-artifacts.ps1

المهمة التالية المرجحة بعد تثبيت الوضع الحالي:
- تثبيت build النهائي
- ثم مراجعة المدفوعات والفوترة والصلاحيات
- ثم إدخال البيانات الحقيقية

```


# File: docs/NEXT_DEVELOPMENT_BACKLOG.md

```md
# Next Development Backlog

## Priority 1

- Fix client feedback
- Improve Arabic text
- Improve empty states
- Improve mobile UX

## Priority 2

- Revenue reports
- Collection reports
- Teacher payout reports
- Lead conversion reports

## Priority 3

- Excel export
- CSV import
- Backup/export workflow

## Priority 4

- Payment reminders
- Follow-up reminders
- Operations handoff reminders

## Priority 5

- Branding configuration
- Template mode
- Multi-tenant support

```


# File: docs/OPERATIONS_PLAYBOOK.md

```md
# Operations Playbook

## Sales Daily Workflow

1. Open Leads.
2. Review new leads.
3. Add follow-ups.
4. Convert qualified leads into students/parents.
5. Create payment manually.
6. Review Account Center.

## Operations Daily Workflow

1. Open Groups.
2. Review active groups.
3. Check schedules.
4. Confirm teacher assignment.
5. Confirm students are attached to groups.
6. Track attendance.
7. Review pending handoff.

## Group Creation

1. Create group.
2. Select course.
3. Select teacher.
4. Add students.
5. Enter manual teacher finance:
   - duration
   - rate
   - notes
6. Save.

## Payment Creation

1. Select student.
2. Enter amount.
3. Set status.
4. Enter covered sessions.
5. Add notes.
6. Save payment.
7. Use Account Center for follow-up.

## Account Center Queues

- No payment
- Near renewal
- Needs renewal
- Overused
- Pending operations handoff
- Healthy

```


# File: docs/QA_CHECKLIST.md

```md
# QA Checklist

## Automated

Run:

\\\ash
npm run check
\\\

## Manual Smoke Test

### Auth

- Login works
- Logout works
- Unauthorized pages are blocked

### Leads

- Create lead
- Edit lead
- Open lead details
- Add follow-up

### Students

- Create student
- Edit student
- Open student profile
- Confirm student appears in students page

### Parents

- Create parent
- Edit parent
- Confirm linked children

### Groups

- Create group
- Add teacher
- Add students
- Add manual teacher finance:
  - duration
  - rate
  - notes
- Open group details
- Edit group finance
- Confirm changes persist

### Payments

- Create payment with 4 covered sessions
- Create payment with 12 covered sessions
- Confirm system does not force 8-session blocks
- Open payment details
- Open invoice

### Account Center

- Confirm covered sessions display
- Confirm used sessions display
- Confirm remaining sessions display
- Confirm overused students appear
- Confirm no-payment students appear
- Confirm manual collection due/status/notes appear if available

### Teacher Finance

- Create/use group with teacher rate
- Confirm teacher finance uses group rate
- Confirm missing group rate appears as unmatched/needs pricing

### Roles

Test:

- owner
- admin
- sales
- ops

Each role should only access allowed pages.

```


# File: docs/RELEASE_NOTES.md

```md
# Release Notes

## Stable Client Handoff Build

Completed:

- RLS hardening
- Temporary read policy cleanup
- Manual collection
- Account Center work queues
- Group-level teacher finance
- Teacher finance from group rates
- Payment covered sessions no longer forced to 8
- Final QA documentation

## Finance Rule

Teacher payout = taught sessions x group teacher session rate

## Collection Rule

Covered sessions are manually entered.
Default is 4.

## Recommended Next Phase

- Real client QA
- UI polish
- Reports expansion
- Import/export
- Teacher portal
- Multi-tenant template version

## Sprint 1 — Quick Wins (Code Hardening)

Date: see git log
Branch: sprint-1-cleanup → main

This sprint focused on safe, code-only improvements. No database
migrations, no schema changes, no breaking API changes.

### Batch 1.1 — Repository Cleanup
- Archived 10 historical phase notes to `docs/archive/`
- Removed backup files (page.backup.tsx, *.bak)
- Removed duplicate `supabase/client.ts` (kept `src/lib/supabase/client.ts`)
- Removed `password_note_fix/` leftover folder
- Removed dev scan artifacts

### Batch 1.2 — Security Hotfixes
- `auth.ts`: removed dangerous fallback to `owner` role on profile failure;
  now returns `null` and triggers a redirect to login
- `auth.ts`: removed user emails and roles from console logs (PII protection)
- `leads.service.ts`: relaxed `isUuid` regex to accept any valid UUID format
  (supports v4 from Supabase + future v7)

### Batch 1.3 — Mojibake Fix
Repaired 357 mis-encoded Arabic strings (UTF-8 read as Windows-1252)
across 5 service files:
- teachers, student-enrollment-control, parents, payments, schedule

User-facing impact: error toasts and default labels now render readable
Arabic instead of garbled text.

### Batch 1.4 — Mock Data Isolation
- Removed silent `MOCK_TEACHERS` fallback in `teachers.service.mapRow`
- Removed silent `MOCK_TEAM` fallback in `leads.service.createLead`
- Added a production warning guard at the top of `src/lib/mock-data.ts`
- Documented remaining tech debt in `docs/KNOWN_LIMITATIONS.md`
  (`lead-form.tsx` still uses `MOCK_TEAM` for the dropdown — Sprint 4)

### Verification
- `npm run check`: 0 ESLint errors, 0 warnings, TypeScript clean
- Production build: 42 routes generated successfully
- DB precheck: 0 orphan auth users, 0 invalid roles in profiles

### Production deployment notes
The `auth.ts` change will sign out any session whose Supabase user has
no profile row or has an invalid role. Verified safe via SQL precheck
before merge.

No DB migration required. Safe to deploy directly to main.

```


# File: README.md

```md
# Skidy Rein OS

لوحة تحكم CRM عربية (RTL) لأكاديمية Skidy Rein لتعليم البرمجة للأطفال أونلاين.

## ما الذي تم في هذه الحزمة؟
- توحيد الترجمات والحالات داخل `src/config/labels.ts`
- إضافة metadata مركزية للألوان والحالات داخل `src/config/status-meta.ts`
- إصلاح `database.types.ts` وتحويله لملف UTF-8 صحيح بدل placeholder معطوب
- إنشاء طبقة خدمات قابلة للتوسعة:
  - `src/services/leads.service.ts`
  - `src/services/follow-ups.service.ts`
  - `src/services/students.service.ts`
  - `src/services/reports.service.ts`
  - `src/services/dashboard.service.ts`
- تحويل صفحات `dashboard / leads / lead details / follow-ups / students / reports` لاستخدام نفس الطبقة
- تشغيل fallback محلي عبر `localStorage` بحيث يستمر النظام بالعمل حتى لو تعطل الاتصال بـ Supabase أو لم تكتمل الـ schema بعد
- إضافة quality gates:
  - `npm run typecheck`
  - `npm run check`
  - GitHub Actions workflow داخل `.github/workflows/ci.yml`

## المبدأ الحالي
المشروع الآن ليس Demo صِرف، وليس Production مكتمل 100%.
هو الآن في مرحلة **Foundation + Realistic Data Flow**:
- يقرأ من Supabase إذا كان الجدول/الأعمدة متاحة
- ويرجع تلقائياً إلى `localStorage + mock data` عند الفشل

هذا يسمح لك بالتطوير التدريجي بدون كسر الواجهة كل مرة.

## التشغيل المحلي
```bash
npm install
npm run dev
```

## فحص الجودة قبل أي push
```bash
npm run typecheck
npm run build
```
أو:
```bash
npm run check
```

## الملفات الأهم للمرحلة القادمة
- `src/config/labels.ts`
- `src/config/status-meta.ts`
- `src/services/leads.service.ts`
- `src/services/follow-ups.service.ts`
- `src/services/dashboard.service.ts`
- `src/services/reports.service.ts`

## المرحلة القادمة المقترحة
1. ربط أعمدة Supabase الحقيقية 1:1 بعد استخراج schema النهائي.
2. بناء Add/Edit Lead على جداول حقيقية بالكامل.
3. إنشاء Activity Timeline كامل من قاعدة البيانات.
4. تحويل Payments وParents وTeachers لنفس طبقة الخدمات.
5. إضافة Server Actions أو Route Handlers للوصول الأكثر أماناً.

```


# Quality Checks
# Quality Checks
Generated at: 2026-05-15 16:36:38

Mode: Running lint/typecheck/build when available.


## npm run lint

Command:
```powershell
npm run lint
```

Output:
```text

> skidy-rein-os@1.0.0 lint
> eslint .


```


## npm run typecheck

Command:
```powershell
npm run typecheck
```

Output:
```text

> skidy-rein-os@1.0.0 typecheck
> tsc --noEmit


```


## npm run build

Command:
```powershell
npm run build
```

Output:
```text

> skidy-rein-os@1.0.0 build
> next build

▲ Next.js 16.2.2 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 6.4s
  Running TypeScript ...
  Finished TypeScript in 10.0s ...
  Collecting page data using 11 workers ...
  Generating static pages using 11 workers (0/27) ...
  Generating static pages using 11 workers (6/27) 
  Generating static pages using 11 workers (13/27) 
  Generating static pages using 11 workers (20/27) 
✓ Generating static pages using 11 workers (27/27) in 412ms
  Finalizing page optimization ...

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /account-center
├ ƒ /action-center
├ ƒ /follow-ups
├ ƒ /groups
├ ƒ /groups/[id]
├ ƒ /groups/[id]/edit
├ ƒ /groups/[id]/report/[studentId]
├ ƒ /groups/new
├ ƒ /leads
├ ƒ /leads/[id]
├ ƒ /leads/[id]/edit
├ ƒ /leads/new
├ ○ /login
├ ƒ /operations-center
├ ƒ /ownership-center
├ ƒ /parents
├ ƒ /parents/[id]
├ ƒ /parents/[id]/edit
├ ƒ /parents/new
├ ƒ /payments
├ ƒ /payments/[id]
├ ƒ /payments/[id]/edit
├ ƒ /payments/[id]/invoice
├ ƒ /payments/invoice/[id]
├ ƒ /payments/new
├ ƒ /reports
├ ƒ /schedule
├ ƒ /schedule/[id]
├ ƒ /schedule/new
├ ƒ /settings
├ ƒ /students
├ ƒ /students/[id]
├ ƒ /students/[id]/edit
├ ƒ /students/[id]/report
├ ƒ /students/new
├ ƒ /teachers
├ ƒ /teachers/[id]
├ ƒ /teachers/[id]/edit
├ ƒ /teachers/finance
└ ƒ /teachers/new


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand


```

# AI Review Instructions for Next Model

Treat this project as:
1. A real internal operating system for Skidy Rein Academy.
2. An Arabic-first CRM / Operations OS for educational centers.
3. A possible Nexo productized service or future SaaS.
4. A project that may be merged with another project, requiring careful product/domain/data-model comparison.

Important product questions:
- Is Lead to Student explicit and safe?
- Are Students and Parents linked correctly?
- Are Follow-ups operationally useful?
- Are Payments and Invoices clear?
- Is Groups / Classes / Centers naming consistent?
- Is Navigation understandable for non-technical Arabic users?
- Does Dashboard answer growth, revenue, and operations questions?
- What must be fixed before client delivery?
- What must be postponed until after internal workflow stability?
- What must be abstracted before SaaS or project merge?

Important technical questions:
- Is production data protected?
- Are auth/RLS/payments/students/leads/parents/groups safe?
- Are there duplicate routes?
- Are there hidden legacy flows?
- Are there missing tests around critical flows?
- Are there route naming issues?
- Are there hardcoded Skidy-specific assumptions?
- What would break if this became multi-tenant?
- What would break if merged with another project?