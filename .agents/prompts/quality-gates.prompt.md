## Objective

Run required quality gates and fix failures without violating boundaries.

## Required contracts

- `GOV-TESTING-QUALITY`
- `GOV-SECURITY`
- `GOV-DATA-ACCESS`

## Required checks

Run:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when affected

## Required reporting updates

- Record pass/fail outcomes in `validation.report.json`.
- Record each fix action in `execution-ledger.json`.
- Add unresolved issues to `blockers.status.json`.
