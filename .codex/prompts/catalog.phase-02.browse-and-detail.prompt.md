# Catalog Phase 02 Prompt

Use this prompt for the public browse and detail correctness pass.

## Objective

Keep catalog browse and detail surfaces product-like, deterministic, and aligned to explicit hero
and gallery assets.

## Primary Files

- `features/catalog/catalog-browse-page-feature.tsx`
- `features/catalog/catalog-detail-page-feature.tsx`
- `components/catalog/WrapCard.tsx`
- `components/catalog/WrapDetail.tsx`
- `lib/fetchers/catalog.fetchers.ts`
- `lib/fetchers/catalog.mappers.ts`

## Required Outcomes

1. Browse cards use deterministic display assets and correct preview links.
2. Detail page uses grouped asset DTOs rather than raw arrays.
3. Handoff to `/visualizer?wrapId=...` stays intact.
4. Hidden-wrap and demo-wrap behavior remain intentional.

## Required Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
