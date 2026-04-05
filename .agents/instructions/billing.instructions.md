---
description: Billing domain interpretation for invoices, payments, and Stripe integration.
applyTo: "app/(tenant)/billing/**, components/billing/**, features/billing/**, lib/actions/billing*.ts, lib/fetchers/billing*.ts, app/api/stripe/**"
---

## Purpose

Interpret billing lifecycle behavior with strong consistency and webhook resilience.

## Interpretation guidance

- Keep invoice/payment state transitions explicit and deterministic.
- Treat webhook events as external signals requiring verification and idempotency.
- Handle retries and ordering issues without duplicating side effects.
- Keep payment-sensitive operations tightly scoped and auditable.

## Reliability interpretation

- Prefer reconciliation-safe writes and replay-safe handlers.
- Preserve linkability between local records and provider event identifiers.

## References

- `.agents/docs/TECHNOLOGY-REQUIREMENTS.md`
- `.agents/contracts/security.contract.yaml`
- `.agents/contracts/mutation-pipeline.contract.yaml`
