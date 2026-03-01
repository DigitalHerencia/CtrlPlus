# CtrlPlus

A subdomain-based multi-tenant Next.js 16 platform for vehicle wrap operations. The target architecture is server-first (RSC by default), strict tenant isolation, and domain-organized read/write boundaries.

## Architecture baseline

Authoritative architecture policy:

- `AGENTS.md` (hard constraints and implementation rules)
- `.codex/docs/20-architecture.md` (canonical technical architecture)
- `.codex/docs/40-quality-gates.md` (quality gates + E2E trigger policy + PR checklist)
- `.codex/docs/50-release-operations.md` (deployment and release procedures)

Execution backlog for the redesign lives in `.codex/TODO.md` (tracker only; canonical policy remains `AGENTS.md` + `.codex/docs/20-architecture.md`).

## Core conventions

- No Prisma usage in `app/**`.
- Reads only from `lib/server/fetchers/**`.
- Writes only from `lib/server/actions/**`.
- Tenant is resolved server-side from host/subdomain, never trusted from client payloads.
- Clerk orgs are not used; authz is custom RBAC per tenant membership.
- UI primitives come from shadcn in `components/ui/**`.

## Local setup

1. Install Node.js 20+ (or use `.nvmrc`).
2. Install dependencies:

```bash
pnpm install
```

3. Pull development environment variables from Vercel:

```bash
pnpm dlx vercel pull --yes --environment=development
pnpm dlx vercel env pull .env.local --environment development
```

4. Required environment contract (see `.env.example`):

- `AUTH_CLERK_SECRET_KEY`
- `NEXT_PUBLIC_AUTH_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY` (alias)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (alias)
- `NEXT_PUBLIC_CLERK_FRONTEND_API_URL` (optional)
- `NEXT_PUBLIC_AUTH_CLERK_FRONTEND_API_URL` (optional)
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `NEON_API_KEY` (optional)
- `AUTH_TENANT_ROLE_BINDINGS` (optional in non-production)
- `STRIPE_WEBHOOK_SECRET`
- `CLERK_WEBHOOK_SIGNING_SECRET`
- `VERCEL_OIDC_TOKEN` (optional)

Clerk webhook assumption for every deployed environment:

- Endpoint URL: `https://<environment-domain>/api/clerk/webhook`
- Subscribed events: `user.created`, `user.updated`, `user.deleted`
- Environment secret: `CLERK_WEBHOOK_SIGNING_SECRET` from that endpoint

5. Run quality checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

6. Generate Prisma client and run migrations:

```bash
pnpm db:generate
pnpm db:migrate:dev
```

7. Start the app:

```bash
pnpm dev
```

## GitHub setup

After `gh auth login` and setting your default repository:

```bash
pnpm bootstrap:github
```

This syncs labels, milestones, roadmap issues, and project board metadata.

## Additional docs

- `docs/README.md` for end-user documentation
- `.codex/docs/00-index.md` for developer/internal documentation load order
- `.codex/docs/30-engineering-workflows.md` for governance automation
- `.codex/docs/50-release-operations.md` for deploy/rollback flow
- `.codex/docs/70-history.md` for archived historical snapshots


