<!-- markdownlint-disable-file -->

# Research: Scheduling Scope Reduction (User Booking + Admin/Owner Management)

## Objective

Identify the current scheduling surface area and define what should be kept, simplified, or retired to support only:

1. Regular users setting appointments
2. Admin/owner managing appointments

## Tooling Evidence (workspace)

- Route scan: `app/(tenant)/scheduling/**`
- Feature scan: `features/scheduling/**`
- Read/write layer scan: `lib/fetchers/scheduling.fetchers.ts`, `lib/actions/scheduling.actions.ts`
- Authz scan: `hasCapability`, `requireOwnerOrPlatformAdmin`, `requireCustomerOwnedResourceAccess`
- Usage scan for potentially removable APIs: `reserveSlot`, `cleanupExpiredReservations`, `getAvailability`, `getAvailabilityWindowById`, `getAvailabilityWindowsByDay`
- Test impact scan: `tests/vitest/unit/features/scheduling/**`, `tests/vitest/unit/lib/scheduling/**`

## Current Scheduling Routes

### Customer-facing routes

- `app/(tenant)/scheduling/page.tsx` → dashboard with links to book/bookings/manage
- `app/(tenant)/scheduling/book/page.tsx` → book appointment
- `app/(tenant)/scheduling/bookings/page.tsx` → my appointments
- `app/(tenant)/scheduling/[bookingId]/page.tsx` → appointment detail
- `app/(tenant)/scheduling/[bookingId]/edit/page.tsx` → customer edit/reschedule
- `app/(tenant)/scheduling/new/page.tsx` → redirect to `/scheduling/book`

### Admin/owner routes

- `app/(tenant)/scheduling/manage/page.tsx` → manager list view
- `app/(tenant)/scheduling/manage/[bookingId]/page.tsx` → manager detail view
- `app/(tenant)/scheduling/manage/[bookingId]/edit/page.tsx` → manager edit/lifecycle actions
- `app/(tenant)/scheduling/manage/new/page.tsx` → redirect to `/scheduling/manage`

## Current Feature Surface

### Core features aligned to target scope

- `features/scheduling/scheduling-book-page-feature.tsx`
- `features/scheduling/scheduling-booking-form-client.tsx`
- `features/scheduling/scheduling-bookings-page-feature.tsx`
- `features/scheduling/booking-detail-page-feature.tsx`
- `features/scheduling/edit-booking-page-feature.tsx`
- `features/scheduling/manage/bookings-manager-page-feature.tsx`
- `features/scheduling/manage/edit-managed-booking-page-feature.tsx`

### Potentially extra/retirable complexity

- `features/scheduling/manage/booking-notification-controls.client.tsx` (display-only panel text)
- `components/scheduling/manage/booking-command-panel.tsx` (container only)
- `components/scheduling/manage/booking-lifecycle-panel.tsx` (container only)
- Catalog/visualizer cross-links in booking flow (`/catalog`, `/visualizer`) are optional to appointment scope
- `features/scheduling/booking-detail-tabs.client.tsx` timeline tab content can be simplified if not needed

## Actions and Fetchers: Keep vs Candidate Simplification

### Actions currently exported

- Keep (needed):
    - `createBooking`
    - `updateBooking`
    - `cancelBooking`
    - `confirmBooking`
    - `completeBooking`
- Candidate remove/deprecate:
    - `reserveSlot` (not used in active app routes/features)
    - `cleanupExpiredReservations` (used in tests only; no active app route usage found)

### Fetchers currently exported

- Keep (used in core flows):
    - `getAvailabilityWindows`
    - `getBookings`
    - `getBookingById`
    - `getBooking`
    - `getBookingManagerRows`
    - `getUpcomingBookingCount`
- Candidate simplify/deprecate:
    - `getAvailabilityWindowById` (test-usage only)
    - `getAvailabilityWindowsByDay` (test-usage only)
    - `getAvailability` (test-usage only)

## Auth/Authz Findings

- Route-level capability gates exist for manager paths:
    - `scheduling.read.all` on manager listing/detail
    - `scheduling.write.all` on manager edit/new redirect
- Server write actions use guard enforcement:
    - Admin/owner-only lifecycle transitions (`confirmBooking`, `completeBooking`) via `requireOwnerOrPlatformAdmin`
    - Ownership checks in update/cancel via `requireCustomerOwnedResourceAccess`
- Read layer uses `hasCapability(session.authz, 'scheduling.read.own')` and escalates to all-scope via `scheduling.read.all`

## Architectural Conformance Check

- `app/**` acts as orchestration and redirects only ✅
- Reads in `lib/fetchers/**` ✅
- Writes in `lib/actions/**` ✅
- Mutation validation uses Zod schemas (`schemas/scheduling.schemas.ts`) ✅
- Server-side authz checks present in routes/actions/fetchers ✅

## Recommended Keep List (initial)

- Routes to keep:
    - `/scheduling`
    - `/scheduling/book`
    - `/scheduling/bookings`
    - `/scheduling/[bookingId]`
    - `/scheduling/[bookingId]/edit`
    - `/scheduling/manage`
    - `/scheduling/manage/[bookingId]`
    - `/scheduling/manage/[bookingId]/edit`
- Flows to keep:
    - Customer create/reschedule/cancel own appointments
    - Admin/owner review/confirm/complete/cancel appointments

## Candidate Removals / Inlining

- Remove route aliases:
    - `/scheduling/new` (replace with direct navigation to `/scheduling/book`)
    - `/scheduling/manage/new` (replace with direct navigation to `/scheduling/manage`)
- Remove/inline manager-only display wrappers:
    - `features/scheduling/manage/booking-notification-controls.client.tsx`
    - `components/scheduling/manage/booking-command-panel.tsx`
    - `components/scheduling/manage/booking-lifecycle-panel.tsx`
- Remove unused action/fetcher APIs after usage cleanup:
    - `reserveSlot`, `cleanupExpiredReservations`
    - `getAvailability`, `getAvailabilityWindowById`, `getAvailabilityWindowsByDay`
- Simplify booking UX copy/links to scheduling-only wording (de-emphasize catalog/visualizer as optional)

## Risks Identified

- Status lifecycle coupling risk: changing/removing reservation-related code can affect display status logic (`reserved`/`expired`) and tests.
- Hidden dependency risk: background jobs/cron hooks outside scanned files may call `cleanupExpiredReservations`.
- Billing coupling risk: manager detail links to billing composer when completed.
- Test coverage drift: multiple unit tests target soon-to-retire APIs.
- Capability regression risk: route guards and action guards must remain enforced after simplification.

## Incremental Strategy Recommendation

1. Route and navigation cleanup (remove alias routes, keep canonical flows).
2. UI simplification in manager edit/detail (inline/remove notification and panel wrappers).
3. Remove optional cross-domain links from booking context card if strict scope desired.
4. Deprecate then remove unused fetcher/action APIs with temporary compatibility notes.
5. Update tests and run quality gates.
