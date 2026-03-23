# Visualizer Refactor Prompt

## Mission

Refactor only the `visualizer` domain to the target CtrlPlus server-first architecture while preserving server-authoritative preview generation, catalog-backed selection, and preview ownership rules.

## Scope anchors

- `app/(tenant)/visualizer/**`
- `features/visualizer/**`
- `components/visualizer/**`
- `lib/visualizer/**`
- `lib/catalog/fetchers/**` when explicitly needed for wrap selection boundaries
- affected tests under `e2e/**` and `tests/**`

## Non-goals

- do not refactor catalog management internals except for explicit shared selection boundaries
- do not refactor scheduling or billing
- do not move preview generation authority into the client

## Target architecture

- keep `app/**` thin and orchestration-only
- move page composition into `features/visualizer/**`
- keep pure UI in `components/visualizer/**`
- keep reads in `lib/visualizer/fetchers/**`
- keep writes in `lib/visualizer/actions/**`

## Required implementation rules

- refactor only the named domain unless a shared boundary file is explicitly listed
- do not refactor adjacent domains in the same pass
- do not move Prisma into `app/**` or React components
- keep feature orchestration outside `app/**`
- keep client components free of authz, business rules, and cache invalidation
- preserve server-side preview ownership and wrap selection rules

## Domain behaviors to preserve

- catalog-backed visualizer-ready wrap selection
- deterministic asset resolution
- preview ownership and cache-key stability
- status-driven generation flow
- HF primary generation with deterministic fallback behavior

## Refactor checklist

- thin visualizer route files
- move orchestration into features
- isolate pure UI from upload, preview, and polling logic
- keep image processing and provider adapters in `lib/visualizer/**`
- preserve cache-aware generation and fallback behavior
- update affected tests

## Validation and tests

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when visualizer flows are affected

## Completion criteria

- visualizer route files are thin
- wrap selection remains server-filtered and catalog-backed
- preview generation remains server-authoritative and status-driven
- preview ownership boundaries remain intact
- quality gates pass
