# Catalog Phase 3 Prompt: Manager and Publish Readiness

## Mission

Refactor catalog management into a coherent operator workflow with explicit asset-role handling and publish-readiness visibility.

## Authoritative specs

- `.codex/arch/codex_catalog_visualizer_migration_spec.md`
- `.codex/docs/catalog.md`
- `.codex/instructions/catalog.instructions.md`

## Upstream prerequisites

- `catalog.phase-1.asset-resolution-and-dtos.prompt.md` is complete and verified
- `catalog.phase-2.public-storefront.prompt.md` is complete if shared DTO/view-model changes are needed

## Scope anchors

- `app/(tenant)/catalog/manage/**` or equivalent manager routes
- `features/catalog/**`
- `components/catalog/CatalogManager.tsx`
- `components/catalog/WrapImageManager.tsx`
- `lib/actions/catalog.actions.ts`
- affected tests

## Exact implementation slice

- unify manager orchestration around the new readiness and DTO contracts
- make hero, gallery, visualizer texture, and mask hint roles obvious in manager UI
- support explicit create, edit, category assignment, asset management, hide, delete, publish, and unpublish flows
- surface readiness state, blocking issues, warnings, and safer action affordances
- enforce hero and visualizer texture exclusivity at mutation time

## Non-goals

- do not implement visualizer preview generation
- do not broaden into unrelated admin, billing, or scheduling workflows

## Required contracts to preserve

- publish decisions remain server-side
- readiness issues remain deterministic and explainable
- manager UI consumes catalog-owned DTOs instead of ad hoc raw records
- asset-role mutation rules stay centralized in catalog actions/helpers

## Validation and tests

- add or update tests for manager row DTO construction
- add or update tests for readiness issue display
- add or update tests for publish and unpublish behavior
- add or update tests for hero and texture exclusivity at mutation time

## Completion criteria

- catalog management feels like one coherent operational workflow
- publish-readiness is visible and actionable
- asset roles are unambiguous in both code and UI
- the final catalog phase can wire visualizer handoff on top of stable manager behavior
