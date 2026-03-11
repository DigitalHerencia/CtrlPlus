"use server";

import { requireOwnerOrPlatformAdmin } from "@/lib/authz/guards";
import { prisma } from "@/lib/prisma";
import type { WrapDTO } from "../types";

export async function deleteWrap(wrapId: string): Promise<WrapDTO> {
  const session = await requireOwnerOrPlatformAdmin();

  const existing = await prisma.wrap.findFirst({
    where: { id: wrapId, deletedAt: null },
    include: {
      images: {
        where: { deletedAt: null },
        select: { id: true, url: true, displayOrder: true },
        orderBy: { displayOrder: "asc" },
      },
      categoryMappings: {
        select: {
          category: {
            select: { id: true, name: true, slug: true, deletedAt: true },
          },
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Forbidden: resource not found");
  }

  await prisma.wrap.update({
    where: { id: wrapId },
    data: { deletedAt: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.userId ?? "system",
      action: "wrap.deleted",
      resourceType: "Wrap",
      resourceId: wrapId,
      details: JSON.stringify({ name: existing.name }),
      timestamp: new Date(),
    },
  });

  return {
    id: existing.id,
    name: existing.name,
    description: existing.description,
    price: Number.isInteger(existing.price) ? existing.price : Math.round(existing.price),
    isHidden: existing.isHidden,
    installationMinutes: existing.installationMinutes,
    images: existing.images,
    categories: existing.categoryMappings
      .map((mapping) => mapping.category)
      .filter((category) => category.deletedAt === null)
      .map(({ deletedAt: _deletedAt, ...category }) => category),
    createdAt: existing.createdAt,
    updatedAt: existing.updatedAt,
  };
}
