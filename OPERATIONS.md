# Operations

## Auth & Role Configuration

- `STORE_OWNER_CLERK_USER_ID` and `PLATFORM_DEV_CLERK_USER_ID` are optional.
- These values are managed in environment files/secrets only.
- Changing them is an operational/developer action, not an in-app workflow.

## Webhook Ops

- Clerk and Stripe webhook handlers are idempotent.
- Keep signing secrets configured and rotate regularly.

## Database Ops

- Run schema migrations using Prisma migration commands.
- Regenerate Prisma client after schema changes.
- Use Neon point-in-time restore before high-risk migration batches.

## Runbooks

- `docs/operations/ship-readiness.md`
- `docs/operations/billing-runbook.md`
- `docs/operations/scheduling-reservations.md`
