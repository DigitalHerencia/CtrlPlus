---
title: CtrlPlus Catalog Delivery Notes
status: Active
owner: Codex
last_updated: 2026-03-30
---

# CtrlPlus Catalog Delivery Notes

The catalog domain is the storefront and wrap-management source of truth for the next delivery phase.

## Source References

- `SRC-CATALOG-MIGRATION-2026-03-30`
- `SRC-VISUALIZER-AUDIT-2026-03-30`
- `SRC-REPO-STATE-2026-03-30`

## Focus

- Keep catalog browse and detail routes thin in `app/(tenant)/catalog/**`
- Preserve orchestration in `features/catalog/**`
- Keep wrap DTO shaping, publish readiness, and visualizer handoff server-authoritative
- Align agent guidance to the current repo topology before further file extraction work

## Non-Negotiables

- Never infer asset meaning from unordered image arrays.
- Keep catalog-to-visualizer handoff server-validated through wrap identity.
- Do not move publish-readiness rules into route files or presentational components.
- Preserve `WrapImage.kind` as the asset-role discriminator.
- Preserve explicit browse, detail, manager, and visualizer-selection DTOs.

## Current Repo Reality

- `prisma/schema.prisma` already carries `WrapImage.kind`, `version`, `contentHash`, and `VisualizerPreview.sourceWrapImageId/sourceWrapImageVersion`.
- `lib/fetchers/catalog.fetchers.ts` already resolves hero, gallery, readiness, and visualizer-selection DTOs, but it still operates from a monolithic fetcher file and includes example data paths.
- `lib/actions/catalog.actions.ts` already supports asset upload, metadata updates, readiness-aware publish and unpublish flows, and revalidation of catalog plus visualizer routes.
- `features/catalog/catalog-manager-client.tsx` and `components/catalog/WrapImageManager.tsx` already expose asset-role management, but future work still needs to keep manager UX coherent and DTO-driven.

## Active File Map

- Route shells: `app/(tenant)/catalog/page.tsx`, `app/(tenant)/catalog/[id]/page.tsx`, `app/(tenant)/catalog/manage/page.tsx`
- Feature shells: `features/catalog/catalog-browse-page-feature.tsx`, `features/catalog/catalog-detail-page-feature.tsx`, `features/catalog/catalog-manager-page-feature.tsx`, `features/catalog/catalog-manager-client.tsx`
- Read boundary: `lib/fetchers/catalog.fetchers.ts`, `lib/fetchers/catalog.mappers.ts`
- Write boundary: `lib/actions/catalog.actions.ts`
- Shared types and validation: `types/catalog.types.ts`, `schemas/catalog.schemas.ts`
- High-value tests: catalog fetcher and action unit coverage, `tests/vitest/unit/components/catalog/WrapImageManager.test.tsx`, and Playwright route smoke tests

## Planned Delivery Sequence

1. Lock asset-role resolution and readiness contracts.
2. Harden browse and detail DTO behavior around explicit hero and gallery usage.
3. Tighten manager UX around publish readiness, texture replacement, and asset-role clarity.
4. Preserve or improve the catalog-to-visualizer handoff contract without widening page-layer responsibility.

## Known Gaps To Carry Forward

- Generic `.codex` prompts and execution state were behind the live catalog implementation before this prep pass.
- `.env.example` previously omitted Cloudinary and visualizer provider vars even though catalog uploads already depend on them.
- There is no repo-local CI workflow definition under `.github/workflows`, so validation discipline must stay explicit in prompts and execution state.

## Use With

- `.codex/arch/codex_catalog_visualizer_migration_spec.md`
- `.codex/instructions/catalog.instructions.md`
- `.codex/contracts/catalog-visualizer.contract.yaml`
- `.codex/prompts/catalog.refactor.prompt.md`
