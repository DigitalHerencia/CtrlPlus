# Visualizer Phase 3 Prompt: Hugging Face Generation and Prompting

## Mission

Implement the primary AI preview path using prompt construction, generation-board preprocessing, and a model-configurable Hugging Face adapter.

## Authoritative specs

- `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
- `.codex/docs/visualizer.md`
- `.codex/instructions/visualizer.instructions.md`

## Upstream prerequisites

- `visualizer.phase-1.catalog-handoff-and-wrap-selection.prompt.md` is complete and verified
- `visualizer.phase-2.vehicle-upload-and-persistence.prompt.md` is complete and verified

## Scope anchors

- `lib/visualizer/prompting/**`
- `lib/visualizer/preprocessing/**`
- `lib/visualizer/huggingface/**`
- `lib/visualizer/actions/**`
- affected tests

## Exact implementation slice

- build the wrap-preview prompt builder using selected wrap metadata and optional prompt overrides
- build the generation-board preprocessing step that combines vehicle and wrap reference imagery
- implement the HF adapter boundary with model selection from `HF_API_KEY`, `HF_IMAGE_TO_IMAGE_MODEL`, and `HF_TIMEOUT_MS`
- wire the primary generation path into preview orchestration
- upload generated outputs to Cloudinary and complete preview rows on success

## Non-goals

- do not implement the fallback composite yet
- do not finalize cache-reuse and regenerate flows beyond what generation requires

## Required contracts to preserve

- Hugging Face remains isolated behind an adapter layer
- selected wrap texture materially influences generation
- preview orchestration remains server-authoritative
- generated outputs persist to Cloudinary with useful metadata

## Validation and tests

- add or update tests for prompt-builder output
- add or update tests for HF adapter error normalization
- add or update tests for successful generation completion and Cloudinary persistence
- add or update tests for status transitions through the primary path

## Completion criteria

- the visualizer can generate a primary AI concept preview from a selected wrap and vehicle upload
- model/provider assumptions are isolated from UI code
- the next phase can add fallback behavior without restructuring the primary generation path
