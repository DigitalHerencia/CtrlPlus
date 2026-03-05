/**
 * Role-Based Access Control (RBAC)
 *
 * Defines tenant roles, hierarchy, and permission utilities.
 * Roles are uppercase strings stored in TenantUserMembership.
 */

export type TenantRole = "OWNER" | "ADMIN" | "MEMBER";

export type AllowedRole = TenantRole | TenantRole[];

/**
 * Numeric hierarchy: higher = more permissions.
 */
export const ROLE_HIERARCHY: Record<TenantRole, number> = {
  OWNER: 3,
  ADMIN: 2,
  MEMBER: 1,
};

/**
 * Returns true if userRole meets or exceeds the required role level.
 */
export function hasRolePermission(
  userRole: TenantRole,
  requiredRole: TenantRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Returns true if userRole is included in allowedRoles.
 * Supports single role or array of roles.
 */
export function isRoleAllowed(
  userRole: TenantRole,
  allowedRoles: AllowedRole
): boolean {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.some((r) => hasRolePermission(userRole, r));
}
