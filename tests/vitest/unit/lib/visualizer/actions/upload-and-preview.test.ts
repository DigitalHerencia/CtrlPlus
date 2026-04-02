import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    createVisualizerPreview: vi.fn(),
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: vi.fn().mockResolvedValue({
        isAuthenticated: true,
        userId: 'user-1',
        authz: {},
        isOwner: false,
        isPlatformAdmin: false,
    }),
}))

import { uploadAndGeneratePreview } from '@/lib/actions/visualizer.actions'
import type { VisualizerPreviewDTO } from '@/types/visualizer.types'

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
            expiresAt: new Date('2026-03-19T00:00:00Z').toISOString(),
            createdAt: new Date('2026-03-18T23:00:00Z').toISOString(),
            updatedAt: new Date('2026-03-19T00:00:00Z').toISOString(),
        } as unknown as VisualizerPreviewDTO

        mocks.createVisualizerPreview.mockResolvedValue(preview)
    })
})
