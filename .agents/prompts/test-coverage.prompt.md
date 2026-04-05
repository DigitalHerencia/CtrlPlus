## Objective

Increase coverage for modified high-risk flows and validate regression safety.

## Required contracts

- `GOV-TESTING-QUALITY`
- `GOV-MUTATION-PIPELINE`

## Required checks

1. Add tests for changed logic and edge conditions.
2. Prioritize auth, lifecycle transitions, and integration boundaries.
3. Ensure tests are deterministic and maintainable.

## Required reporting updates

- Update `programs.status.json` and `tasks.backlog.json`.
- Log test additions/fixes in `execution-ledger.json`.
