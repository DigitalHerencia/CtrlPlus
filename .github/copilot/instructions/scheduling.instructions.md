---
description: "Scheduling domain: booking creation, availability rules, conflict detection, appointment management."
applyTo: "lib/scheduling/**, features/scheduling/**, components/scheduling/**"
---

# Scheduling Domain Quick Reference

## Core Entities

- **Booking** - Appointment record with status (pending, confirmed, completed, cancelled)
- **AvailabilityRule** - Recurring availability slots with capacity

## Core Patterns

| Operation | Path | Auth | Zod Schema | Action |
|-----------|------|------|-----------|--------|
| Get availability | fetcher | public | — | `getAvailability(tenantId, days)` |
| Create booking | action | tenant user | `createBookingSchema` | `createBooking(input)` |
| Cancel booking | action | owner | `cancelBookingSchema` | `cancelBooking(bookingId)` |

## Fetchers: `lib/fetchers/scheduling/`

- `getAvailability(tenantId, startDate, endDate)` - Available slots
- `getBooking(bookingId, userId)` - Fetch booking (customer or admin)
- `getBookings(tenantId, filters)` - List bookings for admin view

## Actions: `lib/actions/scheduling/`

- `createBooking(wrap, dateTime, customer)` - Create appointment
- `updateBooking(bookingId, updates)` - Reschedule or modify
- `cancelBooking(bookingId, reason)` - Cancel with reason logging
- Emits event: "booking.created" → triggers Billing to create invoice

## Booking State Machine

```
pending → confirmed → completed
       ↘  ↙
        cancelled (from any state)
```

## Key Rules

- Only one booking per customer per time slot
- Availability capacity cannot be exceeded
- Cancellations audit-logged
- On booking confirmed: trigger `createInvoice(bookingId)` in Billing domain

## Public Routes

- `/(tenant)/scheduling` - Book appointment
- `/(tenant)/bookings` - View bookings

## Admin Routes (owner-only)

- `/(tenant)/admin/schedule` - Availability management
- `/(tenant)/admin/bookings` - All bookings list
