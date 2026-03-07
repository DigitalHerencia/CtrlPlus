import { prisma } from "@/lib/prisma";
import type { WrapCategoryDTO } from "../types";

export async function getWrapCategoriesForTenant(tenantId: string): Promise<WrapCategoryDTO[]> {
  const categories = await prisma.wrapCategory.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return categories;
}
