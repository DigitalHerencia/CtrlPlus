---
applyTo: '.copilot-tracking/changes/20260402-settings-domain-expansion-changes.md'
---

<!-- markdownlint-disable-file -->

# Task Checklist: Comprehensive Settings Domain Expansion

## Overview

Expand the settings domain from a single website settings page into profile/account/data route segments with server-first boundaries, owner-only tenant/export mutations, typed contracts, and full test coverage updates.

## Objectives

- Deliver thin route orchestration for `/settings/profile`, `/settings/account`, and `/settings/data` backed by feature-level orchestration and presentational component partitioning.
- Enforce settings domain server boundaries (fetchers/actions), owner-only account/export controls, audit logging, and updated unit/E2E tests.

## Research Summary

### Project Files

- `app/(tenant)/settings/page.tsx` - current single-entry settings route proving thin-route baseline.
- `features/settings/settings-page-feature.tsx` - existing feature orchestration pattern to replicate per route.
- `lib/fetchers/settings.fetchers.ts` - current read boundary and migration starting point to `lib/fetchers/settings/**`.
- `lib/actions/settings.actions.ts` - current write boundary with audit logging; migration starting point to `lib/actions/settings/**`.
- `schemas/settings.schemas.ts` and `types/settings.types.ts` - existing minimal contracts to expand.

### External References

- #file:../research/20260402-settings-domain-expansion-research.md - verified codebase and architecture research used for sequencing and file targeting.
- #fetch:https://nextjs.org/docs/app/building-your-application/routing/route-groups - route-group and route organization guidance for segmented settings routes.
- #fetch:https://nextjs.org/docs/app/api-reference/functions/revalidateTag - server-side tagged invalidation guidance for mutation follow-through.

### Standards References

- #file:../../.github/copilot/instructions/server-first.instructions.md - app/features/components/lib boundary enforcement and thin-route law.
- #file:../../.github/copilot/instructions/settings.instructions.md - target settings routes and owner-only settings/export requirements.
- #file:../../.github/copilot/contracts/mutations.yaml - required mutation pipeline (auth, authz, validate, mutate, audit, revalidate).
- #file:../../.github/copilot/contracts/layer-boundaries.contract.yaml - forbidden import and authority boundaries.

## Implementation Checklist

### [ ] Phase 1: Contract and Server Boundary Foundation

- [ ] Task 1.1: Expand settings schemas and DTO contracts
    - Details: `.copilot-tracking/details/20260402-settings-domain-expansion-details.md` (Lines 9-27)

- [ ] Task 1.2: Introduce settings fetchers under domain folder
    - Details: `.copilot-tracking/details/20260402-settings-domain-expansion-details.md` (Lines 29-45)

- [ ] Task 1.3: Introduce settings actions under domain folder with owner-only controls
    - Details: `.copilot-tracking/details/20260402-settings-domain-expansion-details.md` (Lines 47-65)

### [ ] Phase 2: Feature and UI Orchestration

- [ ] Task 2.1: Build feature orchestrators for profile/account/data/security
    - Details: `.copilot-tracking/details/20260402-settings-domain-expansion-details.md` (Lines 69-85)

- [ ] Task 2.2: Add presentational components by settings subdomain
    - Details: `.copilot-tracking/details/20260402-settings-domain-expansion-details.md` (Lines 87-101)

### [ ] Phase 3: Route Decomposition and Navigation

- [ ] Task 3.1: Create thin settings routes under app/(tenant)
    - Details: `.copilot-tracking/details/20260402-settings-domain-expansion-details.md` (Lines 105-122)

### [ ] Phase 4: Test Suite Expansion and Regression Coverage

- [ ] Task 4.1: Update unit tests for new fetchers/actions/features
    - Details: `.copilot-tracking/details/20260402-settings-domain-expansion-details.md` (Lines 126-148)

- [ ] Task 4.2: Update Playwright coverage for segmented settings routes
    - Details: `.copilot-tracking/details/20260402-settings-domain-expansion-details.md` (Lines 153-165)

## Dependencies

- Existing auth/authz guard infrastructure in `lib/auth/**` and `lib/authz/**`
- Prisma settings and audit models currently used by settings fetchers/actions
- Next.js App Router segment conventions and server action runtime support
- Vitest and Playwright test infrastructure in `tests/vitest/**` and `tests/playwright/**`

## Success Criteria

- Profile/account/data routes exist with thin page orchestration and feature delegation
- Settings reads and writes are fully located under `lib/fetchers/settings/**` and `lib/actions/settings/**`
- Owner-only tenant settings and export actions enforce authorization, validation, and audit logging
- Zod schemas and typed DTOs fully cover profile, account, and export flows
- Unit and E2E tests are updated to reflect segmented routes and owner-vs-non-owner behavior
