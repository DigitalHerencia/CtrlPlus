---
description: Domain instructions for catalog delivery work
applyTo: app/(tenant)/catalog/**,features/catalog/**,components/catalog/**,lib/actions/catalog.actions.ts,lib/fetchers/catalog.fetchers.ts,lib/fetchers/catalog.mappers.ts,schemas/catalog.schemas.ts,types/catalog.types.ts,types/catalog/**,lib/uploads/storage.ts,lib/cache/revalidate-tags.ts
---

# Catalog Instructions

- Keep catalog routes thin and server-first.
- Preserve catalog as the source of truth for wrap discovery, detail presentation, publish readiness, and visualizer handoff.
- Keep asset resolution, publish readiness, and visualizer selection logic below UI layers.
- Treat `WrapImage.kind` as authoritative asset intent. Allowed values are `hero`, `gallery`, `visualizer_texture`, and `visualizer_mask_hint`.
- Never derive display or preview behavior from unordered `images[]` or `images[0]`.
- Keep the current read and write boundaries in place while work is still landing in `lib/fetchers/catalog.fetchers.ts`, `lib/fetchers/catalog.mappers.ts`, and `lib/actions/catalog.actions.ts`. File splitting is allowed only when it clearly reduces risk and execution state is updated in the same pass.
- Preserve current catalog DTO ownership. Any change touching browse, detail, manager, or visualizer-selection DTOs must update the matching docs, contract, and tests.

## Locked Catalog Invariants

- Catalog owns wrap CRUD, category mappings, asset-role semantics, publish readiness, and visualizer eligibility.
- Hero and visualizer texture assets are single-active-role surfaces for MVP. If conflicts exist, return deterministic output and record readiness issues rather than silently guessing.
- Public catalog surfaces must operate on resolved DTOs such as `CatalogBrowseCardDTO` and `CatalogDetailDTO`, not raw Prisma rows.
- `/visualizer?wrapId=...` remains the only supported customer handoff route unless the contract changes everywhere in the same pass.
- Demo and example catalog fixtures may remain for browse experiences, but they must not silently bypass visualizer readiness rules.

## Current High-Risk Files

- `lib/fetchers/catalog.fetchers.ts`
- `lib/fetchers/catalog.mappers.ts`
- `lib/actions/catalog.actions.ts`
- `components/catalog/WrapDetail.tsx`
- `components/catalog/WrapImageManager.tsx`
- `features/catalog/catalog-manager-client.tsx`

## Required Validation When Catalog Changes

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- targeted Vitest coverage for catalog DTO mapping, readiness, and asset-role behavior
- `pnpm build` when route, DTO, or server-boundary code changes
- `pnpm test:e2e --project=chromium --reporter=line` when catalog-to-visualizer handoff changes materially

## Execution Discipline

- Update `.codex/execution/backlog.json`, `.codex/execution/progress.json`, and `.codex/execution/validation.json` when catalog scope or validation state changes materially.
- Record any change to asset roles, DTO shape, or handoff semantics in `.codex/contracts/catalog-visualizer.contract.yaml`.
