# Admin Domain Spec

## Goal

Refactor the owner admin surface into a focused operational dashboard and quick-action workspace aligned with the target server-first architecture.

## Current repo anchors

- `app/(tenant)/admin/**`
- `components/admin/**`
- `components/shared/tenant-elements.tsx`
- `components/shared/tenant-nav-config.ts`
- `components/shared/tenant-sidebar.tsx`
- `lib/actions/admin.actions.ts`
- `lib/fetchers/admin.fetchers.ts`
- `lib/fetchers/catalog.fetchers.ts`
- `lib/fetchers/scheduling.fetchers.ts`
- `lib/db/transactions/billing.transactions.ts`
- `lib/auth/**`
- `lib/authz/**`

## Main requirements

- improve owner dashboard usefulness
- expose owner-scoped operational visibility without duplicating domain rules
- align quick actions and tenant navigation with actual capabilities
- keep owner-only access strict and server-enforced
- prepare the admin route for thin page orchestration and feature-owned composition

## Key implementation points

- keep admin reads in `lib/fetchers/admin.fetchers.ts` or compose from other domain fetchers instead of duplicating business logic
- keep admin mutations narrow and server-side when they are truly admin-specific
- keep route entrypoints thin and move dashboard orchestration into `features/admin/**` during the actual refactor
- use admin to summarize catalog, scheduling, and billing state, not to reimplement those domains
- keep capability-aware navigation and quick actions aligned with shared tenant shell components

## UX requirements

- the dashboard should surface useful metrics and next actions instead of placeholder stats
- quick actions should map to real owner workflows
- empty, loading, permission-denied, and error states must be explicit
- admin pages should feel operationally cohesive without turning into a noisy catch-all

## Security/performance focus

- protect owner-only surfaces server-side
- do not trust the client to decide what owner actions are available
- avoid monolithic dashboard queries when smaller domain reads are sufficient
- preserve platform-admin separation for privileged operational tooling

## Acceptance signals

- admin routes, shared shell surfaces, and server helpers have a clear ownership boundary
- the owner dashboard is useful and capability-aware
- admin does not duplicate business rules from billing, catalog, or scheduling
- owner access boundaries remain explicit and testable
