# Scheduling Reservations Runbook

## Reservation Job

Use the reservation cleanup action to expire stale pending reservations.

## Inputs

- Optional `now`
- Optional `limit`

## Behavior

- Expired reservations are removed.
- Related pending bookings are marked cancelled.
- Audit logs are written for cleanup operations.
