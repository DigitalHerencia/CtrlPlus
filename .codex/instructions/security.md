# Security Rules

1. Never import Prisma in `app/**`, except `app/api/clerk/**` and `app/api/stripe/**`.
2. All tenant-domain queries must include `where: { tenantId, deletedAt: null }`.
3. Never trust `tenantId`, role, or ownership scope from client input.
4. Actions follow `auth -> authorize -> validate -> mutate -> audit`.
5. Fetchers return DTOs only, never raw Prisma models.

## Authorization

- Resolve `tenantId` and role from `getSession()` or equivalent server-only helpers.
- Enforce ownership and tenant membership server-side for customer-scoped resources.
- Never accept tenant scoping from client payloads.

## Webhooks

- Verify signatures for Clerk and Stripe handlers.
- Keep webhook processing idempotent.
- Keep webhook data writes out of user-facing UI layers.
