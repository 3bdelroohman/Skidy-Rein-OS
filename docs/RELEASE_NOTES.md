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
