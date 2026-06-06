# Git State
Generated at: 2026-05-15 16:25:58


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
