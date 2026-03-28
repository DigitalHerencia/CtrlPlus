# Visualizer Phase 4 Prompt: Fallback Composite and Recovery

## Mission

Add the resilient fallback path so preview requests can still complete when Hugging Face generation is unavailable, slow, or fails.

## Authoritative specs

- `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
- `.codex/docs/visualizer.md`
- `.codex/instructions/visualizer.instructions.md`

## Upstream prerequisites

- `visualizer.phase-3.hf-generation-and-prompting.prompt.md` is complete and verified

## Scope anchors

- `lib/uploads/image-processing.ts`
- `lib/actions/visualizer.actions.ts`
- `components/visualizer/**`
- affected tests

## Exact implementation slice

- implement the fallback composite flow using the selected wrap texture and uploaded vehicle image
- integrate fallback execution into preview orchestration when HF generation fails or times out
- preserve usable preview lifecycle behavior when fallback succeeds
- make UI recovery and error messaging explicit for fallback and retry scenarios

## Non-goals

- do not redesign the catalog contract
- do not implement long-term background job infrastructure in this phase

## Required contracts to preserve

- fallback remains server-side and deterministic
- successful fallback still results in a `complete` preview outcome
- preview ownership and Cloudinary persistence rules remain unchanged

## Validation and tests

- add or update tests for fallback activation conditions
- add or update tests for fallback completion behavior
- add or update tests for UI messaging around fallback and retry
- add or update tests ensuring full failure still reaches `failed` cleanly

## Completion criteria

- HF instability no longer blocks useful preview delivery
- preview lifecycle and user messaging remain coherent through fallback and failure states
- the final phase can build cache and regenerate behavior on top of resilient orchestration
