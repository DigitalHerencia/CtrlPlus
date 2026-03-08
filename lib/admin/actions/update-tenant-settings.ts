"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
// All roles have access; no RBAC check needed
import { normalizeTenantSlug } from "@/lib/tenancy/slug";
import {
  updateTenantSettingsSchema,
  type TenantSettingsDTO,
  type UpdateTenantSettingsInput,
} from "../types";

/**
 * Updates tenant configuration (name, slug).
 */
export async function updateTenantSettings(
  input: UpdateTenantSettingsInput,
): Promise<TenantSettingsDTO> {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) throw new Error("Unauthorized: not authenticated");

  // All roles have access; no RBAC check

  const parsed = updateTenantSettingsSchema.parse(input);

  const updateData: { name?: string; slug?: string } = {};
  if (parsed.name !== undefined) updateData.name = parsed.name;
  if (parsed.slug !== undefined) {
    const normalizedSlug = normalizeTenantSlug(parsed.slug);
    if (!normalizedSlug) {
      throw new Error("ValidationError: invalid tenant slug");
    }
    updateData.slug = normalizedSlug;
  }

  const tenant = await prisma.$transaction(async (tx) => {
    try {
      const updateResult = await tx.tenant.updateMany({
        where: {
          id: tenantId,
          deletedAt: null,
        },
        data: updateData,
      });

      if (updateResult.count !== 1) {
        throw new Error("Forbidden: tenant not found");
      }

      const updatedTenant = await tx.tenant.findFirst({
        where: {
          id: tenantId,
          deletedAt: null,
        },
      });

      if (!updatedTenant) {
        throw new Error("Forbidden: tenant not found");
      }

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: "tenant.settings_updated",
          resourceType: "Tenant",
          resourceId: tenantId,
          details: JSON.stringify(updateData),
        },
      });

      return updatedTenant;
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "P2002") {
        throw new Error("Conflict: slug is already in use by another tenant");
      }

      throw err;
    }
  });

  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    createdAt: tenant.createdAt.toISOString(),
    updatedAt: tenant.updatedAt.toISOString(),
  };
}
