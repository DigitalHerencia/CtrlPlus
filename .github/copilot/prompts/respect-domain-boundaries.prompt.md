---
description: Domain-boundary audit and corrective refactor pass. Finds and corrects places where code drifted away from documented domain ownership, layer boundaries, or server-first architecture.
---

# POST-REFACTOR ENFORCEMENT PROMPT — R-E-S-P-E-C-T MY DOMAIN BOUNDARIES

You are performing a domain-boundary audit and corrective refactor pass on this CtrlPlus codebase.

## Mission

Find and correct any places where the refactor drifted away from the documented domain ownership model, layer boundaries, or server-first architecture.

## Canonical rules to enforce

- `app/**` is orchestration-only.
- `features/**` owns domain view orchestration.
- `components/**` owns reusable UI composition.
- `components/ui/**` contains primitive UI building blocks only.
- `lib/fetchers/**` is read authority.
- `lib/actions/**` is write authority.
- `schemas/**` provides runtime validation contracts.
- `types/**` provides DTO and shared type contracts.
- Do not allow ad hoc domain coupling that bypasses server boundaries.
- Domain ownership must remain explicit:
  - Catalog owns wrap product and asset readiness.
  - Visualizer owns preview generation lifecycle.
  - Scheduling owns availability and booking lifecycle.
  - Billing owns invoicing/payment flows.
  - Admin and platform own privileged operations and diagnostics.

## Audit objectives

1. Find cross-domain leakage where one domain improperly owns logic belonging to another.
2. Find boundary violations where code is placed in the wrong layer.
3. Find route/page files doing business logic, DTO shaping, Prisma access, or mutation logic.
4. Find features that became generic shared UI dumping grounds.
5. Find components that own business semantics, authz decisions, or server data access.
6. Find domain logic implemented in the wrong domain folder.
7. Find duplicated domain contracts or route semantics that should be consolidated.

## Correction rules

- Move read logic into canonical `lib/fetchers/{domain}`.
- Move write logic into canonical `lib/actions/{domain}`.
- Move validation into `schemas/{domain}.schemas.ts`.
- Move DTO contracts into `types/{domain}.types.ts`.
- Thin `page.tsx` files aggressively.
- Keep domain-specific orchestration in `features/**`.
- Keep `components/**` presentational and reusable.
- Do not invent a new architecture.
- Do not rename large parts of the repo unless required to restore documented boundaries.
- Prefer minimal, targeted code movement with preserved behavior.

## Deliverables

1. Apply the needed code changes.
2. Output a concise changelog grouped by:
   - Domain ownership fixes
   - Layer boundary fixes
   - Route thinning fixes
   - Component purity fixes
3. Output a "remaining risk" section listing anything suspicious that could not be safely corrected without broader product decisions.

## Verification checklist

- No business logic in `app/**`
- No Prisma in `app/**`, `features/**`, or `components/**`
- No domain blocks in `components/ui/**`
- No cross-domain ownership drift
- Reads route through fetchers
- Writes route through actions
- DTOs and schemas live in canonical locations
