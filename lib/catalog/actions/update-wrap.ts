"use server";

import { requireOwnerOrPlatformAdmin } from "@/lib/authz/guards";
import { prisma } from "@/lib/prisma";
import {
  PUBLISH_REQUIRED_WRAP_IMAGE_KINDS,
  updateWrapSchema,
  type UpdateWrapInput,
  type WrapDTO,
} from "../types";
import { getWrapById } from "../fetchers/get-wraps";
import { assertWrapCanBePublished } from "../validators/publish-wrap";

export async function updateWrap(wrapId: string, input: UpdateWrapInput): Promise<WrapDTO> {
  const session = await requireOwnerOrPlatformAdmin();
  const parsed = updateWrapSchema.parse(input);

  const existing = await prisma.wrap.findFirst({
    where: {
      id: wrapId,
      deletedAt: null,
    },
    select: {
      id: true,
      isHidden: true,
    },
  });

  if (!existing) {
    throw new Error("Forbidden: resource not found");
  }

  const isPublishing = existing.isHidden && parsed.isHidden === false;

  if (isPublishing) {
    const publishAssets = await prisma.wrapImage.findMany({
      where: {
        wrapId,
        deletedAt: null,
        kind: {
          in: [...PUBLISH_REQUIRED_WRAP_IMAGE_KINDS],
        },
      },
      select: {
        kind: true,
        isActive: true,
      },
    });

    assertWrapCanBePublished(publishAssets);
  }

  const data = Object.fromEntries(
    Object.entries(parsed).filter(([, value]) => value !== undefined),
  ) as Record<string, unknown>;

  const result = await prisma.wrap.updateMany({
    where: {
      id: wrapId,
      deletedAt: null,
    },
    data,
  });

  if (result.count === 0) {
    throw new Error("Forbidden: resource not found");
  }

  await prisma.auditLog.create({
    data: {
      userId: session.userId ?? "system",
      action: "wrap.updated",
      resourceType: "Wrap",
      resourceId: wrapId,
      details: JSON.stringify({ changes: parsed }),
      timestamp: new Date(),
    },
  });

  const wrap = await getWrapById(wrapId, { includeHidden: true });
  if (!wrap) {
    throw new Error("Forbidden: resource not found");
  }

  return wrap;
}
