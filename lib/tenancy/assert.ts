/**
 * Tenancy Assertion Helpers
 *
 * Defensive security checks for tenant scoping and permissions.
 * Use these to prevent cross-tenant data leaks.
 */

import { prisma } from "@/lib/prisma";
import { type TenantRole, hasRolePermission } from "./types";

/**
 * Assert that a user is a member of a tenant with the required role.
 * Throws an error if membership does not exist or role is insufficient.
 *
 * @param tenantId - Tenant ID to check
 * @param clerkUserId - Clerk user ID (from session)
 * @param requiredRole - Minimum role required (defaults to "MEMBER")
 * @throws Error if user is not an active member or has insufficient role
 */
export async function assertTenantMembership(
  tenantId: string,
  clerkUserId: string,
  requiredRole: TenantRole = "MEMBER"
): Promise<void> {
  const membership = await prisma.tenantUserMembership.findFirst({
    where: {
      tenantId,
      user: { clerkUserId },
      status: "ACTIVE",
    },
    select: { role: true },
  });

  if (!membership) {
    throw new Error(
      `Forbidden: user is not an active member of tenant ${tenantId}`
    );
  }

  if (!hasRolePermission(membership.role as TenantRole, requiredRole)) {
    throw new Error(
      `Forbidden: role '${membership.role}' is insufficient; requires '${requiredRole}' or higher`
    );
  }
}

/**
 * Assert that a record belongs to the current tenant.
 * Use as a defensive check when fetching records by ID.
 *
 * @param recordTenantId - The tenantId stored on the record
 * @param currentTenantId - The tenant from the current session
 * @throws Error if the record does not belong to the current tenant
 */
export function assertTenantScope(
  recordTenantId: string,
  currentTenantId: string
): void {
  if (recordTenantId !== currentTenantId) {
    throw new Error("Forbidden: resource does not belong to this tenant");
  }
}

/**
 * Get the role of a user within a tenant.
 * Returns null if the user is not an active member.
 */
export async function getUserTenantRole(
  tenantId: string,
  clerkUserId: string
): Promise<TenantRole | null> {
  const membership = await prisma.tenantUserMembership.findFirst({
    where: {
      tenantId,
      user: { clerkUserId },
      status: "ACTIVE",
    },
    select: { role: true },
  });

  return membership ? (membership.role as TenantRole) : null;
}

/**
 * Check if a user has at least the required role within a tenant.
 * Returns false instead of throwing.
 */
export async function hasMinimumRole(
  tenantId: string,
  clerkUserId: string,
  requiredRole: TenantRole
): Promise<boolean> {
  const userRole = await getUserTenantRole(tenantId, clerkUserId);
  if (!userRole) return false;
  return hasRolePermission(userRole, requiredRole);
}
