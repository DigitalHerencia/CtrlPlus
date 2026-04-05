## Objective

Ensure proposed changes preserve server-first architecture and layer responsibilities.

## Required contracts

- `GOV-LAYERS`
- `GOV-ROUTE-OWNERSHIP`
- `GOV-DOMAIN-BOUNDARIES`

## Required checks

1. Confirm route files remain orchestration-only.
2. Confirm business logic is not moved into UI layers.
3. Confirm reads/writes remain in fetchers/actions.

## Required reporting updates

- Append action summary to `execution-ledger.json`.
- Update `validation.report.json` architecture check status.
