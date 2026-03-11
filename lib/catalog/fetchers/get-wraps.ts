import { prisma } from "@/lib/prisma";
import {
  searchWrapsSchema,
  type SearchWrapsInput,
  type WrapDTO,
  wrapDTOFields,
  type WrapListDTO,
} from "../types";

export interface WrapVisibilityScope {
  includeHidden?: boolean;
}

function normalizePriceInCents(value: number): number {
  return Number.isInteger(value) ? value : Math.round(value);
}

function toWrapDTO(prismaWrap: {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isHidden: boolean;
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
    name: prismaWrap.name,
    description: prismaWrap.description,
    price: normalizePriceInCents(prismaWrap.price),
    isHidden: prismaWrap.isHidden,
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

function getVisibilityFilter(scope: WrapVisibilityScope) {
  return scope.includeHidden ? {} : { isHidden: false };
}

export async function getWraps(scope: WrapVisibilityScope = {}): Promise<WrapDTO[]> {
  const wraps = await prisma.wrap.findMany({
    where: {
      deletedAt: null,
      ...getVisibilityFilter(scope),
    },
    orderBy: { createdAt: "desc" },
    select: wrapDTOFields,
  });

  return wraps.map(toWrapDTO);
}

export async function getWrapById(
  wrapId: string,
  scope: WrapVisibilityScope = {},
): Promise<WrapDTO | null> {
  const wrap = await prisma.wrap.findFirst({
    where: {
      id: wrapId,
      deletedAt: null,
      ...getVisibilityFilter(scope),
    },
    select: wrapDTOFields,
  });

  return wrap ? toWrapDTO(wrap) : null;
}

export async function searchWraps(
  filters: SearchWrapsInput = { page: 1, pageSize: 20 },
  scope: WrapVisibilityScope = {},
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
    deletedAt: null,
    ...getVisibilityFilter(scope),
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
