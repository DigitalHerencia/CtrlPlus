---
applyTo: '.copilot-tracking/changes/20260414-scheduling-scope-reduction-changes.md'
---

<!-- markdownlint-disable-file -->

# Task Checklist: Scheduling Scope Reduction

## Overview

Refactor scheduling to support only customer appointment setup/management and admin/owner appointment operations while removing non-essential capabilities.

## Objectives

- Keep canonical scheduling routes/features for customer and manager workflows only.
- Remove or inline extra scheduling capabilities that add complexity without scope value.
- Preserve server-side auth/authz, read/write layering, and Zod-validated mutations.

## Research Summary

### Project Files

- `app/(tenant)/scheduling/**` - route orchestration and capability-gated entrypoints
- `features/scheduling/**` - customer and manager scheduling UI flows
- `lib/actions/scheduling.actions.ts` - scheduling writes and lifecycle operations
- `lib/fetchers/scheduling.fetchers.ts` - scheduling reads and booking/availability queries
- `schemas/scheduling.schemas.ts` - Zod validation contracts for scheduling mutation/query inputs

### External References

- #file:../research/20260414-scheduling-scope-reduction-research.md - verified inventory, keep/remove recommendations, and risk map

### Standards References

- #file:../../AGENTS.md - repository architecture and quality gate requirements

## Implementation Checklist

### [ ] Phase 1: Canonical route and flow consolidation

- [ ] Task 1.1: Keep only canonical scheduling flows and retire alias routes

  - Details: .copilot-tracking/details/20260414-scheduling-scope-reduction-details.md (Lines 11-27)

- [ ] Task 1.2: Keep customer + admin capability boundaries explicit

  - Details: .copilot-tracking/details/20260414-scheduling-scope-reduction-details.md (Lines 29-45)

### [ ] Phase 2: Remove manager UI extras and simplify scheduling UX

- [ ] Task 2.1: Inline/remove manager display-only wrappers

  - Details: .copilot-tracking/details/20260414-scheduling-scope-reduction-details.md (Lines 49-65)

- [ ] Task 2.2: Reduce optional cross-domain scheduling links

  - Details: .copilot-tracking/details/20260414-scheduling-scope-reduction-details.md (Lines 67-81)

### [ ] Phase 3: Action/fetcher API reduction and test alignment

- [ ] Task 3.1: Deprecate and remove unused reservation-oriented APIs

  - Details: .copilot-tracking/details/20260414-scheduling-scope-reduction-details.md (Lines 85-102)

- [ ] Task 3.2: Update and prune tests for reduced scope

  - Details: .copilot-tracking/details/20260414-scheduling-scope-reduction-details.md (Lines 104-119)

### [ ] Phase 4: Verification and controlled rollout

- [ ] Task 4.1: Run project quality gates for safe merge

  - Details: .copilot-tracking/details/20260414-scheduling-scope-reduction-details.md (Lines 123-141)

## Dependencies

- Next.js App Router route orchestration in `app/**`
- `lib/fetchers/**` for reads and `lib/actions/**` for writes
- Server-side auth/authz and ownership checks
- Zod schemas in `schemas/scheduling.schemas.ts`
- Quality gates: `pnpm lint`, `pnpm typecheck`, `pnpm prisma:validate`, `pnpm build`, `pnpm test`, `pnpm test:e2e --project=chromium --reporter=line`

## Success Criteria

- Only customer booking/edit/cancel and admin/owner manage/confirm/complete/cancel flows remain.
- Alias routes and wrapper-only extra components are removed or inlined without navigation breaks.
- Deprecated reservation-oriented APIs are retired with no runtime references.
- All required quality gates pass.
