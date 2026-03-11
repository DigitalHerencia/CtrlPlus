import { prisma } from "@/lib/prisma";
import {
  type VisualizerPreviewDTO,
  visualizerPreviewDTOFields,
  type PreviewStatus,
} from "../types";

function toPreviewDTO(record: {
  id: string;
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

export async function getPreviewById(previewId: string): Promise<VisualizerPreviewDTO | null> {
  const preview = await prisma.visualizerPreview.findFirst({
    where: {
      id: previewId,
      deletedAt: null,
    },
    select: visualizerPreviewDTOFields,
  });

  return preview ? toPreviewDTO(preview) : null;
}

export async function getPreviewsByWrap(wrapId: string): Promise<VisualizerPreviewDTO[]> {
  const previews = await prisma.visualizerPreview.findMany({
    where: {
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
