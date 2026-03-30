import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    createVisualizerPreview: vi.fn(),
}))

vi.mock('@/lib/visualizer/actions/visualizer.actions', () => ({
    createVisualizerPreview: mocks.createVisualizerPreview,
    uploadAndGeneratePreview: (input: import('@/types/visualizer/inputs').UploadPhotoInput) =>
        mocks.createVisualizerPreview(input),
}))

import { uploadAndGeneratePreview } from '@/lib/actions/visualizer.actions'
import type { UploadPhotoInput } from '@/types/visualizer/inputs'
import type { VisualizerPreviewDTO } from '@/types/visualizer/domain'

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
