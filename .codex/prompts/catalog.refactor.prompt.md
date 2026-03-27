# Catalog Refactor Prompt

## Mission

Refactor only the `catalog` domain to the target CtrlPlus server-first architecture while preserving publish-readiness, deterministic asset-role rules, and the visualizer handoff contract that now feeds a catalog-driven preview pipeline.

## Authoritative specs

- `.codex/arch/codex_catalog_visualizer_migration_spec.md`
- `.codex/arch/codex_visualizer_huggingface_generation_spec.md` for downstream handoff assumptions
- `.codex/docs/catalog.md`
- `.codex/instructions/catalog.instructions.md`

## Scope anchors

- `app/(tenant)/catalog/**`
- `features/catalog/**`
- `components/catalog/**`
- `lib/catalog/**`
- affected tests under `e2e/**` and `tests/**`

## Upstream and downstream dependencies

- upstream auth/authz and storage boundaries must remain intact
- downstream visualizer work depends on catalog-owned DTOs, asset resolution, publish-readiness, and `/visualizer?wrapId=...` handoff behavior
- phase prompts should be executed in order unless an earlier phase is already complete and verified

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
- encode image meaning through `WrapImage.kind`, never array order

## Domain behaviors to preserve

- publish-readiness rules
- asset-role normalization at mutation time
- browse, detail, manager, and visualizer-selection DTO separation
- visualizer handoff through `/visualizer?wrapId=...`
- visualizer-ready filtering for customer-visible surfaces
- server-authoritative wrap visibility and asset validation

## Phase execution order

1. `catalog.phase-1.asset-resolution-and-dtos.prompt.md`
2. `catalog.phase-2.public-storefront.prompt.md`
3. `catalog.phase-3.manager-and-publish-readiness.prompt.md`
4. `catalog.phase-4.visualizer-handoff.prompt.md`
5. `catalog-visualizer.integration-e2e.prompt.md` for cross-domain smoke coverage when catalog changes affect the funnel

## Refactor checklist

- thin catalog route files
- move orchestration into features
- split pure UI from workflow logic
- keep asset resolution deterministic
- preserve explicit publish and unpublish actions
- preserve catalog-owned DTOs and selection contracts
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
- the catalog can safely hand off an approved wrap into the visualizer pipeline
- quality gates pass
