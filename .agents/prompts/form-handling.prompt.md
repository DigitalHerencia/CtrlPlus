## Objective

Ensure forms and submission handlers align with validation and mutation pipeline rules.

## Required contracts

- `GOV-MUTATION-PIPELINE`
- `GOV-NAMING`
- `GOV-SECURITY`

## Required checks

1. Form payloads are validated with runtime schemas.
2. Server actions enforce auth/authz and safe error handling.
3. Client form UX reflects success/failure states explicitly.

## Required reporting updates

- Record completed checks in `validation.report.json`.
- Record edits/errors/fixes in `execution-ledger.json`.
