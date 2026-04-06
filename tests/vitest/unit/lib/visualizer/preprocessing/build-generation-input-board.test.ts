import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    createVehicleMask: vi.fn(),
    fallbackCenterMask: vi.fn(),
}))

vi.mock('@/lib/integrations/huggingface', () => ({
    createVehicleMask: mocks.createVehicleMask,
    fallbackCenterMask: mocks.fallbackCenterMask,
}))

import { buildGenerationInputBoard } from '@/lib/visualizer/preprocessing/build-generation-input-board'

describe('buildGenerationInputBoard', () => {
    it('returns aligned board and board mask buffers', async () => {
        const whiteMask = await import('sharp').then(({ default: sharp }) =>
            sharp({
                create: { width: 256, height: 256, channels: 3, background: '#ffffff' },
            })
                .png()
                .toBuffer()
        )

        mocks.createVehicleMask.mockResolvedValue(whiteMask)

        const sourceImage = await import('sharp').then(({ default: sharp }) =>
            sharp({
                create: { width: 640, height: 360, channels: 3, background: '#404040' },
            })
                .png()
                .toBuffer()
        )

        const refImage = await import('sharp').then(({ default: sharp }) =>
            sharp({
                create: { width: 320, height: 320, channels: 3, background: '#1d4ed8' },
            })
                .png()
                .toBuffer()
        )

        const result = await buildGenerationInputBoard({
            vehicleBuffer: sourceImage,
            referenceBuffers: [refImage],
            wrapName: 'Test Wrap',
        })

        expect(result.boardBuffer.byteLength).toBeGreaterThan(0)
        expect(result.boardMaskBuffer.byteLength).toBeGreaterThan(0)
        expect(result.maskStrategy).toBe('hf_segmentation')
        expect(result.notes).toContain('mask_source=hf_segmentation')
    })
})
