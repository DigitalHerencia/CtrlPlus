## Purpose

Define stack intent and modern technology conventions for CtrlPlus. This document
captures what technologies and operating assumptions the platform is built around.
Execution constraints are enforced in contracts.

## Technology stack matrix

| Area            | Requirement                                             |
| --------------- | ------------------------------------------------------- |
| Framework       | Next.js App Router (server-first)                       |
| Language        | TypeScript (strict typing, no implicit unsafe patterns) |
| Runtime         | Node.js-compatible runtime for Next.js and tooling      |
| UI              | React + Tailwind + shared `components/ui` primitives    |
| Auth            | Clerk                                                   |
| Database        | PostgreSQL via Prisma                                   |
| Billing         | Stripe                                                  |
| Media/AI        | Cloudinary-backed catalog media + authenticated Cloudinary visualizer media + Hugging Face |
| Testing         | Vitest + Playwright                                     |
| Package manager | pnpm                                                    |

## Modern conventions and best-practice direction

### Next.js and React

- Use Next.js App Router patterns consistently.
- Prefer Server Components by default and isolate client interactivity.
- Use streaming/loading boundaries for resilient UX.
- Keep server actions and route handlers explicitly authenticated/authorized.

### Type safety and validation

- Validate mutation input using Zod schemas from `schemas/**`.
- Keep interfaces and types in `types/**`.

### Data access and persistence

- Reads must run through `lib/fetchers/{domain}.fetchers`.
- Writes must run through `lib/actions/{domain}.actions`.
- Avoid Prisma usage in route UI or client components.
- Enforce authorization checks in `lib/authz/**` for all sensitive operations.
- Use transaction boundaries for multi-step writes requiring atomicity.
- Use `lib/cache` for server caching and revalidation strategies.
- Use `lib/db/selects` for DTO shaping and select patterns.

## Tooling and infrastructure expectations

- Use pnpm as package/runtime workflow baseline.
- Keep Prisma migrations explicit and reviewable before production rollout.
- Keep Stripe webhook handling robust against retries and out-of-order delivery.
- Keep Clerk usage server-authoritative for identity/capability checks.
- Keep media and preview generation integration resilient to provider failures.
- Treat catalog storefront wrap imagery as Cloudinary-backed production media;
  local `/uploads/wraps/**` paths are remediation-only.

## Dependency choices

- Prefer existing libraries already used in the repo.
- Introduce new libraries only when they provide clear value and fit current architecture.
- Avoid duplicating capabilities already covered by existing stack.

## Upgrade requirements

When upgrading packages:

1. Verify compatibility with Next.js App Router and current React version.
2. Validate Prisma and migration safety before schema-affecting changes.
3. Re-run quality gates after upgrades.

## Troubleshooting version conflicts

- Resolve lockfile drift before broad dependency updates.
- Upgrade in small, reviewable batches by domain impact.
- Prefer official migration/codemod paths for major upgrades.

## Testing strategy intent

- Prioritize high-risk domain workflows for automated coverage.
- Use deterministic fixtures/mocks for integration boundaries.
- Treat flaky tests as reliability defects, not acceptable noise.

## Coverage goals

- Aim for high coverage on critical business logic and mutation flows.
- Use coverage reports to identify gaps and prioritize test additions.

## Test data management

- Keep test and test shims in `tests/**` with domain subfolders.
- Test data should be realistic but synthetic, avoiding production data usage.
- Mock external integrations in unit tests, but include integration tests for critical paths.

## Required quality gates

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when affected

## Related files

- `ARCHITECTURE.md` for system intent.
- `ROADMAP.md` for sequencing and priorities.
- `.agents/contracts/testing-quality.contract.yaml` for enforceable quality gates.
