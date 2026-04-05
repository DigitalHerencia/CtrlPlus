## Purpose

This folder is the **reporting layer**.

JSON files track execution state, progress, decisions, blockers, and remediation logs.

## Reporting files

- `governance-index.json`: master pointers and versioning.
- `programs.status.json`: cross-program progress snapshot.
- `tasks.backlog.json`: prioritized work queue with ownership and dependencies.
- `decisions.log.json`: ADR-like decision records and open questions.
- `execution-ledger.json`: chronological actions, edits, errors, and fixes.
- `blockers.status.json`: active and resolved blocker state.
- `domains.catalog.status.json`: catalog-specific status.
- `domains.visualizer.status.json`: visualizer-specific status.
- `validation.report.json`: latest governance validation outcomes.

## Rules

- Reporting files do not define policy.
- Every execution prompt should update at least one reporting artifact.
- Every resolved error should create a fix record in `execution-ledger.json`.
