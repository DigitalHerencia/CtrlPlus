## Objective

Review and remediate authentication, authorization, and security controls.

## Required contracts

- `GOV-SECURITY`
- `GOV-MUTATION-PIPELINE`

## Required checks

1. Verify server-side auth checks for sensitive reads/writes.
2. Verify capability/ownership checks before mutations.
3. Verify secret handling and webhook verification protections.

## Required reporting updates

- Record findings and fixes in `execution-ledger.json`.
- Update blocker state in `blockers.status.json` if unresolved issues remain.
