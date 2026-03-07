# Admin Domain Runbook

## Scope

This runbook covers tenant-admin operations under `lib/admin/*`, `components/admin/*`, and `app/(tenant)/admin/*`.

## Final Behavior

### Team management

- Team listing is tenant-scoped and RBAC-gated (`admin` or `owner`).
- Team member DTOs include both internal `userId` and `clerkUserId` so UI can safely call role mutation actions.
- Team list DTO uses explicit pagination fields:
  - `members`
  - `total`
  - `page`
  - `pageSize`
  - `totalPages`

### Role mutation

- Canonical role action is `updateUserRole`.
- `setUserRole` is retained only as a compatibility shim and should not be used for new imports.
- Input accepts `targetClerkUserId`, then maps that to internal `User.id` with a single helper: `getInternalUserIdByClerkId`.
- Guardrails enforced:
  - owner-only caller authorization
  - cannot assign `owner`
  - cannot modify owner membership role
  - cannot mutate membership outside current tenant
- Every successful mutation writes an audit log entry (`user.role_updated`) including both Clerk and internal IDs in `details`.

### Tenant settings

- Owner-only mutation path.
- Slug validation and conflict handling preserved.
- Returns DTO-safe serialized timestamps.

### Admin dashboard metrics

- Stats remain tenant-scoped with soft-delete filters.
- Dashboard uses canonical fields (`memberCount`, `bookingCount`, `wrapCount`, `totalRevenue`) to avoid duplicated metric contracts.

## Key Files

- `lib/admin/actions/update-user-role.ts`
- `lib/admin/actions/set-user-role.ts`
- `lib/admin/user-id.ts`
- `lib/admin/types.ts`
- `lib/admin/fetchers/get-users.ts`
- `app/(tenant)/admin/team/page.tsx`
- `components/admin/set-role-form.tsx`

## Test Coverage Added/Updated

- `lib/admin/actions/__tests__/update-user-role.test.ts`
  - Clerk → internal ID mapping
  - owner-role immutability
  - tenant scoping
  - audit log write
- `lib/admin/fetchers/__tests__/get-users.test.ts`
  - DTO shape and serialization
  - tenant scoping
  - invalid role rejection
- Updated existing settings/fetcher tests for serialized timestamp DTOs.
