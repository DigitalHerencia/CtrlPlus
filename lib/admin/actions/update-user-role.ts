"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { updateUserRoleSchema, type UpdateUserRoleInput, type UserRoleDTO } from "../types";

/**
 * Updates the role of an existing tenant member.
 */
export async function updateUserRole(input: UpdateUserRoleInput): Promise<UserRoleDTO> {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) throw new Error("Unauthorized: not authenticated");

  await assertTenantMembership(tenantId, userId, "owner");

  const parsed = updateUserRoleSchema.parse(input);

  const membership = await prisma.tenantUserMembership.findUnique({
    where: {
      tenantId_userId: {
        tenantId,
        userId: parsed.targetClerkUserId,
      },
    },
  });

  if (!membership || membership.deletedAt) {
    throw new Error("Forbidden: target user is not a member of this tenant");
  }

  if (membership.role === "owner") {
    throw new Error("Forbidden: cannot change the role of an owner");
  }

  const updated = await prisma.tenantUserMembership.update({
    where: {
      tenantId_userId: {
        tenantId,
        userId: parsed.targetClerkUserId,
      },
    },
    data: { role: parsed.role },
  });

  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      action: "user.role_updated",
      resourceType: "TenantUserMembership",
      resourceId: updated.id,
      details: JSON.stringify({
        targetUserId: parsed.targetClerkUserId,
        newRole: parsed.role,
      }),
    },
  });

  return {
    tenantId: updated.tenantId,
    userId: updated.userId,
    role: updated.role as "admin" | "member",
    updatedAt: updated.updatedAt,
  };
}
