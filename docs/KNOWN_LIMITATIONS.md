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