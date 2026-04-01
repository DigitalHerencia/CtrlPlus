# CtrlPlus Refactor Operating Model

Use this file when executing any task tied to the large `app` + `features` + `components` refactor.

## Required Read Order

1. `.copilot/docs/refactor-prd.md`
2. `.copilot/docs/refactor-technical-requirements.md`
3. `.copilot/docs/refactor-domain-map.md`
4. `.copilot/arch/server-first-refactor-architecture.md`
5. Relevant YAML contracts in `.copilot/contracts/`
6. JSON execution files in `.copilot/execution/`

## Required Behavior

- Check `.copilot/execution/manifest.json` if you need the canonical artifact inventory.
- Select the next task from `.copilot/execution/refactor-backlog.json`.
- Confirm the task's workstream and dependencies before editing code.
- Keep route concerns in `app/`, orchestration in `features/`, reusable UI in `components/`, and primitives in `components/ui/`.
- Preserve server-side authority in `lib/`, `schemas/`, `types/`, and `prisma/`.
- Update `.copilot/execution/refactor-progress.json` and the affected task state in `.copilot/execution/refactor-backlog.json` when task status changes.

## Bounded Execution Rules

- Prefer incremental passes over broad speculative rewrites.
- Record new assumptions in markdown before changing YAML contracts or JSON task scope.
- Do not create new architectural layers unless the markdown artifacts explicitly authorize them.
- Do not rename current business domains as part of the refactor unless a task explicitly covers that migration.

## Completion Standard

- Code changes match the scoped task ID.
- JSON execution state reflects the completed or updated task status.
- Verification notes are recorded in the JSON artifacts when checks run or are deferred.
