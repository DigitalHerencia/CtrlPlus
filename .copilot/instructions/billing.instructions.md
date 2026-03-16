---
description: "Domain instructions for billing, invoices, and Stripe flows"
applyTo: "app/(tenant)/billing/**,app/api/stripe/**,components/billing/**,lib/billing/**"
---

# Billing Domain Instructions

## Domain purpose

The billing domain handles invoice reads, checkout session creation, payment confirmation, payment status, and Stripe webhook-aligned billing state.

## Scope boundaries

This domain owns:

- billing pages
- invoice status display
- checkout initiation
- payment confirmation
- billing fetchers and Stripe integration helpers
- invoice creation for booking handoff

This domain does not own:

- booking capacity logic
- platform-wide recovery operations
- auth identity model
- catalog CRUD

## Required patterns

- Keep `app/(tenant)/billing/**` read/orchestration focused.
- Reads go through `lib/billing/fetchers/**`.
- Writes go through `lib/billing/actions/**`.
- Stripe integration details belong in `lib/billing/stripe.ts` and webhook routes.
- Billing state must remain server-authoritative.

## Security requirements

- Never trust client-reported payment success.
- Stripe webhook processing must remain authoritative for final payment state transitions where applicable.
- Enforce invoice ownership server-side.
- Do not leak secrets, raw webhook payload secrets, or internal provider identifiers.
- Validate all IDs and mutation payloads.

## Product requirements

- Billing pages must clearly show invoice status and next actions.
- Checkout initiation must be explicit and safe.
- Booking-to-invoice handoff must be deterministic.
- Payment confirmation must handle retry, pending, success, and failure states cleanly.

## UI requirements

- Billing UI should feel trustworthy and minimal.
- Status badges and action buttons must be unambiguous.
- Avoid confusing state duplication between booking and invoice screens.
- Keep invoice detail surfaces concise and operational.

## Performance requirements

- Avoid repeated status polling unless necessary.
- Prevent duplicate checkout session creation for the same unresolved invoice when possible.
- Keep billing fetches focused and server-side.

## Testing requirements

Add or update tests when changing:

- checkout session creation
- payment confirmation flow
- invoice ownership rules
- invoice fetchers
- Stripe webhook route behavior
- invoice status rendering

## Refactor priorities

1. tighten invoice/payment state model
2. improve checkout safety and idempotency
3. improve clarity of billing page UX
4. harden webhook-driven state updates
5. keep booking and billing boundaries explicit
