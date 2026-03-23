'use server'

import type { GeneratePreviewInput, VisualizerPreviewDTO } from '../types'
import { processVisualizerPreview } from './process-visualizer-preview'

export async function generatePreview(input: GeneratePreviewInput): Promise<VisualizerPreviewDTO> {
    return processVisualizerPreview(input)
}
