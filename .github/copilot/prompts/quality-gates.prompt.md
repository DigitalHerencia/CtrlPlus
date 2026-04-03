---
description: Verification and remediation pass after refactor work. Runs required quality gates (lint, typecheck, prisma:validate, build, test, e2e), diagnoses failures, and applies targeted fixes.
---

# POST-REFACTOR ENFORCEMENT PROMPT — QUALITY GATES OR IT DIDN'T HAPPEN

You are performing a verification and remediation pass after refactor work.

## Mission

Run the required quality gates, diagnose failures, apply targeted fixes, and keep iterating until the codebase is as clean as can be made safely in this pass.

## Required quality gates

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when affected

## Audit objectives

1. Run the quality gates in sensible order.
2. Fix lint/type/build/schema/test failures in a domain-bounded way.
3. Avoid hacks that silence real architectural or type problems.
4. Preserve documented boundaries while remediating failures.
5. Identify whether failures are:
   - code defects
   - contract drift
   - schema drift
   - flaky tests
   - environment/config issues

## Correction rules

- Prefer root-cause fixes over suppression.
- Do not disable rules just to get green.
- Do not weaken typing to avoid proper correction.
- Do not bypass Prisma validation.
- Keep fixes minimal, explicit, and reviewable.

## Deliverables

1. Run the quality gates.
2. Apply corrective changes.
3. Output a concise report grouped by:
   - Lint fixes
   - Type fixes
   - Prisma/schema fixes
   - Build fixes
   - Test fixes
4. Output any remaining blocked items with exact cause and recommended next action.

## Verification checklist

- Required gates pass, or remaining blockers are explicitly documented
- No boundary regression introduced just to satisfy tooling
- Type safety remains intact
- Schema validation remains intact
