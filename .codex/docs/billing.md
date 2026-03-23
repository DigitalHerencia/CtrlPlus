# Billing Domain Spec

## Goal

Refactor billing into a clean, trustworthy invoice and payment system that follows the target server-first architecture while preserving explicit booking, checkout, and webhook boundaries.

## Current repo anchors

- `app/(tenant)/billing/**`
- `features/billing/**`
- `app/api/stripe/webhook/route.ts`
- `components/billing/CheckoutButton.tsx`
- `components/billing/InvoiceStatusBadge.tsx`
- `lib/billing/actions/**`
- `lib/billing/fetchers/**`
- `lib/billing/stripe.ts`
- `lib/auth/**`
- `lib/authz/**`

## Main requirements

- clarify the invoice and payment lifecycle
- preserve webhook-authoritative payment state
- keep the booking-to-billing handoff explicit
- tighten checkout creation, confirmation, and retry behavior
- prepare billing routes for thin `app/**` orchestration and feature-owned UI flows

## Key implementation points

- keep all billing reads in `lib/billing/fetchers/**`
- keep all billing mutations in `lib/billing/actions/**`
- keep feature orchestration outside `app/**`
- enforce invoice ownership and capability checks at the server boundary
- keep Stripe route handling narrow, idempotent, and auditable
- preserve flexibility for PaymentIntent lifecycle expansion, failed-payment handling, refunds, and reconciliation work identified in `DOMAIN_AUDIT.md`

## UX requirements

- invoice list and detail views should be direct, trustworthy, and easy to scan
- status badges must be unambiguous across pending, paid, failed, canceled, and retry states
- checkout initiation and retry actions must be explicit
- loading, empty, permission-denied, and payment-error states must be first-class
- billing UI should not duplicate booking state or imply client-authoritative payment confirmation

## Security/performance focus

- never trust client-reported payment status
- keep webhook processing safe, idempotent, and server-authoritative
- keep invoice ownership and read-all versus read-own boundaries strict
- use focused or short-lived reads for payment-sensitive data
- avoid repeated billing fetches and duplicate checkout-session creation

## Acceptance signals

- billing routes, features, and server helpers have clear separation of concerns
- payment state handling is clearer and remains webhook-authoritative
- booking-to-billing handoff is explicit in code and UI
- owner-scoped and customer-scoped invoice access remains intact
- tests cover critical billing transitions, webhook handling, and checkout behavior
