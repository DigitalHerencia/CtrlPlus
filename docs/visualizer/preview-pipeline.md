# Visualizer Real Preview Pipeline

## Architecture note

The preview pipeline is server-authoritative and tenant-scoped:

1. Upload metadata is accepted through `uploadVehiclePhoto` and cached by deterministic `cacheKey`.
2. `generatePreview` transitions records through `pending -> processing -> complete|failed`.
3. Processing calls Hugging Face semantic segmentation to isolate vehicle regions.
4. A deterministic procedural texture is composited over masked vehicle pixels and persisted.
5. Results are cached for 24h using `VisualizerPreview.expiresAt`.

Template mode remains independent and always available as fallback.

## Storage decision

**Primary**: Vercel Blob (`@vercel/blob`) under key prefix:

- `visualizer/{tenantId}/{previewId}.png`

This preserves tenant scoping at object key level and works with Vercel runtime.

**Local/dev fallback**: data URL return when `BLOB_READ_WRITE_TOKEN` is absent.

## Hugging Face integration

The pipeline calls:

- `POST https://api-inference.huggingface.co/models/{HUGGINGFACE_VISUALIZER_MODEL}`

Default model:

- `facebook/mask2former-swin-large-cityscapes-semantic`

Behavior:

- retries with exponential backoff (`HUGGINGFACE_RETRIES`)
- request timeout (`HUGGINGFACE_TIMEOUT_MS`)
- selects top score from `car|truck|bus|vehicle` labels
- if unavailable, fallback center mask keeps previews functional

## Compositing algorithm

Implemented with `sharp` using generated SVG texture overlays (no binary assets in git):

- generate deterministic texture from wrap id
- apply alpha via configurable opacity
- clip texture with segmentation mask (`dest-in`)
- blend masked texture onto source (`multiply` or `overlay`)

## Security and safety

- server-side auth + tenant membership checks
- wrap ownership verified by tenant
- content type allow-list (`jpeg/png/webp`)
- max upload size limit (`VISUALIZER_MAX_UPLOAD_SIZE_BYTES`, default 10MB)
- no client-provided tenant ID trusted

## Environment variables

- `BLOB_READ_WRITE_TOKEN`
- `HUGGINGFACE_API_TOKEN`
- `HUGGINGFACE_VISUALIZER_MODEL`
- `HUGGINGFACE_INFERENCE_API_BASE` (optional)
- `HUGGINGFACE_TIMEOUT_MS`
- `HUGGINGFACE_RETRIES`
- `VISUALIZER_MAX_UPLOAD_SIZE_BYTES`
- `VISUALIZER_BLEND_MODE` (`multiply|overlay`)
- `VISUALIZER_OVERLAY_OPACITY` (`0..1`)

## Operational notes (Vercel)

- Keep previews asynchronous if API latency grows (queue/background function follow-up).
- Add Blob lifecycle/retention policy if storage growth becomes material.
- Monitor failed status ratios by tenant to detect model outages.

## Tests

Unit tests cover:

- cache key determinism
- status transitions and failure handling
- pipeline call mocking (no real HF network in unit tests)
