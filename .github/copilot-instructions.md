---
description: CtrlPlus repository agent instructions
applyTo: '**/*'
---

## Project intent

CtrlPlus is a single-store, tenant-scoped operations platform built on Next.js App
Router, Clerk auth, Prisma + Neon Postgres, Stripe billing, scheduling, wrap catalog,
and visualizer previews.

## Non-negotiable architecture rules

- Treat `app/**` as orchestration only.
- Do not import Prisma directly in `app/**` or React components.
- All reads go through `lib/fetchers/**`.
- All writes go through `lib/actions/**`.
- Keep auth, authz, ownership, and capability checks server-side.
- Validate mutation input with Zod/runtime schemas.
- Prefer Server Components; use Client Components only where needed.
- Reuse `components/ui/**` primitives.

## Canonical governance source

Use `.agents` as the source of truth.

- `.agents/docs` = intent layer
- `.agents/instructions` = interpretation layer
- `.agents/contracts` = execution layer
- `.agents/json` = reporting layer
- `.agents/prompts` = accountability layer

### Precedence

`contracts > instructions > docs > prompts` (json is reporting only).

## Domain boundaries

Active domains:

- admin
- auth/authz
- billing
- catalog
- platform
- scheduling
- settings
- visualizer

Catalog owns wrap and asset semantics. Visualizer owns preview lifecycle.

- Catalog wrap imagery production storage is Cloudinary-backed; local `/uploads/wraps/**`
  paths are legacy remediation-only and must not be used for live catalog assets.

## Security and quality expectations

- Never trust client-provided role/ownership/scope.
- Enforce auth/authz in server actions and route handlers.
- Verify Stripe webhooks and use replay-safe/idempotent processing.
- Keep sensitive operations auditable.

Required quality gates when affected:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line`

### Dead-code prevention policy

- Every new module must be imported by at least one route, feature, action, fetcher, or test in the same PR.
- Prefer local (non-exported) helpers unless external reuse is required.
- Do not create parallel abstractions in both `components/{domain}` and `features/{domain}` unless each has documented ownership.
- For alias migrations, keep one canonical export name and remove redundant aliases within one release cycle.

### CI enforcement

- Run `knip --no-progress` in CI and fail on newly introduced unused files/exports.
- Run `tsc --noEmit --noUnusedLocals --noUnusedParameters` in CI profile.
- Keep a reviewed ignore list (`knip.json`) for framework-convention exports (Next.js route entrypoints).

### Layer integrity

- `lib/actions/*` owns writes and orchestration.
- `lib/fetchers/*` owns reads.
- `lib/db/transactions/*` must be either actively consumed by actions or removed.

### Audit artifact freshness protocol

- Treat `.agents/reports/*.txt` and `.agents/reports/CODEBASE_AUDIT_REPORT.md` as snapshots that can become stale.
- Before acting on dead-code findings, regenerate artifacts using current runs:
    - `pnpm knip --no-progress` (write to `knip.out.txt`, then copy to `.agents/reports/knip.txt`)
    - `pnpm exec ts-prune` (write to `.agents/reports/ts-prune.txt`)
    - `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters` (write to `.agents/reports/tsc-unused.txt`)
    - `pnpm exec eslint . --cache --max-warnings=0` (write to `.agents/reports/eslint-unused-vars.txt`)
- If `knip.out.txt` and `.agents/reports/knip.txt` differ, treat `knip.out.txt` as the source of truth until reports are refreshed.

## Operating workflow

1. Read relevant `.agents/docs/*` for intent.
2. Apply `.agents/instructions/*` for interpretation.
3. Enforce `.agents/contracts/*` rules.
4. Use `.agents/prompts/*` for execution framing.
5. Update `.agents/json/*` with tasks, decisions, progress, blockers, actions, edits,
   errors, and fixes.

## Synchronization requirement

`AGENTS.md` and `.github/copilot-instructions.md` must always contain the same content.
