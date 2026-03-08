"use server";

import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { createWrapSchema, type CreateWrapInput, type WrapDTO } from "../types";

export async function createWrap(input: CreateWrapInput): Promise<WrapDTO> {
  const { userId, tenantId } = await requireAuth();
  await assertTenantMembership(tenantId, userId);

  const parsed = createWrapSchema.parse(input);

  const wrap = await prisma.wrap.create({
    data: {
      tenantId,
      name: parsed.name,
      description: parsed.description ?? null,
      price: parsed.price,
      installationMinutes: parsed.installationMinutes ?? null,
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

  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      action: "wrap.created",
      resourceType: "Wrap",
      resourceId: wrap.id,
      details: JSON.stringify({ name: wrap.name, priceInCents: parsed.price }),
      timestamp: new Date(),
    },
  });

  return {
    id: wrap.id,
    tenantId: wrap.tenantId,
    name: wrap.name,
    description: wrap.description,
    price: parsed.price,
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
