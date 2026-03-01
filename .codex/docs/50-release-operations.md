# Release Operations Runbook

This document is the canonical deployment and release checklist.

## Preconditions

Before deployment:

1. Required CI checks are green.
2. PR checklist in `.codex/docs/40-quality-gates.md` is complete.
3. Operator has access to Vercel, Neon, and Stripe config for target environment.

## Environment Contract

Keep this aligned across `.env.example`, `README.md`, and this runbook.

| Variable | Required | Purpose |
| --- | --- | --- |
| `AUTH_CLERK_SECRET_KEY` | Yes | Clerk backend secret |
| `NEXT_PUBLIC_AUTH_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes (alias) | Compatibility alias |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes (alias) | Compatibility alias |
| `NEXT_PUBLIC_CLERK_FRONTEND_API_URL` | Optional | Clerk frontend override |
| `NEXT_PUBLIC_AUTH_CLERK_FRONTEND_API_URL` | Optional | Backward-compatible alias |
| `DATABASE_URL` | Yes | Pooled Prisma connection |
| `DATABASE_URL_UNPOOLED` | Yes | Direct migration connection |
| `NEON_API_KEY` | Optional | Neon API workflows |
| `AUTH_TENANT_ROLE_BINDINGS` | Optional | Non-prod static role mapping |
| `STRIPE_WEBHOOK_SECRET` | Yes in deployed environments | Stripe signature secret |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Yes in deployed environments | Clerk Svix signing secret |
| `VERCEL_OIDC_TOKEN` | Optional | Vercel OIDC integrations |

## Clerk Webhook Endpoint Contract

Per environment, configure Clerk webhook endpoint:

- `https://<environment-domain>/api/clerk/webhook`

Required subscribed events:

- `user.created`
- `user.updated`
- `user.deleted`

`CLERK_WEBHOOK_SIGNING_SECRET` must match the environment-specific endpoint signing secret.

## Deployment Sequence

### Step A: Sync candidate commit

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

```bash
pnpm dlx prisma migrate deploy
pnpm dlx prisma migrate status
```

### Step C: Trigger deploy

Primary path: GitHub -> Vercel integration from `main`.

Manual fallback:

```bash
pnpm dlx vercel deploy --prod
```

## Post-Deploy Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test tests/integration/stripe-webhook.test.ts
pnpm test tests/integration/prisma-tenancy.test.ts
pnpm test:e2e tests/e2e/auth-routing-regression.spec.ts
```

Expected checks:

- Tenant routing resolves correctly.
- Stripe webhook verification/idempotency remains intact.
- Checkout and auth routes still function.

## Rollback

1. Freeze additional deploys.
2. Roll back to previous known-good Vercel deployment.
3. Assess migration compatibility and apply compensating migration if required.
4. Re-run verification commands.
5. Record incident root cause and prevention tasks.

## Demo Release Checklist

- [ ] Milestone scope aligns to task manifest and linked issues.
- [ ] PR includes completion references (`Closes #...`).
- [ ] Environment contract is synchronized.
- [ ] Quality gates and targeted tests pass.
- [ ] Migration and rollback owners are identified.
- [ ] Post-deploy smoke checks are assigned and completed.
- [ ] Outcomes and follow-ups are documented.
