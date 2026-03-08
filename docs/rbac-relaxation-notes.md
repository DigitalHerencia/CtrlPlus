# RBAC Relaxation & Tenant Access Modernization

## Summary

All role-based access control (RBAC) restrictions have been removed for tenant routes and admin actions. Now, all roles (`owner`, `admin`, `member`) have full access to all tenant features, including admin, billing, catalog, scheduling, and settings. Only authentication (sign-in) is required.

## Key Changes

- All role/permission checks and forbidden/insufficient role redirects are removed from tenant and admin pages.
- All server actions and fetchers no longer enforce role-based restrictions; only authentication and tenant membership are required.
- RBAC utility functions (`hasRolePermission`, `hasPermission`, etc.) now always return `true`.
- All admin fetchers/actions and tests have been updated to reflect the new access model.

## Security Note

- Tenant isolation and authentication are still strictly enforced. Only authenticated users with valid tenant membership can access tenant routes.
- No data is exposed across tenants.

## How to Revert

To restore RBAC, reintroduce role checks in:

- `lib/auth/rbac.ts`, `lib/tenancy/types.ts`
- Tenant/admin route guards in `app/(tenant)/**`
- Admin fetchers/actions in `lib/admin/**`

## Testing

- All tests for forbidden/insufficient role are now removed or updated to expect full access for all roles.
- Run `pnpm test` to verify.

---

_This change was made per user request to allow all roles full access for all tenant features._
