# Demo Visual Readiness Audit

Date: 2026-02-19
Scope: `/workspace/CtrlPlus`

## Executive status

| Area | Status | Notes |
|---|---|---|
| Visual demo readiness | 🟡 Partial | Marketing/public pages are polished, but tenant/product flows are mostly shell-level and data is in-memory only. |
| Architecture conformance | 🟡 Partial | RSC-first and auth/tenancy guards exist, but several AGENTS/doc-required stack pieces are not yet implemented. |
| Production readiness | 🔴 Not ready | SQLite + in-memory stores + hardcoded tenant maps block production multi-tenant behavior. |

## What is implemented well

- Next.js App Router structure with clear route segmentation across public, auth, tenant, and API routes.
- Clerk integration via provider, middleware auth protection, and signed-in user menu patterns.
- RBAC primitives and permission checks wired into server-side actions/pages.
- Security headers + CSP in middleware, plus webhook signature verification and idempotency guard.
- Testing baseline exists and passes for unit/integration scenarios.

## Major blockers for client visual demo approval

1. **Tenant catalog and admin experiences run from in-memory stores, not a persistent DB**, so seeded or edited visual content is not durable.
2. **Prisma datasource is SQLite instead of Neon Postgres**, conflicting with target architecture and deployment assumptions.
3. **Routing conventions have correctness issues** (e.g. `sign-up` catch-all folder named `[[...sign-out]]`).
4. **Styling system does not match stated Tailwind + shadcn requirement**; CSS is custom global stylesheet, and there is no shadcn component base.
5. **Clerk tenancy model conflicts with “no orgs” guidance**: middleware and permission checks depend on `orgId` matching tenant org IDs.

## Detailed audit matrix

| Topic | Status | Evidence summary | Recommendation |
|---|---|---|---|
| Tech stack & framework config | 🟡 Partial | Next 16 + React 19 + Clerk + TS strict + ESLint/Vitest/Playwright are present; Prisma datasource is SQLite. | Move datasource to Neon Postgres, generate real Prisma client usage in fetchers/actions, and keep environment-specific configs explicit. |
| Style/UI system | 🟡 Partial | Rich custom CSS in `app/globals.css`; no Tailwind config or shadcn/ui base components found. | Decide: either align docs to custom CSS strategy or implement Tailwind + shadcn foundation before client visual sign-off. |
| Routing | 🟡 Partial | App Router groups exist for `(auth)` and `(tenant)`; typo in sign-up catch-all folder `[[...sign-out]]`. | Rename folder to `[[...sign-up]]`, add route coverage tests, and verify auth callbacks/URLs. |
| Tooling | 🟢 Good baseline | `lint`, `typecheck`, `test`, `test:e2e`, husky/lint-staged scripts present and runnable. | Add formatting script and pin package manager/engines consistency in CI. |
| CI | 🟡 Partial | CI workflows run lint/typecheck/unit/integration + conditional e2e. Path filters reference folders that do not exist. | Align path filters with real repo paths (`create-*` action files, current catalog/visualizer locations), and sync docs with workflow truth. |
| Features | 🟡 Partial | Public marketing flows are strong; booking/invoice/checkout/webhook logic exists; admin dashboard is shell-like. | Build complete end-to-end UX states for browse→visualize→schedule→pay with persisted data and tenant fixtures. |
| Neon serverless Postgres | 🔴 Missing | Prisma configured for SQLite; no Neon adapter/connection config found. | Migrate datasource provider/url, add migration validation against Neon, and add a smoke test using a test DB. |
| Clerk auth | 🟡 Partial | Sign-in/sign-up pages + middleware protection are wired. | Remove org dependency if “no orgs” is requirement; use user metadata + DB membership only. |
| Prisma schema | 🟡 Partial | Multi-tenant tables exist with tenantId and indexes, but schema is simplified and missing many planned entities. | Add missing entities (TenantDomain, TenantMember, AuditEvent, visualizer/scheduling richness) and enforce enum/status types. |
| RBAC | 🟡 Partial | Roles/permissions and requirePermission guard exist. | Replace env fallback role maps with DB-backed tenant membership checks; add audit trail for authorization decisions on sensitive actions. |
| Components | 🟡 Partial | Clear split between public shell and feature components; no shadcn primitives in `components/ui`. | Introduce component library baseline and design tokens; keep business logic out shared UI components. |
| Data fetching/actions | 🟡 Partial | Clear fetcher/action separation and tenancy + permission checks in actions. | Replace in-memory stores with Prisma-backed adapters and add transactional safety/idempotency for writes. |
| Duplicates | 🟡 Partial | Duplicate concepts: mock `TenantScopedPrisma` in db layer and separate in-memory domain stores; overlapping tenancy role sources. | Consolidate persistence interfaces and single source of truth for authz data. |
| Missing files/capabilities | 🔴 Significant | No Tailwind/shadcn setup files, no real Prisma client implementation, no deployment/runtime env template, no observability wiring. | Add infra readiness artifacts (`.env.example`, logger, tracing hooks, seed scripts, DB migration docs). |
| Misconfigurations | 🔴 Significant | SQLite vs Neon mismatch; auth route typo; CI path-filter drift. | Fix immediately before demo freeze. |
| Bugs | 🟡 Notable | Potential sign-up route catch-all typo; org mismatch can deny valid users if org not active; non-durable data by design. | Address with targeted fixes and regression tests. |
| Naming consistency | 🟡 Partial | Mostly coherent naming; some mismatches (`createTemplatePreviewAction` file naming vs docs paths). | Standardize feature/action naming by bounded context directories. |
| Patterns & architecture | 🟡 Partial | Good separation intentions and tests, but implementation still scaffold-grade in persistence/authz backing. | Complete transition from scaffold to production adapters per DDD boundaries. |

## Architecture snapshot

```mermaid
flowchart TD
  Browser --> NextApp[Next.js App Router]
  NextApp --> Middleware[proxy.ts clerkMiddleware + tenancy + security headers]
  Middleware --> Pages[app/(public|auth|tenant)]
  Pages --> Fetchers[lib/server/fetchers/*]
  Pages --> Actions[lib/server/actions/*]
  Actions --> Guards[requireTenant + requirePermission]
  Fetchers --> InMemory[(In-memory stores)]
  Actions --> InMemory
  API[app/api/stripe/webhook] --> InMemory
  PrismaSchema[prisma/schema.prisma] -. defined but not used for runtime persistence .-> InMemory
```

## Demo-approval completion checklist

### P0 (must complete before client visual demo sign-off)

- [ ] Replace in-memory catalog/booking/invoice/upload stores with Prisma-backed repositories.
- [ ] Move Prisma datasource to Neon Postgres and validate migrations against Neon.
- [ ] Fix auth route folder typo (`sign-up` catch-all segment naming).
- [ ] Align Clerk tenancy model with requirement (no org dependency) or formally update requirement docs.
- [ ] Stabilize demo data strategy (seeded tenant catalog and visual assets persisted in DB/blob).

### P1 (high-value hardening)

- [ ] Align UI stack with decision (Tailwind + shadcn OR documented custom CSS standard).
- [ ] Add server-side validation schemas (Zod) in actions for all action payloads.
- [ ] Add structured audit events for invoice/booking and authz-sensitive actions.
- [ ] Fix CI path filters and add failure-proof checks for changed action/fetcher paths.

### P2 (operational readiness)

- [ ] Add observability baseline (structured logging, request correlation IDs, error taxonomy).
- [ ] Add `.env.example` with required secrets/non-secret config.
- [ ] Add deployment runbook (Neon + Clerk + Stripe + Vercel) and incident rollback steps.


## GitHub execution mapping

The remediation plan is now codified as roadmap tasks under milestone `M9` in `.github/task-manifest.json` (`DEMO-001` through `DEMO-008`) to ensure label/project automation can materialize issues consistently.

The roadmap tasks are materialized as GitHub issues `#52` through `#59` and attached to milestone `M9` plus the project board.

## Suggested acceptance criteria for visual demo approval

1. Demo tenant can refresh/reopen and still see identical catalog, previews, and bookings (persistent data).
2. Browse→visualize→schedule→pay works with realistic seeded wraps and no dead-end states.
3. Admin can edit catalog and changes are visible immediately in tenant-facing pages.
4. Authentication flows are reliable for sign-up/sign-in/sign-out without route edge-case failures.
5. CI quality gates + regression tests cover the demo-critical flows.

