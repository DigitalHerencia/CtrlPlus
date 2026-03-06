import { prisma } from "@/lib/prisma";
import { type SearchWrapsInput, type WrapDTO, wrapDTOFields, type WrapListDTO } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toWrapDTO(prismaWrap: {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  price: number;
  installationMinutes: number | null;
  createdAt: Date;
  updatedAt: Date;
}): WrapDTO {
  return {
    id: prismaWrap.id,
    tenantId: prismaWrap.tenantId,
    name: prismaWrap.name,
    description: prismaWrap.description,
    price: prismaWrap.price,
    installationMinutes: prismaWrap.installationMinutes,
    createdAt: prismaWrap.createdAt,
    updatedAt: prismaWrap.updatedAt,
  };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

/**
 * Fetches all active wraps for a tenant.
 *
 * @param tenantId - Tenant scope (server-side verified; never accept from client)
 * @returns Array of WrapDTOs ordered by creation date descending
 */
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

/**
 * Fetches a single wrap by ID, scoped to the tenant.
 *
 * @param tenantId - Tenant scope (server-side verified)
 * @param wrapId - Wrap ID to look up
 * @returns WrapDTO or null if not found / wrong tenant
 */
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

/**
 * Searches and paginates active wraps for a tenant.
 *
 * @param tenantId - Tenant scope (server-side verified)
 * @param filters  - Optional search query, price cap, and pagination
 * @returns Paginated WrapListDTO
 */
export async function searchWraps(
  tenantId: string,
  filters: SearchWrapsInput = { page: 1, pageSize: 20 },
): Promise<WrapListDTO> {
  const {
    query,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
    page,
    pageSize,
  } = filters;
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
