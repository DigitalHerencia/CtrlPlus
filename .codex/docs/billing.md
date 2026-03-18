# Billing Domain Spec

## Goal

Refactor billing into a clean, trustworthy invoice and payment system integrated with existing Stripe and booking boundaries.

## Current repo anchors

- `app/(tenant)/billing/**`
- `app/api/stripe/webhook/route.ts`
- `components/billing/CheckoutButton.tsx`
- `components/billing/InvoiceStatusBadge.tsx`
- `lib/billing/actions/*`
- `lib/billing/fetchers/*`
- `lib/billing/stripe.ts`

## Main requirements

- clarify invoice lifecycle
- tighten checkout creation and confirmation
- preserve webhook-authoritative payment updates
- improve billing page usability

## Key implementation points

- keep payment writes server-side
- keep invoice ownership validation strict
- reduce duplicate payment actions when possible
- keep booking-to-billing handoff explicit

## UX requirements

- invoice list and detail views should be direct and trustworthy
- status badges must be unambiguous
- checkout actions must be explicit
- pending, paid, failed, and retry states must be clear

## Security/performance focus

- never trust client-reported payment status
- keep webhook processing safe and idempotent
- avoid unnecessary repeated billing fetches

## Acceptance signals

- billing UI is professional and simple
- payment state handling is clearer
- owner-scoped invoice access is intact
- tests cover critical billing transitions
