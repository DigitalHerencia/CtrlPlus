"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import { createWrapSchema, type CreateWrapInput, type WrapDTO } from "../types";

/**
 * Creates a new wrap in the catalog for the current tenant.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is an admin or owner of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Mutate        — create the record scoped to tenantId
 * 5. Audit         — write an immutable audit event
 */
export async function createWrap(input: CreateWrapInput): Promise<WrapDTO> {
  // 1. AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE
  await assertTenantMembership(tenantId, user.id, "admin");

  // 3. VALIDATE
  const parsed = createWrapSchema.parse(input);

  // 4. MUTATE (always scoped by tenantId)
  const wrap = await prisma.wrap.create({
    data: {
      tenantId,
      name: parsed.name,
      description: parsed.description ?? null,
      price: parsed.price,
      installationMinutes: parsed.installationMinutes ?? null,
    },
  });

  // 5. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "CREATE_WRAP",
      resourceType: "Wrap",
      resourceId: wrap.id,
      details: JSON.stringify({ name: wrap.name }),
      timestamp: new Date(),
    },
  });

  return {
    id: wrap.id,
    tenantId: wrap.tenantId,
    name: wrap.name,
    description: wrap.description,
    price: wrap.price,
    installationMinutes: wrap.installationMinutes,
    createdAt: wrap.createdAt,
    updatedAt: wrap.updatedAt,
  };
}
