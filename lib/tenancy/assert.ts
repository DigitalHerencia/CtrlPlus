import { prisma } from "@/lib/prisma";

export type AllowedRole = "OWNER" | "ADMIN" | "MEMBER";

/**
 * Asserts that the given user holds at least one of the required roles
 * within the specified tenant. Throws if the membership is missing,
 * inactive, or the role is insufficient.
 *
 * @param tenantId - The tenant to check membership against
 * @param userId   - The Clerk user ID
 * @param roles    - Required role(s); any match is sufficient
 */
export async function assertTenantMembership(
  tenantId: string,
  userId: string,
  roles: AllowedRole | AllowedRole[]
): Promise<void> {
  const allowed = Array.isArray(roles) ? roles : [roles];

  const membership = await prisma.tenantUserMembership.findFirst({
    where: {
      tenantId,
      userId,
      status: "ACTIVE",
    },
    select: { role: true },
  });

  if (!membership) {
    throw new Error("Forbidden: no active membership for this tenant");
  }

  if (!allowed.includes(membership.role)) {
    throw new Error(
      `Forbidden: role '${membership.role}' is not in [${allowed.join(", ")}]`
    );
  }
}
