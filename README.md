# CtrlPlus

A multi-tenant website for a small home-based vehicle wrap business in El Paso, Texas. Customers can browse wrap designs, visualize a wrap on their vehicle (via upload or fast alternative), schedule drop-off and pick-up, and pay an invoice via Stripe in a single guided session. Admins manage wrap inventory, schedules, invoices, and fulfillment.

## Repository initialization status

This repository now includes baseline engineering and GitHub automation scaffolding aligned to the planning docs:

- TypeScript strict-mode configuration and lint/test command surface.
- PR quality-gate workflow with conditional E2E triggers.
- Issue and pull request templates aligned to the standard checklist.
- Scripted GitHub label bootstrap matching the canonical taxonomy.

## Local setup

1. Install Node.js 20 (or use `.nvmrc`).
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run baseline quality checks:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   ```

## GitHub setup

After `gh auth login` and setting your default repository, bootstrap labels:

```bash
pnpm bootstrap:labels
```

See `docs/github-workflow.md` and `docs/ci-design.md` for governance details.
