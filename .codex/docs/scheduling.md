# Scheduling Domain Spec

## Goal

Refactor scheduling into a reliable booking system with clear availability, reservation, confirmation, and cancellation behavior under the target server-first architecture.

## Current repo anchors

- `app/(tenant)/scheduling/**`
- `features/scheduling/**`
- `components/scheduling/booking-form.tsx`
- `components/scheduling/calendar-client.tsx`
- `components/scheduling/time-slot.tsx`
- `lib/scheduling/actions/**`
- `lib/scheduling/fetchers/**`
- `lib/scheduling/capacity.ts`
- `lib/authz/**`

## Main requirements

- preserve server-authoritative availability
- simplify booking UX
- harden reservation and confirmation lifecycle behavior
- keep booking statuses explicit
- prepare scheduling routes for thin page orchestration and feature-owned flows

## Key implementation points

- keep route orchestration thin and move scheduling page composition into `features/scheduling/**`
- keep slot, capacity, and lifecycle logic in domain server helpers
- avoid client-authoritative scheduling assumptions
- ensure reservation, confirmation, cancellation, and expiration paths are explicit
- align booking views and status badges with actual domain state
- account for audit follow-up work around timezone normalization and reservation cleanup execution

## UX requirements

- intuitive booking flow
- clear available, unavailable, reserved, confirmed, canceled, expired, and conflict states
- direct booking list and detail views
- strong validation, save feedback, and retry-safe error handling
- avoid optimistic UX where slot contention could make the UI briefly wrong

## Security/performance focus

- validate server-side inputs and ownership
- avoid race-prone slot handling
- reduce redundant availability fetches
- keep contested reservation flows server-confirmed
- preserve explicit billing handoff boundaries

## Acceptance signals

- scheduling routes, features, and helpers align with the target architecture
- booking flow is easier to trust and complete
- slot conflicts are better handled
- scheduling UI feels operationally solid
- tests cover critical availability, reservation, and lifecycle transitions
