"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import {
  updateTenantSettingsSchema,
  type UpdateTenantSettingsInput,
  type TenantSettingsDTO,
} from "../types";

/**
 * Updates the display name for the current tenant.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is the tenant owner
 * 3. Validate      — parse and validate input with Zod
 * 4. Mutate        — update the tenant record
 * 5. Audit         — write an immutable audit event
 */
export async function updateTenantSettings(
  input: UpdateTenantSettingsInput,
): Promise<TenantSettingsDTO> {
  // 1. AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — only owners may change tenant settings
  await assertTenantMembership(tenantId, user.id, "owner");

  // 3. VALIDATE
  const parsed = updateTenantSettingsSchema.parse(input);

  // 4. MUTATE (scoped to tenantId)
  const tenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: { name: parsed.name },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // 5. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "UPDATE_TENANT_SETTINGS",
      resourceType: "Tenant",
      resourceId: tenantId,
      details: JSON.stringify({ name: parsed.name }),
      timestamp: new Date(),
    },
  });

  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    createdAt: tenant.createdAt,
    updatedAt: tenant.updatedAt,
  };
}
