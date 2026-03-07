# Scheduling Reservation Holds

## Why BookingReservation is retained

`BookingReservation` is now an active model used by scheduling flows to enforce 15-minute slot holds while bookings are in `pending` status.

- `reserveSlot` creates `Booking` (`pending`) + `BookingReservation` (`expiresAt = now + 15m`).
- `confirmBooking` requires an unexpired reservation and then transitions booking to `confirmed`.
- `cleanupExpiredReservations` cancels and soft-deletes stale pending bookings and deletes expired reservations.

## Authoritative slot computation rules

1. Slot must be fully covered by at least one `AvailabilityRule` for the UTC weekday.
2. Matching rules are those where `rule.startTime <= slotStartHHmm` and `rule.endTime >= slotEndHHmm`.
3. Effective capacity is the maximum `capacitySlots` among matching rules.
4. Capacity consumption counts overlapping bookings with statuses:
   - `confirmed`
   - `completed`
   - `pending` with a non-expired reservation

## Concurrency-safe capacity enforcement

- Slot reservation and booking reschedule use `prisma.$transaction(..., { isolationLevel: Serializable })`.
- Capacity checks and writes happen in the same transaction boundary.
- This prevents read/write races that can otherwise lead to overbooking during concurrent requests.

## Reservation TTL cleanup path

- **Job/manual entrypoint:** `cleanupExpiredReservations`.
- Recommended trigger: cron every 1-5 minutes.
- For manual backfill, call it with optional `tenantId` and/or custom `now`/`limit`.

## Test coverage

- `reserve-slot.test.ts` validates hold creation, one-active-hold policy, and serializable transactions.
- `confirm-booking.test.ts` validates reservation expiry enforcement.
- `cleanup-expired-reservations.test.ts` validates TTL cleanup behavior.
- Existing create/update/cancel tests continue covering booking lifecycle compatibility.
