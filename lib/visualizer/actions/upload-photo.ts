"use server";

import { getSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/authz/policy";
import { prisma } from "@/lib/prisma";
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
  const session = await getSession();
  const userId = session.userId;
  if (!session.isAuthenticated || !userId) throw new Error("Unauthorized: not authenticated");
  requireCapability(session.authz, "visualizer.use");

  const parsed = uploadPhotoSchema.parse(input);
  validatePhotoInput(parsed.customerPhotoUrl);

  const wrap = await prisma.wrap.findFirst({
    where: {
      id: parsed.wrapId,
      deletedAt: null,
      ...(!session.isOwner && !session.isPlatformAdmin ? { isHidden: false } : {}),
    },
    select: { id: true },
  });
  if (!wrap) throw new Error("Wrap not found");

  const cacheKey = buildVisualizerCacheKey({
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

  if (existing && existing.expiresAt > new Date() && existing.deletedAt === null) {
    return {
      id: existing.id,
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
          wrapId: parsed.wrapId,
          customerPhotoUrl: parsed.customerPhotoUrl,
          status: "pending",
          cacheKey,
          expiresAt,
        },
      });

  await prisma.auditLog.create({
    data: {
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
