## Objective

Enforce separation between feature orchestration and presentational components.

## Required contracts

- `GOV-ROUTE-OWNERSHIP`
- `GOV-DATA-ACCESS`

## Required checks

1. Components stay presentation-focused.
2. Feature modules orchestrate interaction without direct persistence writes.
3. Domain boundaries remain explicit.

## Required reporting updates

- Add findings to `validation.report.json`.
- Add remediation actions to `execution-ledger.json`.
