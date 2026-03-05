import { prisma } from "@/lib/prisma";
import {
  type WrapDTO,
  type WrapListDTO,
  type SearchWrapsInput,
  WrapStatus,
  wrapDTOFields,
} from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toWrapDTO(
  prismaWrap: Record<string, unknown> & {
    price: { toString(): string } | string | number;
    status: string;
    category: string;
  }
): WrapDTO {
  return {
    id: prismaWrap.id as string,
    tenantId: prismaWrap.tenantId as string,
    name: prismaWrap.name as string,
    description: (prismaWrap.description as string | null) ?? null,
    price:
      typeof prismaWrap.price === "object" && prismaWrap.price !== null
        ? (prismaWrap.price as { toString(): string }).toString()
        : String(prismaWrap.price),
    estimatedHours: prismaWrap.estimatedHours as number,
    status: prismaWrap.status as WrapDTO["status"],
    imageUrls: prismaWrap.imageUrls as string[],
    category: prismaWrap.category as WrapDTO["category"],
    createdAt: prismaWrap.createdAt as Date,
    updatedAt: prismaWrap.updatedAt as Date,
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
      status: WrapStatus.ACTIVE,
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
export async function getWrapById(
  tenantId: string,
  wrapId: string
): Promise<WrapDTO | null> {
  const wrap = await prisma.wrap.findFirst({
    where: {
      id: wrapId,
      tenantId,
      status: WrapStatus.ACTIVE,
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
 * @param filters  - Optional search query, category, price cap, and pagination
 * @returns Paginated WrapListDTO
 */
export async function searchWraps(
  tenantId: string,
  filters: SearchWrapsInput = { page: 1, pageSize: 20 }
): Promise<WrapListDTO> {
  const { query, category, maxPrice, page, pageSize } = filters;
  const skip = (page - 1) * pageSize;

  const where = {
    tenantId,
    status: WrapStatus.ACTIVE,
    deletedAt: null,
    ...(query && {
      OR: [
        { name: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
      ],
    }),
    ...(category && { category }),
    ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
  };

  const [wraps, total] = await Promise.all([
    prisma.wrap.findMany({
      where,
      orderBy: { createdAt: "desc" },
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
