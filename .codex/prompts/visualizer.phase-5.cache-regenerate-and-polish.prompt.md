# Visualizer Phase 5 Prompt: Cache, Regenerate, and Polish

## Mission

Finalize preview reuse, regenerate behavior, and surface polish once selection, upload, generation, and fallback flows are stable.

## Authoritative specs

- `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
- `.codex/docs/visualizer.md`
- `.codex/instructions/visualizer.instructions.md`

## Upstream prerequisites

- `visualizer.phase-1.catalog-handoff-and-wrap-selection.prompt.md` is complete and verified
- `visualizer.phase-2.vehicle-upload-and-persistence.prompt.md` is complete and verified
- `visualizer.phase-3.hf-generation-and-prompting.prompt.md` is complete and verified
- `visualizer.phase-4.fallback-composite-and-recovery.prompt.md` is complete and verified

## Scope anchors

- `lib/visualizer/cache-key.ts`
- `lib/visualizer/actions/**`
- `lib/visualizer/fetchers/**`
- `components/visualizer/**`
- affected tests

## Exact implementation slice

- implement deterministic cache-key generation
- reuse prior previews when the effective generation inputs match
- implement regenerate behavior using existing preview ownership and source metadata
- polish UI states for retry, regenerate, and previously generated preview reuse
- tighten any remaining status, metadata, or traceability gaps

## Non-goals

- do not expand into unrelated history dashboards unless already planned in scope
- do not replace the provider architecture established in earlier phases

## Required contracts to preserve

- cache keys include owner identity, wrap source metadata, normalized vehicle image input, generation mode, model, and prompt version
- regenerate stays server-authoritative and ownership-scoped
- regenerate remains compatible with the existing `VisualizerWrapInput` and `PreviewStatus` model
- preview reuse does not bypass wrap validity or ownership checks

## Validation and tests

- add or update tests for cache-key determinism
- add or update tests for cache-hit reuse behavior
- add or update tests for regenerate ownership enforcement
- add or update tests for status and UI behavior around reused or regenerated previews

## Completion criteria

- duplicate preview work is reduced through deterministic reuse
- regenerate behavior is reliable and ownership-safe
- the visualizer feels production-ready enough for cross-domain funnel verification
