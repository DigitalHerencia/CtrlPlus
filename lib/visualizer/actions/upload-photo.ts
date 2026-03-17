type WrapTextureAsset = {
  id: string;
  url: string;
  kind: string;
  isActive: boolean;
  version: number;
  displayOrder: number;
};

import { getSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/authz/policy";
import { prisma } from "@/lib/prisma";
import { buildVisualizerCacheKey } from "@/lib/visualizer/cache-key";
import crypto from "crypto";

// Inline WrapTextureAsset type since it's not exported from types

import { isAllowedRemotePhotoHost, visualizerConfig } from "@/lib/visualizer/config";
import type { UploadPhotoInput, VisualizerPreviewDTO } from "../types";
import { PreviewStatus, uploadPhotoSchema } from "../types";

async function validatePhotoInput(customerPhotoUrl: string): Promise<void> {
  if (customerPhotoUrl.startsWith("data:")) {
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

    // Dimension validation
    const buffer = Buffer.from(match[2], "base64");
    const sharp = (await import("sharp")).default;
    const meta: { width?: number; height?: number; isProgressive?: boolean } =
      await sharp(buffer).metadata();
    if (!meta.width || !meta.height) throw new Error("Image dimensions missing");
    if (meta.width < 512 || meta.height < 512) throw new Error("Image too small (min 512x512)");
    if (meta.width > 4096 || meta.height > 4096) throw new Error("Image too large (max 4096x4096)");
    // Moderation stub: NSFW/copyright
    // Replace with real moderation API as needed
    if (meta.isProgressive) throw new Error("NSFW or copyright risk detected");
    return;
  }

  let parsed: URL;
  try {
    parsed = new URL(customerPhotoUrl);
  } catch {
    throw new Error("Only data URLs or approved HTTPS image URLs are allowed");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("Only HTTPS image URLs are allowed");
  }

  const host = parsed.hostname.toLowerCase();
  if (!isAllowedRemotePhotoHost(host)) {
    throw new Error("Image host is not allowed for visualizer uploads");
  }
}

function pickVisualizerTexture(images: WrapTextureAsset[]): WrapTextureAsset | null {
  const sorted = [...images].sort((a, b) => a.displayOrder - b.displayOrder);

  const activeTexture = sorted.find(
    (image) => image.kind === "visualizer_texture" && image.isActive,
  );
  if (activeTexture) return activeTexture;

  const firstTexture = sorted.find((image) => image.kind === "visualizer_texture");
  if (firstTexture) return firstTexture;

  const activeHero = sorted.find((image) => image.kind === "hero" && image.isActive);
  if (activeHero) return activeHero;

  return sorted[0] ?? null;
}

function deriveAssetVersion(url: string | null): number {
  if (!url) return 0;

  const versionParam = (() => {
    try {
      return new URL(url).searchParams.get("v");
    } catch {
      return null;
    }
  })();

  const fromQuery = versionParam ? Number.parseInt(versionParam, 10) : Number.NaN;
  if (Number.isInteger(fromQuery) && fromQuery > 0) {
    return fromQuery;
  }

  const digest = crypto.createHash("sha256").update(url).digest("hex").slice(0, 8);
  const derived = Number.parseInt(digest, 16);
  return Number.isInteger(derived) ? derived : 0;
}

export async function uploadVehiclePhoto(input: UploadPhotoInput): Promise<VisualizerPreviewDTO> {
  const session = await getSession();
  const userId = session.userId;
  if (!session.isAuthenticated || !userId) throw new Error("Unauthorized: not authenticated");
  requireCapability(session.authz, "visualizer.use");

  // Ownership hardening: Only owner or platform admin can upload for hidden wraps
  const wrapMeta = await prisma.wrap.findFirst({
    where: {
      id: input.wrapId,
      deletedAt: null,
    },
    select: { id: true, isHidden: true },
  });
  if (!wrapMeta) throw new Error("Wrap not found");
  if (wrapMeta.isHidden && !session.isOwner && !session.isPlatformAdmin) {
    throw new Error("Forbidden: only owner or platform admin can upload for hidden wraps");
  }

  const parsed = uploadPhotoSchema.parse(input);
  await validatePhotoInput(parsed.customerPhotoUrl);

  const wrapData = await prisma.wrap.findFirst({
    where: {
      id: parsed.wrapId,
      deletedAt: null,
      ...(!session.isOwner && !session.isPlatformAdmin ? { isHidden: false } : {}),
    },
    select: {
      id: true,
      images: {
        where: { deletedAt: null },
        select: {
          id: true,
          url: true,
          kind: true,
          isActive: true,
          version: true,
          displayOrder: true,
        },
      },
    },
  });
  if (!wrapData) throw new Error("Wrap not found");

  const textureAsset = pickVisualizerTexture(wrapData.images as WrapTextureAsset[]);
  const sourceAssetVersion = textureAsset?.version ?? deriveAssetVersion(textureAsset?.url ?? null);

  const cacheKey = buildVisualizerCacheKey({
    wrapId: parsed.wrapId,
    ownerUserId: userId,
    customerPhotoUrl: parsed.customerPhotoUrl,
    textureId: textureAsset?.id ?? textureAsset?.url ?? "generated-fallback",
    sourceAssetVersion,
    maskModel: visualizerConfig.maskModel,
    maskModelRevision: visualizerConfig.huggingFaceModelRevision,
    maskModelProvider: visualizerConfig.huggingFaceProvider,
    blendMode: visualizerConfig.blendMode,
    opacity: visualizerConfig.overlayOpacity,
  });

  const expiresAt = new Date(Date.now() + visualizerConfig.previewTtlMs);

  const existing = await prisma.visualizerPreview.findFirst({
    where: {
      cacheKey,
      ownerClerkUserId: userId,
      deletedAt: null,
    },
  });

  if (existing && existing.expiresAt > new Date()) {
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

  let customerPhotoUrl = parsed.customerPhotoUrl;
  // If data URL, upload to Cloudinary
  if (customerPhotoUrl.startsWith("data:")) {
    const { storePreviewImage } = await import("@/lib/visualizer/storage");
    const match = customerPhotoUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid image data format");
    const mimeType = match[1];
    const buffer = Buffer.from(match[2], "base64");
    customerPhotoUrl = await storePreviewImage({
      previewId: cacheKey,
      buffer,
      contentType: mimeType,
    });
  }

  const preview = existing
    ? await prisma.visualizerPreview.update({
        where: { id: existing.id },
        data: {
          wrapId: parsed.wrapId,
          ownerClerkUserId: userId,
          customerPhotoUrl,
          processedImageUrl: null,
          status: "pending",
          sourceWrapImageId: textureAsset?.id ?? null,
          sourceWrapImageVersion: sourceAssetVersion,
          expiresAt,
          deletedAt: null,
        },
      })
    : await prisma.visualizerPreview.create({
        data: {
          wrapId: parsed.wrapId,
          ownerClerkUserId: userId,
          customerPhotoUrl,
          status: "pending",
          cacheKey,
          sourceWrapImageId: textureAsset?.id ?? null,
          sourceWrapImageVersion: sourceAssetVersion,
          expiresAt,
        },
      });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "UPLOAD_VEHICLE_PHOTO",
      resourceType: "VisualizerPreview",
      resourceId: preview.id,
      details: JSON.stringify({
        wrapId: parsed.wrapId,
        sourceWrapImageId: textureAsset?.id ?? null,
        sourceWrapImageVersion: sourceAssetVersion,
      }),
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
