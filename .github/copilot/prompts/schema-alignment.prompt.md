---
description: Data-model and Prisma alignment audit. Finds and corrects drift between the codebase, Prisma schema expectations, DTO contracts, fetcher/action assumptions, and migration safety rules.
---

# POST-REFACTOR ENFORCEMENT PROMPT — NEON TABLES DON'T LIKE VIBES, THEY LIKE VALID SCHEMAS

You are performing a data-model and Prisma alignment audit.

## Mission

Find and correct drift between the current codebase, Prisma schema expectations, DTO contracts, fetcher/action assumptions, and migration safety rules.

## Canonical rules to enforce

- Prisma schema is the source of truth for persisted entities.
- PostgreSQL is the persistent store.
- DTOs exposed to UI should be explicit and minimal.
- Mutations should be validated before touching persistence.
- Tenant boundaries must be enforced server-side for reads and writes.
- Favor additive, backward-compatible changes when possible.
- Use explicit migrations and review SQL impact.
- Avoid dropping/renaming critical fields without a staged transition plan.

## Audit objectives

1. Find code assumptions that do not match the Prisma schema.
2. Find stale DTOs that no longer match persisted fields or lifecycle states.
3. Find fetchers/actions relying on missing, renamed, nullable, or invalid fields.
4. Find tenant-scoped entities missing tenant enforcement in reads/writes.
5. Find migrations or schema changes that look unsafe, destructive, or incomplete.
6. Find places where UI contracts expose too much of the raw persisted model.
7. Find invalid schema assumptions around relations, enum-like status fields, and optional data.

## Correction rules

- Align DTOs, actions, fetchers, and schemas with the current Prisma source of truth.
- Prefer minimal additive fixes over destructive rewrites.
- Tighten nullability handling where the schema requires it.
- Restore tenant scoping in all relevant entities.
- Update code contracts to reflect actual lifecycle states and relationships.
- If a destructive schema issue is discovered, do not guess. Isolate it and report it clearly.

## Deliverables

1. Apply safe corrective changes in code.
2. Output a concise changelog grouped by:
   - DTO/schema alignment fixes
   - Fetcher/action persistence fixes
   - Tenant-scoping fixes
   - Migration safety concerns
3. Output a "schema risk register" listing anything that likely needs a staged migration plan instead of an immediate change.

## Verification checklist

- Prisma remains source of truth
- Code assumptions match schema reality
- Tenant boundaries are preserved
- DTOs are minimal and explicit
- No unsafe blind schema rewrites
