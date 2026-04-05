## Purpose

This folder is the **accountability layer**.

Each prompt must:

1. Reference relevant contract IDs.
2. Define clear acceptance checks.
3. Require updates to reporting JSON files.

## Standard prompt structure

- Objective
- Required contracts
- Required checks
- Required reporting updates

## Reporting minimum

Every prompt-driven execution must update:

- `execution-ledger.json` (actions/edits/errors/fixes)
- one of `validation.report.json`, `tasks.backlog.json`, or domain status files
