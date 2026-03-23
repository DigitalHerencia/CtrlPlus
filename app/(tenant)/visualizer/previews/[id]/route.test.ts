import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getPreviewById: vi.fn(),
}))

vi.mock('@/lib/visualizer/fetchers/get-preview', () => ({
    getPreviewById: mocks.getPreviewById,
}))

import { GET } from './route'

describe('GET /visualizer/previews/[id]', () => {
    it('returns the owner-scoped preview payload', async () => {
        mocks.getPreviewById.mockResolvedValue({
            id: 'preview-1',
            wrapId: 'wrap-1',
            customerPhotoUrl: 'https://example.com/vehicle.png',
            processedImageUrl: null,
            status: 'pending',
            cacheKey: 'cache-key',
            sourceWrapImageId: 'texture-1',
            sourceWrapImageVersion: 4,
            expiresAt: new Date('2026-03-20T00:00:00Z'),
            createdAt: new Date('2026-03-19T00:00:00Z'),
            updatedAt: new Date('2026-03-19T00:00:00Z'),
        })

        const response = await GET(new Request('http://localhost/visualizer/previews/preview-1'), {
            params: Promise.resolve({ id: 'preview-1' }),
        })

        await expect(response.json()).resolves.toEqual({
            preview: expect.objectContaining({
                id: 'preview-1',
                status: 'pending',
            }),
        })
    })

    it('returns a null preview when the read helper throws', async () => {
        mocks.getPreviewById.mockRejectedValue(new Error('Forbidden'))

        const response = await GET(new Request('http://localhost/visualizer/previews/preview-1'), {
            params: Promise.resolve({ id: 'preview-1' }),
        })

        await expect(response.json()).resolves.toEqual({
            preview: null,
        })
    })
})
