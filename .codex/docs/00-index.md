# Codex Docs Index

This directory is the canonical internal docs set for Codex in this repository.

It is intentionally flattened, deduplicated, and ordered so agents can load only what they need with minimal context churn.

## Canonical Load Order

1. `AGENTS.md`
2. `PLANS.md`
3. `.codex/docs/00-index.md`
4. `.codex/docs/20-architecture.md`
5. `.codex/docs/40-quality-gates.md`
6. `.codex/docs/50-release-operations.md`

Load additional files only when needed by task scope.

## Standard Files

- `00-index.md`: canonical doc map and loading policy
- `10-product.md`: product requirements and user-flow goals
- `20-architecture.md`: architecture constraints and backend contracts
- `30-engineering-workflows.md`: GitHub governance and multi-agent execution patterns
- `40-quality-gates.md`: CI policy, PR checklist, copy QA rules
- `50-release-operations.md`: deployment runbook and demo release checks
- `60-design-system.md`: visual system and Tailwind v4 authoring contract
- `61-design-tokens.json`: machine-readable design token source of truth
- `70-history.md`: historical report summaries and archived decisions

## Canonical Sources

- `AGENTS.md` is the repository policy source of truth.
- `PLANS.md` is the ExecPlan source of truth.
- `.codex/TODO.md` is a tracker only and is not policy.

## Archive Policy

Historical analysis is normalized into `70-history.md`. When adding future snapshots:

1. Add a dated section in `70-history.md`.
2. Mark whether the artifact is superseded.
3. Link only to canonical follow-up documents that replaced it.
