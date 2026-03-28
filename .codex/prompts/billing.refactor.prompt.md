# Billing Refactor Prompt

## Mission

Refactor only the `billing` domain to the target CtrlPlus server-first architecture while preserving explicit checkout, invoice, and webhook boundaries.

## Scope anchors

- `app/(tenant)/billing/**`
- `features/billing/**`
- `components/billing/**`
- `lib/actions/billing.actions.ts`
- `lib/fetchers/billing.fetchers.ts`
- `lib/integrations/stripe.ts`
- `app/api/stripe/**`
- affected tests under `e2e/**` and `tests/**`

## Non-goals

- do not refactor scheduling or booking logic beyond the explicit billing handoff boundary
- do not refactor platform tooling except for shared webhook boundary files explicitly listed
- do not replace Stripe or redesign provider strategy

## Target architecture

- keep `app/**` thin and orchestration-only
- move page composition into `features/billing/**`
- keep pure UI in `components/billing/**`
- keep reads in `lib/fetchers/billing.fetchers.ts`
- keep writes in `lib/actions/billing.actions.ts`

## Required implementation rules

- refactor only the named domain unless a shared boundary file is explicitly listed
- do not refactor adjacent domains in the same pass
- do not move Prisma into `app/**` or React components
- keep feature orchestration outside `app/**`
- keep client components free of authz, business rules, and cache invalidation
- keep webhook-authoritative payment state intact

## Domain behaviors to preserve

- explicit booking-to-billing handoff
- invoice ownership validation
- checkout idempotency and retry safety
- Stripe webhook authority for payment state
- room for failed-payment, refund, and reconciliation work

## Refactor checklist

- thin billing route files
- move orchestration into features
- keep invoice DTOs explicit
- keep checkout creation and confirmation server-side
- preserve webhook route narrowness and idempotency
- update affected tests

## Validation and tests

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when billing flows are affected

## Completion criteria

- billing route files are thin
- payment state remains webhook-authoritative
- booking-to-billing boundaries are explicit
- billing UI and server helpers are cleanly separated
- quality gates pass
