# Catalog + Visualizer Integration Prompt: Funnel and E2E

## Mission

Verify and harden the shared catalog-to-visualizer funnel after the catalog and visualizer phase prompts have landed.

## Authoritative specs

- `.codex/arch/codex_catalog_visualizer_migration_spec.md`
- `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
- `.codex/docs/catalog.md`
- `.codex/docs/visualizer.md`
- `.codex/instructions/catalog.instructions.md`
- `.codex/instructions/visualizer.instructions.md`

## Upstream prerequisites

- all catalog phase prompts are complete and verified
- all visualizer phase prompts are complete and verified

## Scope anchors

- shared catalog and visualizer routes
- shared fetchers/actions involved in selection and preview creation
- `tests/**`
- `e2e/**`

## Exact implementation slice

- verify the catalog detail to visualizer entry path end to end
- verify the selected wrap is preloaded correctly from the query-string handoff
- verify preview creation uses the approved wrap metadata from the catalog contract
- verify failure, fallback, and retry states remain coherent through the funnel
- tighten any cross-domain DTO, authz, or test gaps discovered during integration

## Non-goals

- do not start new architectural refactors unrelated to the catalog-visualizer funnel
- do not broaden into scheduling, billing, settings, admin, or platform work

## Required contracts to preserve

- catalog owns wrap visibility, readiness, and selection DTOs
- visualizer owns upload, preview lifecycle, provider orchestration, and ownership
- `/visualizer?wrapId=...` remains the cross-domain handoff contract

## Validation and tests

- run the highest-value affected unit and integration tests
- update or add Playwright smoke coverage for browse, detail, handoff, upload, preview, and retry/fallback states
- confirm hidden or non-ready wraps cannot enter the customer preview funnel

## Completion criteria

- a customer can browse catalog, open a wrap detail page, enter the visualizer with the selected wrap, upload a vehicle photo, and receive a preview
- cross-domain contracts are explicit and stable
- the funnel is covered by tests strong enough to support future iteration
