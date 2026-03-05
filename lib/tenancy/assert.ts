import { prisma } from "@/lib/prisma";

export type AllowedRole = "OWNER" | "ADMIN" | "MEMBER";

/**
 * Asserts that the given user holds at least one of the required roles
 * within the specified tenant. Throws if the membership is missing,
 * inactive, or the role is insufficient.
 *
 * @param tenantId    - The tenant to check membership against
 * @param clerkUserId - The Clerk user ID (from `getSession().user.id`)
 * @param roles       - Required role(s); any match is sufficient
 * @throws {Error} "Forbidden: no active membership for this tenant"
 * @throws {Error} "Forbidden: role '...' is not in [...]"
 */
export async function assertTenantMembership(
  tenantId: string,
  clerkUserId: string,
  roles: AllowedRole | AllowedRole[]
): Promise<void> {
  const allowed = Array.isArray(roles) ? roles : [roles];

  const membership = await prisma.tenantUserMembership.findFirst({
    where: {
      tenantId,
      // userId is the internal ClerkUser.id (FK), so we join via the relation
      user: { clerkUserId },
      status: "ACTIVE",
    },
    select: { role: true },
  });

  if (!membership) {
    throw new Error("Forbidden: no active membership for this tenant");
  }

  if (!allowed.includes(membership.role as AllowedRole)) {
    throw new Error(
      `Forbidden: role '${membership.role}' is not in [${allowed.join(", ")}]`
    );
  }
}
