# Deployment Runbook (DEMO-008)

This runbook defines the standard deployment flow for CtrlPlus with a focus on **safe migrations**, **rollback readiness**, and **post-deploy verification**.

Use this runbook for staging and production releases so deployment behavior stays consistent with repository governance and CI quality gates.

## 1) Preconditions

Before any deployment:

1. Main branch is green for required CI checks.
2. PR checklist is complete (`docs/pr-checklist.md`).
3. The release operator has access to:
   - Vercel project and environment variables.
   - Neon database branch/role used by production.
   - Stripe webhook configuration for the target environment.
4. `gh` CLI is installed and authenticated for governance workflows.

## 2) Environment contract

The following variables are the canonical runtime contract and must stay aligned across `.env.example`, `README.md`, and this runbook.

| Variable | Required | Purpose |
| --- | --- | --- |
| `AUTH_CLERK_SECRET_KEY` | Yes | Clerk backend secret used by server auth helpers. |
| `NEXT_PUBLIC_AUTH_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key for browser auth flows. |
| `CLERK_SECRET_KEY` | Yes (alias) | Canonical alias for tooling expecting default Clerk naming. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes (alias) | Canonical alias for tooling expecting default Clerk naming. |
| `NEXT_PUBLIC_CLERK_FRONTEND_API_URL` | Optional | Explicit Clerk frontend API origin override. |
| `NEXT_PUBLIC_AUTH_CLERK_FRONTEND_API_URL` | Optional | Backward-compatible frontend API origin alias. |
| `DATABASE_URL` | Yes | Prisma pooled connection string for app queries. |
| `DATABASE_URL_UNPOOLED` | Yes | Prisma direct connection string for migrations. |
| `NEON_API_KEY` | Optional | Neon API key for MCP/API workflows (not required at runtime). |
| `AUTH_TENANT_ROLE_BINDINGS` | Optional | Static tenant-role binding map for local/non-production workflows. |
| `STRIPE_WEBHOOK_SECRET` | Yes in deployed envs | Stripe webhook signature secret. |
| `VERCEL_OIDC_TOKEN` | Optional | OIDC token when using Vercel identity integrations. |

## 3) Standard deployment sequence

### Step A: Sync and verify candidate commit

```bash
git fetch origin
git checkout main
git pull --ff-only
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
```

### Step B: Apply migrations safely

Use production-scoped environment values before running commands.

```bash
pnpm dlx prisma migrate deploy
```

Migration policy:

- Use forward-only migrations in `prisma/migrations/**`.
- Avoid destructive schema changes without an explicit backfill and rollback strategy.
- Confirm migration history after deploy:

```bash
pnpm dlx prisma migrate status
```

### Step C: Trigger deployment

Deploy via the GitHub->Vercel integration from main after migrations pass.

If a manual deploy is required:

```bash
pnpm dlx vercel deploy --prod
```

## 4) Post-deploy verification

Run these checks immediately after deployment.

### 4.1 Static quality gates (local/CI)

```bash
pnpm lint
pnpm typecheck
pnpm test
```

### 4.2 Targeted runtime verification

```bash
pnpm test tests/integration/stripe-webhook.test.ts
pnpm test tests/integration/prisma-tenancy.test.ts
pnpm test:e2e tests/e2e/auth-routing-regression.spec.ts
```

Verification expectations:

- Stripe webhook signature and idempotency logic remains intact.
- Tenant isolation queries reject cross-tenant access.
- Auth route handling remains stable for sign-in/sign-up and tenant routing.

### 4.3 Operational smoke checks

- Confirm tenant subdomain routes resolve to the correct tenant context.
- Validate one end-to-end checkout flow in the target environment.
- Confirm no new high-severity alerts in deployment logs.

## 5) Rollback procedure

When release quality or production safety is in doubt, stop rollout and execute rollback.

1. **Freeze additional deploys** and communicate incident status.
2. **Revert application version** in Vercel to the previous known-good deployment.
3. **Assess migration impact**:
   - If migration is backward-compatible, keep schema and rollback app only.
   - If migration introduced incompatible changes, execute a prepared compensating migration.
4. **Re-run post-rollback verification**:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test tests/integration/prisma-tenancy.test.ts
```

5. **Record incident notes** in PR/issue with root cause and preventive action items.

## 6) Documentation and governance alignment

For every release PR:

- Include `Closes #<issue>` in the PR body.
- Complete all checklist items in `.github/pull_request_template.md`.
- Ensure release docs stay aligned with:
  - `docs/github-workflow.md`
  - `docs/ci-design.md`
  - `docs/pr-checklist.md`
