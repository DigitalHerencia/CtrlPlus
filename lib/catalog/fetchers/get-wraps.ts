import { WrapDTO } from "../types";

/**
 * Returns all active wraps for the given tenant.
 *
 * TODO: replace stub data with a Prisma query once the database layer is wired up:
 *   return prisma.wrap.findMany({
 *     where: { tenantId, status: WrapStatus.ACTIVE, deletedAt: null },
 *     orderBy: { createdAt: "desc" },
 *     select: { id, name, description, price, estimatedHours, status, imageUrls, category, createdAt },
 *   });
 */
export async function getWrapsForTenant(tenantId: string): Promise<WrapDTO[]> {
  if (!tenantId) return [];

  // Stub: Return empty list until Prisma is connected.
  return [];
}

/**
 * Returns a single active wrap by id, scoped to the tenant.
 * Returns null when not found or belonging to a different tenant.
 */
export async function getWrapById(
  tenantId: string,
  wrapId: string
): Promise<WrapDTO | null> {
  if (!tenantId || !wrapId) return null;

  // Stub: Return null until Prisma is connected.
  return null;
}
