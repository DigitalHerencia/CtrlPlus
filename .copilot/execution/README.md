# `.copilot/execution`

This directory is the JSON execution layer for the CtrlPlus refactor and catalog/visualizer delivery work.

## Active Files

- `manifest.json`: inventory of the active markdown, YAML, and JSON artifacts
- `backlog.json`: primary task ledger for the active catalog/visualizer program
- `progress.json`: current summary state, blockers, and next recommended phase
- `decisions.json`: active open and resolved decisions for the catalog/visualizer program
- `context-map.json`: current file map, dependencies, tests, and delivery risks
- `validation.json`: current tooling and command results for the active program
- `handoff.json`: operator guidance for starting, monitoring, and managing the next pass
- `catalog-visualizer.*.json`: phase-specific companion files retained for more detailed audit history
- `refactor-*.json`: background refactor history, not the primary intake path for catalog/visualizer work

## Rules

- Update JSON when task state materially changes.
- Keep JSON operational and audit-friendly.
- Do not change program meaning here without first updating markdown or YAML.
