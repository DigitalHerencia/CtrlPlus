<!-- markdownlint-disable-file -->

# Research: Full Scheduling Route/Feature/Component Structure

## Metadata

- Date: 2026-04-02
- Task: Add full scheduling route/feature/component structure
- Scope roots:
  - `app/(tenant)/scheduling/**`
  - `features/scheduling/**`
  - `components/scheduling/**`
- Required constraints:
  - Thin pages import features only.
  - Features orchestrate fetchers/actions + compose pure UI components.
  - `components/scheduling` stays presentational and uses `components/ui/**` primitives.
  - No Prisma in app/features/components.
  - Prefer existing scheduling fetchers/actions in `lib`.

## Tooling Evidence Summary

### Workspace evidence gathered

1. Current scheduling route inventory exists but is partial:
   - Present: `app/(tenant)/scheduling/page.tsx`, `loading.tsx`, `error.tsx`, `book/page.tsx`, `bookings/page.tsx`
   - Missing from required set: `not-found.tsx`, `new/**`, `[bookingId]/**`, `manage/**` tree.
2. Current scheduling feature inventory exists but follows older naming:
   - `features/scheduling/scheduling-page-feature.tsx`
   - `features/scheduling/scheduling-book-page-feature.tsx`
   - `features/scheduling/scheduling-bookings-page-feature.tsx`
   - `features/scheduling/scheduling-booking-form-client.tsx`
3. Current scheduling component inventory exists but is minimal:
   - `components/scheduling/booking-card.tsx`
   - `components/scheduling/booking-form.tsx`
   - `components/scheduling/booking-status-badge.tsx`
   - `components/scheduling/calendar-client.tsx`
   - `components/scheduling/time-slot.tsx`
4. Existing reusable scheduling server APIs already exist and should be reused:
   - `lib/fetchers/scheduling.fetchers.ts`
   - `lib/actions/scheduling.actions.ts`
5. Scheduling tests confirm stable contracts for these APIs:
   - `tests/vitest/unit/lib/scheduling/fetchers/get-bookings.test.ts`
   - `tests/vitest/unit/lib/scheduling/actions/create-booking.test.ts`
   - `tests/vitest/unit/lib/scheduling/actions/lifecycle-actions.test.ts`

### External source evidence gathered

- Next.js App Router conventions for route segment files:
  - error handling + `error.tsx` behavior and client-boundary requirement.
  - `loading.tsx` behavior and Suspense wrapping.
  - `not-found.tsx` behavior with `notFound()` flow.
- Sources:
  - <https://nextjs.org/docs/app/getting-started/error-handling>
  - <https://nextjs.org/docs/app/api-reference/file-conventions/loading>
  - <https://nextjs.org/docs/app/api-reference/file-conventions/not-found>

## Verified In-Repo Patterns

## 1) Thin route pages in `app/**`

Observed pattern from current scheduling pages:

- Route pages perform auth gating / redirect.
- Route pages import and return one feature component.
- Complex data work is delegated to feature + lib.

References:

- `app/(tenant)/scheduling/page.tsx`
- `app/(tenant)/scheduling/book/page.tsx`
- `app/(tenant)/scheduling/bookings/page.tsx`

## 2) Feature orchestration in `features/**`

Observed pattern:

- Server feature composes UI and calls fetchers in parallel (`Promise.all`).
- Feature maps server DTOs to component props.
- Feature owns route-level empty states and action affordances.

References:

- `features/scheduling/scheduling-page-feature.tsx`
- `features/scheduling/scheduling-book-page-feature.tsx`

## 3) Presentational component discipline in `components/**`

Observed and contract-confirmed pattern:

- Components consume props and UI primitives.
- No Prisma or server-side authority in components.

References:

- `components/scheduling/booking-card.tsx`
- `components/scheduling/booking-status-badge.tsx`
- `components/ui/**`

## 4) Existing scheduling read/write APIs to reuse

Read APIs in `lib/fetchers/scheduling.fetchers.ts` (verified):

- `getBookings(...)`
- `getBookingById(...)`
- `getUpcomingBookingCount(...)`
- `getAvailabilityRules(...)` / `getAvailabilityWindows` alias
- `getAvailability(...)`

Write APIs in `lib/actions/scheduling.actions.ts` (verified):

- `reserveSlot(...)`
- `createBooking(...)`
- `updateBooking(...)`
- `confirmBooking(...)`
- `cancelBooking(...)`
- `cleanupExpiredReservations(...)`

Implication: full scheduling surface can be added without introducing new Prisma usage in route/feature/component layers.

## 5) Contract and instruction constraints

Authoritative constraints consumed:

- `.github/copilot/instructions/server-first.instructions.md`
- `.github/copilot/instructions/scheduling.instructions.md`
- `.github/copilot/contracts/layer-boundaries.contract.yaml`
- `.github/copilot/contracts/mutations.yaml`

Critical rules applied to planning:

1. `app/**` orchestration only.
2. `features/**` compose lib + components, no Prisma.
3. `components/**` presentational only.
4. Server mutations follow auth -> authz -> validate -> mutate -> audit -> revalidate.
5. Reuse existing domain APIs first.

## Required Target Structure (From Request)

## Routes to add under `app/(tenant)/scheduling`

- `not-found.tsx`
- `new/page.tsx`
- `[bookingId]/page.tsx`
- `[bookingId]/edit/page.tsx`
- `manage/loading.tsx`
- `manage/error.tsx`
- `manage/page.tsx`
- `manage/new/page.tsx`
- `manage/[bookingId]/page.tsx`
- `manage/[bookingId]/edit/page.tsx`

(Existing `loading.tsx`, `error.tsx`, `page.tsx` stay and may be updated.)

## Features to add under `features/scheduling`

- `scheduling-dashboard-page-feature.tsx`
- `scheduling-dashboard-filters.client.tsx`
- `scheduling-dashboard-table.client.tsx`
- `new-booking-page-feature.tsx`
- `booking-detail-page-feature.tsx`
- `edit-booking-page-feature.tsx`
- `booking-form.client.tsx`
- `booking-calendar.client.tsx`
- `booking-slot-picker.client.tsx`
- `booking-detail-tabs.client.tsx`
- `manage/bookings-manager-page-feature.tsx`
- `manage/bookings-manager-toolbar.client.tsx`
- `manage/bookings-manager-table.client.tsx`
- `manage/bookings-manager-filters.client.tsx`
- `manage/bookings-manager-bulk-actions.client.tsx`
- `manage/new-managed-booking-page-feature.tsx`
- `manage/edit-managed-booking-page-feature.tsx`
- `manage/managed-booking-form.client.tsx`
- `manage/booking-status-actions.client.tsx`
- `manage/booking-notification-controls.client.tsx`

## Components to add under `components/scheduling`

- `scheduling-dashboard-header.tsx`
- `scheduling-dashboard-toolbar.tsx`
- `scheduling-dashboard-table.tsx`
- `scheduling-dashboard-stats.tsx`
- `booking-card.tsx` (existing; update/align)
- `booking-status-badge.tsx` (existing; update/align)
- `booking-detail-header.tsx`
- `booking-detail-summary.tsx`
- `booking-detail-timeline.tsx`
- `booking-detail-tabs.tsx`
- `booking-form/booking-form-shell.tsx`
- `booking-form/booking-form-fields.tsx`
- `booking-form/booking-date-fields.tsx`
- `booking-form/booking-contact-fields.tsx`
- `booking-form/booking-notes-fields.tsx`
- `booking-form/booking-calendar.tsx`
- `booking-form/booking-slot-picker.tsx`
- `booking-form/booking-form-actions.tsx`
- `manage/bookings-manager-header.tsx`
- `manage/bookings-manager-toolbar.tsx`
- `manage/bookings-manager-table.tsx`
- `manage/bookings-manager-row-actions.tsx`
- `manage/bookings-manager-stats.tsx`
- `manage/booking-command-panel.tsx`
- `manage/booking-notification-panel.tsx`
- `manage/booking-lifecycle-panel.tsx`

## Implementation Guidance Derived from Evidence

1. Build routes as thin wrappers that only:
   - read params/searchParams,
   - gate auth/capability,
   - render one feature.
2. Build features first as orchestration shells with TODO-safe placeholders and stable imports to existing lib fetchers/actions.
3. Build presentational components next; keep client state in feature `*.client.tsx` wrappers where interaction is needed.
4. Keep all DB access in `lib/fetchers/scheduling.fetchers.ts` and `lib/actions/scheduling.actions.ts`; extend these only if a required field is unavailable.
5. Sequence manage/admin views after customer views because they depend on broader list/table primitives and capability checks.

## Dependency Graph (High-level)

1. Base DTO compatibility check (`types/scheduling.types.ts`) ->
2. Presentational components (dashboard/form/detail/manager blocks) ->
3. Feature orchestrators (customer paths) ->
4. Feature orchestrators (manage paths) ->
5. Thin route files wiring ->
6. Tests for route-to-feature wiring and feature contracts.

## Risks and Mitigations

- Risk: Naming collision with existing older scheduling files.
  - Mitigation: Add new files with requested names first; keep old files until final route cutover.
- Risk: Capability mismatch for `/manage` routes.
  - Mitigation: Reuse `hasCapability(session.authz, 'scheduling.read.all')` style checks already used in fetchers/policy.
- Risk: Presentational components accidentally importing server modules.
  - Mitigation: enforce import checks during `pnpm lint` and review layer boundaries.

## Conclusion

Research is sufficient for planning: it includes verified current state, contracts, concrete existing implementation patterns, external framework conventions, and evidence-backed implementation sequencing.
