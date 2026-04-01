# `.copilot/docs`

This directory is the markdown intent layer for the CtrlPlus refactor program.

## Purpose

- Preserve human-readable architecture intent derived from source markdown.
- Record scope, rationale, assumptions, and domain outcomes before they become contracts or
  execution state.
- Provide the canonical repo-local PRD and technical requirements for the refactor.

## Active Documents

- `refactor-prd.md`
- `refactor-technical-requirements.md`
- `refactor-domain-map.md`
- `ctrlplus-refactor-prd.md`
- `ctrlplus-technical-requirements.md`
- `ctrlplus-refactor-gap-analysis.md`
- `catalog.md`
- `visualizer.md`
- `catalog-visualizer-prep-status.md`

## Catalog And Visualizer Focus

When the task is specifically about wraps, asset roles, visualizer handoff, Hugging Face, or
preview storage, start with:

- `catalog.md`
- `visualizer.md`
- `catalog-visualizer-prep-status.md`
- the paired specs under `.copilot/arch/`

Update these files before expanding YAML contracts or JSON task scope.
