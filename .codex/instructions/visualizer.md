# Visualizer Domain Notes

## Current Behavior

- Upload flow writes `VisualizerPreview` records and caches by deterministic `cacheKey`.
- Segmentation uses Hugging Face first, then falls back to a simple center mask.
- Compositing currently uses generated textures, not catalog-specific visualizer assets.

## Required Guardrails

- Actions must enforce: `auth -> authorize -> validate -> mutate -> audit`.
- Enforce `visualizer.use` capability before preview creation or generation.
- Resolve and enforce tenant scope server-side for every visualizer query and mutation.
- Keep hidden-wrap restrictions for non-owner/admin users.

## Catalog Asset Direction

- Catalog should define explicit visualizer asset roles (`hero`, `visualizer_texture`, optional `visualizer_mask_hint`).
- Visualizer server pipeline should consume `visualizer_texture` first and use synthetic textures only as fallback.
- See `.codex/docs/visualizer/catalog-asset-workflow.md` for the end-to-end asset contract.
