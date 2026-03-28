# Catalog Phase 4 Prompt: Visualizer Handoff

## Mission

Finalize the catalog side of the visualizer funnel by exposing a server-authoritative selection contract and stable `/visualizer?wrapId=...` handoff behavior.

## Authoritative specs

- `.codex/arch/codex_catalog_visualizer_migration_spec.md`
- `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
- `.codex/docs/catalog.md`
- `.codex/instructions/catalog.instructions.md`

## Upstream prerequisites

- `catalog.phase-1.asset-resolution-and-dtos.prompt.md` is complete and verified
- `catalog.phase-2.public-storefront.prompt.md` is complete
- `catalog.phase-3.manager-and-publish-readiness.prompt.md` is complete where manager changes affect visibility/readiness

## Scope anchors

- `lib/catalog/fetchers/wraps.ts`
- `app/(tenant)/catalog/**`
- `components/catalog/**`
- shared catalog-to-visualizer boundary files
- affected tests

## Exact implementation slice

- implement or finalize `getVisualizerSelectableWrapById`
- ensure preview CTA and any direct navigation use `/visualizer?wrapId=...`
- ensure the selection contract includes active visualizer texture metadata and any prompt metadata needed by the visualizer
- ensure server-side wrap visibility and readiness checks back the handoff
- avoid leaking non-approved or incomplete wraps into the visualizer path

## Non-goals

- do not implement the visualizer pipeline itself
- do not rework public browse UX beyond what handoff correctness requires

## Required contracts to preserve

- catalog remains the source of truth for selectable wraps
- selected wrap DTO stays explicit and minimal for downstream use
- hidden or non-ready wraps remain blocked from customer-facing preview entry

## Validation and tests

- add or update tests for `getVisualizerSelectableWrapById`
- add or update tests for preview CTA routing
- add or update tests for invalid or hidden wrap rejection
- update E2E smoke coverage if the browse-to-preview path changes

## Completion criteria

- catalog can hand off an approved wrap into `/visualizer?wrapId=...` deterministically
- downstream visualizer work can depend on a stable selection contract
- catalog-side funnel behavior is fully server-authoritative
