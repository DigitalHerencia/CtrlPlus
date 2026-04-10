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

## Frontend Design & UI Governance

The frontend is optimized for **mobile-first responsive design** using Tailwind CSS and shadcn/ui primitives.
All styling, component, and animation rules are documented in `.agents/docs/design.md` and enforced via `.agents/contracts/ui-component-governance.contract.yaml`.

### Key Frontend Principles

- **Mobile-First**: Optimize for small screens first, progressively enhance for larger viewports
- **Semantic Simplicity**: Use shadcn/ui primitives exclusively; no custom UI components
- **Color System**: Strict palette (blue-600 primary, neutral-700 borders, neutral-900 bg, neutral-100 text)
- **Typography Scaling**: All font sizes responsive across breakpoints (mobile-first pattern)
- **Button Template**: All buttons follow Header Button Template (primary = blue bg with border-invert hover, secondary = outline variant)
- **Spacing System**: 4px increments with breakpoint scaling (px-4 sm:px-6 lg:px-8, etc.)
- **Animations**: Tailwind-only (fade-in, slide-in-up, transition-all)
- **No Rounded Corners**: All components use `--radius: 0` for sharp edges

### Design & Component References

- **Intent & Patterns**: `.agents/docs/design.md` (color system, typography scale, spacing, responsive grids, button styles, accessibility)
- **Execution Rules**: `.agents/contracts/ui-component-governance.contract.yaml` (component usage, button anatomy, color constraints, violations)
- **Example Implementation**: `app/page.tsx` (hero, features grid, pricing cards, animations)
- **Shared Components**: `components/shared/site-header.tsx`, `components/shared/site-footer.tsx` (responsive mobile-first header/footer)

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
