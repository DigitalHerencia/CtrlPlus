# Standard Pull Request Checklist

Use this checklist for every PR.

## Quality gates must be green

- [ ] Lint passes
- [ ] Typecheck passes
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated (if DB/auth/fetcher/action logic changed)
- [ ] E2E updated (if user flow or route behavior changed)

## Architecture and security requirements

- [ ] No Prisma usage inside `app/**`
- [ ] Reads implemented in `lib/server/fetchers/**` only
- [ ] Writes implemented in `lib/server/actions/**` only
- [ ] Tenant isolation enforced server-side
- [ ] Auth + permission validated server-side
- [ ] Zod validation/sanitization added for all new inputs
- [ ] No client-trusted `tenantId` in mutation flow
- [ ] Webhook handlers verify signatures and enforce idempotency

## Verification and release safety

- [ ] No `console.log` leftovers
- [ ] Copy updates follow `docs/copy-style-guide.md` and `docs/copy-qa-checklist.md`
- [ ] Deployment updates documented in `docs/deployment-runbook.md` (migration + rollback + verification)
- [ ] Environment contract remains synchronized across `.env.example`, `README.md`, and deployment docs
- [ ] Demo release criteria validated with `docs/demo-release-checklist.md` when applicable