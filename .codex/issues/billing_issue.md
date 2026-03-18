# Issue: Billing Flow Hardening

## Labels

feature, billing, refactor

## References

PRD.md
TECH-REQUIREMENTS.md
billing.domain.md

## Summary

Improve invoice lifecycle clarity and checkout safety while maintaining Stripe‑driven authoritative payment state.

## Scope

- app/(tenant)/billing/\*\*
- components/billing/\*\*
- lib/billing/\*\*

## Implementation tasks

### 1 Invoice lifecycle

Clarify states:

- pending
- payable
- paid
- failed

### 2 Checkout creation

Ensure checkout session cannot be duplicated for same unpaid invoice.

### 3 Billing UI

Improve invoice list and detail clarity.

### 4 Security

- never trust client payment state
- rely on Stripe webhook updates

### 5 Performance

Avoid repeated invoice status fetches.

## QA / CI

- lint
- typecheck
- build

Playwright

invoice view → checkout → confirmation

## Completion criteria

- billing flow simple and trustworthy
- checkout safe
- invoice states clear
