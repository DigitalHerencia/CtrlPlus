## System design summary

CtrlPlus follows a server-first Next.js App Router architecture with explicit
domain boundaries and security-first mutation flows.

## Core principles

- `app/**` is orchestration-only.
- `features/**` owns domain view orchestration.
- `components/**` owns reusable UI composition.
- `components/ui/**` contains primitive UI building blocks.
- `lib/fetchers/**` is read authority.
- `lib/actions/**` is write authority.
- `schemas/**` provides runtime validation contracts.
- `types/**` provides DTO and shared type contracts.

## Layer boundaries

### Route and orchestration layer

- `app/(auth)/**` and `app/(tenant)/**` define route shells and segment behavior.
- Pages should stay thin and delegate work to `features/**` and server layers.

### Feature layer

- Handles composition of fetchers, actions, and UI blocks for each domain.
- Owns interaction-heavy flows that require client components.

### UI layer

- Domain components render data and controls.
- UI components do not directly perform Prisma access or ownership decisions.

### Server authority layer

- Fetchers perform tenant-safe reads and shape DTOs.
- Actions perform authenticated/authorized writes and revalidation.

## Mutation pipeline

All sensitive write flows should follow:

1. Authenticate user session.
2. Authorize capability/role/ownership.
3. Validate input with Zod schema.
4. Execute mutation in domain action/transaction boundary.
5. Record audit data where applicable.
6. Revalidate cache tags/paths.

## Caching and revalidation

- Place cache strategy in server read paths, not in presentational components.
- Invalidate cache after successful mutations using domain-appropriate tags/paths.
- Keep freshness policies explicit for billing/payment and other real-time flows.

## Domain ownership model

- Catalog owns wrap product and asset readiness.
- Visualizer owns preview generation lifecycle.
- Scheduling owns availability and booking lifecycle.
- Billing owns invoicing/payment domain flows.
- Admin and platform own privileged operations and diagnostics.

## Security boundaries

- Keep auth and authz server-side (`lib/auth/**`, `lib/authz/**`).
- Never trust tenant, role, or ownership claims from client input.
- Validate all mutation payloads at server boundary.

## App Router implementation guidance

- Prefer Server Components by default.
- Use client components only for interaction-heavy experiences.
- Keep route-level `loading.tsx` and `error.tsx` focused on UX resilience.

## Canonical placement guidance

- New read logic: `lib/fetchers/{domain}`.
- New write logic: `lib/actions/{domain}`.
- New schemas: `schemas/{domain}.schemas.ts`.
- New domain contracts: `types/{domain}.types.ts`.
