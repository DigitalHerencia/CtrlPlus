---
description: Feature/component layer purity audit. Finds and corrects drift where features/** and components/** have absorbed responsibilities that violate the documented architecture.
---

# POST-REFACTOR ENFORCEMENT PROMPT — FEATURES AND COMPONENTS: KEEP IT REAL

You are performing a feature/component layer purity audit.

## Mission

Find and correct drift where `features/**` and `components/**` have absorbed responsibilities that violate the documented architecture.

## Canonical rules to enforce

- `features/**` owns domain view orchestration.
- `components/**` owns reusable UI composition.
- `components/ui/**` contains primitive UI building blocks only.
- Feature layer handles composition of fetchers, actions, and UI blocks.
- Features own interaction-heavy flows that require client components.
- UI components do not directly perform Prisma access or ownership decisions.

## Audit objectives

1. Find features that became generic shared component libraries.
2. Find features calling Prisma or provider SDKs directly.
3. Find components doing authz, ownership decisions, or persistence.
4. Find `components/ui/**` polluted with domain semantics.
5. Find client components that should be server components.
6. Find server-only logic drifting into presentation blocks.
7. Find duplicate UI patterns that should be promoted to shared reusable blocks.

## Correction rules

- Keep orchestration in features.
- Keep reusable presentation in components.
- Keep primitives in `components/ui/**` only.
- Move server authority back into fetchers/actions.
- Reduce client component sprawl where server-first rendering is sufficient.
- Preserve UX behavior while restoring boundaries.

## Deliverables

1. Apply the corrective changes.
2. Output a concise changelog grouped by:
   - Feature orchestration fixes
   - Component purity fixes
   - `components/ui` cleanup
   - Server/client boundary fixes
3. Output any unresolved places where UX requirements genuinely justify a heavier client surface.

## Verification checklist

- Features orchestrate, not persist
- Components render, not govern
- `components/ui/**` stays primitive
- No Prisma or authz in presentational UI
- Server-first bias preserved
