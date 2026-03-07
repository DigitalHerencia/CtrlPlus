"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { getInternalUserIdByClerkId } from "../user-id";
import { updateUserRoleSchema, type UpdateUserRoleInput, type UserRoleDTO } from "../types";

/**
 * Canonical action for updating tenant member roles.
 * Owner-only; never allows assigning owner role or mutating current owner role.
 */
export async function updateUserRole(input: UpdateUserRoleInput): Promise<UserRoleDTO> {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) throw new Error("Unauthorized: not authenticated");

  await assertTenantMembership(tenantId, userId, "owner");

  const parsed = updateUserRoleSchema.parse(input);
  const targetUserId = await getInternalUserIdByClerkId(parsed.targetClerkUserId);

  const membership = await prisma.tenantUserMembership.findUnique({
    where: {
      tenantId_userId: {
        tenantId,
        userId: targetUserId,
      },
    },
    select: {
      id: true,
      tenantId: true,
      userId: true,
      role: true,
      deletedAt: true,
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
        userId: targetUserId,
      },
    },
    data: { role: parsed.role },
    select: {
      id: true,
      tenantId: true,
      userId: true,
      role: true,
      updatedAt: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      action: "user.role_updated",
      resourceType: "TenantUserMembership",
      resourceId: updated.id,
      details: JSON.stringify({
        targetClerkUserId: parsed.targetClerkUserId,
        targetUserId,
        newRole: parsed.role,
      }),
    },
  });

  return {
    tenantId: updated.tenantId,
    userId: updated.userId,
    role: updated.role as "admin" | "member",
    updatedAt: updated.updatedAt.toISOString(),
  };
}
