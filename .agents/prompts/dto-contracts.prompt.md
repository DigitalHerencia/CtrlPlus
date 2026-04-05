## Objective

Validate DTO usage and naming hygiene across domain boundaries.

## Required contracts

- `GOV-NAMING`
- `GOV-DATA-ACCESS`

## Required checks

1. DTOs are explicit for UI-facing read models.
2. Raw persistence models are not leaked into presentation layers.
3. Naming conventions are consistent.

## Required reporting updates

- Record validation status in `validation.report.json`.
- Record corrections in `execution-ledger.json`.
