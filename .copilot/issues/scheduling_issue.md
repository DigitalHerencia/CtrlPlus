# Issue: Scheduling Reliability and UX Improvements

## Labels

feature, scheduling, refactor

## References

PRD.md
TECH-REQUIREMENTS.md
scheduling.domain.md

## Summary

Improve booking UX and reliability of reservation lifecycle while preserving server‑authoritative availability logic.

## Scope

- app/(tenant)/scheduling/\*\*
- components/scheduling/\*\*
- lib/scheduling/\*\*

## Implementation tasks

### 1 Availability

Ensure availability logic comes only from server fetchers.

Avoid client derived slot assumptions.

### 2 Reservation lifecycle

Improve:

- reserve slot
- confirm booking
- cancel booking
- expire reservations

Ensure double booking cannot occur.

### 3 Booking UI

Improve clarity for:

- available
- reserved
- confirmed
- cancelled

### 4 Form UX

Improve validation and feedback in booking form.

### 5 Security

Validate all booking payloads server side.

## QA / CI

- lint
- typecheck
- build
- unit tests for reservation logic

Playwright

booking flow:

availability → reserve → confirm

## Completion criteria

- slot conflicts handled
- booking UI clearer
- reservation lifecycle stable
