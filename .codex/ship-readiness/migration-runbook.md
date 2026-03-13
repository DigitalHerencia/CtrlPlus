# Neon Migration Runbook

## Required Flow
1. Implement schema in `prisma/schema.prisma` + migration SQL under `prisma/migrations`.
2. Use Neon MCP `prepare_database_migration` against project `falling-tooth-18064652`.
3. Validate temporary branch with `run_sql`:
   - expected columns
   - expected indexes/constraints
   - backfill row counts and null checks
4. Request explicit approval before `complete_database_migration`.
5. Apply migration to parent branch and re-verify.

## Safety Checks
- Avoid long exclusive locks where possible.
- Use idempotent SQL (`IF EXISTS` / `IF NOT EXISTS`) where applicable.
- Capture rollback notes before applying.

## Current Planned Sequence
1. Asset metadata fields on `WrapImage`.
2. Ownership/source fields on `VisualizerPreview`.
3. Partial unique index on active `WrapCategory.slug`.
