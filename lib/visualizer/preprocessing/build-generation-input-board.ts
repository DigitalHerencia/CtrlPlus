import sharp from 'sharp'

export async function buildGenerationInputBoard(params: {
    vehicleBuffer: Buffer
    wrapTextureBuffer: Buffer
}): Promise<Buffer> {
    const canvasWidth = 1536
    const canvasHeight = 1024
    const texturePanelWidth = 384
    const gutter = 24
    const vehiclePanelWidth = canvasWidth - texturePanelWidth - gutter * 3

    const normalizedVehicle = await sharp(params.vehicleBuffer)
        .rotate()
        .resize(vehiclePanelWidth, canvasHeight - gutter * 2, {
            fit: 'contain',
            withoutEnlargement: true,
            background: '#0a0a0a',
        })
        .png()
        .toBuffer()

    const normalizedTexture = await sharp(params.wrapTextureBuffer)
        .rotate()
        .resize(texturePanelWidth, texturePanelWidth, {
            fit: 'cover',
            position: 'attention',
        })
        .png()
        .toBuffer()

    return sharp({
        create: {
            width: canvasWidth,
            height: canvasHeight,
            channels: 4,
            background: '#0a0a0a',
        },
    })
        .composite([
            { input: normalizedVehicle, left: gutter, top: gutter },
            { input: normalizedTexture, left: vehiclePanelWidth + gutter * 2, top: gutter },
        ])
        .png()
        .toBuffer()
}
