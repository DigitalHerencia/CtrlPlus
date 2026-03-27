# Visualizer Domain Spec

## Goal

Refactor the visualizer into a production-ready, catalog-driven preview feature that accepts a selected wrap and a customer vehicle photo, generates an AI-assisted concept preview, stores original and generated assets in Cloudinary, and preserves strict server-side ownership and lifecycle control.

## Authoritative references

- `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
- `.codex/arch/codex_catalog_visualizer_migration_spec.md` for upstream catalog handoff requirements

## Current repo anchors

- `app/(tenant)/visualizer/page.tsx`
- `features/visualizer/**`
- `components/visualizer/VisualizerClient.tsx`
- `components/visualizer/UploadForm.tsx`
- `components/visualizer/WrapSelector.tsx`
- `components/visualizer/PreviewCanvas.tsx`
- `lib/visualizer/actions/**`
- `lib/visualizer/fetchers/get-wrap-selections.ts`
- `lib/visualizer/fetchers/get-preview.ts`
- `lib/visualizer/huggingface/**`
- `lib/visualizer/preview-pipeline.ts`
- `lib/catalog/fetchers/**`

## Product framing

- The visualizer is a storefront sales aid that produces an AI concept preview, not a print-proofing or manufacturing-accuracy engine.
- The uploaded vehicle image is the structural base.
- The selected catalog wrap is the design authority.
- The output should be framed in product copy as an AI preview or concept render, not an exact production proof.

## Source-of-truth responsibilities

The visualizer owns:

- authenticated preview creation and retrieval
- vehicle image validation and normalization
- preview lifecycle state transitions
- Hugging Face generation orchestration
- fallback composite generation
- Cloudinary-backed upload and preview persistence
- preview ownership, cache reuse, and regenerate flows

The visualizer does not own:

- wrap CRUD or category management
- visualizer texture selection rules
- catalog publish-readiness logic

## Required contracts

### Upstream catalog contract

The visualizer may only consume wraps returned by catalog-approved selection fetchers. At minimum, the selected wrap DTO should expose:

- `id`
- `name`
- `description`
- resolved `heroImage`
- exactly one active `visualizerTexture`
- optional prompt metadata such as `aiPromptTemplate` and `aiNegativePrompt`

### Preview lifecycle contract

The visualizer must use an explicit `PreviewStatus` contract with these statuses:

- `pending`
- `processing`
- `complete`
- `failed`

### Primary action contract

The visualizer should preserve or introduce these domain contracts:

- `VisualizerWrapInput`
- `createVisualizerPreview`
- `regenerateVisualizerPreview`
- `getVisualizerWrapSelection`
- `getVisualizerPreviewById`
- deterministic preview cache key helpers
- Hugging Face adapter boundary and fallback composite boundary

## Generation strategy

- primary mode is Hugging Face image-to-image style generation driven by a catalog-selected wrap and a normalized vehicle image
- generation must be hidden behind a dedicated adapter so the model can change without rewriting domain actions
- a fallback composite path is mandatory so the user can still receive a preview if free inference is unavailable or unstable
- the catalog-selected visualizer texture must materially influence the output, either through prompt construction, reference-board preprocessing, or both

## Storage and persistence requirements

- Cloudinary is the system of record for customer uploads and generated preview outputs
- preview rows should store URLs and source metadata, not large inline image payloads
- preview records must retain `sourceWrapImageId` and `sourceWrapImageVersion`
- cache keys should capture the effective generation inputs so duplicate preview work can be reused safely

## UX requirements

- `/visualizer?wrapId=...` is the primary entry path from the catalog
- the selected wrap should load server-side before the client shell renders
- upload flow must show clear validation, pending, processing, failed, and success states
- preview UI should privilege the final generated result and make retry/regenerate behavior explicit
- long-running work should feel status-driven rather than pretending to be instantaneous

## Security/performance focus

- require authentication and `visualizer.use` server-side
- keep preview access scoped to the preview owner unless elevated access is explicitly intended
- never trust client-provided wrap asset ids, URLs, or Cloudinary metadata
- normalize uploads server-side before generation
- avoid duplicate generation by checking the deterministic cache key before invoking providers
- fail fast from provider instability into the fallback path when possible

## Acceptance signals

- wrap selection remains catalog-backed and server-authoritative
- preview generation is status-driven and operationally understandable
- originals and outputs live in Cloudinary with traceable metadata
- preview ownership and cache stability remain intact
- HF failures no longer imply total feature failure because fallback composite still delivers a usable concept preview
