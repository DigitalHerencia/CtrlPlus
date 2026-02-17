# AGENTS.md

## Purpose

This repo is a **subdomain-based multi-tenant** Next.js App Router application for a vehicle wrap business platform. Agents must follow strict architectural boundaries for security, performance, and testability.

## Non-negotiable rules

1. **No Prisma usage in `app/`**
   All DB reads go through `lib/server/fetchers/**`. All writes go through `lib/server/actions/**`.

2. **Tenant isolation is enforced server-side**
   Tenant is resolved from the request host/subdomain. Never accept `tenantId` from the client.

3. **Clerk orgs are NOT used**
   Use Clerk universal components for sign-in/up/out and the Clerk user menu component. Authorization is custom RBAC with tenant membership.

4. **RSC-first**
   Default to React Server Components. Use client components only when necessary (forms, interactive visualizer UI).

5. **Feature-first DDD**
   Business logic lives in `features/**` as pure functions/use-cases. UI is composed from shadcn primitives.

6. **Security gates everywhere**

   * Validate inputs with Zod in server actions.
   * Verify permissions in fetchers/actions.
   * Stripe webhooks must be signature-verified + idempotent.

7. **Testing is mandatory**

   * New logic must include unit tests.
   * New fetchers/actions must include integration tests.
   * Critical flows require Playwright e2e coverage.

## Required project conventions

### Directory conventions

* `app/`: routes, layouts, pages, route handlers only
* `features/`: domain modules and use-cases
* `lib/server/fetchers/`: read-only DB access
* `lib/server/actions/`: write-only mutations (server actions)
* `components/ui/`: shadcn components only (no business logic)
* `prisma/`: schema + migrations
* `tests/`: unit/integration/e2e

### Code conventions

* TypeScript strict mode.
* Prefer explicit DTOs returned from fetchers (no raw Prisma models).
* Each server action must:

  1. resolve tenant from host,
  2. check auth + permissions,
  3. validate input,
  4. perform mutation,
  5. return minimal output,
  6. write an audit event if relevant.

### Auth & tenancy helpers (expected patterns)

* `requireAuth()` returns `{ userId, clerkUserId }` or throws.
* `requireTenant()` returns `{ tenantId, tenantSlug }` from host.
* `requirePermission(permission, { tenantId, userId })` throws on violation.
* `assertTenantScope(tenantId, recordTenantId)` for defensive checks.

## ExecPlans

When writing complex features or significant refactors, use an ExecPlan (as described in .agent/PLANS.md) from design to implementation.

## How to implement changes (agent workflow)

When asked to implement a feature, follow this order:

1. **Update domain types/schemas**

   * Add/adjust Zod schemas in `lib/shared/schemas/**` or within the feature module.

2. **Update Prisma schema + migration (if needed)**

   * Keep tenant-scoped tables consistent with `tenantId`.

3. **Implement fetchers/actions**

   * Fetchers in `lib/server/fetchers/**`
   * Actions in `lib/server/actions/**`
   * Add tests alongside.

4. **Implement feature use-cases**

   * Pure functions in `features/<context>/use-cases/**`
   * Unit-testable.

5. **Wire into `app/` pages**

   * Pages call fetchers and render shadcn-based views.
   * Mutations are triggered via server actions.

6. **Add tests**

   * Unit: pure logic
   * Integration: DB + guards
   * E2E: user flow if relevant

7. **Run quality gates**

   * `pnpm lint`
   * `pnpm typecheck`
   * `pnpm test`
   * `pnpm test:e2e` (when changed flows)

## Feature-specific guidance

### Visualizer

* Must support:

  * template-based preview (fast path)
  * upload-based preview (best effort) with fallback
* Cache previews by deterministic keys.
* Never block scheduling if preview fails.

### Scheduling

* Slot computation must be a pure function with unit tests.
* Server validates chosen slot against availability and capacity at booking time.

### Stripe

* Prefer Stripe Checkout (v1).
* Webhook handler:

  * verify signature
  * idempotency table
  * update invoice + booking statuses
  * audit log

## Deliverable standards

* Every PR must include:

  * clear description
  * tests added/updated
  * no architectural boundary violations
  * tenant isolation and authz checks verified

## “Stop the line” conditions (must not proceed)

* Any feature that bypasses tenant scoping in DB queries.
* Any mutation implemented outside server actions.
* Any authorization performed only on the client.
* Any webhook handler without signature verification + idempotency.
