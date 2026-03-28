---
description: 'Domain instructions for owner admin dashboard and operational quick actions'
applyTo: 'app/(tenant)/admin/**,components/admin/**,lib/actions/admin.actions.ts,lib/fetchers/admin.fetchers.ts,components/shared/tenant-elements.tsx,components/shared/tenant-nav-config.ts,components/shared/tenant-sidebar.tsx'
---

# Admin Domain Instructions

## Domain purpose

The admin domain owns the owner-facing dashboard, operational quick actions, and shared owner workflow entry points that summarize other domains without reimplementing them.

## Scope boundaries

This domain owns:

- owner dashboard pages
- owner-scoped operational summaries
- quick actions that route into catalog, scheduling, billing, and settings
- owner-aware shared shell surfaces when they are specific to dashboard or navigation behavior

This domain does not own:

- catalog business rules
- scheduling lifecycle logic
- billing lifecycle logic
- platform-admin diagnostics and recovery tooling
- auth and capability policy implementation

## Required patterns

- Keep `app/(tenant)/admin/**` thin and orchestration-focused.
- Future refactors should move admin composition into `features/admin/**`.
- Compose admin from `lib/fetchers/admin.fetchers.ts` and existing domain fetchers instead of duplicating business logic.
- Keep owner-only mutations server-side and narrow.
- Shared tenant navigation or shell changes must remain capability-aware.

## Security requirements

- Enforce owner or platform-admin access server-side.
- Never trust the client to decide which owner controls are allowed.
- Keep platform-admin-only tooling out of owner admin surfaces.
- Preserve auth/authz ownership in `lib/auth/**` and `lib/authz/**`.

## Product requirements

- Admin should surface useful operational metrics and next actions.
- Admin should reflect real owner workflows, not placeholder statistics.
- Quick actions should route cleanly into domain workflows without duplicating them.
- Shared shell navigation should reflect actual capabilities and product structure.

## UI requirements

- Dashboard UI should be high-signal and easy to scan.
- Empty, error, loading, and permission-denied states must be explicit.
- Quick actions should be clearly labeled and capability-aware.
- Avoid turning the dashboard into a noisy catch-all surface.

## Performance requirements

- Avoid monolithic queries for dashboard data.
- Prefer focused summaries with explicit DTOs.
- Keep admin reads server-side and small enough for responsive first render.

## Testing requirements

Add or update tests when changing:

- owner dashboard stats or summaries
- owner dashboard access rules
- shared tenant navigation behavior
- owner quick-action visibility

## Refactor priorities

1. make the owner dashboard genuinely useful
2. keep admin focused on summaries and routing, not duplicated domain logic
3. align owner navigation with real capabilities
4. preserve strict owner access boundaries
5. improve owner-surface coverage in unit and end-to-end tests
