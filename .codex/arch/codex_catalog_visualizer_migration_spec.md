---
title: Catalog Visualizer Migration Spec
status: Active
owner: Codex
last_updated: 2026-03-30
---

# Catalog Visualizer Migration Spec

This spec defines the shared delivery boundary between the catalog storefront and the visualizer preview flow.

## Source Provenance

- `SRC-CATALOG-MIGRATION-2026-03-30`
- `SRC-VISUALIZER-AUDIT-2026-03-30`
- `SRC-REPO-STATE-2026-03-30`

## Shared Contract

- Catalog owns wrap discovery, wrap detail, asset intent, and visualizer selection eligibility.
- Visualizer owns vehicle upload, preview generation, preview polling, and preview review.
- The handoff remains `/visualizer?wrapId=...` with server-side wrap validation.
- Asset intent is explicit through `WrapImage.kind` and never inferred from array order.
- Preview traceability persists through `sourceWrapImageId` and `sourceWrapImageVersion`.

## Migration Priorities

1. Keep catalog asset meaning explicit and deterministic.
2. Keep visualizer generation status-driven and server-authoritative.
3. Avoid collapsing catalog and visualizer into a single overloaded feature layer.
4. Align future agent prompts and execution state with the live repo topology rather than a generic earlier refactor program.

## Live Repo Alignment

- Catalog browse, detail, manager, and visualizer-selection DTO shaping already exists in `lib/fetchers/catalog.fetchers.ts`.
- Visualizer selection, preview creation, processing, and regeneration already exist in `lib/actions/visualizer.actions.ts` and `lib/fetchers/visualizer.fetchers.ts`.
- Manager and visualizer UI shells are already present. The next delivery passes should harden them rather than re-scaffold them.

## Next Delivery Phases

1. Catalog asset and readiness correctness.
2. Catalog public browse and detail correctness.
3. Catalog manager clarity and publish controls.
4. Visualizer provider, upload, and storage hardening.
5. Integration and E2E signoff for `/catalog -> /visualizer`.

## Acceptance

- Catalog continues to decide which wraps are eligible for visualizer selection.
- Visualizer continues to operate on server-validated wrap and upload inputs.
- Shared contracts remain documented in markdown, YAML, and JSON as the program evolves.
