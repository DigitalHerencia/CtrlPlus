# Quality Gates and PR Standards

This file is the canonical quality-gate and pull-request policy source.

## Baseline Required Checks

Every pull request must run and pass:

1. `lint`
2. `typecheck`
3. `test-unit`
4. `test-integration`

## Conditional E2E Policy

Run `test-e2e` for PRs that modify files in any of these paths:

- `app/(auth)/**`
- `app/(tenant)/**`
- `app/api/stripe/**`
- `app/api/clerk/**`
- `components/shared/**`
- `features/**`
- `lib/auth/**`
- `lib/db/**`
- `lib/rate-limit/**`
- `lib/storage/**`
- `lib/tenancy/**`
- `lib/server/**`
- `schemas/**`
- `types/**`
- `prisma/**`
- `proxy.ts`
- `tests/e2e/**`
- `package.json`
- `pnpm-lock.yaml`
- `playwright.config.*`
- `next.config.*`
- `.github/workflows/**`

## Branch Protection Status Checks

Require:

1. `lint`
2. `typecheck`
3. `test-unit`
4. `test-integration`
5. `test-e2e` when triggered by the path policy above

## Pull Request Checklist

### Quality

- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Unit tests added/updated.
- [ ] Integration tests added/updated for DB/auth/fetcher/action changes.
- [ ] E2E updated when user-facing flow or route behavior changes.

### Architecture and security

- [ ] No Prisma usage in `app/**`.
- [ ] Reads only in `lib/server/fetchers/**`.
- [ ] Writes only in `lib/server/actions/**`.
- [ ] Tenant isolation is server-enforced.
- [ ] Auth and permission are server-enforced.
- [ ] New input contracts are zod-validated.
- [ ] No client-trusted `tenantId` mutation flow.
- [ ] Webhooks are signature-verified and idempotent.

### Release safety

- [ ] No debug logging leftovers.
- [ ] Copy updates follow the copy standards in this file.
- [ ] Deployment docs remain aligned with `.codex/docs/50-release-operations.md`.
- [ ] Env contract remains aligned across `.env.example`, `README.md`, and release docs.

## Copy Standards

Tone rules:

- Use concise, direct, professional language.
- Avoid hype and luxury wording.
- Keep user direction action-oriented.

Approved CTA labels:

- `Create Account`
- `Sign In`
- `View Features`
- `Contact Us`

Disallowed wording examples:

- `premium`
- `exclusive`
- `world-class`
- `elite`
- `luxury`

Copy QA checks:

- Validate text consistency across `/`, `/about`, `/features`, `/contact`, `/sign-in`, `/sign-up`, `/wraps`, `/wraps/[id]`, `/admin` when changed.
- Ensure copy edits do not alter layout/component structure.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` after copy changes.

## Flaky E2E Handling

Retry policy:

- Up to 2 retries per failed spec (3 attempts total).

Quarantine policy:

- Quarantine only after repeated incidents.
- Quarantined tests require an owner and tracking issue.

SLA policy:

- Quarantined tests must be fixed or mitigated within 2 business days.
