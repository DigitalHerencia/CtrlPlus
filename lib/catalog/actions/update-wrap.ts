"use server";

import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { updateWrapSchema, type UpdateWrapInput, type WrapDTO } from "../types";

export async function updateWrap(wrapId: string, input: UpdateWrapInput): Promise<WrapDTO> {
  const { userId, tenantId } = await requireAuth();
  await assertTenantMembership(tenantId, userId);

  const parsed = updateWrapSchema.parse(input);

  const data = Object.fromEntries(
    Object.entries(parsed).filter(([, value]) => value !== undefined),
  ) as Record<string, unknown>;

  const result = await prisma.wrap.updateMany({
    where: {
      id: wrapId,
      tenantId,
      deletedAt: null,
    },
    data,
  });

  if (result.count === 0) {
    throw new Error("Forbidden: resource not found");
  }

  const wrap = await prisma.wrap.findFirst({
    where: {
      id: wrapId,
      tenantId,
      deletedAt: null,
    },
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

  if (!wrap) {
    throw new Error("Forbidden: resource not found");
  }

  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      action: "wrap.updated",
      resourceType: "Wrap",
      resourceId: wrap.id,
      details: JSON.stringify({ changes: parsed }),
      timestamp: new Date(),
    },
  });

  return {
    id: wrap.id,
    tenantId: wrap.tenantId,
    name: wrap.name,
    description: wrap.description,
    price: Number.isInteger(wrap.price) ? wrap.price : Math.round(wrap.price),
    installationMinutes: wrap.installationMinutes,
    images: wrap.images,
    categories: wrap.categoryMappings
      .map(
        (mapping: {
          category: { id: string; name: string; slug: string; deletedAt: Date | null };
        }) => mapping.category,
      )
      .filter(
        (category: { id: string; name: string; slug: string; deletedAt: Date | null }) =>
          category.deletedAt === null,
      )
      .map(
        ({
          deletedAt: _deletedAt,
          ...category
        }: {
          deletedAt: Date | null;
          id: string;
          name: string;
          slug: string;
        }) => category,
      ),
    createdAt: wrap.createdAt,
    updatedAt: wrap.updatedAt,
  };
}
