/**
 * Admin RBAC Guard
 *
 * Provides role-based access control helpers for the admin domain.
 * All admin fetchers and actions should call assertAdminOrOwner before
 * executing any tenant-scoped query.
 */

import { assertTenantMembership } from "@/lib/tenancy/assert";

/**
 * Assert that a user has at least the ADMIN role within a tenant.
 * Owners automatically satisfy this requirement due to role hierarchy.
 *
 * @param tenantId - Tenant to check membership in
 * @param userId   - Clerk user ID of the requesting user
 * @throws Error if user is not a member or has only MEMBER role
 */
export async function assertAdminOrOwner(
  tenantId: string,
  userId: string,
): Promise<void> {
  await assertTenantMembership(tenantId, userId, "admin");
}
