import sharp from 'sharp'

export async function tintVehiclePanels(params: {
    vehicleBuffer: Buffer
    textureBuffer: Buffer
    opacity?: number
}): Promise<Buffer> {
    const metadata = await sharp(params.vehicleBuffer).metadata()
    if (!metadata.width || !metadata.height) {
        throw new Error('Unable to read vehicle image dimensions.')
    }

    const tintedTexture = await sharp(params.textureBuffer)
        .resize(metadata.width, metadata.height, { fit: 'cover' })
        .ensureAlpha(params.opacity ?? 0.55)
        .png()
        .toBuffer()

    return sharp(params.vehicleBuffer)
        .composite([{ input: tintedTexture, blend: 'overlay' }])
        .png()
        .toBuffer()
}
