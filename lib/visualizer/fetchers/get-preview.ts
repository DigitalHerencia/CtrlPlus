import { prisma } from "@/lib/prisma";
import {
  type VisualizerPreviewDTO,
  visualizerPreviewDTOFields,
  type PreviewStatus,
} from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toPreviewDTO(record: {
  id: string;
  tenantId: string;
  wrapId: string;
  customerPhotoUrl: string;
  processedImageUrl: string | null;
  status: string;
  cacheKey: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}): VisualizerPreviewDTO {
  return {
    id: record.id,
    tenantId: record.tenantId,
    wrapId: record.wrapId,
    customerPhotoUrl: record.customerPhotoUrl,
    processedImageUrl: record.processedImageUrl,
    status: record.status as PreviewStatus,
    cacheKey: record.cacheKey,
    expiresAt: record.expiresAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

/**
 * Fetches a single visualizer preview by ID, scoped to the tenant.
 *
 * @param tenantId - Tenant scope (server-side verified; never accept from client)
 * @param previewId - Preview ID to look up
 * @returns VisualizerPreviewDTO or null if not found / wrong tenant
 */
export async function getPreviewById(
  tenantId: string,
  previewId: string,
): Promise<VisualizerPreviewDTO | null> {
  const preview = await prisma.visualizerPreview.findFirst({
    where: {
      id: previewId,
      tenantId,
      deletedAt: null,
    },
    select: visualizerPreviewDTOFields,
  });

  return preview ? toPreviewDTO(preview) : null;
}

/**
 * Fetches all non-expired previews for a specific wrap, scoped to the tenant.
 *
 * @param tenantId - Tenant scope (server-side verified)
 * @param wrapId - Wrap ID to filter by
 * @returns Array of VisualizerPreviewDTOs ordered by creation date descending
 */
export async function getPreviewsByWrap(
  tenantId: string,
  wrapId: string,
): Promise<VisualizerPreviewDTO[]> {
  const previews = await prisma.visualizerPreview.findMany({
    where: {
      tenantId,
      wrapId,
      deletedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: { createdAt: "desc" },
    select: visualizerPreviewDTOFields,
  });

  return previews.map(toPreviewDTO);
}
