"use server";

import type { UploadPhotoInput, VisualizerPreviewDTO } from "../types";
import { generatePreview } from "./generate-preview";
import { uploadVehiclePhoto } from "./upload-photo";

export async function uploadAndGeneratePreview(
  input: UploadPhotoInput,
): Promise<VisualizerPreviewDTO> {
  const uploaded = await uploadVehiclePhoto(input);
  return await generatePreview({ previewId: uploaded.id });
}
