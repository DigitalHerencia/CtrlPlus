## Objective

Ensure cache invalidation semantics match mutation scope and UX needs.

## Required contracts

- `GOV-MUTATION-PIPELINE`
- `GOV-DATA-ACCESS`

## Required checks

1. Confirm write paths trigger intentional invalidation semantics.
2. Confirm stale/fresh behavior aligns with read usage.
3. Avoid blanket invalidation when targeted invalidation is sufficient.

## Required reporting updates

- Add validation result to `validation.report.json`.
- Log edits in `execution-ledger.json`.
