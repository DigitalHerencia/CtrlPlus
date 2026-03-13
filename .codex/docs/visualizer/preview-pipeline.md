# Visualizer Preview Pipeline

## Current Runtime Flow

1. Customer selects a wrap and uploads a vehicle photo (or picks a template image).
2. `uploadVehiclePhoto` validates image source/type/size, resolves the active visualizer texture candidate from catalog assets, then creates or reuses a `VisualizerPreview` by deterministic `cacheKey`.
3. `generatePreview` enforces ownership (`ownerClerkUserId`) and marks the preview as `processing`.
4. Server pipeline tries Hugging Face segmentation first; if it fails, it falls back to a center-ellipse mask.
5. Server compositing resolves catalog texture assets first (`visualizer_texture`/`hero` precedence), and falls back to generated synthetic textures only when no valid asset is available.
6. The processed result is stored at `visualizer/previews/{previewId}.png` (Blob when configured, `data:` URL fallback otherwise).
7. Preview status is updated to `complete` or `failed`; success actions are logged to `AuditLog`.

## Current Asset Behavior

- Catalog wrap images drive selector/UI surfaces.
- Server-side compositing consumes catalog-managed texture assets as the authoritative source when available.
- Synthetic texture generation is retained only as explicit fallback for wraps missing visualizer-ready assets.

## Security and Authorization

- Input validation is server-side.
- Wrap visibility is enforced (`isHidden` restricted for non-owner/admin users).
- Preview read/generate paths enforce ownership via `ownerClerkUserId`.
- Visualizer actions enforce `visualizer.use` capability before mutation.

## Operational Checks

- Track status mix: `pending`, `processing`, `complete`, `failed`.
- Track failure ratio and median/p95 preview generation latency.
- Track Hugging Face fallback rate (segmentation error -> fallback mask).
- Track Blob write success/failure and fallback-to-inline ratio.

## Next Upgrade

Add explicit instrumentation and failure audit events so runtime monitoring aligns with the operational checks above.
