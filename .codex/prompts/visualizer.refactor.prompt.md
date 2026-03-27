# Visualizer Refactor Prompt

## Mission

Refactor only the `visualizer` domain to the target CtrlPlus server-first architecture while preserving catalog-backed wrap selection, server-authoritative preview generation, Cloudinary-backed persistence, preview ownership rules, and resilient Hugging Face plus fallback behavior.

## Authoritative specs

- `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
- `.codex/arch/codex_catalog_visualizer_migration_spec.md` for upstream catalog handoff constraints
- `.codex/docs/visualizer.md`
- `.codex/instructions/visualizer.instructions.md`

## Scope anchors

- `app/(tenant)/visualizer/**`
- `features/visualizer/**`
- `components/visualizer/**`
- `lib/visualizer/**`
- `lib/catalog/fetchers/**` when explicitly needed for wrap selection boundaries
- affected tests under `e2e/**` and `tests/**`

## Upstream and downstream dependencies

- visualizer work assumes catalog-owned selection DTOs and deterministic visualizer texture resolution
- external-provider assumptions must remain isolated to `lib/visualizer/**`
- phase prompts should be executed in order unless an earlier phase is already complete and verified

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
- keep HF model choice configurable via env and isolated behind adapters

## Domain behaviors to preserve

- catalog-backed visualizer-ready wrap selection
- deterministic asset resolution
- preview ownership and cache-key stability
- status-driven generation flow
- HF primary generation with deterministic fallback behavior
- Cloudinary-backed original and generated image persistence

## Phase execution order

1. `visualizer.phase-1.catalog-handoff-and-wrap-selection.prompt.md`
2. `visualizer.phase-2.vehicle-upload-and-persistence.prompt.md`
3. `visualizer.phase-3.hf-generation-and-prompting.prompt.md`
4. `visualizer.phase-4.fallback-composite-and-recovery.prompt.md`
5. `visualizer.phase-5.cache-regenerate-and-polish.prompt.md`
6. `catalog-visualizer.integration-e2e.prompt.md` for cross-domain smoke coverage when the funnel changes

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
- Cloudinary-backed persistence and model-adapter boundaries are clear
- quality gates pass
