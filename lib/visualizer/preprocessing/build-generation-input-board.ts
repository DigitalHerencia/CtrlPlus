import sharp from 'sharp'

import { buildVehicleEditMask } from '@/lib/visualizer/preprocessing/build-vehicle-edit-mask'
import type { BuildGenerationInputBoardResult } from '@/types/visualizer.types'

function getReferencePlacement(index: number) {
    const positions = [
        { left: 1160, top: 48 },
        { left: 1472, top: 48 },
        { left: 1160, top: 368 },
        { left: 1472, top: 368 },
    ]

    return positions[index] ?? positions[positions.length - 1]
}

export async function buildGenerationInputBoard(params: {
    vehicleBuffer: Buffer
    referenceBuffers: Buffer[]
    wrapName: string
}): Promise<BuildGenerationInputBoardResult> {
    const canvasWidth = 1792
    const canvasHeight = 1024
    const vehiclePanelWidth = 1080
    const referenceSize = 280
    const normalizedVehicle = await sharp(params.vehicleBuffer)
        .rotate()
        .resize(vehiclePanelWidth, canvasHeight - 96, {
            fit: 'contain',
            withoutEnlargement: true,
            background: '#0a0a0a',
        })
        .png()
        .toBuffer()

    const vehicleMask = await buildVehicleEditMask(normalizedVehicle)

    const referenceBuffers = await Promise.all(
        params.referenceBuffers.slice(0, 4).map((buffer) =>
            sharp(buffer)
                .rotate()
                .resize(referenceSize, referenceSize, {
                    fit: 'cover',
                    position: 'attention',
                })
                .png()
                .toBuffer()
        )
    )

    const labelSvg = Buffer.from(`
        <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#0a0a0a"/>
          <text x="1160" y="760" fill="#f5f5f5" font-size="54" font-family="Arial, sans-serif" font-weight="700">
            ${params.wrapName.replaceAll('&', '&amp;')}
          </text>
          <text x="1160" y="818" fill="#a3a3a3" font-size="24" font-family="Arial, sans-serif">
            Hero and gallery reference board
          </text>
        </svg>
    `)

    const boardBuffer = await sharp({
        create: {
            width: canvasWidth,
            height: canvasHeight,
            channels: 4,
            background: '#0a0a0a',
        },
    })
        .composite([
            { input: labelSvg },
            { input: normalizedVehicle, left: 32, top: 48 },
            ...referenceBuffers.map((input, index) => ({
                input,
                ...getReferencePlacement(index),
            })),
        ])
        .png()
        .toBuffer()

    const boardMaskBuffer = await sharp({
        create: {
            width: canvasWidth,
            height: canvasHeight,
            channels: 4,
            background: '#000000',
        },
    })
        .composite([
            {
                input: vehicleMask.maskBuffer,
                left: 32,
                top: 48,
            },
        ])
        .removeAlpha()
        .greyscale()
        .png()
        .toBuffer()

    return {
        boardBuffer,
        boardMaskBuffer,
        maskStrategy: vehicleMask.strategy,
        notes: vehicleMask.notes,
    }
}
