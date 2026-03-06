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
  /**
   * Normalized API role (uppercase).
   * The database stores this as lowercase (`TenantRoleDb`); callers that read
   * directly from Prisma should pass the raw string through `normalizeTenantRole()`
   * before constructing this DTO.
   */
  role: TenantRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type TenantRole = "OWNER" | "ADMIN" | "MEMBER";

/**
 * The role value as stored in the database (lowercase).
 * The database column defaults to "member" and stores "owner" | "admin" | "member".
 * Use `normalizeTenantRole()` to convert to the canonical `TenantRole` API type.
 */
export type TenantRoleDb = "owner" | "admin" | "member";

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
 * Convert a raw database role string to the canonical uppercase `TenantRole`.
 * Throws if the provided string is not a recognized role value.
 *
 * @example
 * ```ts
 * normalizeTenantRole("admin")  // → "ADMIN"
 * normalizeTenantRole("OWNER")  // → "OWNER"
 * normalizeTenantRole("unknown") // throws
 * ```
 */
export function normalizeTenantRole(role: string): TenantRole {
  const upper = role.toUpperCase();
  // Validate before casting: only cast to TenantRole after confirming it exists
  // in the hierarchy map to prevent unsafe assertions on unrecognized strings.
  if (!(upper in ROLE_HIERARCHY)) {
    throw new Error(`Invalid tenant role: "${role}"`);
  }
  return upper as TenantRole;
}

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
