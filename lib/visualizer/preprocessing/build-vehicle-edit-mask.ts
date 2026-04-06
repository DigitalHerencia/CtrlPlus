import sharp from 'sharp'

import { createVehicleMask, fallbackCenterMask } from '@/lib/integrations/huggingface'
import type { BuildVehicleEditMaskResult } from '@/types/visualizer.types'

function normalizeMask(maskBuffer: Buffer, width: number, height: number) {
    return sharp(maskBuffer)
        .resize(width, height, { fit: 'fill' })
        .removeAlpha()
        .greyscale()
        .blur(1.2)
        .threshold(120)
        .dilate(2)
        .png()
        .toBuffer()
}

export async function buildVehicleEditMask(
    vehicleBuffer: Buffer
): Promise<BuildVehicleEditMaskResult> {
    const metadata = await sharp(vehicleBuffer).metadata()
    if (!metadata.width || !metadata.height) {
        throw new Error('Unable to determine vehicle image dimensions for mask generation.')
    }

    try {
        const hfMask = await createVehicleMask(vehicleBuffer)

        return {
            maskBuffer: await normalizeMask(hfMask, metadata.width, metadata.height),
            strategy: 'hf_segmentation',
            notes: ['mask_source=hf_segmentation'],
        }
    } catch (error) {
        const fallbackMask = await fallbackCenterMask(vehicleBuffer)
        const reason = error instanceof Error ? error.message : 'unknown_segmentation_failure'

        return {
            maskBuffer: await normalizeMask(fallbackMask, metadata.width, metadata.height),
            strategy: 'fallback_center',
            notes: [`mask_source=fallback_center`, `mask_fallback_reason=${reason}`],
        }
    }
}
