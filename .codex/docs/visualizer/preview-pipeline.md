# Visualizer Preview Pipeline

## Current Runtime Flow

1. Customer selects a wrap and uploads a vehicle photo (or picks a template image).
2. `uploadVehiclePhoto` validates image type and size, then creates or reuses a `VisualizerPreview` by deterministic `cacheKey`.
3. `generatePreview` marks the preview as `processing`.
4. Server pipeline tries Hugging Face segmentation first; if it fails, it falls back to a center-ellipse mask.
5. A generated texture is composited with the vehicle mask and blended onto the customer photo.
6. The processed result is stored at `visualizer/previews/{previewId}.png` (Blob when configured, `data:` URL fallback otherwise).
7. Preview status is updated to `complete` or `failed`, and action events are logged to `AuditLog`.

## Current Asset Behavior

- Catalog wrap images are used in the UI (`WrapSelector` thumbnails and a client overlay hint in `PreviewCanvas`).
- Server-side compositing currently does **not** consume a catalog-managed visualizer texture asset.
- Result: visualizer output is deterministic but synthetic (texture chosen from a code-side texture library).

## Security and Authorization

- Input validation is server-side.
- Wrap visibility is enforced (`isHidden` restricted for non-owner/admin).
- No client-provided ownership scope is trusted.
- Visualizer actions must enforce `visualizer.use` capability before mutation.

## Operational Checks

- Track status mix: `pending`, `processing`, `complete`, `failed`.
- Track failure ratio and median/p95 preview generation latency.
- Track Hugging Face fallback rate (segmentation error -> fallback mask).
- Track Blob write success/failure and fallback-to-inline ratio.

## Next Upgrade

Use the catalog asset workflow in `.codex/docs/visualizer/catalog-asset-workflow.md` to shift from synthetic textures to explicit catalog-owned visualizer assets.
