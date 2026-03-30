# Visualizer Refactor Prompt

Use this prompt for visualizer-only refactor passes.

## Required Context

1. `.codex/prompts/refactor.master.prompt.md`
2. `.codex/docs/visualizer.md`
3. `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
4. `.codex/instructions/visualizer.instructions.md`
5. relevant `.codex/contracts/*.yaml`
6. relevant `.codex/execution/*.json`

## Goal

Advance only the visualizer-relevant portion of the current refactor task while keeping preview generation server-authoritative.
