## CtrlPlus Agent Governance Index

`.agents` is the canonical governance system for agent-assisted work in this repository.

## Layer model

- `docs/` → **intent layer** (why, outcomes, architecture intent)
- `instructions/` → **interpretation layer** (how to apply intent/contracts)
- `contracts/` → **execution layer** (normative machine-readable rules)
- `json/` → **reporting layer** (tasks, progress, decisions, blockers, fix history)
- `prompts/` → **accountability layer** (task execution templates with reporting obligations)

## Precedence

`contracts > instructions > docs > prompts` (json is observational/reporting only).

## Canonical navigation order

1. Read `docs/` for intent.
2. Read `instructions/` for implementation interpretation.
3. Enforce `contracts/` rule IDs.
4. Execute with `prompts/`.
5. Report outcomes in `json/`.

## Synchronization requirement

- `AGENTS.md` and `.github/copilot-instructions.md` must carry the same content.
- If one changes, update the other in the same change.

## Maintenance principles

- Keep layers non-overlapping.
- Move enforceable statements to contracts.
- Keep progress/decision state in JSON only.
- Require prompts to reference contract IDs and reporting updates.

## Current domain coverage

- admin
- auth/authz
- billing
- catalog
- platform
- scheduling
- settings
- visualizer
