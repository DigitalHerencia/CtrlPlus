# Billing Runbook

## Flow

1. Customer or manager opens invoice.
2. Checkout session is created for that invoice.
3. Stripe webhook confirms payment.
4. Payment and invoice status update atomically.

## Authorization

- Customers can pay only their own invoices.
- Owner/admin can manage all invoices.

## Verification

- Invoice lookups must enforce ownership or elevated role capability.
- Webhook processing must remain idempotent.
