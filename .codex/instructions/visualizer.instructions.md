---
description: 'Domain instructions for the vehicle visualizer'
applyTo: 'app/(tenant)/visualizer/**,components/visualizer/**,features/visualizer/**,lib/visualizer/**,lib/integrations/huggingface.ts,lib/uploads/**,lib/cache/**,schema/visualizer/**,types/visualizer/**'
---

# Visualizer Domain Instructions

## Domain purpose

The visualizer lets an authenticated user enter with a catalog-approved wrap, upload a vehicle image, generate an AI concept preview, and view or regenerate the resulting render with clear lifecycle state and ownership boundaries.

## Scope boundaries

This domain owns:

- visualizer page orchestration
- catalog-backed wrap selection consumption
- vehicle upload flow
- preview creation and retrieval
- Hugging Face preview generation adapter
- fallback composite generation
- preview caching and storage
- visualizer-specific UI state

This domain does not own:

- catalog CRUD
- wrap category management
- catalog publish-readiness rules
- billing creation
- scheduling workflows
- platform recovery tooling

## Required patterns

- Keep `app/(tenant)/visualizer/page.tsx` thin.
- Put reads in `lib/visualizer/fetchers/**`.
- Put writes in `lib/visualizer/actions/**`.
- Future refactors should move page composition into `features/visualizer/**`.
- Keep image processing, uploads, cache keys, and provider integrations inside `lib/uploads/**`, `lib/cache/**`, and `lib/integrations/**`.
- Keep interactive UI in `components/visualizer/**`.
- Use catalog-backed visualizer selection fetchers rather than reading raw wrap/image lists in the page.
- Keep Hugging Face behind an adapter boundary so model changes do not leak into actions or UI.

## Hard product requirements

- Selecting a wrap must use catalog-approved deterministic asset resolution, not incidental image ordering.
- Customer-facing selection must exclude wraps that are not visualizer-ready.
- Preview generation must have a clear `PreviewStatus` lifecycle: `pending`, `processing`, `complete`, `failed`.
- Cloudinary is the system of record for original vehicle uploads and generated preview outputs.
- Preview generation should attempt Hugging Face first and automatically fall back to `fallback_composite` when generation is unavailable or unstable.
- UI copy and behavior must frame the result as an AI preview or concept render, not an exact production proof.

## Catalog handoff contract

- The primary entry path is `/visualizer?wrapId=...`.
- Selected wraps must be loaded server-side before the client shell renders.
- Never trust client-provided wrap asset ids or URLs.
- Preserve or introduce catalog-backed DTOs such as `VisualizerWrapSelectionDTO` with the active visualizer texture and optional prompt metadata.
- Hidden or invalid wraps must stay blocked at the server boundary unless elevated access is explicitly intended.

## Lifecycle and persistence contract

- `createVisualizerPreview` and `regenerateVisualizerPreview` must enforce auth, capability, ownership, and wrap validity server-side.
- Preview rows must preserve `sourceWrapImageId` and `sourceWrapImageVersion`.
- Use deterministic cache keys that incorporate owner identity, wrap metadata, normalized vehicle image input, generation mode, model, and prompt version.
- Avoid storing heavy inline payloads in database rows.
- Cloudinary uploads should retain metadata needed for audit and debugging.

## Provider and environment requirements

- Support `HF_API_KEY`, `HF_IMAGE_TO_IMAGE_MODEL`, and `HF_TIMEOUT_MS`.
- Keep model-specific assumptions out of UI code.
- Normalize provider errors into domain-level failure behavior.
- Preserve a clean fallback path so HF instability does not break the feature outright.

## Security requirements

- Enforce `visualizer.use` capability server-side.
- Never trust client-provided wrap ownership or preview ownership.
- Preview records must be scoped to the authenticated owner/user identity already used by the repo.
- Treat uploaded vehicle images and generated previews as sensitive user content.
- Avoid exposing raw storage internals to the client.
- Harden remote image fetch behavior and MIME/size validation.

## UI requirements

- `VisualizerClient` is the feature shell, not the pipeline implementation.
- `WrapSelector` should make it obvious which catalog wrap drives generation.
- `UploadForm` should validate file type, size, and intent before submit.
- `PreviewCanvas` should privilege final output and render explicit loading, failed, and recovery states.
- Include explicit empty states and retry paths.
- Prefer status-driven UX over pretending long-running work is instant.

## Performance requirements

- Do not block the UI on long-running inference if status-based polling is feasible.
- Reuse preview cache keys deterministically.
- Avoid duplicate generation for the same effective input set.
- Prefer storage references over inline base64 strings.
- Preserve room for background processing and signed or short-lived preview delivery when the runtime implementation evolves.

## Testing requirements

Add or update tests when changing:

- catalog-backed wrap selection
- upload validation and normalization
- preview generation behavior
- preview lifecycle transitions
- cache-key behavior
- preview ownership rules
- fallback rendering behavior
- visualizer page happy path and failure path

## Refactor priorities

1. make catalog handoff and wrap selection deterministic
2. move photo ingestion to durable storage references
3. make preview generation resilient and status-driven
4. tighten server-side validation and ownership checks
5. improve visualizer usability and operational clarity
