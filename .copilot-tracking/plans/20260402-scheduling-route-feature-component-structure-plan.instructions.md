---
applyTo: '.copilot-tracking/changes/20260402-scheduling-route-feature-component-structure-changes.md'
---

<!-- markdownlint-disable-file -->

# Task Checklist: Scheduling Route/Feature/Component Full Structure

## Overview

Create the full scheduling route, feature, and component structure requested for CtrlPlus using thin pages, feature orchestration, and presentational components backed by existing scheduling fetchers/actions.

## Objectives

- Add all required scheduling route files under `app/(tenant)/scheduling/**` with page-thin orchestration only.
- Add all requested scheduling feature and component files with correct layering and dependency boundaries.

## Research Summary

### Project Files

- `app/(tenant)/scheduling/page.tsx` - existing thin route pattern.
- `features/scheduling/scheduling-page-feature.tsx` - existing feature orchestration pattern.
- `lib/fetchers/scheduling.fetchers.ts` - existing read-side scheduling APIs to reuse.
- `lib/actions/scheduling.actions.ts` - existing write-side scheduling APIs to reuse.
- `.github/copilot/contracts/layer-boundaries.contract.yaml` - layer responsibilities and forbidden behavior.

### External References

- #file:../research/20260402-scheduling-route-feature-component-structure-research.md - verified local + external research and required target structure.
- #fetch:https://nextjs.org/docs/app/api-reference/file-conventions/loading - loading segment behavior.
- #fetch:https://nextjs.org/docs/app/api-reference/file-conventions/not-found - route-level not-found conventions.
- #fetch:https://nextjs.org/docs/app/getting-started/error-handling - error boundary behavior for segment routes.

### Standards References

- #file:../../AGENTS.md - workspace architectural and security constraints.
- #file:../../.github/copilot/instructions/server-first.instructions.md - server-first layering rules.
- #file:../../.github/copilot/instructions/scheduling.instructions.md - scheduling domain route/action guidance.

## Implementation Checklist

### [ ] Phase 1: Scheduling Route Tree Scaffolding

- [ ] Task 1.1: Add missing customer scheduling route files and wire each to a single feature import.
  - Details: .copilot-tracking/details/20260402-scheduling-route-feature-component-structure-details.md (Lines 9-35)

- [ ] Task 1.2: Add full `/manage` scheduling route tree and capability-gated thin pages.
  - Details: .copilot-tracking/details/20260402-scheduling-route-feature-component-structure-details.md (Lines 36-66)

### [ ] Phase 2: Customer Scheduling Features

- [ ] Task 2.1: Create customer dashboard/detail/new/edit feature files plus client helper features.
  - Details: .copilot-tracking/details/20260402-scheduling-route-feature-component-structure-details.md (Lines 67-108)

### [ ] Phase 3: Manage Scheduling Features

- [ ] Task 3.1: Create manage feature files and client orchestration modules.
  - Details: .copilot-tracking/details/20260402-scheduling-route-feature-component-structure-details.md (Lines 109-154)

### [ ] Phase 4: Presentational Component Surface

- [ ] Task 4.1: Add dashboard/detail/form presentational components under `components/scheduling/**`.
  - Details: .copilot-tracking/details/20260402-scheduling-route-feature-component-structure-details.md (Lines 155-208)

- [ ] Task 4.2: Add manager presentational components under `components/scheduling/manage/**`.
  - Details: .copilot-tracking/details/20260402-scheduling-route-feature-component-structure-details.md (Lines 209-252)

### [ ] Phase 5: Integration and Validation

- [ ] Task 5.1: Ensure features use existing `lib/fetchers/scheduling.fetchers` and `lib/actions/scheduling.actions` only.
  - Details: .copilot-tracking/details/20260402-scheduling-route-feature-component-structure-details.md (Lines 253-280)

- [ ] Task 5.2: Run lint/typecheck/tests for scheduling scope and fix boundary violations.
  - Details: .copilot-tracking/details/20260402-scheduling-route-feature-component-structure-details.md (Lines 281-306)

## Dependencies

- Existing scheduling APIs in `lib/fetchers/scheduling.fetchers.ts` and `lib/actions/scheduling.actions.ts`
- App Router conventions for segment special files (`loading.tsx`, `error.tsx`, `not-found.tsx`)
- Capability checks (`lib/auth/session`, `lib/authz/policy`)

## Success Criteria

- Every required file from the user request exists with correct layer role.
- `app/**` remains thin and imports features only.
- No Prisma import appears in `app/**`, `features/**`, or `components/**` scheduling files.
- Features orchestrate data/actions using existing scheduling lib modules.
- `pnpm lint` and `pnpm typecheck` pass for new scheduling surface.
