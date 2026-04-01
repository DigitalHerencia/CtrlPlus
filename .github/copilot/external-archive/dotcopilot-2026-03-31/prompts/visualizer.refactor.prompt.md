# Visualizer Refactor Prompt

Use this prompt for visualizer-only refactor passes.

## Required Context

1. `.copilot/prompts/refactor.master.prompt.md`
2. `.copilot/docs/visualizer.md`
3. `.copilot/arch/copilot_visualizer_huggingface_generation_spec.md`
4. `.copilot/instructions/visualizer.instructions.md`
5. `.copilot/contracts/catalog-visualizer.contract.yaml`
6. relevant `.copilot/contracts/*.yaml`
7. relevant `.copilot/execution/*.json`

## Goal

Advance only the visualizer-relevant portion of the current refactor task while keeping preview
generation server-authoritative.

## Live Repo Files To Inspect Before Editing

- `app/(tenant)/visualizer/page.tsx`
- `features/visualizer/visualizer-page-feature.tsx`
- `features/visualizer/visualizer-workspace-client.tsx`
- `features/visualizer/visualizer-preview-poller-client.tsx`
- `components/visualizer/VisualizerClient.tsx`
- `components/visualizer/UploadForm.tsx`
- `components/visualizer/WrapSelector.tsx`
- `components/visualizer/PreviewCanvas.tsx`
- `lib/fetchers/visualizer.fetchers.ts`
- `lib/fetchers/visualizer.mappers.ts`
- `lib/actions/visualizer.actions.ts`
- `lib/uploads/image-processing.ts`
- `lib/uploads/storage.ts`
- `lib/integrations/huggingface.ts`
- `lib/cache/cache-keys.ts`
- `types/visualizer.types.ts`
- `schemas/visualizer.schemas.ts`

## Phase Pairing

Pair this master prompt with exactly one of:

- `.copilot/prompts/visualizer.phase-01.handoff-and-selection.prompt.md`
- `.copilot/prompts/visualizer.phase-02.generation-and-storage.prompt.md`
