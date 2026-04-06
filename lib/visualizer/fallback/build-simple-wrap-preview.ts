import { placeLogoOverlay } from './place-logo-overlay'
import { tintVehiclePanels } from './tint-vehicle-panels'

export async function buildSimpleWrapPreview(params: {
    vehicleBuffer: Buffer
    referenceBuffers: Buffer[]
}): Promise<Buffer> {
    const leadReference = params.referenceBuffers[0]
    if (!leadReference) {
        throw new Error('At least one reference image is required for fallback rendering.')
    }

    const tinted = await tintVehiclePanels({
        vehicleBuffer: params.vehicleBuffer,
        textureBuffer: leadReference,
        opacity: 0.48,
    })

    return placeLogoOverlay({
        baseBuffer: tinted,
        textureBuffer: leadReference,
    })
}
