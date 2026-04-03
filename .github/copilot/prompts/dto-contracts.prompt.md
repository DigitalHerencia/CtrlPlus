---
description: DTO and data contract purity audit. Eliminates raw Prisma leakage, normalizes DTOs, and ensures UI contracts are explicit, minimal, and stable.
---

# POST-REFACTOR ENFORCEMENT PROMPT — DTO DIRTY TO ME

You are performing a DTO and data contract purity audit.

## Mission

Eliminate raw Prisma leakage, normalize DTOs, and ensure UI contracts are explicit, minimal, and stable.

## Canonical rules to enforce

- DTOs must be explicit and minimal.
- UI must not consume raw Prisma models.
- DTOs belong in `types/**`.
- Fetchers shape DTOs.
- Dates, enums, and nullability must be consistent.

## Audit objectives

1. Find raw Prisma objects passed to UI.
2. Find DTOs that mirror entire DB tables unnecessarily.
3. Find inconsistent date handling (Date vs string).
4. Find enum/string drift across domains.
5. Find nullability mismatches between schema and UI.
6. Find duplicated or conflicting DTO definitions.

## Correction rules

- Create explicit DTOs per use case.
- Strip unused fields.
- Normalize timestamps (usually ISO string).
- Normalize status fields across domains.
- Ensure DTOs match schema reality.

## Deliverables

- Apply DTO normalization.
- Output grouped changes:
  - Prisma leakage fixes
  - DTO shape reductions
  - Type consistency fixes
- Output "contract drift risks".

## Verification checklist

- UI only consumes DTOs
- No raw Prisma types in components
- Consistent timestamps and enums
- DTOs match schema, not vibes
