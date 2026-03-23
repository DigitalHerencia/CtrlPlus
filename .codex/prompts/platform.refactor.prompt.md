# Platform Refactor Prompt

## Mission

Refactor only the `platform` domain to the target CtrlPlus server-first architecture while preserving strict platform-admin boundaries and auditable operational tooling.

## Scope anchors

- `app/(tenant)/platform/**`
- `features/platform/**`
- `components/platform/**`
- `lib/platform/**`
- `app/api/stripe/**`
- affected tests under `e2e/**` and `tests/**`

## Non-goals

- do not refactor auth/authz implementation except for explicitly listed shared boundary files
- do not refactor tenant-facing business domains
- do not dilute platform-admin-only access boundaries

## Target architecture

- keep `app/**` thin and orchestration-only
- move page composition into `features/platform/**`
- keep pure UI in `components/platform/**`
- keep reads in `lib/platform/fetchers/**`
- keep writes in `lib/platform/actions/**`

## Required implementation rules

- refactor only the named domain unless a shared boundary file is explicitly listed
- do not refactor adjacent domains in the same pass
- do not move Prisma into `app/**` or React components
- keep feature orchestration outside `app/**`
- keep client components free of authz, business rules, and cache invalidation
- preserve platform-admin-only enforcement on the server

## Domain behaviors to preserve

- privileged diagnostics and recovery separation
- auditable dangerous actions
- operational visibility into webhook failures and backlog
- migration from state-flip retries toward real retry execution

## Refactor checklist

- thin platform route files
- move orchestration into features
- isolate pure operational UI from server mutations
- keep recovery flows explicit and auditable
- preserve pagination and targeted operational reads
- update affected tests

## Validation and tests

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when platform flows are affected

## Completion criteria

- platform routes are thin
- diagnostics and recovery concerns are clearly separated
- privileged operations remain server-enforced and auditable
- retry tooling no longer pretends work happened when it only flipped state
- quality gates pass
