"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import { updateWrapSchema, type UpdateWrapInput, type WrapDTO } from "../types";
import { Prisma } from "@prisma/client";

/**
 * Updates an existing wrap in the catalog.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is an admin or owner of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Mutate        — apply updates scoped by tenantId (throws if not found)
 * 5. Audit         — write an immutable audit event
 */
export async function updateWrap(wrapId: string, input: UpdateWrapInput): Promise<WrapDTO> {
  // 1. AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE
  await assertTenantMembership(tenantId, user.id, "admin");

  // 3. VALIDATE
  const parsed = updateWrapSchema.parse(input);

  // Build the update data, excluding undefined fields
  const data = Object.fromEntries(
    Object.entries(parsed).filter(([, v]) => v !== undefined),
  ) as Prisma.WrapUpdateInput;

  // 4. MUTATE — the compound where clause acts as the tenant-scope check:
  //    if no matching row exists (wrong tenant, already deleted, or bad ID)
  //    Prisma throws P2025 which we convert to a safe Forbidden error.
  let wrap;
  try {
    wrap = await prisma.wrap.update({
      where: { id: wrapId, tenantId, deletedAt: null },
      data,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new Error("Forbidden: resource not found");
    }
    throw err;
  }

  // 5. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "UPDATE_WRAP",
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
