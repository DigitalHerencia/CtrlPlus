"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import {
  generatePreviewSchema,
  type GeneratePreviewInput,
  type PreviewStatus,
  type VisualizerPreviewDTO,
} from "../types";

/**
 * Triggers preview generation for an uploaded vehicle photo.
 *
 * In production this would enqueue an async image-processing job.
 * For now it transitions the status synchronously to "complete" with
 * the customer photo URL as a placeholder processed image.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is a member of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Mutate        — update the preview record scoped to tenantId
 * 5. Audit         — write an immutable audit event
 */
export async function generatePreview(input: GeneratePreviewInput): Promise<VisualizerPreviewDTO> {
  // 1. AUTHENTICATE
  const { tenantId, userId } = await getSession();
  if (!tenantId) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — any tenant member can generate a preview
  if (!userId) throw new Error("Unauthorized: not authenticated");
  await assertTenantMembership(tenantId, userId);

  // 3. VALIDATE
  const parsed = generatePreviewSchema.parse(input);

  // 4. MUTATE — update preview status (scoped by tenantId)
  const existing = await prisma.visualizerPreview.findFirst({
    where: { id: parsed.previewId, tenantId, deletedAt: null },
  });

  if (!existing) throw new Error("Preview not found");

  // Return early if already complete
  if (existing.status === "complete") {
    return {
      id: existing.id,
      tenantId: existing.tenantId,
      wrapId: existing.wrapId,
      customerPhotoUrl: existing.customerPhotoUrl,
      processedImageUrl: existing.processedImageUrl,
      status: existing.status as PreviewStatus,
      cacheKey: existing.cacheKey,
      expiresAt: existing.expiresAt,
      createdAt: existing.createdAt,
      updatedAt: existing.updatedAt,
    };
  }

  // Transition to "complete" with a placeholder processed image URL.
  // In production, this would trigger an async job and poll for completion.
  const processed = await prisma.visualizerPreview.update({
    where: { id: parsed.previewId },
    data: {
      status: "complete",
      // Placeholder: in production this would be the URL of the composited image
      processedImageUrl: existing.customerPhotoUrl,
    },
  });

  // 5. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      action: "GENERATE_PREVIEW",
      resourceType: "VisualizerPreview",
      resourceId: processed.id,
      details: JSON.stringify({ wrapId: processed.wrapId }),
      timestamp: new Date(),
    },
  });

  return {
    id: processed.id,
    tenantId: processed.tenantId,
    wrapId: processed.wrapId,
    customerPhotoUrl: processed.customerPhotoUrl,
    processedImageUrl: processed.processedImageUrl,
    status: processed.status as PreviewStatus,
    cacheKey: processed.cacheKey,
    expiresAt: processed.expiresAt,
    createdAt: processed.createdAt,
    updatedAt: processed.updatedAt,
  };
}
