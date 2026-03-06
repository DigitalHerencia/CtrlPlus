import { prisma } from "@/lib/prisma";
import { type TenantSettingsDTO } from "../types";

/**
 * Returns the configurable settings for a tenant.
 *
 * @param tenantId - Tenant scope (server-side verified; never accept from client)
 * @returns TenantSettingsDTO or null if the tenant does not exist
 */
export async function getTenantSettings(tenantId: string): Promise<TenantSettingsDTO | null> {
  const tenant = await prisma.tenant.findFirst({
    where: {
      id: tenantId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!tenant) return null;

  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    createdAt: tenant.createdAt,
    updatedAt: tenant.updatedAt,
  };
}
