# .codex/prompts

Contains per-domain refactor prompts for the active CtrlPlus domains:

- `admin`
- `auth/authz`
- `billing`
- `catalog`
- `platform`
- `scheduling`
- `settings`
- `visualizer`

Each prompt is a preparatory orchestration input for a future domain refactor pass. Prompt files define mission, scope, non-goals, target architecture, required implementation rules, preserved domain behaviors, validation steps, and completion criteria.

## Catalog and visualizer prompt strategy

Catalog and visualizer now use a `master + phases` convention:

- master prompts define the full-domain mission, boundaries, dependencies, and ordered execution path
- phase prompts define one bounded implementation slice that can be executed safely in sequence
- the integration prompt captures cross-domain testing and funnel verification after catalog and visualizer phases land

### Catalog prompt files

- `catalog.refactor.prompt.md`
- `catalog.phase-1.asset-resolution-and-dtos.prompt.md`
- `catalog.phase-2.public-storefront.prompt.md`
- `catalog.phase-3.manager-and-publish-readiness.prompt.md`
- `catalog.phase-4.visualizer-handoff.prompt.md`

### Visualizer prompt files

- `visualizer.refactor.prompt.md`
- `visualizer.phase-1.catalog-handoff-and-wrap-selection.prompt.md`
- `visualizer.phase-2.vehicle-upload-and-persistence.prompt.md`
- `visualizer.phase-3.hf-generation-and-prompting.prompt.md`
- `visualizer.phase-4.fallback-composite-and-recovery.prompt.md`
- `visualizer.phase-5.cache-regenerate-and-polish.prompt.md`

### Cross-domain prompt file

- `catalog-visualizer.integration-e2e.prompt.md`

Use the master prompt plus one phase prompt when executing a bounded implementation pass. Do not skip phase prerequisites unless the earlier phase is already complete and verified.
