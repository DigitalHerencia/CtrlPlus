"use server";

import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import {
  deletePersistedWrapImage,
  persistWrapImage,
  validateWrapImageFile,
} from "../image-storage";
import { wrapImageUploadSchema, type WrapImageDTO, type WrapImageUploadInput } from "../types";

async function assertWrapOwnedByTenant(wrapId: string, tenantId: string): Promise<void> {
  const wrap = await prisma.wrap.findFirst({
    where: { id: wrapId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (!wrap) {
    throw new Error("Forbidden: wrap not found");
  }
}

export async function addWrapImage(input: WrapImageUploadInput): Promise<WrapImageDTO> {
  const { userId, tenantId } = await requireAuth();
  await assertTenantMembership(tenantId, userId, "admin");

  const parsed = wrapImageUploadSchema.parse(input);
  await assertWrapOwnedByTenant(parsed.wrapId, tenantId);
  validateWrapImageFile(parsed.file);

  const imageUrl = await persistWrapImage({
    tenantId,
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
      tenantId,
      userId,
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
  const { userId, tenantId } = await requireAuth();
  await assertTenantMembership(tenantId, userId, "admin");

  await assertWrapOwnedByTenant(wrapId, tenantId);

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
      tenantId,
      userId,
      action: "wrapImage.removed",
      resourceType: "Wrap",
      resourceId: wrapId,
      details: JSON.stringify({ wrapImageId: imageId }),
      timestamp: new Date(),
    },
  });
}

export async function reorderWrapImages(wrapId: string, imageIdsInOrder: string[]): Promise<void> {
  const { userId, tenantId } = await requireAuth();
  await assertTenantMembership(tenantId, userId, "admin");

  await assertWrapOwnedByTenant(wrapId, tenantId);

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
      tenantId,
      userId,
      action: "wrapImage.reordered",
      resourceType: "Wrap",
      resourceId: wrapId,
      details: JSON.stringify({ imageIdsInOrder }),
      timestamp: new Date(),
    },
  });
}
