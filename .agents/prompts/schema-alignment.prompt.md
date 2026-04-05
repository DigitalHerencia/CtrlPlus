## Objective

Ensure schema validation, DTO contracts, and data model intent remain aligned.

## Required contracts

- `GOV-NAMING`
- `GOV-DATA-ACCESS`

## Required checks

1. Schema names and usage are consistent.
2. DTOs reflect intended client-facing shapes.
3. Persistence/model changes do not bypass schema updates.

## Required reporting updates

- Add alignment result to `validation.report.json`.
- Add related edits/fixes to `execution-ledger.json`.
