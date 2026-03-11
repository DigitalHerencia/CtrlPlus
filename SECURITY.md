# Security Policy

CTRL+ runs as a single-store application with server-side authorization.

## Core Controls

1. Authentication is handled by Clerk.
2. Authorization is server-side with roles: `customer`, `owner`, `admin`.
3. Owner/admin identities are resolved from environment variables only.
4. No tenant/org IDs are accepted from clients.
5. All mutations are audited via `AuditLog`.

## Data Access

- Shared resources (catalog, availability rules) are global and soft-delete aware.
- Customer resources (bookings, invoices, settings) must enforce ownership checks by `customerId`/`clerkUserId`.
- Elevated roles (`owner`, `admin`) may access global management views.

## Data Layer Boundary

- `app/**` must not import Prisma directly, except webhook handlers.
- Queries and mutations are centralized in `lib/*/fetchers` and `lib/*/actions`.
- Fetchers return DTOs only.

## Webhooks

- Clerk webhook route is public and signature-verified (`verifyWebhook`).
- Stripe webhook route is signature-verified.
- Idempotency tables (`ClerkWebhookEvent`, `StripeWebhookEvent`) protect replay processing.

## Operational Security

- Production env vars must be managed outside the app UI.
- `STORE_OWNER_CLERK_USER_ID` and `PLATFORM_DEV_CLERK_USER_ID` are operational settings, not user-facing actions.
