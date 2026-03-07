"use server";

import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import type { WrapDTO } from "../types";

export async function deleteWrap(wrapId: string): Promise<WrapDTO> {
  const { userId, tenantId } = await requireAuth();
  await assertTenantMembership(tenantId, userId, "admin");

  const existing = await prisma.wrap.findFirst({
    where: { id: wrapId, tenantId, deletedAt: null },
    select: {
      id: true,
      tenantId: true,
      name: true,
      description: true,
      price: true,
      installationMinutes: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!existing) {
    throw new Error("Forbidden: resource not found");
  }

  const wrap = await prisma.wrap.update({
    where: { id: wrapId },
    data: { deletedAt: new Date() },
  });

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
    id: existing.id,
    tenantId: existing.tenantId,
    name: existing.name,
    description: existing.description,
    price: Number.isInteger(existing.price) ? existing.price : Math.round(existing.price),
    installationMinutes: existing.installationMinutes,
    images: [],
    categories: [],
    createdAt: existing.createdAt,
    updatedAt: existing.updatedAt,
  };
}
