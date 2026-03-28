# Visualizer Phase 1 Prompt: Catalog Handoff and Wrap Selection

## Mission

Implement the visualizer-side consumption of the catalog handoff contract so the page can preload a server-approved wrap from `/visualizer?wrapId=...`.

## Authoritative specs

- `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
- `.codex/arch/codex_catalog_visualizer_migration_spec.md`
- `.codex/docs/visualizer.md`
- `.codex/instructions/visualizer.instructions.md`

## Upstream prerequisites

- `catalog.phase-4.visualizer-handoff.prompt.md` is complete and verified

## Scope anchors

- `app/(tenant)/visualizer/**`
- `features/visualizer/**`
- `lib/fetchers/visualizer.fetchers.ts`
- shared catalog-selection boundary files
- affected tests

## Exact implementation slice

- load and validate `wrapId` server-side
- implement or finalize visualizer-side selection fetchers around the catalog-approved DTO
- preload the selected wrap before the client shell renders
- keep route files thin and pass typed props into the visualizer feature shell
- ensure invalid, hidden, or non-ready wraps are rejected at the server boundary

## Non-goals

- do not implement upload normalization or persistence yet
- do not implement provider-backed generation yet

## Required contracts to preserve

- the catalog remains the source of truth for wrap selection
- the selected wrap DTO exposes active visualizer texture metadata and optional prompt metadata
- the handoff stays compatible with a downstream `VisualizerWrapInput`
- no client-authoritative wrap asset selection

## Validation and tests

- add or update tests for wrap selection fetchers
- add or update tests for invalid `wrapId` handling
- add or update route and feature tests for server-preloaded selected wraps

## Completion criteria

- entering `/visualizer?wrapId=...` reliably produces a server-approved selected wrap state
- the visualizer client shell no longer depends on raw wrap lists for initial selection
- later phases can assume a stable selected wrap contract
