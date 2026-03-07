"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { buildVisualizerCacheKey } from "@/lib/visualizer/cache-key";
import { visualizerConfig } from "@/lib/visualizer/config";
import {
  uploadPhotoSchema,
  type PreviewStatus,
  type UploadPhotoInput,
  type VisualizerPreviewDTO,
} from "../types";

function validatePhotoInput(customerPhotoUrl: string): void {
  if (!customerPhotoUrl.startsWith("data:")) return;

  const match = customerPhotoUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data format");

  const mimeType = match[1].toLowerCase();
  if (!visualizerConfig.supportedMimeTypes.includes(mimeType)) {
    throw new Error("Unsupported image type");
  }

  const byteLength = Buffer.byteLength(match[2], "base64");
  if (byteLength > visualizerConfig.maxUploadSizeBytes) {
    throw new Error("Uploaded image exceeds max size");
  }
}

export async function uploadVehiclePhoto(input: UploadPhotoInput): Promise<VisualizerPreviewDTO> {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) throw new Error("Unauthorized: not authenticated");

  await assertTenantMembership(tenantId, userId);

  const parsed = uploadPhotoSchema.parse(input);
  validatePhotoInput(parsed.customerPhotoUrl);

  const wrap = await prisma.wrap.findFirst({
    where: { id: parsed.wrapId, tenantId, deletedAt: null },
    select: { id: true },
  });
  if (!wrap) throw new Error("Wrap not found");

  const cacheKey = buildVisualizerCacheKey({
    tenantId,
    wrapId: parsed.wrapId,
    customerPhotoUrl: parsed.customerPhotoUrl,
    maskModel: visualizerConfig.maskModel,
    blendMode: visualizerConfig.blendMode,
    opacity: visualizerConfig.overlayOpacity,
  });

  const expiresAt = new Date(Date.now() + visualizerConfig.previewTtlMs);

  const existing = await prisma.visualizerPreview.findUnique({
    where: { cacheKey },
  });

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

  const preview = existing
    ? await prisma.visualizerPreview.update({
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
      })
    : await prisma.visualizerPreview.create({
        data: {
          tenantId,
          wrapId: parsed.wrapId,
          customerPhotoUrl: parsed.customerPhotoUrl,
          status: "pending",
          cacheKey,
          expiresAt,
        },
      });

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
