# Tech Requirements

This document is the canonical technical architecture requirement for the CtrlPlus redesign.

## 1) Stack

- Next.js 16 App Router + React Server Components
- TypeScript (strict mode)
- Neon serverless PostgreSQL
- Prisma ORM (target: v7+)
- Clerk (no org usage)
  - Universal components for sign-in/up/out
  - Catch-all auth routes
  - User menu and sign-out in shared tenant UI
  - Webhook-based user sync
- Tailwind CSS v4 + shadcn/ui
- Stripe Checkout + webhook verification
- Vitest + Playwright
- ESLint + Prettier + GitHub Actions

## 2) Non-negotiable architecture rules

- `app/**` contains routes, layouts, pages, and route handlers only.
- No Prisma usage in `app/**`.
- Reads only from `lib/server/fetchers/**`.
- Writes only from `lib/server/actions/**`.
- Tenant is resolved server-side from host/subdomain and never trusted from client payloads.
- Clerk orgs are not used; authorization is custom RBAC with tenant membership.
- Server-first rendering by default; client components only for required interactivity.

## 3) Directory conventions

- `app/`: route groups, pages, layouts, loading/error boundaries, route handlers
- `features/`: domain logic and feature composition
- `lib/server/fetchers/`: read-only DB access
- `lib/server/actions/`: write-only mutation logic
- `lib/server/auth/`: auth and permission enforcement
- `lib/server/tenancy/`: tenant resolution and scope guards
- `lib/shared/schemas/`: zod schemas and sanitization contracts
- `types/`: shared and domain-level type contracts organized by domain
- `components/ui/`: shadcn primitives only
- `components/shared-ui/`: shared app shells, nav, auth UI, blocks, skeletons

## 4) Routing model

Route groups and nested layouts are required:

- `app/(public)/**`
- `app/(auth)/**`
- `app/(tenant)/**`

Each domain route segment in `(tenant)` should include:

- `layout.tsx`
- `loading.tsx`
- `error.tsx`
- list/dashboard page
- detail page (`[id]`)
- edit page (`[id]/edit`)
- create page (`new`) where applicable

## 5) Data and tenancy model

- Tenant-scoped tables must include `tenantId` and proper indexes.
- All fetchers/actions must enforce tenant scope.
- `assertTenantScope` must be used for defensive checks when reading/mutating tenant records.
- Cross-tenant access attempts must fail and be test-covered.

## 6) AuthN/AuthZ model

- Identity is Clerk user.
- RBAC is custom per-tenant membership.
- `requireAuth()` resolves authenticated user context.
- `requireTenant()` resolves tenant context from host.
- `requirePermission()` enforces permission checks.
- Authorization must never depend on client-only checks.

## 7) Read path contract (`lib/server/fetchers/**`)

- Read-only operations only.
- No mutations.
- Typed DTO output from `types/**`.
- Supports search/filter/sort/pagination where needed.
- Applies server-side auth/tenant/permission gates for protected data.
- Uses appropriate Next.js caching strategy and cache tags.

## 8) Write path contract (`lib/server/actions/**`)

Every action must execute this sequence:

1. Resolve auth.
2. Resolve tenant from host.
3. Enforce permission.
4. Validate and sanitize input with zod.
5. Execute mutation (transactional where needed).
6. Return minimal response DTO.
7. Emit audit event when relevant.

## 9) Clerk webhook sync contract

Route: `POST /api/clerk/webhook`

Requirements:

- Verify signatures using `verifyWebhook` from `@clerk/nextjs/webhooks`.
- Process `user.created`, `user.updated`, `user.deleted`.
- Idempotency via `ClerkWebhookEvent` unique event ID.
- Sync user and membership records with transaction-safe upserts.
- Source tenant roles from `private_metadata.tenantRoles`.
- Unknown tenant IDs are ignored with warning logs (not fatal if valid memberships exist).
- Runtime authz cutover to DB-backed roles is out of scope for this phase.

## 10) Caching strategy

- Use cacheable reads for stable tenant-safe data.
- Use dynamic/no-store for auth-sensitive or rapidly changing views.
- Mutations must trigger targeted invalidation (`revalidateTag`/path strategy).
- Cache keys and tags must be deterministic and testable.

## 11) Forms and UI behavior

- All forms use React Hook Form + `zodResolver`.
- Suspense boundaries on data-heavy sections.
- Skeleton UI in `components/shared-ui/feedback/**` and domain-specific placeholders.
- shadcn primitives are required for base UI components.

Type placement rule:

- Shared/domain contracts must live in `types/**`.
- Small one-file, non-exported local UI prop types may stay colocated when they are not reused.

## 12) Styling requirements

- Brand tokens and semantic variables in `app/globals.css`.
- Tailwind v4 utility-first approach.
- Route/domain-specific exceptions in colocated `*.module.css`.
- Remove duplicated/obsolete style systems during migration.

## 13) Testing requirements

Mandatory coverage for new/changed logic:

- Unit: pure domain logic/use-cases/validators/mappers
- Integration: fetchers/actions with authz/tenancy/validation/transaction behavior
- E2E: critical user flows and high-risk routing/auth/payment paths

Quality gates:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:e2e` when triggered by CI path rules

## 14) Migration requirements

- Legacy `lib/fetchers/**` and `lib/actions/**` must be removed after migration.
- Any docs or checklists referencing legacy paths must be updated or archived.
- Broken/unused components and stale assets must be removed or fixed.
- Migration is complete only when architecture boundaries are enforced and all quality gates pass.
