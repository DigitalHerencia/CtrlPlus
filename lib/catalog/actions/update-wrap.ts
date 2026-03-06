"use server";

import { requireAuth } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import { updateWrapSchema, type UpdateWrapInput, type WrapDTO } from "../types";

/**
 * Updates an existing wrap in the catalog.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is an admin or owner of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Mutate        — apply updates scoped by tenantId (throws if not found)
 * 5. Audit         — write an immutable audit log entry
 */
export async function updateWrap(wrapId: string, input: UpdateWrapInput): Promise<WrapDTO> {
  // 1. AUTHENTICATE
  const { userId, tenantId } = await requireAuth();

  // 2. AUTHORIZE
  await assertTenantMembership(tenantId, userId, ["OWNER", "ADMIN"]);

  // 3. VALIDATE
  const parsed = updateWrapSchema.parse(input);

  // Build the update data, excluding undefined fields
  const data = Object.fromEntries(
    Object.entries(parsed).filter(([, v]) => v !== undefined),
  ) as Record<string, unknown>;

  // 4. MUTATE
  //    Perform an atomic conditional update scoped by tenantId and soft-delete
  //    status to avoid TOCTOU between ownership/soft-delete checks and writes.
  const result = await prisma.wrap.updateMany({
    where: {
      id: wrapId,
      tenantId,
      deletedAt: null,
    },
    data,
  });

  if (result.count === 0) {
    throw new Error("Forbidden: resource not found");
  }

  const wrap = await prisma.wrap.findFirst({
    where: {
      id: wrapId,
      tenantId,
    },
    select: {
      id: true,
      tenantId: true,
      name: true,
      description: true,
      price: true,
      installationMinutes: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!wrap) {
    throw new Error("Forbidden: resource not found");
  }
  // 5. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      action: "wrap.updated",
      resourceType: "Wrap",
      resourceId: wrap.id,
      details: JSON.stringify({ changes: parsed }),
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
