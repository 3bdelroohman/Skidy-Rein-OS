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

text

---

## 2026-05-03 — Sprint 3 batch (UI + multiple urgent features)

**Type:** Mixed (planned UI + 11 unplanned feature/fix commits)
**Branch:** sprint-3-ui-foundation -> merged to main (dc677cf)
**Reason for bypass:** Business features were needed in production
sooner than the Sprint plan permitted (group session tracking,
defer single session, complete-to-eight, move student between
groups, per-payment currency).

### Tech debt introduced:

1. **Per-payment currency stored in JSON metadata** (in `payments.notes`
   under `__SKIDY_PAYMENT_META__:` prefix).
   - Conflicts with the goal of *removing* JSON-in-notes patterns.
   - Cannot do `SUM(amount) GROUP BY currency` efficiently.
   - No RLS or indexes on currency.
   - **Owed to:** Sprint 2 — add `payments.currency text NOT NULL DEFAULT 'EGP'`
     column with backfill from metadata.

2. **Mojibake in `src/lib/utils.ts`**
   - `formatRelativeTime()` Arabic strings ("الآن", "قبل X دقيقة") are
     broken UTF-8 (CP1252-encoded).
   - **Owed to:** Sprint 3 content rewrite batch.

3. **Mock-data WARNING printed during prod build**
   - Mock data module still imported even when `ALLOW_DEMO_FALLBACK=false`.
   - Not a leak (the warning fires only if explicitly enabled), but noisy.
   - **Owed to:** Sprint 9 (Testing Foundation) — isolate mocks behind
     a build-time flag or split into dev-only module.

4. **Repeat-session flow used `createScheduleEntry` in a loop**
   - Created 7 duplicate active groups in production.
   - Fixed in commit 9dddca5; data repaired with 7 archives + 7 cancels.
   - Backup: `_ops/backups/20260503-015735-before-duplicate-groups-repair`
   - **Status:** RESOLVED. No further owed work.

### Data repair performed (read-only audit -> backup -> repair):

- 7 duplicate `classes` rows archived (`classes_archived = 7`)
- 7 duplicate `sessions` rows cancelled (`duplicate_sessions_cancelled = 7`)
- 0 deletes; original group `98208447-d445-43e4-b139-263efb1ed534` retained.

### Manual QA at merge time (localhost):
- /groups: no duplicates ✓
- /groups/[id]: 8 sessions, defer single session works ✓
- /schedule/new with repeat: one group + 8 sessions ✓
- /payments/new: per-payment currency selector EGP/SAR works ✓
- Build: pass ✓

---

## Working agreement (effective 2026-05-03)

Going forward:
1. Urgent features go on `hotfix/...` or `feature/...` branches, not on
   the active Sprint branch.
2. No data migration on production without staging tested first.
3. Every hotfix appends an entry to this log before merge.
4. A hotfix block is at most ~3 hours of contiguous work; longer scope
   pauses to re-plan against the Sprint roadmap.