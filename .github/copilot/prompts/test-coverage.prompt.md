---
description: Testing coverage audit. Ensures high-risk domain flows (auth/authz, booking conflicts, billing transitions, preview lifecycle) are covered with meaningful Vitest unit tests and Playwright E2E tests.
---

# POST-REFACTOR ENFORCEMENT PROMPT — TEST ME LIKE YOU MEAN IT

You are performing a testing coverage audit.

## Mission

Ensure high-risk domain flows are covered with meaningful tests.

## Canonical rules to enforce

- Vitest for unit
- Playwright for E2E
- Test critical domain paths

## Audit objectives

1. Missing tests for:
   - auth/authz flows
   - booking conflicts
   - billing transitions
   - preview lifecycle
2. Weak or meaningless tests
3. Missing integration coverage

## Correction rules

- Add tests for high-risk flows
- Prefer meaningful assertions over shallow snapshots
- Cover edge cases and failure paths

## Deliverables

- Add/adjust tests
- Output grouped changes:
  - Unit coverage
  - Integration coverage
  - E2E coverage

## Verification checklist

- Critical flows tested
- Failures caught early
- No fake confidence tests
