# Admin Refactor Prompt

## Mission

Refactor only the `admin` domain to the target CtrlPlus server-first architecture. Do not refactor adjacent business domains except for explicitly listed shared boundary files.

## Scope anchors

- `app/(tenant)/admin/**`
- `features/admin/**`
- `components/admin/**`
- `lib/actions/admin.actions.ts`
- `lib/fetchers/admin.fetchers.ts`
- `components/shared/tenant-elements.tsx`
- `components/shared/tenant-nav-config.ts`
- `components/shared/tenant-sidebar.tsx`
- affected tests under `e2e/**` and `tests/**`

## Non-goals

- do not refactor catalog, scheduling, billing, settings, or platform internals
- do not move auth or capability policy out of `lib/auth/**` and `lib/authz/**`
- do not redesign tenant role semantics or provider integrations

## Target architecture

- keep `app/**` thin and orchestration-only
- move page composition into `features/admin/**`
- keep pure UI in `components/admin/**`
- keep admin reads in `lib/fetchers/admin.fetchers.ts` or compose from existing domain fetchers
- keep admin-only writes server-side

## Required implementation rules

- refactor only the named domain unless a shared boundary file is explicitly listed
- do not refactor adjacent domains in the same pass
- do not move Prisma into `app/**` or React components
- keep feature orchestration outside `app/**`
- keep client components free of authz, business rules, and cache invalidation
- preserve owner and platform-admin checks at the server boundary

## Domain behaviors to preserve

- owner dashboard usefulness and high-signal summaries
- capability-aware quick actions and tenant navigation
- admin as a summary or routing layer, not a duplicate business-rule layer
- strict separation between owner admin and platform-admin tooling

## Refactor checklist

- move dashboard orchestration out of route files
- isolate pure admin UI from server reads
- shape explicit admin DTOs for dashboard summaries
- keep shared owner shell changes capability-aware
- preserve explicit empty, loading, error, and denied states
- update affected tests

## Validation and tests

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when admin flows are affected

## Completion criteria

- admin route files are thin
- admin orchestration lives outside `app/**`
- admin does not duplicate catalog, scheduling, or billing business rules
- owner-facing quick actions and navigation remain capability-aware
- quality gates pass
