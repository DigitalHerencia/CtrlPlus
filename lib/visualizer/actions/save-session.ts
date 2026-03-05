"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import {
  savePreviewSessionSchema,
  type SavePreviewSessionInput,
  type PreviewSessionDTO,
} from "../types";

/**
 * Saves a wrap preview session for the current tenant.
 *
 * Security pipeline: authenticate → authorize → validate → mutate
 *
 * TODO: Replace stub mutation with Prisma once database is configured:
 * const row = await prisma.previewSession.create({
 *   data: { ...parsed, tenantId, userId: user.id },
 * });
 * return transformToDTO(row);
 */
export async function savePreviewSession(
  input: SavePreviewSessionInput
): Promise<PreviewSessionDTO> {
  // Step 1: AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // Step 2: AUTHORIZE — any tenant member may save a preview
  await assertTenantMembership(tenantId, user.id, "member");

  // Step 3: VALIDATE
  const parsed = savePreviewSessionSchema.parse(input);

  // Step 4: MUTATE (stub until Prisma is wired up)
  const id = crypto.randomUUID();
  const createdAt = new Date();

  return {
    id,
    wrapId: parsed.wrapId,
    wrapName: parsed.wrapName,
    vehicleImageUrl: parsed.vehicleImageUrl,
    previewImageUrl: parsed.previewImageUrl,
    mode: parsed.mode,
    createdAt,
  };
}
