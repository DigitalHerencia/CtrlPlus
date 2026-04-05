## Objective

Audit CRUD implementations for strict server authority and boundary compliance.

## Required contracts

- `GOV-DATA-ACCESS`
- `GOV-ROUTE-OWNERSHIP`
- `GOV-MUTATION-PIPELINE`

## Required checks

1. No direct DB access in app/components.
2. Reads only via fetchers; writes only via actions.
3. Validation/authz present for all create/update/delete operations.

## Required reporting updates

- Update `tasks.backlog.json` for impacted tasks.
- Add execution entry to `execution-ledger.json`.
