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
