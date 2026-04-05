## Objective

Prevent unauthorized cross-domain coupling.

## Required contracts

- `GOV-DOMAIN-BOUNDARIES`
- `GOV-ROUTE-OWNERSHIP`

## Required checks

1. Confirm ownership of modified capabilities.
2. Confirm cross-domain interactions use allowed boundaries.
3. Confirm no hidden coupling via utility shortcuts.

## Required reporting updates

- Record review outcome in `validation.report.json`.
- Record fixes in `execution-ledger.json`.
