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
