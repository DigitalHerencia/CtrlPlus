import { prisma } from "@/lib/prisma";
import {
  searchWrapsSchema,
  type SearchWrapsInput,
  type WrapDTO,
  wrapDTOFields,
  type WrapListDTO,
} from "../types";

function normalizePriceInCents(value: number): number {
  return Number.isInteger(value) ? value : Math.round(value);
}

function toWrapDTO(prismaWrap: {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  price: number;
  installationMinutes: number | null;
  createdAt: Date;
  updatedAt: Date;
  images: Array<{ id: string; url: string; displayOrder: number }>;
  categoryMappings: Array<{
    category: { id: string; name: string; slug: string; deletedAt: Date | null };
  }>;
}): WrapDTO {
  return {
    id: prismaWrap.id,
    tenantId: prismaWrap.tenantId,
    name: prismaWrap.name,
    description: prismaWrap.description,
    price: normalizePriceInCents(prismaWrap.price),
    installationMinutes: prismaWrap.installationMinutes,
    images: prismaWrap.images,
    categories: prismaWrap.categoryMappings
      .map((mapping) => mapping.category)
      .filter((category) => category.deletedAt === null)
      .map(({ deletedAt: _deletedAt, ...category }) => category),
    createdAt: prismaWrap.createdAt,
    updatedAt: prismaWrap.updatedAt,
  };
}

export async function getWrapsForTenant(tenantId: string): Promise<WrapDTO[]> {
  const wraps = await prisma.wrap.findMany({
    where: {
      tenantId,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
    select: wrapDTOFields,
  });

  return wraps.map(toWrapDTO);
}

export async function getWrapById(tenantId: string, wrapId: string): Promise<WrapDTO | null> {
  const wrap = await prisma.wrap.findFirst({
    where: {
      id: wrapId,
      tenantId,
      deletedAt: null,
    },
    select: wrapDTOFields,
  });

  return wrap ? toWrapDTO(wrap) : null;
}

export async function searchWraps(
  tenantId: string,
  filters: SearchWrapsInput = { page: 1, pageSize: 20 },
): Promise<WrapListDTO> {
  const parsedFilters = searchWrapsSchema.parse(filters);
  const {
    query,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
    page,
    pageSize,
    categoryId,
  } = parsedFilters;
  const skip = (page - 1) * pageSize;

  const where = {
    tenantId,
    deletedAt: null,
    ...(query && {
      OR: [
        { name: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
      ],
    }),
    ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
    ...(categoryId && {
      categoryMappings: {
        some: {
          categoryId,
          category: {
            tenantId,
            deletedAt: null,
          },
        },
      },
    }),
  };

  const [wraps, total] = await Promise.all([
    prisma.wrap.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      select: wrapDTOFields,
      skip,
      take: pageSize,
    }),
    prisma.wrap.count({ where }),
  ]);

  return {
    wraps: wraps.map(toWrapDTO),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
