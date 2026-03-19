'use server'

import type { UploadPhotoInput, VisualizerPreviewDTO } from '../types'
import { createVisualizerPreview } from './create-visualizer-preview'

export async function uploadVehiclePhoto(input: UploadPhotoInput): Promise<VisualizerPreviewDTO> {
    return createVisualizerPreview(input)
}
