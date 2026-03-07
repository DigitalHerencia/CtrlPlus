"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import crypto from "crypto";
import {
  uploadPhotoSchema,
  type PreviewStatus,
  type UploadPhotoInput,
  type VisualizerPreviewDTO,
} from "../types";

/**
 * Uploads a vehicle photo and creates a VisualizerPreview record for the tenant.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is a member of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Mutate        — create the preview record scoped to tenantId
 * 5. Audit         — write an immutable audit event
 */
export async function uploadVehiclePhoto(input: UploadPhotoInput): Promise<VisualizerPreviewDTO> {
  // 1. AUTHENTICATE
  const { tenantId, userId } = await getSession();
  if (!tenantId) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — any tenant member can upload a preview
  if (!userId) throw new Error("Unauthorized: not authenticated");
  await assertTenantMembership(tenantId, userId);

  // 3. VALIDATE
  const parsed = uploadPhotoSchema.parse(input);

  // Verify the wrap belongs to this tenant
  const wrap = await prisma.wrap.findFirst({
    where: { id: parsed.wrapId, tenantId, deletedAt: null },
    select: { id: true },
  });
  if (!wrap) throw new Error("Wrap not found");

  // 4. MUTATE — create preview record scoped to tenantId
  const cacheKey = crypto
    .createHash("sha256")
    .update(`${tenantId}:${parsed.wrapId}:${parsed.customerPhotoUrl}`)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Check for any existing record with this cacheKey (unique constraint)
  const existing = await prisma.visualizerPreview.findUnique({
    where: { cacheKey },
  });

  // If a valid cached preview exists for this tenant, return it
  if (
    existing &&
    existing.tenantId === tenantId &&
    existing.expiresAt > new Date() &&
    existing.deletedAt === null
  ) {
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

  // If a record exists but is expired or soft-deleted, update it in place to
  // avoid a unique-constraint violation on `cacheKey` from a CREATE.
  if (existing) {
    const refreshed = await prisma.visualizerPreview.update({
      where: { cacheKey },
      data: {
        tenantId,
        wrapId: parsed.wrapId,
        customerPhotoUrl: parsed.customerPhotoUrl,
        processedImageUrl: null,
        status: "pending",
        expiresAt,
        deletedAt: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action: "UPLOAD_VEHICLE_PHOTO",
        resourceType: "VisualizerPreview",
        resourceId: refreshed.id,
        details: JSON.stringify({ wrapId: parsed.wrapId }),
        timestamp: new Date(),
      },
    });

    return {
      id: refreshed.id,
      tenantId: refreshed.tenantId,
      wrapId: refreshed.wrapId,
      customerPhotoUrl: refreshed.customerPhotoUrl,
      processedImageUrl: refreshed.processedImageUrl,
      status: refreshed.status as PreviewStatus,
      cacheKey: refreshed.cacheKey,
      expiresAt: refreshed.expiresAt,
      createdAt: refreshed.createdAt,
      updatedAt: refreshed.updatedAt,
    };
  }

  const preview = await prisma.visualizerPreview.create({
    data: {
      tenantId,
      wrapId: parsed.wrapId,
      customerPhotoUrl: parsed.customerPhotoUrl,
      status: "pending",
      cacheKey,
      expiresAt,
    },
  });

  // 5. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      action: "UPLOAD_VEHICLE_PHOTO",
      resourceType: "VisualizerPreview",
      resourceId: preview.id,
      details: JSON.stringify({ wrapId: parsed.wrapId }),
      timestamp: new Date(),
    },
  });

  return {
    id: preview.id,
    tenantId: preview.tenantId,
    wrapId: preview.wrapId,
    customerPhotoUrl: preview.customerPhotoUrl,
    processedImageUrl: preview.processedImageUrl,
    status: preview.status as PreviewStatus,
    cacheKey: preview.cacheKey,
    expiresAt: preview.expiresAt,
    createdAt: preview.createdAt,
    updatedAt: preview.updatedAt,
  };
}
