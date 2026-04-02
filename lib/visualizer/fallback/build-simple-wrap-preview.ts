import { placeLogoOverlay } from './place-logo-overlay'
import { tintVehiclePanels } from './tint-vehicle-panels'

export async function buildSimpleWrapPreview(params: {
    vehicleBuffer: Buffer
    textureBuffer: Buffer
}): Promise<Buffer> {
    const tinted = await tintVehiclePanels({
        vehicleBuffer: params.vehicleBuffer,
        textureBuffer: params.textureBuffer,
        opacity: 0.48,
    })

    return placeLogoOverlay({
        baseBuffer: tinted,
        textureBuffer: params.textureBuffer,
    })
}
