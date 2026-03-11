"use server";

import { requireOwnerOrPlatformAdmin } from "@/lib/authz/guards";
import { prisma } from "@/lib/prisma";
import {
  deletePersistedWrapImage,
  persistWrapImage,
  validateWrapImageFile,
} from "../image-storage";
import { wrapImageUploadSchema, type WrapImageDTO, type WrapImageUploadInput } from "../types";

async function assertWrapExists(wrapId: string): Promise<void> {
  const wrap = await prisma.wrap.findFirst({
    where: { id: wrapId, deletedAt: null },
    select: { id: true },
  });

  if (!wrap) {
    throw new Error("Forbidden: wrap not found");
  }
}

export async function addWrapImage(input: WrapImageUploadInput): Promise<WrapImageDTO> {
  const session = await requireOwnerOrPlatformAdmin();
  const parsed = wrapImageUploadSchema.parse(input);
  await assertWrapExists(parsed.wrapId);
  validateWrapImageFile(parsed.file);

  const imageUrl = await persistWrapImage({
    wrapId: parsed.wrapId,
    file: parsed.file,
  });

  const maxDisplayOrder = await prisma.wrapImage.aggregate({
    where: { wrapId: parsed.wrapId, deletedAt: null },
    _max: { displayOrder: true },
  });

  const image = await prisma.wrapImage.create({
    data: {
      wrapId: parsed.wrapId,
      url: imageUrl,
      displayOrder: (maxDisplayOrder._max.displayOrder ?? -1) + 1,
    },
    select: { id: true, url: true, displayOrder: true },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.userId ?? "system",
      action: "wrapImage.added",
      resourceType: "Wrap",
      resourceId: parsed.wrapId,
      details: JSON.stringify({ wrapImageId: image.id, imageUrl }),
      timestamp: new Date(),
    },
  });

  return image;
}

export async function removeWrapImage(wrapId: string, imageId: string): Promise<void> {
  const session = await requireOwnerOrPlatformAdmin();
  await assertWrapExists(wrapId);

  const image = await prisma.wrapImage.findFirst({
    where: {
      id: imageId,
      wrapId,
      deletedAt: null,
    },
    select: { id: true, url: true },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  await prisma.wrapImage.update({
    where: { id: imageId },
    data: { deletedAt: new Date() },
  });

  await deletePersistedWrapImage(image.url);

  await prisma.auditLog.create({
    data: {
      userId: session.userId ?? "system",
      action: "wrapImage.removed",
      resourceType: "Wrap",
      resourceId: wrapId,
      details: JSON.stringify({ wrapImageId: imageId }),
      timestamp: new Date(),
    },
  });
}

export async function reorderWrapImages(wrapId: string, imageIdsInOrder: string[]): Promise<void> {
  const session = await requireOwnerOrPlatformAdmin();
  await assertWrapExists(wrapId);

  const existing = await prisma.wrapImage.findMany({
    where: {
      wrapId,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (existing.length !== imageIdsInOrder.length) {
    throw new Error("Image reorder payload does not match wrap image set.");
  }

  const existingIds = new Set(existing.map((image) => image.id));
  for (const imageId of imageIdsInOrder) {
    if (!existingIds.has(imageId)) {
      throw new Error("Image reorder payload contains invalid image IDs.");
    }
  }

  await prisma.$transaction(
    imageIdsInOrder.map((imageId, index) =>
      prisma.wrapImage.update({
        where: { id: imageId },
        data: { displayOrder: index },
      }),
    ),
  );

  await prisma.auditLog.create({
    data: {
      userId: session.userId ?? "system",
      action: "wrapImage.reordered",
      resourceType: "Wrap",
      resourceId: wrapId,
      details: JSON.stringify({ imageIdsInOrder }),
      timestamp: new Date(),
    },
  });
}
