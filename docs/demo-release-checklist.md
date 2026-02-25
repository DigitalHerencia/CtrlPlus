# Demo Release Checklist (M9)

Use this checklist before cutting a demo release so documentation, governance, and runtime expectations remain in sync.

## 1) Scope and governance

- [ ] Milestone scope matches `.github/task-manifest.json` and linked issues.
- [ ] PR body uses template sections and includes `Closes #...` references.
- [ ] PR checklist items are complete in `.github/pull_request_template.md`.
- [ ] Dependencies called out in milestone notes are merged.

## 2) Environment and secrets

- [ ] `.env.example`, `README.md`, and `docs/deployment-runbook.md` list the same env contract.
- [ ] Clerk keys are configured for target environment.
- [ ] Neon database URLs are configured (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`).
- [ ] `STRIPE_WEBHOOK_SECRET` is configured in deployed environment.

## 3) Build, quality, and verification

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm test tests/integration/stripe-webhook.test.ts`
- [ ] `pnpm test tests/integration/prisma-tenancy.test.ts`
- [ ] `pnpm test:e2e tests/e2e/auth-routing-regression.spec.ts`

## 4) Deployment safety

- [ ] Migration plan reviewed and `pnpm dlx prisma migrate deploy` prepared.
- [ ] Rollback owner and compensating migration strategy documented.
- [ ] Post-deploy smoke checks assigned (tenant routing + checkout flow).

## 5) Release closeout

- [ ] Deployment outcomes and follow-ups are logged in PR comments.
- [ ] Any incidents include root cause and preventive tasks.
- [ ] Release docs remain current with scripts in `package.json`.
