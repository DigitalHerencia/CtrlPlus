# Catalog Refactor Prompt

## Mission

Refactor only the `catalog` domain to the target CtrlPlus server-first architecture while preserving publish-readiness, asset-role rules, and the visualizer handoff contract.

## Scope anchors

- `app/(tenant)/catalog/**`
- `features/catalog/**`
- `components/catalog/**`
- `lib/catalog/**`
- affected tests under `e2e/**` and `tests/**`

## Non-goals

- do not refactor visualizer generation internals
- do not refactor scheduling or billing
- do not change the underlying provider strategy for uploads unless explicitly required

## Target architecture

- keep `app/**` thin and orchestration-only
- move route composition into `features/catalog/**`
- keep pure UI in `components/catalog/**`
- keep reads in `lib/catalog/fetchers/**`
- keep writes in `lib/catalog/actions/**`

## Required implementation rules

- refactor only the named domain unless a shared boundary file is explicitly listed
- do not refactor adjacent domains in the same pass
- do not move Prisma into `app/**` or React components
- keep feature orchestration outside `app/**`
- keep client components free of authz, business rules, and cache invalidation
- preserve owner and platform-admin enforcement at the server boundary

## Domain behaviors to preserve

- publish-readiness rules
- asset-role normalization at mutation time
- browse, detail, manager, and visualizer-selection DTO separation
- visualizer handoff through `/visualizer?wrapId=...`
- visualizer-ready filtering for customer-visible surfaces

## Refactor checklist

- thin catalog route files
- move orchestration into features
- split pure UI from workflow logic
- keep asset resolution deterministic
- preserve explicit publish and unpublish actions
- update affected tests

## Validation and tests

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when catalog flows are affected

## Completion criteria

- catalog route files are thin
- asset-role handling is deterministic and centralized
- publish and visualizer-ready behavior remain server-authoritative
- catalog DTOs are explicit for each surface
- quality gates pass
