<!-- markdownlint-disable-file -->

# Task Details: Comprehensive Settings Domain Expansion

## Research Reference

**Source Research**: #file:../research/20260402-settings-domain-expansion-research.md

## Phase 1: Contract and Server Boundary Foundation

### Task 1.1: Expand settings schemas and DTO contracts

Define settings domain contracts for profile, account, and data export before route and UI work.

- **Files**:
    - `schemas/settings.schemas.ts` - add profile/account/export input schemas with Zod validation
    - `types/settings.types.ts` - add `UserSettingsDTO`, `TenantSettingsDTO`, and export DTO/input contracts
    - `schemas/settings.ts` and `types/settings.ts` - preserve re-export surface for compatibility
- **Success**:
    - Route/features/actions compile against explicit settings contracts with no `any`
    - Owner-only action inputs and export payloads are represented by typed schemas and DTOs
- **Research References**:
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 95-133) - schema/type baseline and missing contract coverage
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 171-216) - target file topology and required contract surface
- **Dependencies**:
    - None

### Task 1.2: Introduce settings fetchers under domain folder

Create `lib/fetchers/settings/**` modules for user settings, tenant settings, and export configuration reads.

- **Files**:
    - `lib/fetchers/settings/get-user-settings.ts`
    - `lib/fetchers/settings/get-tenant-settings.ts`
    - `lib/fetchers/settings/get-export-options.ts`
    - `lib/fetchers/settings/mappers.ts`
    - `lib/fetchers/settings.fetchers.ts` - compatibility exports or migration bridge
- **Success**:
    - All new settings reads route through `lib/fetchers/settings/**`
    - No Prisma access exists in app/features/components layers
- **Research References**:
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 79-95) - current fetcher baseline
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 171-200) - required fetcher topology
- **Dependencies**:
    - Task 1.1 completion

### Task 1.3: Introduce settings actions under domain folder with owner-only controls

Implement profile, tenant, and export actions using mutation pipeline and audit logging.

- **Files**:
    - `lib/actions/settings/update-user-settings.ts`
    - `lib/actions/settings/update-tenant-settings.ts`
    - `lib/actions/settings/request-data-export.ts`
    - `lib/actions/settings.actions.ts` - compatibility exports or migration bridge
- **Success**:
    - Each action enforces auth/authz, validation, mutation, audit, and revalidation
    - Tenant settings and export actions reject non-owner attempts
    - Action modules are the only write authority for new settings functionality
- **Research References**:
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 82-95) - current action baseline
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 138-170) - required constraints and action pipeline
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 201-207) - owner-only action requirements
- **Dependencies**:
    - Tasks 1.1 and 1.2 completion

## Phase 2: Feature and UI Orchestration

### Task 2.1: Build feature orchestrators for profile/account/data/security

Create server-first feature modules that fetch data and compose settings sections.

- **Files**:
    - `features/settings/profile-settings-feature.tsx`
    - `features/settings/account-settings-feature.tsx`
    - `features/settings/data-settings-feature.tsx`
    - `features/settings/security-settings-feature.tsx`
    - optional client coordinators for forms/export triggers under `features/settings/*.tsx`
- **Success**:
    - Features orchestrate data and guard handling without Prisma imports
    - Owner-only pages render permission-denied state for unauthorized users
- **Research References**:
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 74-79) - existing feature orchestration pattern
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 185-193) - target feature topology
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 159-170) - owner-only constraints
- **Dependencies**:
    - Phase 1 completion

### Task 2.2: Add presentational components by settings subdomain

Create component sets for user settings, tenant settings, export, and security sections.

- **Files**:
    - `components/settings/user-settings/user-profile-form.tsx`
    - `components/settings/tenant-settings/tenant-account-form.tsx`
    - `components/settings/export/export-controls.tsx`
    - `components/settings/security/security-panel.tsx`
- **Success**:
    - Components remain pure/presentational and accept props + callbacks only
    - Existing `components/ui/**` primitives are reused
- **Research References**:
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 76-79) - presentational baseline
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 193-200) - required component partition
- **Dependencies**:
    - Task 2.1 completion

## Phase 3: Route Decomposition and Navigation

### Task 3.1: Create thin settings routes under app/(tenant)

Add profile/account/data route pages that delegate to features and keep route logic minimal.

- **Files**:
    - `app/(tenant)/settings/profile/page.tsx`
    - `app/(tenant)/settings/account/page.tsx`
    - `app/(tenant)/settings/data/page.tsx`
    - optional route-local `loading.tsx`/`error.tsx`
    - `app/(tenant)/settings/page.tsx` - keep index landing or redirect strategy
- **Success**:
    - Pages stay orchestration-only and thin
    - URLs `/settings/profile`, `/settings/account`, `/settings/data` are active
    - Existing `/settings` behavior remains intentional (landing or redirect)
- **Research References**:
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 71-74) - current single-route baseline
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 176-184) - target route topology
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 153-158) - route-group external guidance
- **Dependencies**:
    - Phase 2 completion

## Phase 4: Test Suite Expansion and Regression Coverage

### Task 4.1: Update unit tests for new fetchers/actions/features

Add and refactor Vitest coverage for profile/account/data contracts and owner-only behavior.

- **Files**:
    - `tests/vitest/unit/lib/settings/fetchers/get-user-settings.test.ts`
    - `tests/vitest/unit/lib/settings/fetchers/get-tenant-settings.test.ts`
    - `tests/vitest/unit/lib/settings/fetchers/get-export-options.test.ts`
    - `tests/vitest/unit/lib/settings/actions/update-user-settings.test.ts`
    - `tests/vitest/unit/lib/settings/actions/update-tenant-settings.test.ts`
    - `tests/vitest/unit/lib/settings/actions/request-data-export.test.ts`
    - feature client tests for new settings forms as applicable
- **Success**:
    - Owner/non-owner paths, validation failures, and audit log writes are asserted
    - Existing website settings tests are either migrated or retained with no coverage loss
- **Research References**:
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 101-110) - current test baseline
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 223-239) - required unit test expansion
- **Dependencies**:
    - Phases 1-3 completion

### Task 4.2: Update Playwright coverage for segmented settings routes

Extend E2E tests to validate profile/account/data behaviors and authorization boundaries.

- **Files**:
    - `tests/playwright/e2e/settings-save.spec.ts` (split or extend)
    - additional settings route E2E specs if needed for readability
- **Success**:
    - `/settings/profile` flow verifies persisted user preferences
    - `/settings/account` and `/settings/data` validate owner access and denial behavior
- **Research References**:
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 109-110) - current E2E baseline
    - #file:../research/20260402-settings-domain-expansion-research.md (Lines 240-247) - required E2E updates
- **Dependencies**:
    - Task 4.1 completion

## Dependencies

- Next.js App Router route segment conventions
- Existing auth/authz capability and tenant ownership checks in `lib/auth/**` and `lib/authz/**`
- Prisma models for website/user/tenant settings and audit log persistence
- Vitest + Playwright existing test harnesses

## Success Criteria

- Settings domain supports profile/account/data routes with thin app orchestration
- Settings reads/writes are fully routed through `lib/fetchers/settings/**` and `lib/actions/settings/**`
- Tenant account and export actions are owner-only and audit-logged
- Zod schemas and typed DTOs are complete for new flows
- Unit and E2E settings tests are updated for new route and authz boundaries
