import { PreviewStatus, type VisualizerPreviewDTO } from "@/lib/visualizer/types";

export interface TemplateVehicleOption {
  id: string;
  label: string;
  imageUrl: string;
}

export const templateVehicleOptions: TemplateVehicleOption[] = [
  {
    id: "fleet-night",
    label: "Fleet · Night Showcase",
    imageUrl: "/ctrlplus-fleet-night-showcase.png",
  },
  {
    id: "desert-overlook",
    label: "SUV · Desert Overlook",
    imageUrl: "/wrapped-cars-desert-overlook.png",
  },
  {
    id: "night-star",
    label: "Truck · Night Star",
    imageUrl: "/wrapped-vehicles-night-star.png",
  },
  {
    id: "desert-sunset",
    label: "Fleet · Desert Sunset",
    imageUrl: "/fleet-desert-sunset-showcase.png",
  },
];

export function buildTemplatePreview(params: {
  tenantId?: string;
  wrapId: string;
  imageUrl: string;
}): VisualizerPreviewDTO {
  const now = new Date();

  return {
    id: `template-${params.wrapId}-${Date.now()}`,
    tenantId: params.tenantId ?? "template",
    wrapId: params.wrapId,
    customerPhotoUrl: params.imageUrl,
    processedImageUrl: params.imageUrl,
    status: PreviewStatus.COMPLETE,
    cacheKey: `template:${params.wrapId}:${params.imageUrl}`,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    createdAt: now,
    updatedAt: now,
  };
}
