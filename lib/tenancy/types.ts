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
}

export type TenantRole = "owner" | "admin" | "member";

/**
 * Map of role hierarchy for permission checking.
 * Higher value = more permissions.
 */
export const ROLE_HIERARCHY: Record<TenantRole, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

/**
 * Check if a role has at least the required permission level.
 */
export function hasRolePermission(userRole: TenantRole, requiredRole: TenantRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
