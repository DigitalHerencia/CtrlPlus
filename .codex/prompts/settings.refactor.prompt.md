# Settings Refactor Prompt

## Mission

Refactor only the `settings` domain to the target CtrlPlus server-first architecture while preserving current-user and owner-scoped configuration boundaries.

## Scope anchors

- `app/(tenant)/settings/**`
- `features/settings/**`
- `components/settings/**`
- `lib/settings/**`
- affected tests under `e2e/**` and `tests/**`

## Non-goals

- do not refactor admin dashboard behavior except for explicitly listed shared boundary files
- do not refactor auth/authz policy ownership
- do not fold settings back into a generic operations bucket

## Target architecture

- keep `app/**` thin and orchestration-only
- move page composition into `features/settings/**`
- keep pure UI in `components/settings/**`
- keep reads in `lib/settings/fetchers/**`
- keep writes in `lib/settings/actions/**`

## Required implementation rules

- refactor only the named domain unless a shared boundary file is explicitly listed
- do not refactor adjacent domains in the same pass
- do not move Prisma into `app/**` or React components
- keep feature orchestration outside `app/**`
- keep client components free of authz, business rules, and cache invalidation
- preserve current-user and owner scoping at the server boundary

## Domain behaviors to preserve

- schema-backed forms
- focused settings reads and writes
- strong save feedback and validation clarity
- explicit denied, empty, loading, and error states

## Refactor checklist

- thin settings route files
- move orchestration into features
- isolate form UI from server mutations
- keep validation explicit and reusable
- preserve targeted revalidation after writes
- update affected tests

## Validation and tests

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when settings flows are affected

## Completion criteria

- settings route files are thin
- settings reads and writes remain focused and server-scoped
- settings form behavior is clearer and more reliable
- settings concerns are not mixed back into generic operations
- quality gates pass
