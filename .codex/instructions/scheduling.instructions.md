---
description: 'Domain instructions for scheduling and bookings'
applyTo: 'app/(tenant)/scheduling/**,components/scheduling/**,lib/scheduling/**'
---

# Scheduling Domain Instructions

## Domain purpose

The scheduling domain handles availability, slot reservation, booking creation, booking confirmation, updates, cancellation, and booking views.

## Scope boundaries

This domain owns:

- scheduling pages
- booking form and calendar UI
- availability lookup
- reservation lifecycle
- booking lifecycle
- booking status presentation

This domain does not own:

- invoice/payment processing logic
- platform recovery tooling
- wrap catalog management
- visualizer rendering pipeline

## Required patterns

- Keep page files orchestration-only.
- Reads go through `lib/scheduling/fetchers/**`.
- Writes go through `lib/scheduling/actions/**`.
- Future refactors should move route composition into `features/scheduling/**`.
- Capacity and slot logic belongs in `lib/scheduling/capacity.ts` and related utilities.
- Booking form behavior should stay aligned with existing domain typing and validation patterns.

## Product requirements

- Availability must be deterministic and server-authoritative.
- Reservation and confirmation must avoid double-booking behavior.
- Booking status transitions must be explicit.
- Scheduling UI must clearly distinguish available, reserved, confirmed, cancelled, and expired states.
- Future refactors must keep timezone handling and cleanup execution explicit.

## Security requirements

- Enforce ownership and capability checks server-side.
- Never trust client-submitted booking status or slot authority.
- Validate date/time inputs and booking payloads.
- Cleanup and expiration logic must be safe and idempotent.

## UI requirements

- Booking flow must be simple, clear, and conversion-friendly.
- Calendar and slot UI must prioritize clarity over visual novelty.
- Include loading, unavailable, conflict, success, and cancellation states.
- Keep form errors specific and actionable.

## Performance requirements

- Avoid repeated availability fetches in the same flow.
- Keep slot calculations server-consistent.
- Prevent race-prone client-only booking assumptions.
- Avoid optimistic UI for contested slot reservation or confirmation behavior.

## Testing requirements

Add or update tests when changing:

- availability logic
- reservation flow
- booking creation/confirmation/cancellation
- expiration cleanup
- scheduling UI flow
- conflict handling

## Refactor priorities

1. harden slot reservation lifecycle
2. simplify booking flow UI
3. tighten availability consistency
4. improve domain status modeling and display
5. ensure billing handoff stays explicit and reliable
