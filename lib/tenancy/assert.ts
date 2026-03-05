import { prisma } from "@/lib/prisma";

export type AllowedRole = "OWNER" | "ADMIN" | "MEMBER";

const ROLE_HIERARCHY: Record<AllowedRole, number> = {
  OWNER: 3,
  ADMIN: 2,
  MEMBER: 1,
};

/**
 * Asserts that a user is a member of a tenant with at least the given role.
 * Throws "Forbidden" if the user does not have the required role.
 */
export async function assertTenantMembership(
  tenantId: string,
  userId: string,
  requiredRole: AllowedRole | AllowedRole[]
): Promise<void> {
  const membership = await prisma.tenantUserMembership.findFirst({
    where: { tenantId, userId },
    select: { role: true },
  });

  if (!membership) {
    throw new Error("Forbidden: not a member of this tenant");
  }

  const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const userLevel = ROLE_HIERARCHY[membership.role as AllowedRole] ?? 0;
  const hasPermission = required.some((r) => userLevel >= ROLE_HIERARCHY[r]);

  if (!hasPermission) {
    throw new Error(`Forbidden: requires one of [${required.join(", ")}] role`);
  }
}
