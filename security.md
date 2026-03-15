# Security Rules

1. Never import Prisma in `app/**`, except `app/api/clerk/**` and `app/api/stripe/**`.
2. All protected-domain queries must include `deletedAt: null` and server-side role/ownership checks.
3. Never trust role, ownership scope, or resource IDs from client input without server validation.
4. Actions follow `auth -> authorize -> validate -> mutate -> audit`.
5. Fetchers return DTOs only, never raw Prisma models.

## Authorization

- Resolve role and user identity from server-only helpers (`getSession()`/guards).
- Enforce ownership for customer-scoped resources server-side.
- Keep owner/admin capabilities server-enforced only.

## Webhooks

- Verify signatures for Clerk and Stripe handlers.
- Keep webhook processing idempotent.
- Keep webhook data writes out of user-facing UI layers.
