# `.codex/execution`

This directory is the JSON execution layer for the CtrlPlus refactor program.

## Files

- `manifest.json`: inventory of the active markdown, YAML, and JSON artifacts
- `refactor-backlog.json`: task ledger for the program
- `refactor-progress.json`: current summary state, blockers, and verification status
- `refactor-decisions.json`: stable program decisions and explicit naming or scope constraints

## Rules

- Update JSON when task state materially changes.
- Keep JSON operational and audit-friendly.
- Do not change program meaning here without first updating markdown or YAML.
