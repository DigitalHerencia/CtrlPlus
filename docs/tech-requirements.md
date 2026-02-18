# Tech Requirements

## 1 Stack

* Next.js App Router + React Server Components (RSC)
* TypeScript
* Neon Postgres
* Prisma ORM
* Clerk (no orgs)

  * Universal components for sign-in/up/out
  * Catch-all routes for auth
  * User menu component
  * Use Clerk **private user metadata** for tenant membership + roles
* Tailwind + shadcn/ui (pure components)
* Payments: Stripe (Checkout recommended v1)
* Testing: Vitest + Testing Library + Playwright
* CI/CD: GitHub Actions + Vercel deployments
* Tooling: ESLint + Prettier + Husky pre-commit

## 2 Architecture rules (hard constraints)

### 2.1 App Router boundaries

* `app/` contains **page views** and route handlers only:

  * Pages render using shadcn UI components and call into **feature modules**.
  * No direct Prisma calls in `app/`.
* `lib/` contains:

  * **Read-only fetchers** (server-only) for Neon/Prisma queries.
  * **Write-only server actions** for mutations.
  * Auth/tenancy guards used by both.
* `features/` contains:

  * Domain/business logic, orchestration, validation, and UI composition.
  * Feature-level components use shadcn primitives, but don’t own tenancy/auth decisions—those are enforced in `lib/` guards.

### 2.2 Domain-driven design (DDD), feature-first

* Organize by bounded contexts:

  * `catalog` (wrap designs)
  * `visualizer` (preview generation)
  * `scheduling` (availability + bookings)
  * `billing` (invoices + payments)
  * `tenancy` (tenant resolution + membership)
  * `authz` (RBAC/ownership rules)
* Each context:

  * Entities/value objects (types + zod schemas)
  * Use-cases (application services)
  * UI components (shadcn-based)
  * Integrations (Stripe, image pipeline) behind interfaces

## 3 Multi-tenancy (official next/vercel demo pattern alignment)

### 3.1 Tenancy model

* Subdomain-based routing: `{tenantSlug}.domain.com`
* Optional custom domains later; keep table fields ready.
* Tenant resolution:

  * Middleware parses host and resolves tenant slug.
  * Tenant slug injected into request context (headers or request storage).
* **Tenant scoping must be enforced server-side**:

  * Every fetcher/action requires resolved `tenantId`.
  * Prisma queries always include `tenantId` in `where`.

### 3.2 Data isolation strategy

* Single database, shared schema, **tenantId column** on tenant-scoped tables.
* Enforce in code:

  * `requireTenant()` guard
  * `scopeToTenant(tenantId)` helper patterns
* Optional: Postgres RLS later; not required v1 but leave path open.

## 4 AuthN/AuthZ (Clerk + custom RBAC, no orgs)

### 4.1 Identity

* Clerk user is canonical identity.
* Store:

  * `clerkUserId` in DB user table.
  * Tenant membership + role mapping in DB.
  * Clerk private metadata caches role/tenant hints (never trusted alone).

### 4.2 Authorization model

* Roles (per tenant):

  * `OWNER`, `STAFF`, `VIEWER`
* Permissions (examples):

  * `catalog:read`, `catalog:write`
  * `booking:read`, `booking:write`
  * `invoice:read`, `invoice:write`
  * `tenant:manage`
* Ownership checks:

  * Table-level enforcement via `tenantId` + `createdByUserId` where applicable.
* Enforcement points:

  * **Fetchers**: verify session, tenant membership, permission.
  * **Actions**: same, plus input validation and idempotency.

### 4.3 Server-side checks

* No client-trusted authorization.
* Use Clerk server helpers in server-only modules.
* Any `tenantId` from client is ignored; derived from host resolution.

## 5 Data model (Prisma schema outline)

**Core tables**

* `Tenant` { id, slug, name, timezone, stripeAccountId?, createdAt }
* `TenantDomain` { id, tenantId, domain, isPrimary }
* `User` { id, clerkUserId, email, createdAt }
* `TenantMember` { id, tenantId, userId, role, createdAt }

**Catalog**

* `WrapDesign` { id, tenantId, name, description, tags[], basePriceCents, images[], isActive }
* `WrapVariant` { id, wrapDesignId, finishType, priceDeltaCents }

**Visualizer**

* `VehicleProfile` { id, tenantId, userId?, make, model, year, notes }
* `WrapPreview` { id, tenantId, wrapDesignId, userId?, sourceType, sourceAssetUrl, resultAssetUrl, status, createdAt }

  * `sourceType`: `UPLOAD` | `TEMPLATE`
  * `status`: `PENDING` | `READY` | `FAILED`

**Scheduling**

* `AvailabilityRule` { id, tenantId, dayOfWeek, startTime, endTime, capacity }
* `BlackoutDate` { id, tenantId, date, reason }
* `Booking` { id, tenantId, userId?, vehicleProfileId, wrapDesignId, dropoffAt, pickupAt, status, notes }

**Billing**

* `Invoice` { id, tenantId, bookingId?, customerEmail, amountCents, status, stripeCheckoutSessionId?, stripePaymentIntentId?, createdAt }
* `PaymentEvent` { id, tenantId, stripeEventId, type, processedAt } (idempotency)
* `AuditEvent` { id, tenantId, actorUserId?, type, payloadJson, createdAt }

## 6 Visualizer implementation (practical v1)

### 6.1 Recommended approach

* **Template-based first** for speed + reliability.
* Upload-based uses:

  * Simple segmentation + perspective-ish overlay (approx) OR
  * “Style transfer / texture overlay” pipeline (bounded cost)
    Since you want fast+efficient, keep v1 to:
  * lightweight processing
  * caching
  * strict file size limits

### 6.2 Pipeline (v1)

* Upload:

  * Store original image in blob storage (Vercel Blob or S3-compatible).
  * Create `WrapPreview` row as `PENDING`.
  * Generate preview via server-side worker-like route/action:

    * Apply wrap texture overlay using deterministic transforms.
    * Save result image.
    * Mark `READY` or `FAILED`.
* Template fallback:

  * Pick nearest template by make/model/year (or vehicle class).
  * Composite wrap texture onto template (instant).
  * Return `READY` synchronously.

### 6.3 Performance constraints

* Upload max: e.g., 8–12MB.
* Preview generation target: p95 < 20s, template path < 1s.
* Aggressive caching keyed by `(wrapDesignId, vehicleTemplateId | uploadHash)`.

### 6.4 Safety constraints

* Validate mime types, dimensions, strip EXIF.
* Virus scanning optional (future) but use basic validation now.
* Never expose private blob URLs; serve via signed URLs if needed.

## 7 Scheduling rules engine (v1)

* Inputs:

  * Selected wrap has `estimatedDurationHours`
  * Tenant availability rules + capacity
* Output:

  * Valid drop-off slots and computed pick-up window options
* Implementation:

  * `features/scheduling` has pure slot computation (unit-testable).
  * `lib/fetchers` reads rules/blackouts/bookings.
  * `lib/actions` creates booking with optimistic concurrency checks.

## 8 Stripe integration

### 8.1 Checkout (v1 recommended)

* Create Checkout Session server-side.
* Store `stripeCheckoutSessionId` on invoice.
* Webhook:

  * Verify signature.
  * Idempotency via `PaymentEvent` table keyed by `stripeEventId`.
  * Update invoice status (`PAID`) and booking status (`CONFIRMED`).

### 8.2 Security

* Webhook route is tenant-aware:

  * Prefer using metadata on Checkout Session: `tenantId`, `invoiceId`.
  * Still validate that invoice belongs to tenant.

## 9 Fetchers/actions contracts

### 9.1 Read-only fetchers (server-only)

Location: `lib/server/fetchers/**`
Rules:

* Must not mutate DB.
* Must call `requireAuth()` + `requireTenant()` + `requirePermission()` as needed.
* Must return typed DTOs, not Prisma models directly.

Examples:

* `getWrapDesigns({ tenantId, filters })`
* `getWrapDesignById({ tenantId, wrapDesignId })`
* `getAvailability({ tenantId, range })`
* `getBookingById({ tenantId, bookingId })`

### 9.2 Write-only actions (server actions)

Location: `lib/server/actions/**`
Rules:

* Validate input with Zod.
* Auth + permission enforced server-side.
* Idempotency where relevant (Stripe, booking creation).
* Return minimal result objects.

Examples:

* `createWrapPreviewAction(input)`
* `createBookingAction(input)`
* `createInvoiceAction(input)`
* `createStripeCheckoutSessionAction(input)`
* `handleStripeWebhookAction(event)`

## 10 Repo structure (recommended)

```
.
├─ app/
│  ├─ (public)/
│  ├─ (auth)/sign-in/[[...sign-in]]/page.tsx
│  ├─ (auth)/sign-up/[[...sign-up]]/page.tsx
│  ├─ (tenant)/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ wraps/
│  │  ├─ visualizer/
│  │  ├─ schedule/
│  │  ├─ checkout/
│  │  └─ admin/
│  ├─ api/
│  │  └─ stripe/webhook/route.ts
│  └─ proxy.ts (or root proxy.ts)
├─ features/
│  ├─ catalog/
│  ├─ visualizer/
│  ├─ scheduling/
│  ├─ billing/
│  ├─ tenancy/
│  └─ authz/
├─ lib/
│  ├─ server/
│  │  ├─ db/ (prisma client)
│  │  ├─ auth/ (clerk server helpers)
│  │  ├─ tenancy/
│  │  ├─ fetchers/
│  │  ├─ actions/
│  │  └─ audit/
│  ├─ shared/ (types, zod schemas, utils)
│  └─ client/ (client-only helpers)
├─ components/
│  ├─ ui/ (shadcn)
│  └─ shared/
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/
├─ .github/workflows/
├─ .husky/
├─ .vscode/
├─ eslint.config.mjs
├─ prettier.config.cjs
├─ vitest.config.ts
├─ playwright.config.ts
├─ .codex/
│  ├─ AGENTS.md
│  └─ PLANS.md
└─ README.md
```

## 11 Testing strategy (required)

* **Unit (Vitest)**:

  * scheduling slot computation
  * RBAC permission mapping
  * pricing calculations
  * preview cache key logic
* **Integration (Vitest + test DB)**:

  * fetchers/actions against Neon (or local Postgres in CI)
  * tenancy scoping enforcement tests (attempt cross-tenant access)
* **E2E (Playwright)**:

  * browse → visualize (template) → schedule → checkout (Stripe test mode) flow
  * admin CRUD smoke tests
* Coverage gates:

  * unit/integration threshold enforced in CI (e.g., 70–80% initially)
* Determinism:

  * seed scripts for test tenants/wraps
  * time fixed via fake timers for scheduling tests

## 12 Performance & security requirements

### Performance

* RSC-first, minimal client components.
* Cache wrap catalog lists per tenant using `unstable_cache` (or Next cache primitives).
* Optimize images (next/image), responsive sizes.
* DB:

  * indexes on `(tenantId, id)` and key query fields (wrap tags, booking dates).
* Avoid N+1 queries: fetch via Prisma includes/select projections.

### Security

* Strict server-side tenant resolution from host.
* Never trust client tenant identifiers.
* Webhook verification + idempotency.
* Rate limiting for upload/preview endpoints (Upstash recommended).
* CSP and secure headers.
* Input validation everywhere (Zod).
* File upload validation and sanitization.

## 13 CI/CD and tooling

Reference policy documents: [CI Design](./ci-design.md), [Milestone 7 Planning](./milestone-7-planning.md), and [Standard PR Checklist](./pr-checklist.md).

### Git hooks

* Husky pre-commit:

  * `lint-staged` runs ESLint + Prettier + typecheck on staged files.
* Pre-push:

  * run unit tests.

### GitHub Actions

* On PR:

  * install
  * typecheck
  * lint
  * unit + integration tests
  * Playwright e2e (optional on main only if too slow)
* On main:

  * same checks
  * Vercel deployment triggered by Git integration (or via token if desired)

### Lint/format

* ESLint (Next + TS)
* Prettier (Tailwind plugin optional)
* Consistent import ordering (eslint-plugin-import)

### Root configs (expected)

* `.editorconfig`
* `.npmrc` (consistent install)
* `.env.example` with required secrets list
* `next.config.ts` hardened (images domains, headers)
* `proxy.ts` for subdomain parsing

## 14 Acceptance criteria checklist (must-pass)

* Tenant isolation verified: cross-tenant reads/writes fail.
* Clerk auth works with universal components + user menu.
* Wrap catalog browsable without auth (configurable) OR gated per tenant setting.
* Visualizer:

  * template preview always works
  * upload preview works within constraints; fallback when fails
* Scheduling:

  * invalid slots rejected server-side
  * booking created only within tenant rules
* Stripe:

  * checkout session created
  * webhook updates invoice + booking idempotently
* Tests:

  * unit + integration + at least one e2e happy path in CI
* CI green on PR before merge
* Lint/format/typecheck enforced
