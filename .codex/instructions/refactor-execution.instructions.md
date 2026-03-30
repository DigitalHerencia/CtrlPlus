# CtrlPlus Refactor Execution Instructions

Use these instructions when performing any scoped refactor under `app`, `features`, or `components`.

## Consumption Order

1. Read `.codex/README.md`.
2. Read the relevant docs in `.codex/docs/`.
3. Read the relevant contracts in `.codex/contracts/`.
4. Read the current state in `.codex/execution/`.
5. Use the relevant prompt in `.codex/prompts/` only after the prior layers are understood.

## Execution Rules

- Do not start a structural refactor without checking `backlog.json`, `progress.json`, and `decisions.json`.
- If you change scope, sequencing, or an architectural assumption, update the JSON execution files in the same pass when practical.
- If a repeated rule emerges, promote it into YAML instead of leaving it only in markdown.
- If a file move or rename would affect contracts, update the affected YAML and markdown references too.

## Delivery Rules

- Keep route pages thin first.
- Normalize features before broad component extraction.
- Keep `lib/**`, `schemas/**`, and `types/**` as the stable authority during UI and route refactors.
- Prefer bounded waves over repo-wide churn.
