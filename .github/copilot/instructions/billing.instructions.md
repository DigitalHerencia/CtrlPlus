---
description: "Billing domain essentials: Stripe integration, invoices, payments, tax calculation. Use when building checkout, payment processing, or subscription features."
applyTo: "lib/billing/**, features/billing/**, components/billing/**"
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
- `getInvoices(tenantId, pagination)` - List tenant invoices
- `getBalance(tenantId)` - Account balance/credits

## Actions: `lib/actions/billing/`

- `createInvoice(bookingId)` - On booking confirmed (called from scheduling)
- `processPayment(invoiceId, paymentMethod)` - Charge customer (Stripe)
- `applyCredit(invoiceId, amount)` - Apply discount/credit
- `voidInvoice(invoiceId)` - Soft-delete invoice

## Stripe Integration

- Webhook endpoint: `app/api/stripe/webhook/route.ts`
- Card tokenization: Clerk handles for marketplace model
- Tax: Stripe Tax API integration (if enabled)

## Public Routes

- `/(tenant)/billing` - History
- `/(tenant)/billing/{invoiceId}` - Invoice detail

## Schema: `schemas/billing.schemas.ts`

- `createInvoiceSchema`: bookingId, tenantId
- `processPaymentSchema`: invoiceId, paymentMethod, amount

## Key Constraints

- All mutations require `assertTenantMembership(..., "owner")`
- Never expose full payment methods to UI (use Stripe token)
- Tax is calculated server-side via Stripe Tax
- Invoices are immutable after creation (void instead of delete)
