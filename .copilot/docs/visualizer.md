# Visualizer Domain Spec

## Goal

Refactor the visualizer into a production-ready feature that preserves current repo boundaries while improving reliability, security, and usability.

## Current repo anchors

- `app/(tenant)/visualizer/page.tsx`
- `components/visualizer/VisualizerClient.tsx`
- `components/visualizer/UploadForm.tsx`
- `components/visualizer/WrapSelector.tsx`
- `components/visualizer/PreviewCanvas.tsx`
- `lib/visualizer/actions/*`
- `lib/visualizer/fetchers/get-preview.ts`
- `lib/visualizer/preview-pipeline.ts`

## Main requirements

- use deterministic wrap asset selection
- improve upload validation and storage strategy
- make preview status handling explicit
- reduce brittle synchronous UX
- preserve server-authoritative generation logic

## Key implementation points

- keep image processing in `lib/visualizer/**`
- keep page/component orchestration separate from pipeline internals
- add clearer status model handling in UI
- keep preview ownership scoped to authenticated user/server session
- avoid inline heavy payload persistence where better storage references exist

## UX requirements

- better wrap selection UX
- cleaner upload flow
- clear progress state
- failure + retry path
- final preview prioritized over fallback overlay behavior

## Security/performance focus

- validate files server-side
- protect preview ownership
- avoid over-trusting remote sources
- keep generation resilient and cache-aware

## Acceptance signals

- visualizer flow feels ship-ready
- preview generation behavior is understandable
- core states are covered in UI and tests
- server boundaries remain clean
