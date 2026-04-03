---
description: 'Visualizer domain patterns. Use when working on preview generation, vehicle photo handling, AI integration, or visualizer components in lib/fetchers/visualizer.fetchers.ts, lib/actions/visualizer.actions.ts, lib/uploads/**, lib/integrations/huggingface.ts, features/visualizer/**, or components/visualizer/**.'
applyTo: 'lib/fetchers/visualizer*.ts, lib/actions/visualizer*.ts, lib/uploads/**, lib/integrations/huggingface.ts, features/visualizer/**, app/(tenant)/visualizer/**, components/visualizer/**'
---

# Visualizer Domain Instructions

The visualizer generates commercial wrap preview images. It depends on the catalog for wrap assets and uses AI (Hugging Face) to create vehicle segmentation masks.

## Core Principle

**Preview generation is async, not blocking.**

The visualizer uses a state machine for previews:

1. **User uploads photo** → create or reuse VisualizerPreview (pending)
2. **User submits** → trigger generation (state → processing)
3. **Backend generates** → segmentation + compositing via HF + Sharp (async)
4. **Store result** → mark complete or failed

Never block the page on generation. Support polling or webhook-based updates.

## Domain Entities

### VisualizerPreview

Preview request + cache entry + ownership tracking.

- `id`, `wrapId`
- `ownerClerkUserId` - which customer/session created this preview request
- `customerPhotoUrl` - HTTPS URL to stored vehicle photo (not base64)
- `processedImageUrl` - URL to generated preview image (nullable until complete)
- `status` - "pending" | "processing" | "complete" | "failed" | "expired"
- `cacheKey` - deterministic hash of (photo + wrap + config); used for reuse
- `sourceWrapImageId`, `sourceWrapImageVersion` - audit trail
- `expiresAt` - TTL for preview (cleanup policy)
- `createdAt`, `updatedAt`, `deletedAt`

Rules:

- `cacheKey` is reused to avoid regenerating identical previews
- Photos are stored as URLs (in Cloudinary), not base64
- Status lifecycle: pending → processing → complete|failed

### HuggingFace Integration

Segmentation model for vehicle detection and mask generation.

- Free, open-source model (e.g., real-ESRGAN or vehicle-segmentation)
- Endpoint via HF Inference API (or self-hosted)
- Returns mask imagery (PNG alpha channel)
- Fallback: deterministic solid-color or simple rectangular mask

### Storage (Cloudinary)

- Original vehicle photos: `/visualizer/uploads/{previewId}`
- Generated previews: `/visualizer/previews/{previewId}`
- Asset cleanup on `deletedAt`

## Fetchers: `lib/fetchers/visualizer.fetchers.ts`

### `getPreview(previewId)`

Fetch a preview record + status.

```typescript
export async function getPreview(
  previewId: string,
  ownerClerkUserId: string
): Promise<VisualizerPreviewDTO> {
  // Validates: preview exists, user is owner
  // Returns full record including URLs + status
}
```

### `getPreviewByWrapAndUser(wrapId, ownerClerkUserId)`

Get customer's current preview for a wrap (cache reuse).

```typescript
export async function getPreviewByWrapAndUser(
  wrapId: string,
  ownerClerkUserId: string
): Promise<VisualizerPreviewDTO | null> {
  // Returns most recent non-expired preview for this wrap + user
  // Used to reuse existing preview when same wrap is visited again
}
```

### `getVisualizerWrap(wrapId)`

Fetch wrap detail scoped for visualizer (catalog dependency).

```typescript
export async function getVisualizerWrap(wrapId: string): Promise<VisualizerWrapSelectionDTO> {
  // Returns: wrap id, name, hero image, visualizer_texture (must exist and be active)
  // Validates: wrap is published, visualizer_texture is present
  // For use in wrap selector + preview generation handoff
}
```

## Actions: `lib/actions/visualizer.actions.ts`

### `uploadVehiclePhoto(input)`

Customer uploads vehicle photo; create or reuse preview request.

```typescript
export async function uploadVehiclePhoto(
  input: UploadVehiclePhotoInput
): Promise<VisualizerPreviewDTO> {
  // 1. Auth: get session
  // 2. Validate: wrapId exists, is published, has visualizer_texture
  // 3. Receive: FormData with file (multipart) or base URL
  // 4. Upload: send file to Cloudinary storage
  // 5. Generate cache key: hash(photoUrl + wrapId + config)
  // 6. Check: does cache key match existing non-expired preview?
  //    - Yes: return existing (reuse)
  //    - No: create new VisualizerPreview (status: pending)
  // 7. Return: preview record (not yet generated)
}
```

Input:

- `wrapId` (string)
- `file` (FormData or presigned upload result)

Output: `VisualizerPreviewDTO` (status: pending)

### `generatePreview(previewId)`

Trigger preview generation (segmentation + compositing).

```typescript
export async function generatePreview(
  previewId: string
): Promise<VisualizerPreviewDTO> {
  // 1. Auth: get session
  // 2. Validate: preview exists, status is pending, not expired
  // 3. Fetch: customerPhotoUrl, wrapId, visualizerTexture
  // 4. Mark status: processing
  // 5. Call pipeline (async):
  //    - HF segmentation: get vehicle mask
  //    - Fetch wrap texture from catalog
  //    - Composite with Sharp
  //    - Upload result to Cloudinary
  // 6. Update: status = complete, processedImageUrl = result
  // 7. Return: full preview record with URL
  //
  // On error:
  // - Catch timeout, retry with fallback mask
  // - Catch storage error, mark status: failed
  // - Update processedImageUrl with fallback or error image
}
```

This action should update status immediately and let polling own the UX. Avoid making the page depend on the returned terminal state.

### `regeneratePreview(previewId)`

Customer re-triggers generation for same preview.

```typescript
export async function regeneratePreview(
  previewId: string
): Promise<VisualizerPreviewDTO> {
  // Same as generatePreview but allows re-triggering
  // Useful if HF timeout occurred or customer wants fresh render
  // Updates processedImageUrl with new result
}
```

## Types: `types/visualizer.types.ts`

```typescript
export interface VisualizerPreviewDTO {
  id: string;
  wrapId: string;
  ownerClerkUserId: string;
  customerPhotoUrl: string; // HTTPS, not base64
  customerPhotoHash: string;
  processedImageUrl: string | null;
  status: "pending" | "processing" | "complete" | "failed" | "expired";
  cacheKey: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisualizerWrapSelectionDTO {
  id: string;
  name: string;
  description: string | null;
  heroImage: {
    id: string;
    url: string;
  } | null;
  visualizerTexture: {
    id: string;
    url: string;
    version: number;
    contentHash: string;
  };
  aiPromptTemplate: string | null;
  aiNegativePrompt: string | null;
}
```

## Integrations: `lib/integrations/huggingface.ts` + `lib/uploads/**`

### `huggingface.ts`

Hugging Face Inference API client.

```typescript
export async function segmentVehicle(
  photoBytes: Buffer,
  config?: SegmentationConfig
): Promise<SegmentationResult> {
  // Calls HF Inference endpoint with photo
  // Receives: mask image (PNG with alpha)
  // Returns: mask URL or buffer
  // Handles: retries, timeout, fallback
}

export interface SegmentationResult {
  maskUrl: string;
  confidence: number; // 0-1
  vehicleDetected: boolean;
}
```

### `compositor.ts`

Wrap texture application and compositing.

```typescript
export async function compositeWrapPreview(
  input: CompositeInput
): Promise<Buffer> {
  // Receives: vehicle photo buffer, wrap texture, mask
  // Uses: Sharp (image processing)
  // Steps:
  //   1. Load vehicle photo
  //   2. Load wrap texture
  //   3. Apply mask to texture (punch holes for glass, etc.)
  //   4. Composite texture onto vehicle using mask as alpha
  //   5. Output: buffer as PNG/WebP
  // Returns: composite result buffer
}

export interface CompositeInput {
  vehiclePhotoBuffer: Buffer;
  wrapTextureUrl: string;
  maskUrl: string;
  outputFormat: "png" | "webp";
}
```

### `config.ts`

Configuration for HF endpoint, storage credentials, model selection.

```typescript
export const HF_MODEL = process.env.HF_MODEL ||  "vehicle-segmentation-default";
export const HF_API_KEY = process.env.HF_API_KEY;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const PREVIEW_TTL_DAYS = 30;
```

### `preview-pipeline.ts`

Orchestration of full preview generation.

```typescript
export async function runPreviewGeneration(
  preview: VisualizerPreview,
  wrap: VisualizerWrapSelectionDTO
): Promise<string> {
  // 1. Fetch vehicle photo from customerPhotoUrl
  // 2. Call segmentVehicle() with retry + fallback
  // 3. Fetch wrap texture from wrap.visualizerTexture.url
  // 4. Call compositeWrapPreview()
  // 5. Upload result to Cloudinary
  // 6. Return URL of generated preview
  //
  // Errors:
  // - HF timeout → use fallback rectangular mask
  // - Storage error → throw (handled by action)
  // - Composite error → throw
}
```

## Components: `components/visualizer/`

### WrapSelector

Wrap autocomplete/picker for visualizer.

Props:

- `onSelect: (wrap: VisualizerWrapSelectionDTO) => void`
- `initialWrapId?: string` (if coming from catalog)

Features:

- Search wraps by name
- Autocomplete dropdown
- Show hero image + name

### PhotoUploader

Vehicle photo upload form.

Props:

- `wrapId: string`
- `onUploadComplete: (preview: VisualizerPreviewDTO) => void`
- `onError: (error: Error) => void`

Features:

- File input (image only)
- Drag-and-drop
- URL paste (optional, for testing)
- Validation: max 5MB, 2:1 aspect ratio recommended
- Upload progress (if multipart)

### PreviewDisplay

Shows generated wrap preview image.

Props:

- `preview: VisualizerPreviewDTO`
- `onRegenerate?: () => void`

Features:

- Loading spinner while status: processing
- Show generated image when complete
- Fallback placeholder if failed
- Share/download button (optional)

### PreviewStatus

Status indicator for preview generation (pending → processing → complete).

Props:

- `preview: VisualizerPreviewDTO`
- `pollInterval?: number` (ms; default 2000)

Features:

- Display status badge
- Poll preview endpoint for updates
- Show retry button if failed

## Features: `features/visualizer/`

### VisualizerFlow

Main visualizer experience.

1. Wrap selector (pre-filled if from catalog)
2. Photo uploader
3. Preview display + regenerate
4. CTA: "Add to Cart" or "Continue Shopping"

State management:

- Selected wrap
- Preview record + status
- Polling state
- Error handling

## Auth & Authz

### Authenticated paths

- `/visualizer` (with optional `?wrapId=...` query param)

### Checks

- All mutations: authenticated user with server-side ownership/capability checks
- Ownership: `preview.ownerClerkUserId === session.userId`
- Wrap authz: wrap must be published (not hidden)

## Storage Strategy

| What               | Location                               | Cleanup                                | Duration      |
| ------------------ | -------------------------------------- | -------------------------------------- | ------------- |
| Vehicle photos     | Cloudinary `/visualizer/uploads/{previewId}`  | On preview delete/expire               | 30 days (TTL) |
| Generated previews | Cloudinary `/visualizer/previews/{previewId}` | On preview delete/expire               | 30 days (TTL) |
| Preview records    | VisualizerPreview table                | Soft-delete; hard-delete after 30 days | 30 days       |

## Caching & Reuse

When customer uploads same photo for same wrap:

1. Generate `cacheKey = hash(photoUrl + wrapId)`
2. Check: does existing Preview with this cacheKey exist and is it not expired?
3. If yes: reuse (no new generation)
4. If no: create new Preview and generate

This reduces HF calls and storage volume while allowing re-renders if customer wants.

## Error Handling

| Error                  | Handling                                                                      |
| ---------------------- | ----------------------------------------------------------------------------- |
| HF timeout             | Retry 2x with exponential backoff; use fallback rectangular mask if both fail |
| HF 429 (rate limit)    | Queue in DB; eventually trigger generation when quota available               |
| HF model error         | Log to monitoring; use fallback mask                                          |
| Cloudinary upload fail | Retry once; mark preview as failed                                            |
| Sharp composite error  | Mark preview as failed; log stack trace                                       |
| Photo too large        | Reject in uploadVehiclePhoto; client shows error                              |
| Invalid wrap           | Reject; wrap must have visualizer_texture                                     |

## Production Readiness Checklist

- [ ] Vehicle photos stored as URLs only (no base64 in DB)
- [ ] Cache key deterministic and prevents collision
- [ ] Status lifecycle state machine documented
- [ ] HF fallback mask working when inference unavailable
- [ ] Preview TTL and cleanup working
- [ ] Storage cleanup on preview delete
- [ ] Error handling for all pipeline stages
- [ ] Monitoring / observability for generation times
- [ ] E2E test: upload → generate → view
- [ ] Load test for concurrent HF requests
- [ ] Security: SSRF / redirect prevention for remote fetches

## Related Resources

- Product requirements: [`docs/PRD.md`](../docs/PRD.md)
- Architecture guide: [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)
- Data model guide: [`docs/DATA-MODEL.md`](../docs/DATA-MODEL.md)
- Catalog dependency: [`catalog.instructions.md`](./catalog.instructions.md)
- Cloudinary setup: `lib/integrations/cloudinary.ts`
- HF Inference docs: https://huggingface.co/inference-api
