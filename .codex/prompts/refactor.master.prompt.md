# CtrlPlus Refactor Master Prompt

Use this prompt as the entrypoint for bounded refactor passes.

## Objective

Execute one wave from the CtrlPlus refactor program without violating server-first boundaries.

## Required Inputs

- relevant `.codex/docs/*.md`
- relevant `.codex/contracts/*.yaml`
- current `.codex/execution/*.json`
- the files in scope for the selected wave

## Required Behavior

1. Read the current execution state before editing.
2. Restrict work to one wave unless explicitly expanded.
3. Update docs, contracts, and execution state when scope or decisions change.
4. Preserve server authority in `lib`, `schemas`, `types`, and `prisma`.
