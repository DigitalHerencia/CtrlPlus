/**
 * Role-Based Access Control (RBAC) for tenant membership.
 *
 * Roles follow a strict hierarchy: OWNER > ADMIN > MEMBER
 * Permissions use the {domain}:{operation} format defined in TECH-REQUIREMENTS.md.
 */

/** Tenant membership role */
export type TenantRole = "OWNER" | "ADMIN" | "MEMBER";

/** Membership status stored in TenantUserMembership */
export type MembershipStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

/** Numeric weight used for role hierarchy comparisons (higher = more privileged) */
export const ROLE_HIERARCHY: Record<TenantRole, number> = {
  OWNER: 3,
  ADMIN: 2,
  MEMBER: 1,
};

/** Permission constants in {domain}:{operation} format */
export const PERMISSIONS = {
  catalog: {
    read: "catalog:read",
    write: "catalog:write",
    delete: "catalog:delete",
  },
  scheduling: {
    read: "scheduling:read",
    write: "scheduling:write",
    delete: "scheduling:delete",
  },
  billing: {
    read: "billing:read",
    write: "billing:write",
  },
  visualizer: {
    read: "visualizer:read",
    write: "visualizer:write",
  },
  admin: {
    read: "admin:read",
    write: "admin:write",
    users: "admin:users",
  },
} as const;

/** Union type of all known permission strings */
export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]];

/** Permissions granted to each role (cumulative — higher roles include lower-role permissions) */
export const ROLE_PERMISSIONS: Record<TenantRole, readonly string[]> = {
  OWNER: [
    PERMISSIONS.catalog.read,
    PERMISSIONS.catalog.write,
    PERMISSIONS.catalog.delete,
    PERMISSIONS.scheduling.read,
    PERMISSIONS.scheduling.write,
    PERMISSIONS.scheduling.delete,
    PERMISSIONS.billing.read,
    PERMISSIONS.billing.write,
    PERMISSIONS.visualizer.read,
    PERMISSIONS.visualizer.write,
    PERMISSIONS.admin.read,
    PERMISSIONS.admin.write,
    PERMISSIONS.admin.users,
  ],
  ADMIN: [
    PERMISSIONS.catalog.read,
    PERMISSIONS.catalog.write,
    PERMISSIONS.catalog.delete,
    PERMISSIONS.scheduling.read,
    PERMISSIONS.scheduling.write,
    PERMISSIONS.scheduling.delete,
    PERMISSIONS.billing.read,
    PERMISSIONS.billing.write,
    PERMISSIONS.visualizer.read,
    PERMISSIONS.visualizer.write,
    PERMISSIONS.admin.read,
  ],
  MEMBER: [
    PERMISSIONS.catalog.read,
    PERMISSIONS.scheduling.read,
    PERMISSIONS.visualizer.read,
    PERMISSIONS.visualizer.write,
  ],
};

/**
 * Returns true if `userRole` satisfies `required`.
 *
 * When `required` is an array, the check passes if the user's role meets
 * **any** of the listed roles (i.e. logical OR across the array).
 * Role hierarchy is respected: OWNER satisfies ADMIN or MEMBER requirements.
 *
 * @param userRole - The user's actual membership role
 * @param required - Single role or array of acceptable roles
 */
export function hasRole(
  userRole: TenantRole,
  required: TenantRole | TenantRole[]
): boolean {
  const roles = Array.isArray(required) ? required : [required];
  return roles.some((r) => ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[r]);
}

/**
 * Returns true if the given role grants the specified permission.
 *
 * @param role       - Membership role to check
 * @param permission - Permission string in `{domain}:{operation}` format
 */
export function hasPermission(role: TenantRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Throws a "Forbidden" error if `userRole` does not satisfy `required`.
 * Use this as a hard authorization gate inside server actions and fetchers.
 *
 * @param userRole - The user's actual membership role
 * @param required - Required role or array of acceptable roles
 * @throws {Error} "Forbidden: insufficient role"
 */
export function requireRole(
  userRole: TenantRole,
  required: TenantRole | TenantRole[]
): void {
  if (!hasRole(userRole, required)) {
    throw new Error("Forbidden: insufficient role");
  }
}
