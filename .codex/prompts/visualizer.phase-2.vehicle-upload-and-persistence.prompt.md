# Visualizer Phase 2 Prompt: Vehicle Upload and Persistence

## Mission

Implement vehicle upload validation, normalization, Cloudinary persistence, and preview-row creation before generation orchestration is introduced.

## Authoritative specs

- `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
- `.codex/docs/visualizer.md`
- `.codex/instructions/visualizer.instructions.md`

## Upstream prerequisites

- `visualizer.phase-1.catalog-handoff-and-wrap-selection.prompt.md` is complete and verified

## Scope anchors

- `lib/actions/visualizer.actions.ts`
- `lib/uploads/storage.ts`
- `lib/uploads/image-processing.ts`
- `components/visualizer/**`
- affected tests

## Exact implementation slice

- validate vehicle uploads for MIME and size
- normalize uploads server-side before generation
- persist normalized source images in Cloudinary
- create or update preview rows with `pending` and `processing` lifecycle transitions
- retain source wrap image id/version metadata in preview persistence
- expose UI states needed for upload submission and processing feedback

## Non-goals

- do not implement Hugging Face generation yet
- do not implement fallback composite yet
- do not finalize cache-reuse logic beyond what persistence setup requires

## Required contracts to preserve

- Cloudinary is the system of record for uploads and outputs
- heavy inline payloads do not land in DB rows
- preview lifecycle state remains explicit through `PreviewStatus`
- preview records remain scoped to the authenticated owner

## Validation and tests

- add or update tests for invalid upload rejection
- add or update tests for image normalization
- add or update tests for Cloudinary upload success/failure handling
- add or update tests for preview-row creation and lifecycle transitions

## Completion criteria

- vehicle uploads are durable, normalized, and traceable
- preview rows exist before provider generation starts
- the next phase can focus on prompting and HF orchestration without reworking upload persistence
