# Milestone 7 Planning

Milestone 7 focuses on quality gate hardening, merge safety, and test-signal reliability.

## 7.1 Objective

Ensure all pull requests are blocked from merge unless required quality gates pass, with E2E execution targeted to risk-bearing changes.

## 7.2 Acceptance criteria

A Milestone 7 implementation is complete only when all criteria below are true:

1. PR workflows execute **lint**, **typecheck**, **unit tests**, and **integration tests** on every PR.
2. E2E tests execute conditionally using the path-based rules defined in [CI Design §3](./ci-design.md#3-conditional-e2e-execution-rules).
3. Branch protection requires the status checks listed in [CI Design §4](./ci-design.md#4-required-status-checks-for-branch-protection).
4. Flaky E2E handling follows the policy in [CI Design §5](./ci-design.md#5-fallback-strategy-for-flaky-e2e-tests).
5. CI criteria remain cross-linked with the [Standard PR Checklist](./pr-checklist.md) to keep enforcement and review expectations aligned.

## 7.3 Done definition

Milestone 7 is done when CI policy, branch protection configuration, and PR review checklist are aligned and documented in the linked sources above.
