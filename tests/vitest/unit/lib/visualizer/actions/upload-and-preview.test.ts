import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    createVisualizerPreview: vi.fn(),
}))

vi.mock('@/lib/visualizer/actions/create-visualizer-preview', () => ({
    createVisualizerPreview: mocks.createVisualizerPreview,
}))

import { uploadAndGeneratePreview } from '@/lib/visualizer/actions/upload-and-preview'
import type { UploadPhotoInput, VisualizerPreviewDTO } from '@/lib/visualizer/types'

describe('uploadAndGeneratePreview', () => {
    it('delegates File-based uploads to the create preview action', async () => {
        const preview = {
            id: 'preview-1',
            wrapId: 'wrap-1',
            customerPhotoUrl: 'https://cloudinary.com/vehicle.png',
            processedImageUrl: 'https://cloudinary.com/result.png',
            status: 'complete',
            cacheKey: 'cache-key',
            sourceWrapImageId: 'texture-1',
            sourceWrapImageVersion: 4,
            expiresAt: new Date('2026-03-19T00:00:00Z'),
            createdAt: new Date('2026-03-18T23:00:00Z'),
            updatedAt: new Date('2026-03-19T00:00:00Z'),
        } as VisualizerPreviewDTO

        mocks.createVisualizerPreview.mockResolvedValue(preview)

        const input: UploadPhotoInput = {
            wrapId: 'wrap-1',
            file: new File(['vehicle'], 'vehicle.png', { type: 'image/png' }),
        }

        const result = await uploadAndGeneratePreview(input)

        expect(mocks.createVisualizerPreview).toHaveBeenCalledWith(input)
        expect(result).toEqual(preview)
    })
})
