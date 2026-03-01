# Architecture Requirements

This file is the canonical technical and execution architecture contract for CtrlPlus.

## Canonical Policy Stack

1. `AGENTS.md`
2. `.codex/docs/20-architecture.md`
3. `PLANS.md`
4. `.codex/docs/40-quality-gates.md`

## Stack

- Next.js App Router + React Server Components
- TypeScript strict mode
- Neon serverless PostgreSQL + Prisma
- Clerk universal auth components (no Clerk org authorization)
- Tailwind CSS v4 + shadcn/ui
- Stripe Checkout + verified webhooks
- Vitest + Playwright
- ESLint + Prettier + GitHub Actions

## Non-Negotiable Boundaries

- `app/**` is route composition and handlers only.
- No Prisma usage in `app/**`.
- Reads only in `lib/server/fetchers/**`.
- Writes only in `lib/server/actions/**`.
- Tenant is resolved server-side from host/subdomain only.
- Never trust `tenantId` from client payloads.
- Authorization is custom tenant RBAC with server-side checks.
- Business logic lives in `features/**` as pure use-cases.
- `components/ui/**` contains shadcn primitives only.

## Directory Conventions

- `app/`: routes, layouts, loading/error boundaries, route handlers
- `features/`: domain logic and use-cases
- `lib/server/fetchers/`: read-only access layer
- `lib/server/actions/`: mutation layer
- `lib/server/auth/`: authn/authz helpers
- `lib/server/tenancy/`: tenant resolution and tenant scope checks
- `schemas/`: zod input schemas
- `types/`: explicit DTO contracts
- `components/shared-ui/`: reusable shells/nav/feedback
- `components/ui/`: shadcn primitives

## Required Server Contracts

### Auth and tenancy helpers

- `requireAuth()` returns authenticated identity context or throws.
- `requireTenant()` returns host-derived tenant context or throws.
- `requirePermission(permission, { tenantId, userId })` throws on violation.
- `assertTenantScope(tenantId, recordTenantId)` must guard tenant-owned record access.

### Fetcher contract (`lib/server/fetchers/**`)

- Read-only operations only.
- Explicit DTO outputs, never raw Prisma models.
- Tenant and permission checks for protected reads.
- Deterministic caching policy and tags where applicable.

### Action contract (`lib/server/actions/**`)

Every server action sequence is:

1. Resolve auth.
2. Resolve tenant from host/subdomain.
3. Enforce permission.
4. Validate/sanitize input with zod.
5. Execute mutation (transactional where needed).
6. Return minimal output DTO.
7. Emit audit event when relevant.

## Webhook Contracts

### Clerk sync webhook

Route: `POST /api/clerk/webhook`

Requirements:

- Verify signatures via `verifyWebhook` from `@clerk/nextjs/webhooks`.
- Process `user.created`, `user.updated`, and `user.deleted`.
- Enforce idempotency with a unique event table.
- Sync user and membership records transactionally.

### Stripe webhook

- Signature verification is mandatory.
- Idempotency is mandatory.
- Payment state mutation occurs only after verification and dedupe.

## Testing Contract

Every meaningful change includes:

- Unit tests for pure domain logic.
- Integration tests for fetchers/actions/guards.
- E2E coverage for critical user and payment flows.

## Migration Contract

- Remove legacy `lib/fetchers/**` and `lib/actions/**` references.
- Keep docs and checks aligned to current folder conventions.
- Migration is complete only when boundaries are enforced and quality gates are green.
