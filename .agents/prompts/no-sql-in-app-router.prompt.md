## Objective

Detect and remove direct persistence access outside fetchers/actions.

## Required contracts

- `GOV-DATA-ACCESS`
- `GOV-ROUTE-OWNERSHIP`

## Required checks

1. No direct Prisma/SQL in `app/**` and UI components.
2. Replace with appropriate fetcher/action calls.
3. Preserve behavior through regression checks.

## Required reporting updates

- Add remediation record to `execution-ledger.json`.
- Update `tasks.backlog.json` for follow-up refactors if needed.
