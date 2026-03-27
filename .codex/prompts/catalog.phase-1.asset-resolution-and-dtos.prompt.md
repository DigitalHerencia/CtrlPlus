# Catalog Phase 1 Prompt: Asset Resolution and DTOs

## Mission

Implement the catalog domain foundations required for deterministic wrap asset resolution and explicit DTO shaping.

## Authoritative specs

- `.codex/arch/codex_catalog_visualizer_migration_spec.md`
- `.codex/docs/catalog.md`
- `.codex/instructions/catalog.instructions.md`

## Upstream prerequisites

- existing catalog CRUD and image records remain intact
- no visualizer runtime changes in this phase

## Scope anchors

- `lib/catalog/**`
- `types/**` or schema modules only if the catalog domain already relies on them
- affected catalog unit and integration tests

## Exact implementation slice

- centralize a `WrapImageKind` contract around `hero`, `gallery`, `visualizer_texture`, and `visualizer_mask_hint`
- add pure asset-resolution helpers for hero, gallery, visualizer texture, and visualizer mask hint
- add or refine DTOs for `WrapCatalogCardDTO`, `WrapDetailViewDTO`, `WrapManagerRowDTO`, `WrapPublishReadinessDTO`, and `VisualizerWrapSelectionDTO`
- introduce publish-readiness validation logic that reports deterministic issues and warnings
- refactor catalog fetchers and builders only as needed to return these DTO shapes cleanly

## Non-goals

- do not refactor catalog page UX
- do not refactor manager UI flows
- do not implement visualizer generation logic

## Required contracts to preserve

- no `images[0]`-driven meaning
- one active hero and one active visualizer texture for MVP expectations
- server-authoritative publish-readiness decisions
- catalog-owned selection DTO for downstream visualizer use

## Validation and tests

- add or update tests for hero resolution
- add or update tests for gallery ordering
- add or update tests for visualizer texture resolution
- add or update tests for conflicting active-role detection
- add or update tests for publish-readiness issue reporting

## Completion criteria

- asset-role resolution is deterministic and reusable
- catalog DTOs are explicit and stable
- publish-readiness logic is centralized enough for later UI phases to consume directly
- downstream phases can rely on DTOs instead of raw wrap/image payloads
