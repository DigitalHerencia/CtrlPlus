<!-- markdownlint-disable-file -->

# Task Details: Scheduling Route/Feature/Component Full Structure

## Research Reference

**Source Research**: #file:../research/20260402-scheduling-route-feature-component-structure-research.md

## Phase 1: Scheduling Route Tree Scaffolding

### Task 1.1: Add missing customer scheduling route files and wire each to a single feature import

Create customer route files to complete the required route tree and keep each page thin.

- **Files**:
  - `app/(tenant)/scheduling/not-found.tsx` - scheduling-specific not-found segment UI.
  - `app/(tenant)/scheduling/new/page.tsx` - thin page rendering `NewBookingPageFeature`.
  - `app/(tenant)/scheduling/[bookingId]/page.tsx` - thin page rendering `BookingDetailPageFeature`.
  - `app/(tenant)/scheduling/[bookingId]/edit/page.tsx` - thin page rendering `EditBookingPageFeature`.
- **Success**:
  - Each page file has route-level auth/capability checks only.
  - Each page imports exactly one feature entrypoint and passes typed params/searchParams.
- **Research References**:
  - #file:../research/20260402-scheduling-route-feature-component-structure-research.md (Lines 64-95) - thin pages and feature boundaries.
  - #fetch:https://nextjs.org/docs/app/api-reference/file-conventions/not-found - segment not-found usage.
- **Dependencies**:
  - Existing route auth pattern from `app/(tenant)/scheduling/page.tsx`.

### Task 1.2: Add full `/manage` scheduling route tree and capability-gated thin pages

Create manage route segment files required by the request and gate with existing authz policy checks.

- **Files**:
  - `app/(tenant)/scheduling/manage/loading.tsx`
  - `app/(tenant)/scheduling/manage/error.tsx`
  - `app/(tenant)/scheduling/manage/page.tsx`
  - `app/(tenant)/scheduling/manage/new/page.tsx`
  - `app/(tenant)/scheduling/manage/[bookingId]/page.tsx`
  - `app/(tenant)/scheduling/manage/[bookingId]/edit/page.tsx`
- **Success**:
  - Manage routes are isolated under `/manage` and render only manage features.
  - Capability checks for all-bookings/admin operations stay server-side.
- **Research References**:
  - #file:../research/20260402-scheduling-route-feature-component-structure-research.md (Lines 152-231) - required target tree and dependency guidance.
  - #file:../../.github/copilot/contracts/layer-boundaries.contract.yaml - app-layer constraints.
- **Dependencies**:
  - Task 1.1 completion.

## Phase 2: Customer Scheduling Features

### Task 2.1: Create customer dashboard/detail/new/edit feature files plus client helper features

Add the requested customer-facing feature set and wire it to existing fetchers/actions without Prisma access.

- **Files**:
  - `features/scheduling/scheduling-dashboard-page-feature.tsx`
  - `features/scheduling/scheduling-dashboard-filters.client.tsx`
  - `features/scheduling/scheduling-dashboard-table.client.tsx`
  - `features/scheduling/new-booking-page-feature.tsx`
  - `features/scheduling/booking-detail-page-feature.tsx`
  - `features/scheduling/edit-booking-page-feature.tsx`
  - `features/scheduling/booking-form.client.tsx`
  - `features/scheduling/booking-calendar.client.tsx`
  - `features/scheduling/booking-slot-picker.client.tsx`
  - `features/scheduling/booking-detail-tabs.client.tsx`
- **Success**:
  - Features orchestrate `getBookings`, `getBookingById`, `getAvailability*`, `createBooking`, `updateBooking`, `cancelBooking`, `confirmBooking` as needed.
  - No feature imports Prisma.
- **Research References**:
  - #file:../research/20260402-scheduling-route-feature-component-structure-research.md (Lines 96-151) - existing feature orchestration and lib reuse guidance.
  - #file:../../.github/copilot/instructions/server-first.instructions.md - feature responsibilities.
- **Dependencies**:
  - Phase 1 route scaffolding complete.

## Phase 3: Manage Scheduling Features

### Task 3.1: Create manage feature files and client orchestration modules

Implement manage surface with bulk operations, manager filters/table, and status/notification controls using existing action/fetcher APIs.

- **Files**:
  - `features/scheduling/manage/bookings-manager-page-feature.tsx`
  - `features/scheduling/manage/bookings-manager-toolbar.client.tsx`
  - `features/scheduling/manage/bookings-manager-table.client.tsx`
  - `features/scheduling/manage/bookings-manager-filters.client.tsx`
  - `features/scheduling/manage/bookings-manager-bulk-actions.client.tsx`
  - `features/scheduling/manage/new-managed-booking-page-feature.tsx`
  - `features/scheduling/manage/edit-managed-booking-page-feature.tsx`
  - `features/scheduling/manage/managed-booking-form.client.tsx`
  - `features/scheduling/manage/booking-status-actions.client.tsx`
  - `features/scheduling/manage/booking-notification-controls.client.tsx`
- **Success**:
  - Manage features read/write through existing scheduling lib modules.
  - Bulk/status/notification controls are client wrappers over server actions.
- **Research References**:
  - #file:../research/20260402-scheduling-route-feature-component-structure-research.md (Lines 232-269) - dependency graph and sequence.
- **Dependencies**:
  - Phase 2 customer features complete.

## Phase 4: Presentational Component Surface

### Task 4.1: Add dashboard/detail/form presentational components under `components/scheduling/**`

Create requested presentational blocks for dashboard and booking details/forms.

- **Files**:
  - `components/scheduling/scheduling-dashboard-header.tsx`
  - `components/scheduling/scheduling-dashboard-toolbar.tsx`
  - `components/scheduling/scheduling-dashboard-table.tsx`
  - `components/scheduling/scheduling-dashboard-stats.tsx`
  - `components/scheduling/booking-card.tsx` (align existing)
  - `components/scheduling/booking-status-badge.tsx` (align existing)
  - `components/scheduling/booking-detail-header.tsx`
  - `components/scheduling/booking-detail-summary.tsx`
  - `components/scheduling/booking-detail-timeline.tsx`
  - `components/scheduling/booking-detail-tabs.tsx`
  - `components/scheduling/booking-form/booking-form-shell.tsx`
  - `components/scheduling/booking-form/booking-form-fields.tsx`
  - `components/scheduling/booking-form/booking-date-fields.tsx`
  - `components/scheduling/booking-form/booking-contact-fields.tsx`
  - `components/scheduling/booking-form/booking-notes-fields.tsx`
  - `components/scheduling/booking-form/booking-calendar.tsx`
  - `components/scheduling/booking-form/booking-slot-picker.tsx`
  - `components/scheduling/booking-form/booking-form-actions.tsx`
- **Success**:
  - Components use shadcn primitives and props only.
  - Components have no server authority imports.
- **Research References**:
  - #file:../research/20260402-scheduling-route-feature-component-structure-research.md (Lines 112-131) - presentational boundary guidance.
  - #file:../../.github/copilot/contracts/layer-boundaries.contract.yaml - components restrictions.
- **Dependencies**:
  - Phase 2 complete.

### Task 4.2: Add manager presentational components under `components/scheduling/manage/**`

Create manager-focused presentational blocks.

- **Files**:
  - `components/scheduling/manage/bookings-manager-header.tsx`
  - `components/scheduling/manage/bookings-manager-toolbar.tsx`
  - `components/scheduling/manage/bookings-manager-table.tsx`
  - `components/scheduling/manage/bookings-manager-row-actions.tsx`
  - `components/scheduling/manage/bookings-manager-stats.tsx`
  - `components/scheduling/manage/booking-command-panel.tsx`
  - `components/scheduling/manage/booking-notification-panel.tsx`
  - `components/scheduling/manage/booking-lifecycle-panel.tsx`
- **Success**:
  - Manager UI is presentational; behavior stays in feature client wrappers.
- **Research References**:
  - #file:../research/20260402-scheduling-route-feature-component-structure-research.md (Lines 170-231) - required structure and constraints.
- **Dependencies**:
  - Task 4.1 complete.

## Phase 5: Integration and Validation

### Task 5.1: Ensure features use existing scheduling fetchers/actions only

Normalize imports and orchestration so all scheduling data/mutations flow through existing lib modules.

- **Files**:
  - `features/scheduling/**/*.tsx`
  - `app/(tenant)/scheduling/**/*.tsx`
- **Success**:
  - No Prisma import in app/features/components scheduling files.
  - Existing `lib/fetchers/scheduling.fetchers.ts` and `lib/actions/scheduling.actions.ts` remain the source of read/write truth.
- **Research References**:
  - #file:../research/20260402-scheduling-route-feature-component-structure-research.md (Lines 132-169) - verified APIs to reuse.
- **Dependencies**:
  - Phases 1-4 complete.

### Task 5.2: Run boundary + quality validation

Run repository checks and correct any violations before completion.

- **Files**:
  - `package.json` scripts already define validation commands.
- **Success**:
  - `pnpm lint`
  - `pnpm typecheck`
  - scheduling tests pass (targeted Vitest + any route-level tests added)
- **Research References**:
  - #file:../research/20260402-scheduling-route-feature-component-structure-research.md (Lines 270-287) - risk and mitigation.
- **Dependencies**:
  - Task 5.1 complete.

## Dependencies

- Existing scheduling fetchers/actions (`lib/fetchers/scheduling.fetchers.ts`, `lib/actions/scheduling.actions.ts`)
- Auth and capability helpers (`lib/auth/session`, `lib/authz/policy`)
- UI primitives under `components/ui/**`

## Success Criteria

- All requested files exist and are wired by layer responsibility.
- Route files stay thin and feature-only imports.
- Features orchestrate lib + components only.
- Scheduling components remain presentational and shadcn-based.
- No Prisma usage appears in app/features/components.
