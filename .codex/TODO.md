# CtrlPlus Unified Migration TODO

## 0) Governance and baseline hardening
- [x] Keep this file checklist-only; keep design rationale in `PLANS.md` and requirements in `docs/tech-requirements.md`.
- [x] Add a no-legacy-import lint rule to block new imports from `lib/fetchers/**` and `lib/actions/**`.
- [x] Add a lint rule that enforces shared/domain type contracts in `types/**` while allowing small non-exported local UI prop types when one-file scoped.
- [x] Record migration defaults: full redesign now, Prisma + Neon, Clerk sync-only rollout (no authz DB cutover in this phase).

## 0.1) Phase gates (must-pass before moving on)
- [x] Phase 1 gate: scaffolding + guardrails complete (`lib/server/**`, route groups, schema/type folders), lint/typecheck/tests green.
- [x] Phase 2 gate: Prisma + auth/tenancy + fetcher/action migration complete for at least one domain end-to-end; cross-tenant tests passing.
- [x] Phase 3 gate: route/layout + shared-ui migration complete for public/auth/tenant shells; loading/error boundaries verified.
- [x] Phase 4 gate: cleanup complete (legacy path removals, broken assets fixed, stale tests/docs removed) and full quality gates green.

## 1) Target directory scaffolding
- [x] Create route groups: `app/(public)`, `app/(auth)`, `app/(tenant)` with nested `layout.tsx`, `loading.tsx`, `error.tsx`.
- [x] Create `components/shared-ui/**` for providers, layout shells, nav, auth UI, blocks, and skeletons.
- [x] Create domain folders in `features/**` with `components/server`, `components/client`, and `use-cases`.
- [x] Create `lib/server/**` for `auth`, `tenancy`, `fetchers`, `actions`, `cache`, `audit`, and `db`.
- [x] Create `types/**` by domain and shared contracts.
- [x] Create `lib/shared/schemas/**` by domain.

## 2) Data layer migration to Prisma v7 + Neon-safe patterns
- [x] Update `prisma/schema.prisma` with normalized Clerk sync tables and tenant-safe indexes.
- [x] Add Prisma migration for `ClerkUser`, `TenantUserMembership`, and `ClerkWebhookEvent`.
- [x] Add transaction-safe DB helper in `lib/server/db/**`.
- [x] Keep existing runtime functional during migration until cutover is complete.

## 3) Auth + tenancy baseline consolidation
- [x] Standardize auth helpers under `lib/server/auth/**` (`require-auth`, `require-permission`, `resolve-tenant-role`).
- [x] Standardize tenancy helpers under `lib/server/tenancy/**` (`require-tenant`, `get-request-tenant`, `assert-tenant-scope`).
- [x] Ensure tenant is always host/subdomain-derived server-side only.
- [x] Add shared audit event helper for mutation flows.

## 4) Read path migration (fetchers only)
- [x] Move all reads from `lib/fetchers/**` to `lib/server/fetchers/<domain>/**`.
- [x] Add list/get fetchers with explicit search/filter/sort/pagination DTOs from `types/**`.
- [x] Add server-side permission checks for sensitive reads.
- [x] Add cache tags + caching policy per fetcher.
- [x] (`catalog`) Migrate read usage to `lib/server/fetchers/catalog/**` for wraps pages and catalog integration tests.
- [x] (`catalog`) Add explicit list/get DTO contracts in `types/catalog/**` with search/filter/sort/pagination.
- [x] (`catalog`) Enforce server-side `catalog:read` permission checks for sensitive list/get fetchers.
- [x] (`catalog`) Add cache tags and revalidation policy for catalog private/public fetchers.

## 5) Write path migration (actions only)
- [x] Move all writes from `lib/actions/**` to `lib/server/actions/<domain>/**`.
- [x] Enforce action pipeline: auth -> tenant -> permission -> zod validate/sanitize -> mutate -> minimal DTO -> audit.
- [x] Add transactional boundaries for multi-step writes.
- [x] Add post-mutation invalidation (`revalidateTag`/path invalidation policy).
- [x] (`catalog`) Move catalog writes from `lib/actions/catalog/**` to `lib/server/actions/catalog/**`.
- [x] (`catalog`) Enforce action pipeline: auth -> tenant -> permission -> zod validate/sanitize -> mutate -> minimal DTO -> audit.
- [x] (`catalog`) Add transactional boundaries for multi-step catalog writes.
- [x] (`catalog`) Add post-mutation invalidation tags/paths for catalog writes.

## 6) Clerk webhook sync implementation
- [x] Add route `app/api/clerk/webhook/route.ts`.
- [x] Verify webhook signatures with `@clerk/nextjs/webhooks`.
- [x] Validate and handle `user.created`, `user.updated`, `user.deleted`.
- [x] Add `lib/server/actions/clerk/sync-clerk-webhook-event.ts` with idempotent upsert transaction logic.
- [x] Upsert `ClerkUser` + `TenantUserMembership` from `private_metadata.tenantRoles`.
- [x] Soft-delete/deactivate memberships on `user.deleted`.
- [x] Record idempotency in `ClerkWebhookEvent`.
- [x] Log structured webhook events with redaction.
- [x] Keep authz runtime unchanged in this phase (sync-only rollout).

## 7) Domain feature migration (server-first)
- [x] Rebuild domain feature components as RSC-first in `features/<domain>/components/server`.
- [x] Add client components only when interactivity is required (`features/<domain>/components/client`).
- [x] Move reusable domain business logic to `features/<domain>/use-cases/**`.
- [x] Implement search/filter/sort/pagination feature logic per domain.
- [x] (`catalog`) Rebuild catalog feature components as RSC-first in `features/catalog/components/server`.
- [x] (`catalog`) Keep catalog rendering server-only; no client component was introduced because interactive behavior is handled with server-driven query params.
- [x] (`catalog`) Move reusable catalog business logic to `features/catalog/use-cases/**`.
- [x] (`catalog`) Implement deterministic search/filter/sort/pagination logic for catalog list queries.

## 8) UI system standardization (shadcn only)
- [x] Keep primitives in `components/ui/**` only (shadcn).
- [x] Move shared headers/footers/nav/sidebars/providers/menus/sign-out to `components/shared-ui/**`.
- [x] Add domain render components under `components/domains/<domain>/**`.
- [x] Replace ad-hoc UI markup with shadcn composition patterns.

## 9) Route/page migration with nested layouts
- [x] Migrate public routes into `app/(public)/**`.
- [x] Keep Clerk catch-all routes in `app/(auth)/sign-in/[[...sign-in]]/page.tsx` and `app/(auth)/sign-up/[[...sign-up]]/page.tsx`.
- [x] Migrate tenant routes into `app/(tenant)/<domain>/**` with `page.tsx`, `[id]/page.tsx`, `[id]/edit/page.tsx`, and `new/page.tsx` where applicable.
- [x] Ensure each domain route segment has `layout.tsx`, `loading.tsx`, `error.tsx`.

## 10) Forms, Suspense, and skeletons
- [x] Standardize forms to React Hook Form + zod resolver.
- [x] Add Suspense boundaries for data-heavy sections.
- [x] Add shared and domain skeletons in `components/shared-ui/feedback/**`.

## 11) Styling and tokens
- [x] Keep brand tokens and semantic CSS variables in `app/globals.css`.
- [x] Use Tailwind v4 utilities first.
- [x] Use nested `*.module.css` only for route/domain-scoped exceptions.
- [x] Remove duplicated/obsolete auth style systems after migration cutover.

## 12) Cleanup and dedup (required)
- [x] Remove unused `components/auth/user-menu.tsx` after shared auth menu replacement.
- [x] Remove or fully implement `components/public/ctrl-logo-mark.tsx` (currently unused and missing class definitions).
- [x] Remove duplicate auth stylesheet `app/(auth)/auth.css` once module-based styling is canonical.
- [x] Fix/remove broken static assets in `components/public/public-site-shell.tsx` (`/0001-762728619053843625.png`, `/0001-3757622370303829961.png`).
- [x] Remove legacy `lib/fetchers/**` and `lib/actions/**` after imports and tests are fully migrated.
- [x] Remove stale tests/imports tied to deleted legacy paths.
- [x] Update CI/governance path filters for `app/api/clerk/**` and `lib/server/**`.

## 13) Testing and quality gates
- [x] Add unit tests for domain use-cases and mapping/parsing logic.
- [x] Add integration tests for fetchers/actions (authz, tenancy, validation, transactions).
- [x] Add integration tests for Clerk webhook happy path, idempotency, invalid signature, and delete flow.
- [x] Ensure critical flows have Playwright coverage.
- [x] Pass: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`.
- [x] (`catalog`) Add integration tests for catalog write actions (authz, tenancy, validation, transaction boundaries, invalidation policy).
- [x] (`catalog`) Add unit tests for catalog use-cases covering deterministic query behavior and search-param parsing.

## 14) Rollout and verification
- [ ] Configure `CLERK_WEBHOOK_SIGNING_SECRET` in all environments.
- [ ] Configure Clerk dashboard endpoint to `/api/clerk/webhook`.
- [x] Validate tenant-scoped behavior on local tenant hosts.
- [x] Verify no boundary violations remain (`app/**` has no Prisma usage; reads/writes split correctly).
- [x] Close migration only when legacy paths are removed and all quality gates pass.

## 15) Definition of done
- [x] App runs with nested-layout architecture and server-first rendering.
- [x] Data access is domain-organized under `lib/server/fetchers` and `lib/server/actions`.
- [x] Clerk webhook sync is live, idempotent, and tested.
- [x] Duplicate/dead/broken files and assets are removed or fixed.
- [x] All quality gates pass with no architectural boundary regressions.

## Validation scenarios
- [x] Tenant isolation: tenant A cannot read/write tenant B data.
- [x] Authz enforcement: missing permission fails server-side for read and write.
- [x] Webhook security: invalid Clerk signature returns 400.
- [x] Webhook idempotency: duplicate `clerkEventId` processes exactly once.
- [x] Webhook lifecycle: create/update upsert user + membership; delete soft-deletes user and deactivates memberships.
- [x] Route UX: domain `loading.tsx` and `error.tsx` render under slow/failing data.
- [x] Data UX: search/filter/sort/pagination are deterministic and tenant-scoped.
- [x] Cache correctness: relevant reads invalidate after mutation.
- [x] Cleanup: no references to removed legacy paths/assets remain.

## Assumptions and defaults
- [x] Full redesign is immediate (not incremental route-preserving).
- [x] Prisma v7 + Neon serverless PostgreSQL remains the stack.
- [x] Shared/domain contracts live in `types/**`; tiny one-file, non-exported local UI prop types are allowed by exception.
- [x] Clerk sync rollout is sync-only first; runtime authz DB cutover is a separate phase.
- [x] Unknown tenant IDs in Clerk metadata are ignored with warnings, not fatal for valid memberships.
