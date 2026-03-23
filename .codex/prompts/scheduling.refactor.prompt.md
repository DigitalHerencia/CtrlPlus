# Scheduling Refactor Prompt

## Mission

Refactor only the `scheduling` domain to the target CtrlPlus server-first architecture while preserving server-authoritative availability and booking lifecycle behavior.

## Scope anchors

- `app/(tenant)/scheduling/**`
- `features/scheduling/**`
- `components/scheduling/**`
- `lib/scheduling/**`
- affected tests under `e2e/**` and `tests/**`

## Non-goals

- do not refactor billing beyond the explicit booking handoff boundary
- do not refactor catalog or visualizer
- do not move contested booking logic into the client

## Target architecture

- keep `app/**` thin and orchestration-only
- move page composition into `features/scheduling/**`
- keep pure UI in `components/scheduling/**`
- keep reads in `lib/scheduling/fetchers/**`
- keep writes in `lib/scheduling/actions/**`

## Required implementation rules

- refactor only the named domain unless a shared boundary file is explicitly listed
- do not refactor adjacent domains in the same pass
- do not move Prisma into `app/**` or React components
- keep feature orchestration outside `app/**`
- keep client components free of authz, business rules, and cache invalidation
- do not use optimistic UI where reservation contention makes rollback risky

## Domain behaviors to preserve

- server-authoritative availability
- reservation, confirmation, cancellation, and expiration lifecycle behavior
- explicit booking status modeling
- timezone correctness and cleanup lifecycle needs
- explicit billing handoff

## Refactor checklist

- thin scheduling route files
- move orchestration into features
- isolate pure UI from availability and lifecycle logic
- keep capacity and slot logic server-side
- preserve explicit state handling and conflict feedback
- update affected tests

## Validation and tests

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when scheduling flows are affected

## Completion criteria

- scheduling route files are thin
- availability and reservation logic remain server-authoritative
- contested slot behavior is not client-authoritative
- lifecycle states are explicit in code and UI
- quality gates pass
