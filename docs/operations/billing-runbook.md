# Billing Runbook

## Environment variables

The billing domain fails fast when these values are missing:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL` (must be an absolute URL)

## Booking → Invoice → Checkout flow

1. Customer books an appointment.
2. `ensureInvoiceForBooking(bookingId)` creates an invoice once per booking (guarded by `Invoice.bookingId @unique`).
3. Customer is redirected to `/billing/:invoiceId`.
4. Checkout creation verifies tenant membership and that the invoice belongs to the current customer.
5. Stripe Checkout session is created from invoice line items (integer cents only).

## Webhook flow (`/api/stripe/webhook`)

1. Verify Stripe signature.
2. Claim idempotency via `StripeWebhookEvent`:
   - Create row with `status=processing`.
   - If duplicate event ID exists, skip processing unless last status was `failed`.
3. For `checkout.session.completed`:
   - Create `Payment` (`stripePaymentIntentId` is unique).
   - Set `Invoice.status=paid`.
   - Set `Booking.status=confirmed`.
4. Mark webhook event `processed` (or `failed` on exception).
5. Non-target event types are acknowledged with HTTP 200 and still marked processed for replay safety.

## Replay and concurrency safety

- `StripeWebhookEvent.id` prevents duplicate event processing.
- `Payment.stripePaymentIntentId @unique` prevents duplicate payment persistence.
- Invoice creation uses `Invoice.bookingId @unique` and race fallback lookup.

## Operational checks

- Invoice lookup and listing are tenant-scoped in all fetchers.
- Checkout rejects invoices that are already paid.
- Checkout rejects payment attempts for another customer’s invoice.
