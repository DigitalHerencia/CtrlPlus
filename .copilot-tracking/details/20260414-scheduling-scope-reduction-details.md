<!-- markdownlint-disable-file -->

# Task Details: Scheduling Scope Reduction

## Research Reference

**Source Research**: #file:../research/20260414-scheduling-scope-reduction-research.md

## Phase 1: Canonical route and flow consolidation

### Task 1.1: Keep only canonical scheduling flows and retire alias routes

Consolidate route entrypoints so only canonical user/admin paths remain discoverable. Remove alias pages that only redirect and are outside the reduced scope.

- **Files**:
    - `app/(tenant)/scheduling/new/page.tsx` - remove alias redirect route
    - `app/(tenant)/scheduling/manage/new/page.tsx` - remove alias redirect route
    - `features/scheduling/scheduling-dashboard-page-feature.tsx` - verify no links to retired aliases
- **Success**:
    - No navigation path relies on `/scheduling/new` or `/scheduling/manage/new`
    - Canonical flows remain: `/scheduling/book`, `/scheduling/bookings`, `/scheduling/manage`
- **Research References**:
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 21-37) - existing route inventory and alias routes
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 105-118) - canonical keep list
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 122-124) - alias removal recommendation
- **Dependencies**:
    - None

### Task 1.2: Keep customer + admin capability boundaries explicit

Preserve route capability checks and ensure no simplified route bypasses read/write capability gates.

- **Files**:
    - `app/(tenant)/scheduling/manage/page.tsx` - enforce `scheduling.read.all`
    - `app/(tenant)/scheduling/manage/[bookingId]/page.tsx` - enforce `scheduling.read.all`
    - `app/(tenant)/scheduling/manage/[bookingId]/edit/page.tsx` - enforce `scheduling.write.all`
    - `lib/actions/scheduling.actions.ts` - preserve owner/admin + ownership checks
- **Success**:
    - Manager list/detail/edit remain inaccessible to non-manager capabilities
    - Customer-owned update/cancel checks remain server-enforced
- **Research References**:
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 87-95) - auth/authz findings
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 97-103) - architecture/security conformance
- **Dependencies**:
    - Task 1.1 completion

## Phase 2: Remove manager UI extras and simplify scheduling UX

### Task 2.1: Inline/remove manager display-only wrappers

Remove manager wrapper panels and display-only controls that do not add scope-critical behavior.

- **Files**:
    - `features/scheduling/manage/edit-managed-booking-page-feature.tsx` - inline simple layout where wrappers are used
    - `features/scheduling/manage/booking-notification-controls.client.tsx` - remove if unused after inlining
    - `components/scheduling/manage/booking-command-panel.tsx` - remove if unused after inlining
    - `components/scheduling/manage/booking-lifecycle-panel.tsx` - remove if unused after inlining
- **Success**:
    - Manager edit page still supports status actions without wrapper-only components
    - No dead imports remain from retired manager helper components
- **Research References**:
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 51-57) - extra feature complexity candidates
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 125-128) - wrapper removal list
- **Dependencies**:
    - Phase 1 completion

### Task 2.2: Reduce optional cross-domain scheduling links

Keep scheduling focused on appointment tasks; de-emphasize or remove catalog/visualizer links from scheduling context cards unless explicitly required.

- **Files**:
    - `features/scheduling/scheduling-book-page-feature.tsx`
    - `features/scheduling/scheduling-booking-form-client.tsx`
- **Success**:
    - Booking flow remains fully functional without cross-domain handoff links
    - Customer can still complete appointment creation and review/edit flows
- **Research References**:
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Line 56) - optional cross-links identified
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Line 132) - simplify UX copy/links recommendation
- **Dependencies**:
    - Task 2.1 completion

## Phase 3: Action/fetcher API reduction and test alignment

### Task 3.1: Deprecate and remove unused reservation-oriented APIs

Retire APIs that are not used by active scheduling routes/features and are outside reduced scope.

- **Files**:
    - `lib/actions/scheduling.actions.ts` - remove `reserveSlot`, `cleanupExpiredReservations` if no runtime consumers
    - `lib/fetchers/scheduling.fetchers.ts` - remove `getAvailability`, `getAvailabilityWindowById`, `getAvailabilityWindowsByDay` if no runtime consumers
    - `types/scheduling.types.ts` - remove stale DTOs/interfaces only tied to removed APIs
    - `schemas/scheduling.schemas.ts` - remove schemas only tied to removed APIs
- **Success**:
    - Active scheduling routes compile with only retained APIs
    - Removed APIs have zero app/runtime references
- **Research References**:
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 59-85) - keep/deprecate API mapping
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 129-131) - planned API removal set
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 136-137) - reservation dependency risks
- **Dependencies**:
    - Phase 2 completion

### Task 3.2: Update and prune tests for reduced scope

Adjust feature and lib tests to validate only retained user/admin appointment workflows.

- **Files**:
    - `tests/vitest/unit/features/scheduling/*.test.tsx`
    - `tests/vitest/unit/lib/scheduling/actions/*.test.ts`
    - `tests/vitest/unit/lib/scheduling/fetchers/*.test.ts`
- **Success**:
    - No tests depend on removed APIs/routes/components
    - Tests cover: user create/update/cancel + admin confirm/complete/manage
- **Research References**:
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 18-19) - test impact scan
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 139-140) - risk coverage requirements
- **Dependencies**:
    - Task 3.1 completion

## Phase 4: Verification and controlled rollout

### Task 4.1: Run project quality gates for safe merge

Run required gates with focus on dead-code and type integrity after removal work.

- **Files**:
    - `knip.json` (reference only)
    - CI workflow files (reference only)
- **Success**:
    - `pnpm lint`
    - `pnpm typecheck`
    - `pnpm prisma:validate`
    - `pnpm build`
    - `pnpm test`
    - `pnpm test:e2e --project=chromium --reporter=line`
- **Research References**:
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 97-103) - architecture/security checks
    - #file:../research/20260414-scheduling-scope-reduction-research.md (Lines 134-140) - risk controls
- **Dependencies**:
    - Phase 3 completion

## Dependencies

- Next.js App Router conventions in `app/**` (orchestration only)
- Reads via `lib/fetchers/**`, writes via `lib/actions/**`
- Zod validation in `schemas/scheduling.schemas.ts`
- Server-side auth/authz checks (no client-trusted permissions)

## Success Criteria

- Scheduling supports only two personas: customer appointment management and admin/owner management
- Alias/extra scheduling routes and wrapper-only components are removed or inlined
- Deprecated reservation-oriented APIs are removed without breaking canonical flows
- All quality gates pass after simplification
