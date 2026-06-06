# Read Me First — Skidy Rein OS AI Handover Pack

This folder contains a generated handover pack for Skidy Rein OS.

Recommended reading order for another AI model:

1. PROJECT_FULL_HANDOVER_CURRENT.md
2. SOURCE_SNAPSHOT_MASKED.md
3. ROUTES_AND_APP_STRUCTURE.md
4. PRODUCT_AND_DOMAIN_SIGNALS.md
5. GIT_STATE.md
6. QUALITY_CHECKS.txt
7. PROJECT_TREE.txt

Important assumptions:
- PROJECT_MEMORY_CURRENT.md is treated as the primary source of truth if present.
- Older handovers are archival unless referenced by PROJECT_MEMORY_CURRENT.md.
- Production data is real/live.
- Main branch may auto-deploy through Netlify.
- Do not suggest destructive migrations without backup/staging/rollback plan.

This pack intentionally excludes:
- .env files
- node_modules
- .next
- .git internals
- build artifacts
- binary assets
- production data