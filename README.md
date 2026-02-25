# CtrlPlus

A multi-tenant website for a small home-based vehicle wrap business in El Paso, Texas. Customers can browse wrap designs, visualize a wrap on their vehicle (via upload or fast alternative), schedule drop-off and pick-up, and pay an invoice via Stripe in a single guided session. Admins manage wrap inventory, schedules, invoices, and fulfillment.

## Repository initialization status

This repository now includes baseline engineering and GitHub automation scaffolding aligned to the planning docs:

- TypeScript strict-mode configuration and lint/test command surface.
- PR quality-gate workflow with conditional E2E triggers.
- Issue and pull request templates aligned to the standard checklist.
- Scripted GitHub label bootstrap matching the canonical taxonomy.
- Codex/project automation for issue routing, board status syncing, PR template validation, and checklist-complete review gating.

## Local setup

1. Install Node.js 20 (or use `.nvmrc`).
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Pull development environment variables from Vercel:

   ```bash
   pnpm dlx vercel pull --yes --environment=development
   pnpm dlx vercel env pull .env.local --environment development
   ```

4. Runtime environment contract (from `.env.example`) for local and deployed environments:

   - `AUTH_CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_AUTH_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY` (alias)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (alias)
   - `NEXT_PUBLIC_CLERK_FRONTEND_API_URL` (optional)
   - `NEXT_PUBLIC_AUTH_CLERK_FRONTEND_API_URL` (optional)
   - `DATABASE_URL`
   - `DATABASE_URL_UNPOOLED`
   - `NEON_API_KEY` (optional for MCP/API workflows)
   - `AUTH_TENANT_ROLE_BINDINGS` (optional, non-production mappings)
   - `STRIPE_WEBHOOK_SECRET`
   - `VERCEL_OIDC_TOKEN` (optional)

5. Run baseline quality checks:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   ```

6. Start the Next.js app locally:

   ```bash
   pnpm dev
   ```

## GitHub setup

After `gh auth login` and setting your default repository, bootstrap governance assets:

```bash
pnpm bootstrap:github
```

This syncs labels, milestones, roadmap issues, and project board field metadata.

See `docs/github-workflow.md` and `docs/ci-design.md` for governance details.
Use `docs/deployment-runbook.md` for migration/rollback/verification deployment steps.
Use `docs/demo-release-checklist.md` for demo release readiness checks.
Use `docs/README.md` for the documentation index and report locations.
