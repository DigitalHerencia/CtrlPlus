# Catalog Asset Workflow for Visualizer

## Objective

Define how catalog assets should be created and used so visualizer previews are based on real wrap art, not synthetic texture placeholders.

## Audit Summary (Current State)

- Catalog currently stores generic wrap images (`WrapImage`) with no asset role metadata.
- Visualizer server pipeline generates pattern textures in code and does not consume catalog wrap art.
- UI applies an extra client overlay from the first wrap image, which can diverge from server-rendered output.
- There is no explicit "hero vs visualizer texture" asset contract.

## Asset Contract (Recommended)

Each wrap should have at least:

- `hero` image: used for catalog cards/detail pages.
- `visualizer_texture` image: transparent or tile-ready texture used by server compositing.

Optional but useful:

- `visualizer_mask_hint` image: grayscale region hint to improve alignment.
- `visualizer_thumb` image: optimized small preview for selector grids.

## Authoring Specs

### `hero`

- Format: `jpg`, `png`, or `webp`
- Recommended size: `1600x900` or larger
- Purpose: product merchandising in catalog

### `visualizer_texture`

- Format: `png` or `webp` with alpha support preferred
- Recommended size: `2048x2048` (tile) or `3072x2048` (non-tile)
- Requirements:
  - avoid baked backgrounds and shadows
  - preserve key material detail at 100% zoom
  - include alpha where material should not render

### `visualizer_mask_hint` (optional)

- Format: `png`
- Resolution: match expected vehicle input profile if possible
- Meaning:
  - white = strongest wrap coverage
  - black = no coverage
  - gray = partial blend

## Ingestion Workflow (Catalog Admin)

1. Create or open a wrap in catalog management.
2. Upload `hero` image first for storefront consistency.
3. Upload `visualizer_texture` as a dedicated visualizer asset.
4. (Optional) Upload `visualizer_mask_hint`.
5. Reorder or label assets so backend can resolve the correct visualizer source deterministically.
6. Run a preview smoke test from `/visualizer` before publishing.

## Runtime Workflow (Visualizer)

1. Validate auth + `visualizer.use` capability.
2. Resolve wrap + active `visualizer_texture` asset.
3. Segment vehicle mask (HF inference with retry/fallback).
4. Composite using asset texture + mask + configured blend mode/opacity.
5. Cache by deterministic key:

- wrap id
- photo hash
- texture asset id/version
- model id
- blend/opacity config

6. Store and return `complete` preview DTO.

## Data Model Upgrade (Recommended)

Current schema lacks asset-role metadata. Add one of these:

- Extend `WrapImage` with `kind` enum (`hero`, `visualizer_texture`, `visualizer_mask_hint`, `gallery`).
- Or create `WrapAsset` table with role + version metadata and keep `WrapImage` for gallery only.

Minimum required fields for robust previews:

- `kind`
- `isActive`
- `version`
- `contentHash`

## Gaps to Close

- Add explicit asset role metadata in schema and UI.
- Remove or gate client-side overlay when processed preview already includes composited art.
- Use catalog visualizer asset in `preview-pipeline.ts` instead of generated texture fallback as the default path.
- Keep generated textures only as fallback when no visualizer asset is configured.
