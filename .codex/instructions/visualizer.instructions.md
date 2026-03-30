---
description: Domain instructions for visualizer delivery work
applyTo: app/(tenant)/visualizer/**,features/visualizer/**,components/visualizer/**,lib/actions/visualizer.actions.ts,lib/fetchers/visualizer.fetchers.ts,lib/fetchers/visualizer.mappers.ts,lib/uploads/**,lib/integrations/**,schemas/visualizer.schemas.ts,types/visualizer/**,lib/cache/cache-keys.ts
---

# Visualizer Instructions

- Keep visualizer routes thin and status-driven.
- Preserve preview generation, uploads, provider access, and fallback behavior on the server.
- Do not move storage or provider semantics into client modules or presentational components.
- Preserve the current two-step lifecycle where preview creation and preview processing remain explicit server actions unless a dedicated refactor updates the contract and tests together.
- Selected wraps must come from the catalog handoff fetcher, not from client-provided image URLs or ad hoc wrap metadata.
- Keep provider logic behind `lib/integrations/huggingface.ts` and storage behind `lib/uploads/storage.ts`.
- Preserve preview traceability through `cacheKey`, `sourceWrapImageId`, and `sourceWrapImageVersion`.

## Locked Visualizer Invariants

- Preview statuses remain `pending`, `processing`, `complete`, and `failed`.
- The uploaded vehicle image is the structural base. The catalog-selected visualizer texture is the design reference.
- Hugging Face remains the primary generation path, and deterministic compositing remains the fallback path.
- Vehicle uploads and generated previews must resolve to durable URLs. Do not introduce new inline base64 persistence.
- Preview ownership stays scoped by `ownerClerkUserId`, and all reads or writes remain server-authoritative.

## Current High-Risk Files

- `lib/actions/visualizer.actions.ts`
- `lib/uploads/image-processing.ts`
- `lib/uploads/storage.ts`
- `lib/integrations/huggingface.ts`
- `features/visualizer/visualizer-workspace-client.tsx`
- `components/visualizer/VisualizerClient.tsx`
- `components/visualizer/UploadForm.tsx`
- `components/visualizer/PreviewCanvas.tsx`

## Environment-Sensitive Surfaces

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_WRAP_UPLOAD_PRESET`
- `CLOUDINARY_WRAP_FOLDER`
- `HUGGINGFACE_API_TOKEN`
- `HUGGINGFACE_VISUALIZER_MODEL`
- `HUGGINGFACE_VISUALIZER_PREVIEW_MODEL`
- `HUGGINGFACE_TIMEOUT_MS`
- `HUGGINGFACE_RETRIES`
- `VISUALIZER_MAX_UPLOAD_SIZE_BYTES`
- `VISUALIZER_BLEND_MODE`
- `VISUALIZER_OVERLAY_OPACITY`
- `VISUALIZER_ALLOWED_IMAGE_HOSTS`

## Required Validation When Visualizer Changes

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- targeted Vitest coverage for prompt construction, cache-key behavior, preview status transitions, and ownership
- `pnpm build` when route or action code changes
- `pnpm test:e2e --project=chromium --reporter=line` when the `/visualizer` entry flow, polling, or catalog handoff changes

## Execution Discipline

- Update `.codex/execution/backlog.json`, `.codex/execution/progress.json`, and `.codex/execution/validation.json` when visualizer scope or runtime assumptions change materially.
- Record any change to storage provider assumptions, preview lifecycle, or handoff inputs in `.codex/contracts/catalog-visualizer.contract.yaml`.
