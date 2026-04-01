# Catalog Phase 03 Prompt

Use this prompt for the catalog manager and publish workflow pass.

## Objective

Finish manager correctness around metadata editing, category mapping, asset-role management, and
publish readiness.

## Primary Files

- `features/catalog/catalog-manager-client.tsx`
- `features/catalog/catalog-wrap-assets-client.tsx`
- `components/catalog/WrapImageManager.tsx`
- `lib/actions/catalog.actions.ts`
- `lib/fetchers/catalog.fetchers.ts`

## Required Outcomes

1. Manager UX distinguishes display assets from visualizer assets clearly.
2. Hero and visualizer texture exclusivity remains server-enforced.
3. Publish and unpublish flows remain auditable and deterministic.
4. Revalidation continues to cover both catalog and visualizer surfaces after asset changes.

## Required Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
