<!-- markdownlint-disable-file -->

# Research: Settings Domain Expansion (Profile, Account, Data)

## Research Scope

- Date: 2026-04-02
- Task: Produce an implementation plan to expand settings from minimal website preferences to full settings domain with profile, account, and data sections.
- Required architecture target:
    - Thin routes in `app/(tenant)/settings/{profile,account,data}`
    - Feature orchestration in `features/settings/**`
    - Presentational components in `components/settings/{user-settings,tenant-settings,export,security}`
    - Server reads in `lib/fetchers/settings/**`
    - Server writes in `lib/actions/settings/**`
    - Zod schemas and typed DTOs
    - Owner-only tenant settings and export actions
    - Audit logging for mutations
    - No Prisma usage outside `lib/**`

## Tool Usage Log and Verified Findings

1. `search_subagent`: Settings domain inventory and testing surface
    - Verified current settings route is a single page at `app/(tenant)/settings/page.tsx`.
    - Verified existing settings feature split:
        - `features/settings/settings-page-feature.tsx`
        - `features/settings/website-settings-form-client.tsx`
    - Verified presentational component:
        - `components/settings/website-settings-form.tsx`
    - Verified read/write server boundaries currently use file-level modules:
        - `lib/fetchers/settings.fetchers.ts`
        - `lib/actions/settings.actions.ts`
    - Verified existing tests:
        - Vitest unit tests for feature client form and settings fetcher/action
        - Playwright E2E spec for `/settings` save flow

2. `read_file`: Governance and architecture references
    - `AGENTS.md` and `.github/copilot/README.md` identify settings domain and resource precedence.
    - `.github/copilot/instructions/server-first.instructions.md` enforces:
        - thin `app/**` routes
        - no Prisma in `app/**`, `features/**`, `components/**`
        - all reads in `lib/fetchers/**`
        - all writes in `lib/actions/**`
        - server actions pipeline (auth → authz → validate → mutate → audit → revalidate)
    - `.github/copilot/instructions/settings.instructions.md` defines target settings pages:
        - `/(tenant)/settings/profile` (user settings)
        - `/(tenant)/settings/account` (tenant settings, owner-only)
        - `/(tenant)/settings/data` (export, owner-only)
    - `.github/copilot/contracts/mutations.yaml` and `layer-boundaries.contract.yaml` confirm strict action pipeline and layer boundaries.

3. `list_dir` and `file_search`: Actual file-system state
    - `app/(tenant)/settings/` contains only `page.tsx`, `loading.tsx`, `error.tsx`.
    - No subroutes currently exist for `profile`, `account`, `data`.
    - Settings fetchers/actions currently exist as single files, not domain folders.

4. `fetch_webpage`: External references
    - Next.js route groups docs confirm route-group convention for organization without URL path impact and caveats around conflicts.
    - Next.js `revalidateTag` docs (updated 2026-03-31) confirm server-only usage and recommend tagged invalidation over broad path invalidation.

## Current Implementation Baseline

### Existing Route and Orchestration

- `app/(tenant)/settings/page.tsx`
    - Performs auth redirect (`getSession`, redirect to `/sign-in`)
    - Delegates rendering to `SettingsPageFeature`
- `features/settings/settings-page-feature.tsx`
    - Calls `getCurrentUserWebsiteSettings()`
    - Handles forbidden state
    - Renders website settings card + form client

### Existing Server Boundaries

- `lib/fetchers/settings.fetchers.ts`
    - `getCurrentUserWebsiteSettings()` reads via Prisma
    - Uses `requireAuthzCapability('settings.manage.own')`
- `lib/actions/settings.actions.ts`
    - `updateUserWebsiteSettings()` validates with Zod
    - Mutates `websiteSettings` via Prisma upsert
    - Writes `prisma.auditLog.create(...)`
    - Calls `revalidatePath('/settings')`

### Existing Schemas/Types

- `schemas/settings.schemas.ts` has `websiteSettingsSchema`
- `types/settings.types.ts` has `WebsiteSettingsInput` and `WebsiteSettingsDTO`
- `schemas/settings.ts` and `types/settings.ts` re-export from `*.schemas` / `*.types`

### Existing Tests

- `tests/vitest/unit/features/settings/website-settings-form-client.test.tsx`
- `tests/vitest/unit/lib/settings/fetchers/get-current-user-website-settings.test.ts`
- `tests/vitest/unit/lib/settings/actions/update-user-website-settings.test.ts`
- `tests/playwright/e2e/settings-save.spec.ts`

## Gap Analysis Against Requested Target

1. **Route decomposition missing**
    - Needed: `settings/profile`, `settings/account`, `settings/data`
    - Current: single `settings/page.tsx`

2. **Feature orchestration breadth missing**
    - Needed: route-specific orchestrators for profile/account/data, including owner-only flows
    - Current: single website settings feature

3. **Component partitioning missing**
    - Needed: presentational components split by `user-settings`, `tenant-settings`, `export`, `security`
    - Current: one website settings form component

4. **Server module organization missing**
    - Needed: settings domain folders in `lib/fetchers/settings/**` and `lib/actions/settings/**`
    - Current: flat files `settings.fetchers.ts` and `settings.actions.ts`

5. **Owner-only tenant/account and data export actions not implemented**
    - Needed: explicit owner guard + audit logging
    - Current: only user-owned website settings update action

6. **Caching alignment improvement needed**
    - Current action uses `revalidatePath('/settings')`
    - Contracts and external docs indicate tag-based revalidation pattern should be preferred for domain data consistency.

## Verified Constraints for the Plan

- Do not import Prisma in `app/**`, `features/**`, `components/**`.
- Reads must live under `lib/fetchers/settings/**`.
- Writes must live under `lib/actions/settings/**`.
- Apply server action pipeline:
    1. authenticate,
    2. authorize,
    3. validate (Zod),
    4. mutate,
    5. audit,
    6. revalidate and return DTO.
- Owner-only boundaries are required for tenant settings writes and export actions.
- Keep app routes thin and server-first.

## External Evidence Used for Implementation Decisions

1. Next.js Route Groups
    - Source: https://nextjs.org/docs/app/building-your-application/routing/route-groups
    - Applied decision: Keep tenant settings subroutes inside existing `(tenant)` route group while creating explicit URL segments `/settings/profile`, `/settings/account`, `/settings/data`.

2. Next.js revalidateTag
    - Source: https://nextjs.org/docs/app/api-reference/functions/revalidateTag
    - Applied decision: plan migration from broad path revalidation (`revalidatePath('/settings')`) to tag-based invalidation for settings resources.

## Recommended Target File Topology

### Routes (thin orchestration)

- `app/(tenant)/settings/profile/page.tsx`
- `app/(tenant)/settings/account/page.tsx`
- `app/(tenant)/settings/data/page.tsx`
- Optional segment-local `loading.tsx` and `error.tsx` per subroute if UX requires route-specific behavior.

### Feature Orchestrators

- `features/settings/profile-settings-feature.tsx`
- `features/settings/account-settings-feature.tsx`
- `features/settings/data-settings-feature.tsx`
- `features/settings/security-settings-feature.tsx` (shared section for password/session/security preferences if included in profile/account screens)
- Client coordinators (only where needed):
    - `features/settings/profile-settings-form-client.tsx`
    - `features/settings/account-settings-form-client.tsx`
    - `features/settings/data-export-client.tsx`

### Presentational Components

- `components/settings/user-settings/user-profile-form.tsx`
- `components/settings/tenant-settings/tenant-account-form.tsx`
- `components/settings/export/export-controls.tsx`
- `components/settings/security/security-panel.tsx`

### Server Fetchers

- `lib/fetchers/settings/get-user-settings.ts`
- `lib/fetchers/settings/get-tenant-settings.ts`
- `lib/fetchers/settings/get-export-options.ts`
- `lib/fetchers/settings/mappers.ts` (DTO shaping utilities)

### Server Actions

- `lib/actions/settings/update-user-settings.ts`
- `lib/actions/settings/update-tenant-settings.ts` (owner-only)
- `lib/actions/settings/request-data-export.ts` (owner-only)

### Contracts

- `schemas/settings.schemas.ts` expanded with:
    - profile input schema
    - tenant settings schema
    - data export request schema
- `types/settings.types.ts` expanded with explicit DTOs:
    - `UserSettingsDTO`
    - `TenantSettingsDTO`
    - `DataExportRequestInput`
    - `DataExportRequestDTO`

## Sequencing Guidance (Evidence-Based)

1. Establish contracts first (schemas + DTOs) to stabilize compiler and form/action boundaries.
2. Add read fetchers for profile/account/data before route/features so features can be server-driven.
3. Add write actions with owner authz + audit logging + revalidation tags.
4. Introduce feature orchestrators and presentational components per subdomain.
5. Add thin app routes that only delegate to feature orchestrators.
6. Update existing flat import surfaces (`settings.fetchers.ts`, `settings.actions.ts`) via compatibility exports or callsite migration.
7. Update tests (unit + e2e) per phase.

## Test Impact and Required Updates

### Unit tests to add/update

- Fetchers
    - `tests/vitest/unit/lib/settings/fetchers/get-user-settings.test.ts`
    - `tests/vitest/unit/lib/settings/fetchers/get-tenant-settings.test.ts`
    - `tests/vitest/unit/lib/settings/fetchers/get-export-options.test.ts`
- Actions
    - `tests/vitest/unit/lib/settings/actions/update-user-settings.test.ts`
    - `tests/vitest/unit/lib/settings/actions/update-tenant-settings.test.ts`
    - `tests/vitest/unit/lib/settings/actions/request-data-export.test.ts`
    - Include owner/non-owner authorization assertions and audit log assertions.
- Features/clients
    - profile/account/data form clients validate schema errors and success flows.

### E2E tests to add/update

- Split current `/settings` scenario into route-specific coverage:
    - `/settings/profile` user update flow
    - `/settings/account` owner allowed, non-owner denied
    - `/settings/data` owner export request flow + denied access for non-owner

## Risks and Mitigations

- Risk: Breaking existing `/settings` entrypoint and links.
    - Mitigation: keep `/settings` page as index landing or redirect to `/settings/profile` after rollout.

- Risk: Role/capability mismatch between existing guards and new owner-only actions.
    - Mitigation: codify explicit owner guard checks in new actions; test failure paths first.

- Risk: Audit log payload inconsistency.
    - Mitigation: standardize action/resourceType/detail payload shape across settings actions.

## Readiness Assessment

Research completeness criteria satisfied:

- Tool usage documentation with verified findings: ✅
- Concrete project structure and pattern analysis: ✅
- External source research with implementation-relevant guidance: ✅
- Evidence-based sequencing guidance and test impact: ✅

This research is sufficient to proceed with creation of planning artifacts.
