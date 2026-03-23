# Visualizer Domain Spec

## Goal

Refactor the visualizer into a production-ready feature that preserves current repo boundaries while improving reliability, security, and usability under the target server-first architecture.

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

## Main requirements

- use deterministic wrap asset selection
- improve upload validation and storage strategy
- make preview status handling explicit
- reduce brittle synchronous UX
- preserve server-authoritative generation logic
- keep customer-facing selection limited to visualizer-ready wraps

## Key implementation points

- keep route entrypoints thin and move orchestration into `features/visualizer/**`
- keep image processing, storage, and provider integrations in `lib/visualizer/**`
- keep wrap selection catalog-backed and server-filtered to visualizer-ready wraps
- keep preview ownership scoped to the authenticated user and server session
- avoid inline heavy payload persistence where better storage references exist
- use File-based vehicle uploads and normalize them server-side before caching or generation
- reuse previews by deterministic cache key before generation
- run Hugging Face image generation behind an adapter and fall back immediately to deterministic compositing
- account for audit follow-up work around background processing and signed or short-lived preview delivery

## UX requirements

- better wrap selection UX
- cleaner upload flow
- clear progress, failure, retry, and success states
- final preview prioritized over fallback overlay behavior
- `/visualizer?wrapId=...` is the primary preselection handoff from catalog
- long-running work should present status-driven UX rather than pretending the request is instant

## Security/performance focus

- validate files server-side
- protect preview ownership
- avoid over-trusting remote sources
- keep generation resilient and cache-aware
- preserve source wrap image id or version on preview records for cache-key stability and traceability
- avoid duplicate generation for the same effective input set

## Acceptance signals

- visualizer routes, features, and helpers align with the target architecture
- visualizer flow feels ship-ready
- preview generation behavior is understandable
- core states are covered in UI and tests
- server boundaries remain clean
- HF unavailability does not block preview delivery because deterministic fallback still completes the request
