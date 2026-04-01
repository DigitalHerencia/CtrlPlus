# Catalog Visualizer Integration Prompt

Use this prompt when a refactor pass spans both the catalog storefront and the visualizer preview
funnel.

## Required Context

1. `.copilot/prompts/refactor.master.prompt.md`
2. `.copilot/docs/catalog.md`
3. `.copilot/docs/visualizer.md`
4. `.copilot/arch/copilot_catalog_visualizer_migration_spec.md`
5. `.copilot/arch/copilot_visualizer_huggingface_generation_spec.md`
6. `.copilot/contracts/catalog-visualizer.contract.yaml`
7. relevant `.copilot/contracts/*.yaml`
8. relevant `.copilot/execution/*.json`

## Goal

Preserve the handoff from catalog selection to visualizer preview while keeping each domain inside
its own layer boundaries.

## Use For

- catalog detail -> visualizer handoff work
- preview CTA correctness
- wrap selection preload correctness
- preview polling and status verification
- Playwright smoke coverage of the sales funnel

## Phase Pairing

Pair this master prompt with:

- `.copilot/prompts/catalog-visualizer.phase-03.validation-and-e2e.prompt.md`
