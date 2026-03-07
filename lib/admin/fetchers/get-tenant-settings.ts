import { prisma } from "@/lib/prisma";
import { assertAdminOrOwner } from "../rbac";
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
 * @param tenantId         - Tenant scope (server-side verified; never accept from client)
 * @param requestingUserId - Clerk user ID of the caller; must be admin or owner
 * @returns TenantSettingsDTO or null if the tenant does not exist
 * @throws Error if caller is not an admin or owner of the tenant
 */
export async function getTenantSettings(
  tenantId: string,
  requestingUserId: string,
): Promise<TenantSettingsDTO | null> {
  await assertAdminOrOwner(tenantId, requestingUserId);

  const record = await prisma.tenant.findFirst({
    where: { id: tenantId, deletedAt: null },
    select: tenantSettingsFields,
  });

  if (!record) return null;

  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
