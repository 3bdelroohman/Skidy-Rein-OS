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