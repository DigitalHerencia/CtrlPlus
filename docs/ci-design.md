# CI Design

This document defines merge-blocking quality gates and failure-management policy.

## 1) Goals

- Prevent regressions from merging.
- Keep PR feedback fast by scoping expensive E2E coverage to high-risk areas.
- Preserve stable developer throughput while handling flaky test behavior with explicit controls.

## 2) Baseline PR workflow gates

Every pull request must run:

1. `lint`
2. `typecheck`
3. `test-unit`
4. `test-integration`

These gates are non-optional and must stay aligned with the [Standard PR Checklist](./pr-checklist.md#quality-gates-must-be-green).

## 3) Conditional E2E execution rules

Run `test-e2e` for PRs that modify files in any of these paths (or their descendants):

- `app/(tenant)/schedule/**`
- `features/scheduling/**`
- `lib/actions/create-booking.ts`
- `lib/fetchers/get-availability.ts`
- `lib/fetchers/booking-store.ts`
- `app/(tenant)/checkout/**`
- `app/api/stripe/**`
- `features/billing/**`
- `lib/actions/create-invoice.ts`
- `lib/actions/create-checkout-session.ts`
- `lib/fetchers/get-invoice.ts`
- `app/(tenant)/visualizer/**`
- `features/visualizer/**`
- `lib/actions/create-template-preview.ts`
- `lib/actions/create-upload-preview.ts`
- `lib/storage/upload-store.ts`
- `lib/rate-limit/fixed-window-limiter.ts`
- `lib/rate-limit/upload-rate-limit.ts`
- `app/(auth)/**`
- `features/authz/**`
- `lib/auth/**`
- `lib/tenancy/**`
- `proxy.ts`

Additionally, run `test-e2e` when shared runtime dependencies change:

- `package.json`
- `pnpm-lock.yaml`
- `playwright.config.*`
- `next.config.*`
- `.github/workflows/**`

## 4) Required status checks for branch protection

Configure branch protection to require these checks before merge:

1. `lint`
2. `typecheck`
3. `test-unit`
4. `test-integration`
5. `test-e2e` (required when triggered by §3 conditions)

Reviewers should verify this list against the [Standard PR Checklist](./pr-checklist.md#quality-gates-must-be-green) whenever CI policy changes.

## 5) Fallback strategy for flaky E2E tests

### Retry policy

- CI retries failed E2E specs up to **2 retries** (3 total attempts per failing spec).
- A test that passes only after retry is marked **flaky** and reported in the workflow summary.

### Quarantine policy

- A test may be quarantined only after **3 flaky incidents in 7 days** or **2 consecutive red builds** attributed to the same spec.
- Quarantined specs are moved behind an explicit quarantine tag (for example `@quarantine`) and excluded from merge-blocking E2E jobs.
- Quarantine requires an owner and linked tracking issue.

### SLA policy

- Quarantined test fix SLA: **2 business days**.
- If SLA is breached, the owning team must either:
  - submit a fix PR immediately, or
  - disable the risky feature path behind a guard until fixed.

All quarantine decisions and removals must be documented in the corresponding PR using the [Standard PR Checklist](./pr-checklist.md#verification-and-release-safety).
