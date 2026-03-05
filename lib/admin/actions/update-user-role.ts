"use server";

/**
 * Update User Role Action
 *
 * Assigns a new role to an existing tenant member.
 * Requires OWNER role — only owners may change member roles.
 *
 * Security pipeline: authenticate → authorize (OWNER) → validate → mutate → audit
 */

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import {
  updateUserRoleSchema,
  type UpdateUserRoleInput,
  type UpdateUserRoleResult,
} from "../types";

export async function updateUserRole(
  input: UpdateUserRoleInput
): Promise<UpdateUserRoleResult> {
  // ── Step 1: AUTHENTICATE ──────────────────────────────────────────────────
  const { userId, tenantId } = await getSession();
  if (!userId || !tenantId) {
    throw new Error("Unauthorized: not authenticated");
  }

  // ── Step 2: AUTHORIZE ─────────────────────────────────────────────────────
  // Only OWNER can reassign roles (including promoting other users to OWNER).
  await assertTenantMembership(tenantId, userId, "OWNER");

  // ── Step 3: VALIDATE ──────────────────────────────────────────────────────
  const parsed = updateUserRoleSchema.parse(input);

  // ── Step 4: MUTATE ────────────────────────────────────────────────────────
  // Confirm the target user is actually an active member of this tenant before updating.
  // The relational filter `user: { clerkUserId }` resolves the Clerk user ID without
  // requiring the caller to know the internal DB id.
  const existing = await prisma.tenantUserMembership.findFirst({
    where: {
      tenantId,
      user: { clerkUserId: parsed.targetClerkUserId },
      status: "ACTIVE",
    },
    select: {
      id: true,
      role: true,
      user: { select: { clerkUserId: true } },
    },
  });

  if (!existing) {
    throw new Error(
      "Not found: target user is not an active member of this tenant"
    );
  }

  const updated = await prisma.tenantUserMembership.update({
    where: { id: existing.id },
    data: { role: parsed.newRole },
    select: { id: true, role: true, updatedAt: true },
  });

  // ── Step 5: AUDIT ─────────────────────────────────────────────────────────
  await prisma.auditEvent.create({
    data: {
      tenantId,
      userId,
      action: "admin.role.updated",
      resource: `tenantUserMembership:${updated.id}`,
      metadata: {
        targetClerkUserId: parsed.targetClerkUserId,
        previousRole: existing.role,
        newRole: parsed.newRole,
      } as object,
    },
  });

  return {
    membershipId: updated.id,
    targetClerkUserId: parsed.targetClerkUserId,
    newRole: updated.role as UpdateUserRoleResult["newRole"],
    updatedAt: updated.updatedAt,
  };
}

// Re-export the Zod schema for use in form validation on the client side.
export { updateUserRoleSchema };
export type { UpdateUserRoleInput };
