'use server'

import type { GeneratePreviewInput, VisualizerPreviewDTO } from '../types'
import { regenerateVisualizerPreview } from './regenerate-visualizer-preview'

export async function generatePreview(input: GeneratePreviewInput): Promise<VisualizerPreviewDTO> {
    return regenerateVisualizerPreview(input)
}
