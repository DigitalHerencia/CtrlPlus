# Scheduling Domain Spec

## Goal

Refactor scheduling into a reliable booking system with clear availability, reservation, and confirmation behavior.

## Current repo anchors

- `app/(tenant)/scheduling/**`
- `components/scheduling/booking-form.tsx`
- `components/scheduling/calendar-client.tsx`
- `components/scheduling/time-slot.tsx`
- `lib/scheduling/actions/*`
- `lib/scheduling/fetchers/*`
- `lib/scheduling/capacity.ts`

## Main requirements

- preserve server-authoritative availability
- simplify booking UX
- harden reservation lifecycle
- keep booking statuses explicit

## Key implementation points

- keep slot logic in domain lib files
- avoid client-authoritative scheduling assumptions
- ensure reservation/confirmation/cancellation paths are clear
- align booking views and status badges with actual domain state

## UX requirements

- intuitive booking flow
- clear available/unavailable/conflict states
- direct booking list views
- strong validation and feedback

## Security/performance focus

- validate server-side inputs and ownership
- avoid race-prone slot handling
- reduce redundant availability fetches

## Acceptance signals

- booking flow is easier to trust and complete
- slot conflicts are better handled
- scheduling UI feels operationally solid
- tests cover critical booking transitions
