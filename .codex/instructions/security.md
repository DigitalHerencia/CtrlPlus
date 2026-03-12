# Security Rules

1. Never import Prisma in `app/**`, except `app/api/clerk/**` and `app/api/stripe/**`.
2. All soft-deletable queries apply `deletedAt: null`.
3. Never trust `tenantId`, role, or ownership scope from the client.
4. Actions follow `auth -> authorize -> validate -> mutate -> audit`.
5. Fetchers return DTOs only, never raw Prisma models.

## Authorization

- Resolve user and role from `getSession()` or equivalent server-only helpers.
- Enforce ownership server-side for customer-scoped bookings, invoices, and settings.
- Owner/admin access comes from environment-mapped Clerk user IDs only.

## Webhooks

- Verify signatures for Clerk and Stripe handlers.
- Keep webhook processing idempotent.
- Keep webhook data writes out of user-facing UI layers.
