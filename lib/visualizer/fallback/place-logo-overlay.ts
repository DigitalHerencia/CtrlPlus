import sharp from 'sharp'

export async function placeLogoOverlay(params: {
    baseBuffer: Buffer
    textureBuffer: Buffer
}): Promise<Buffer> {
    const metadata = await sharp(params.baseBuffer).metadata()
    if (!metadata.width || !metadata.height) {
        throw new Error('Unable to read fallback image dimensions.')
    }

    const logoOverlay = await sharp(params.textureBuffer)
        .resize(Math.floor(metadata.width * 0.32), Math.floor(metadata.height * 0.32), {
            fit: 'contain',
            withoutEnlargement: true,
        })
        .png()
        .toBuffer()

    return sharp(params.baseBuffer)
        .composite([
            {
                input: logoOverlay,
                left: Math.floor(metadata.width * 0.58),
                top: Math.floor(metadata.height * 0.36),
                blend: 'over',
            },
        ])
        .png()
        .toBuffer()
}
