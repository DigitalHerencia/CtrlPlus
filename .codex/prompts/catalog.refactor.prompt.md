# Catalog Refactor Prompt

Use this prompt for catalog-only refactor passes.

## Required Context

1. `.codex/prompts/refactor.master.prompt.md`
2. `.codex/docs/catalog.md`
3. `.codex/arch/codex_catalog_visualizer_migration_spec.md`
4. `.codex/instructions/catalog.instructions.md`
5. relevant `.codex/contracts/*.yaml`
6. relevant `.codex/execution/*.json`

## Goal

Advance only the catalog-relevant portion of the current refactor task without weakening the catalog-to-visualizer contract.
