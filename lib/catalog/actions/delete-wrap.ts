"use server";

import { requireAuth } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import type { WrapDTO } from "../types";

/**
 * Soft-deletes a wrap from the catalog (sets deletedAt timestamp).
 * Hard deletion is avoided to preserve historical booking records.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is an admin or owner of the tenant
 * 3. Tenant scope  — confirm the wrap belongs to the current tenant
 * 4. Mutate        — soft delete by setting deletedAt
 * 5. Audit         — write an immutable audit log entry
 */
export async function deleteWrap(wrapId: string): Promise<WrapDTO> {
  // 1. AUTHENTICATE
  const { userId, tenantId } = await requireAuth();

  // 2. AUTHORIZE — delete requires owner or admin role
  await assertTenantMembership(tenantId, userId, ["OWNER", "ADMIN"]);

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
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      action: "wrap.deleted",
      resourceType: "Wrap",
      resourceId: wrap.id,
      details: JSON.stringify({ name: wrap.name }),
      timestamp: new Date(),
    },
  });

  return {
    id: wrap.id,
    tenantId: wrap.tenantId,
    name: wrap.name,
    description: wrap.description,
    price: wrap.price,
    installationMinutes: wrap.installationMinutes,
    createdAt: wrap.createdAt,
    updatedAt: wrap.updatedAt,
  };
}
