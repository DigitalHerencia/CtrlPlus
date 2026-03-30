# Catalog Refactor Prompt

Use this prompt for catalog-only refactor passes.

## Required Context

1. `.codex/prompts/refactor.master.prompt.md`
2. `.codex/docs/catalog.md`
3. `.codex/arch/codex_catalog_visualizer_migration_spec.md`
4. `.codex/instructions/catalog.instructions.md`
5. `.codex/contracts/catalog-visualizer.contract.yaml`
6. relevant `.codex/contracts/*.yaml`
7. relevant `.codex/execution/*.json`

## Goal

Advance only the catalog-relevant portion of the current refactor task without weakening the
catalog-to-visualizer contract.

## Live Repo Files To Inspect Before Editing

- `app/(tenant)/catalog/page.tsx`
- `app/(tenant)/catalog/[id]/page.tsx`
- `app/(tenant)/catalog/manage/page.tsx`
- `features/catalog/catalog-browse-page-feature.tsx`
- `features/catalog/catalog-detail-page-feature.tsx`
- `features/catalog/catalog-manager-page-feature.tsx`
- `features/catalog/catalog-manager-client.tsx`
- `features/catalog/catalog-wrap-assets-client.tsx`
- `components/catalog/WrapCard.tsx`
- `components/catalog/WrapDetail.tsx`
- `components/catalog/WrapImageManager.tsx`
- `lib/fetchers/catalog.fetchers.ts`
- `lib/fetchers/catalog.mappers.ts`
- `lib/actions/catalog.actions.ts`
- `types/catalog.types.ts`
- `schemas/catalog.schemas.ts`

## Phase Pairing

Pair this master prompt with exactly one of:

- `.codex/prompts/catalog.phase-01.asset-contract.prompt.md`
- `.codex/prompts/catalog.phase-02.browse-and-detail.prompt.md`
- `.codex/prompts/catalog.phase-03.manager-and-publish.prompt.md`
