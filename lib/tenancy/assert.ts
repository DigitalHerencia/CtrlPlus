/**
 * Tenancy Assertions
 *
 * Server-side guards that throw on authorization failures.
 * All admin actions must call assertTenantMembership before mutating data.
 *
 * NOTE: This is a stub. Replace prisma queries with real DB calls once
 * a database connection is configured.
 */

import type { AllowedRole, TenantRole } from "@/lib/auth/rbac";
import { isRoleAllowed } from "@/lib/auth/rbac";

/**
 * Asserts that the given Clerk user is an ACTIVE member of the tenant
 * with one of the allowedRoles.
 *
 * Throws "Forbidden" if the check fails.
 */
export async function assertTenantMembership(
  tenantId: string,
  clerkUserId: string,
  allowedRoles: AllowedRole
): Promise<void> {
  // Stub implementation – always passes in development.
  // In production this queries:
  //   prisma.tenantUserMembership.findFirst({
  //     where: { tenantId, user: { clerkUserId }, status: "ACTIVE" },
  //   })
  // and then checks isRoleAllowed(membership.role, allowedRoles).

  if (!tenantId || !clerkUserId) {
    throw new Error("Forbidden: missing tenant or user context");
  }

  // During development we grant access based on DEV_USER_ROLE env var.
  const devRole =
    (process.env.DEV_USER_ROLE as TenantRole | undefined) ?? "OWNER";
  if (!isRoleAllowed(devRole, allowedRoles)) {
    throw new Error("Forbidden: insufficient permissions");
  }
}

/**
 * Asserts that a given resource belongs to the expected tenant.
 * Use after fetching a record to prevent cross-tenant access.
 */
export function assertTenantScope(
  resourceTenantId: string,
  expectedTenantId: string
): void {
  if (resourceTenantId !== expectedTenantId) {
    throw new Error("Forbidden: resource does not belong to this tenant");
  }
}
