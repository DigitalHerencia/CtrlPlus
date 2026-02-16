# Standard Pull Request Checklist

Use this checklist for every PR. CI requirements are defined in [CI Design](./ci-design.md#4-required-status-checks-for-branch-protection) and mirrored here intentionally to prevent drift.

## Scope and architecture

- [ ] Changes stay within project architecture boundaries (`app/`, `features/`, `lib/server/fetchers`, `lib/server/actions`).
- [ ] Tenant isolation and authorization checks are enforced server-side.
- [ ] Input validation and mutation safety are preserved for any changed actions/fetchers.

## Quality gates (must be green)

- [ ] `lint` status check passes.
- [ ] `typecheck` status check passes.
- [ ] `test-unit` status check passes.
- [ ] `test-integration` status check passes.
- [ ] `test-e2e` status check passes when [conditional E2E trigger rules](./ci-design.md#3-conditional-e2e-execution-rules) apply.

## Verification and release safety

- [ ] New or updated logic includes automated tests at the appropriate level (unit/integration/e2e).
- [ ] Any flaky E2E tests were handled per [flaky test fallback policy](./ci-design.md#5-fallback-strategy-for-flaky-e2e-tests).
- [ ] Documentation and acceptance criteria references were updated when CI policy changed.
