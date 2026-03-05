"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import type { WrapDTO } from "../types";

/**
 * Soft-deletes a wrap from the catalog (sets deletedAt timestamp).
 * Hard deletion is avoided to preserve historical booking records.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is an owner of the tenant (elevated privilege)
 * 3. Tenant scope  — confirm the wrap belongs to the current tenant
 * 4. Mutate        — soft delete by setting deletedAt
 * 5. Audit         — write an immutable audit event
 */
export async function deleteWrap(wrapId: string): Promise<WrapDTO> {
  // 1. AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — delete requires owner or admin role
  await assertTenantMembership(tenantId, user.id, ["OWNER", "ADMIN"]);

  // 3. TENANT SCOPE — defensive ownership check before mutation
  const existing = await prisma.wrap.findFirst({
    where: { id: wrapId, tenantId, deletedAt: null },
    select: { id: true, tenantId: true, name: true },
  });

  if (!existing) {
    throw new Error("Forbidden: resource not found");
  }

  // 4. MUTATE — soft delete
  const wrap = await prisma.wrap.update({
    where: { id: wrapId },
    data: { deletedAt: new Date() },
  });

  // 5. AUDIT
  await prisma.auditEvent.create({
    data: {
      tenantId,
      userId: user.id,
      action: "wrap.deleted",
      resource: `wrap:${wrap.id}`,
      metadata: { name: wrap.name },
    },
  });

  return {
    id: wrap.id,
    tenantId: wrap.tenantId,
    name: wrap.name,
    description: wrap.description,
    price: wrap.price.toString(),
    estimatedHours: wrap.estimatedHours,
    status: wrap.status as WrapDTO["status"],
    imageUrls: wrap.imageUrls,
    category: wrap.category as WrapDTO["category"],
    createdAt: wrap.createdAt,
    updatedAt: wrap.updatedAt,
  };
}
