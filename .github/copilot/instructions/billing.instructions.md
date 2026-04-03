---
description: "Billing domain essentials: Stripe integration, invoices, payments, tax calculation. Use when building checkout, payment processing, or subscription features."
applyTo: "app/(tenant)/billing/**, features/billing/**, components/billing/**, lib/actions/billing.actions.ts, lib/fetchers/billing.fetchers.ts"
---

# Billing Domain Quick Reference

## Core Entities & Operations

| Entity | Owner Actions | Customer Actions |
|--------|---|---|
| Invoice | Create (on booking), void | View, download |
| Payment | Process (Stripe), refund | View history |
| Subscription (future) | Create, modify terms | Cancel, update card |

## Fetchers: `lib/fetchers/billing/`

- `getInvoice(invoiceId, userId)` - Fetch single invoice
- `getInvoices(filters)` - List invoices for the authenticated billing surface
- `getBalance()` - Account balance/credits for the current operating context

## Actions: `lib/actions/billing/`

- `createInvoice(bookingId)` - On booking confirmed (called from scheduling)
- `processPayment(invoiceId, paymentMethod)` - Charge customer (Stripe)
- `applyCredit(invoiceId, amount)` - Apply discount/credit
- `voidInvoice(invoiceId)` - Soft-delete invoice

## Stripe Integration

- Webhook endpoint: `app/api/stripe/webhook/route.ts`
- Card tokenization: Clerk handles for marketplace model
- Tax: Stripe Tax API integration (if enabled)

## Authenticated Routes

- `/(tenant)/billing` - History
- `/(tenant)/billing/{invoiceId}` - Invoice detail

## Schema: `schemas/billing.schemas.ts`

- `createInvoiceSchema`: bookingId
- `processPaymentSchema`: invoiceId, paymentMethod, amount

## Key Constraints

- All mutations require an authenticated session plus server-side capability or ownership checks
- Never expose full payment methods to UI (use Stripe token)
- Tax is calculated server-side via Stripe Tax
- Invoices are immutable after creation (void instead of delete)
