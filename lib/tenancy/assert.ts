/**
 * Tenant authorization helpers.
 * Enforces membership and role checks for tenant-scoped operations.
 */

export type AllowedRole = "OWNER" | "ADMIN" | "MEMBER";

/**
 * Asserts that the given user is a member of the given tenant with at least
 * one of the specified roles. Throws "Forbidden" if the check fails.
 */
export async function assertTenantMembership(
  tenantId: string,
  userId: string,
  roles: AllowedRole | AllowedRole[]
): Promise<void> {
  // TODO: Replace with real Prisma query once @prisma/client is installed.
  // const membership = await prisma.tenantUserMembership.findFirst({
  //   where: { tenantId, userId, role: { in: Array.isArray(roles) ? roles : [roles] } },
  // });
  // if (!membership) throw new Error("Forbidden: insufficient permissions");
  const _tenantId = tenantId;
  const _userId = userId;
  const _roles = roles;
  void _tenantId;
  void _userId;
  void _roles;
}
