export type TenantRole = "owner" | "admin" | "member";

/**
 * Asserts that a user has the required role in a tenant.
 * Throws if the user does not have the required role.
 *
 * TODO: Replace with Prisma-based membership check when database is configured.
 *
 * @example
 * const membership = await prisma.tenantUserMembership.findFirst({
 *   where: { tenantId, userId, deletedAt: null },
 * });
 * if (!membership) throw new Error("Forbidden: not a tenant member");
 * const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
 * if (!roles.includes(membership.role as TenantRole)) {
 *   throw new Error(`Forbidden: requires ${roles.join(" or ")} role`);
 * }
 */
export async function assertTenantMembership(
  _tenantId: string,
  _userId: string,
  _requiredRole: TenantRole | TenantRole[]
): Promise<void> {
  // Stub: always passes until DB-based RBAC is configured
}
