import { prisma } from "@/lib/prisma";
import { type TenantSettingsDTO } from "../types";

// ─── Select helpers ───────────────────────────────────────────────────────────

const tenantSettingsFields = {
  id: true,
  name: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
} as const;

// ─── Fetcher ──────────────────────────────────────────────────────────────────

/**
 * Returns tenant configuration settings.
 *
 * @param tenantId - Tenant scope (server-side verified; never accept from client)
 * @returns TenantSettingsDTO or null if the tenant does not exist
 */
export async function getTenantSettings(
  tenantId: string,
): Promise<TenantSettingsDTO | null> {
  const record = await prisma.tenant.findFirst({
    where: { id: tenantId, deletedAt: null },
    select: tenantSettingsFields,
  });

  if (!record) return null;

  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}
