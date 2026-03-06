/**
 * Tenancy Type Definitions
 *
 * DTOs for tenant and membership data.
 * Never expose raw Prisma models - always use these explicit types.
 */

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantUserMembership {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type TenantRole = "OWNER" | "ADMIN" | "MEMBER";

/**
 * Map of role hierarchy for permission checking.
 * Higher value = more permissions.
 */
export const ROLE_HIERARCHY: Record<TenantRole, number> = {
  OWNER: 3,
  ADMIN: 2,
  MEMBER: 1,
};

/**
 * Check if a role has at least the required permission level.
 * Accepts both upper and lowercase role strings for DB compatibility.
 * Returns false if either role string is not a recognized TenantRole.
 */
export function hasRolePermission(userRole: string, requiredRole: string): boolean {
  const userNormalized = userRole.toUpperCase() as TenantRole;
  const requiredNormalized = requiredRole.toUpperCase() as TenantRole;

  const userLevel = ROLE_HIERARCHY[userNormalized];
  const requiredLevel = ROLE_HIERARCHY[requiredNormalized];

  // Return false for unrecognized roles to prevent unintended access grants
  if (userLevel === undefined || requiredLevel === undefined) {
    return false;
  }

  return userLevel >= requiredLevel;
}
