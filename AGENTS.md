---
description: CtrlPlus repository agent instructions
applyTo: "**/*"
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

## Operating workflow

1. Read relevant `.agents/docs/*` for intent.
2. Apply `.agents/instructions/*` for interpretation.
3. Enforce `.agents/contracts/*` rules.
4. Use `.agents/prompts/*` for execution framing.
5. Update `.agents/json/*` with tasks, decisions, progress, blockers, actions, edits,
   errors, and fixes.

## Synchronization requirement

`AGENTS.md` and `.github/copilot-instructions.md` must always contain the same content.
