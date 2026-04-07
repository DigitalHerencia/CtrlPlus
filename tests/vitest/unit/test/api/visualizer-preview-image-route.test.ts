import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
    getMyVisualizerPreviewImageAssetById: vi.fn(),
    verifySignedVisualizerAssetRequest: vi.fn(),
    resolveVisualizerAssetDeliveryUrl: vi.fn(),
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('@/lib/authz/policy', () => ({
    requireCapability: mocks.requireCapability,
}))

vi.mock('@/lib/fetchers/visualizer.fetchers', () => ({
    getMyVisualizerPreviewImageAssetById: mocks.getMyVisualizerPreviewImageAssetById,
}))

vi.mock('@/lib/visualizer/signed-asset-urls', () => ({
    verifySignedVisualizerAssetRequest: mocks.verifySignedVisualizerAssetRequest,
}))

vi.mock('@/lib/visualizer/asset-delivery', () => ({
    resolveVisualizerAssetDeliveryUrl: mocks.resolveVisualizerAssetDeliveryUrl,
}))

import { GET } from '@/app/api/visualizer/previews/[previewId]/image/route'

function makeSession(overrides: Partial<Awaited<ReturnType<typeof mocks.getSession>>> = {}) {
    return {
        isAuthenticated: true,
        userId: 'user-1',
        authz: { role: 'customer' },
        ...overrides,
    }
}

describe('visualizer preview image route', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getSession.mockResolvedValue(makeSession())
        mocks.requireCapability.mockReturnValue(undefined)
        mocks.verifySignedVisualizerAssetRequest.mockReturnValue(true)
    })

    it('returns 401 when unauthenticated', async () => {
        mocks.getSession.mockResolvedValueOnce(
            makeSession({ isAuthenticated: false, userId: null })
        )

        const response = await GET(
            new Request('https://example.test/api/visualizer/previews/preview-1/image'),
            {
                params: Promise.resolve({ previewId: 'preview-1' }),
            }
        )

        expect(response.status).toBe(401)
        expect(mocks.getMyVisualizerPreviewImageAssetById).not.toHaveBeenCalled()
    })

    it('returns 403 when signature is invalid', async () => {
        mocks.verifySignedVisualizerAssetRequest.mockReturnValueOnce(false)

        const response = await GET(
            new Request(
                'https://example.test/api/visualizer/previews/preview-1/image?expires=1&signature=bad'
            ),
            {
                params: Promise.resolve({ previewId: 'preview-1' }),
            }
        )

        expect(response.status).toBe(403)
        expect(mocks.getMyVisualizerPreviewImageAssetById).not.toHaveBeenCalled()
    })

    it('returns 404 when preview not found', async () => {
        mocks.getMyVisualizerPreviewImageAssetById.mockResolvedValueOnce(null)

        const response = await GET(
            new Request(
                'https://example.test/api/visualizer/previews/preview-1/image?expires=1&signature=ok'
            ),
            {
                params: Promise.resolve({ previewId: 'preview-1' }),
            }
        )

        expect(response.status).toBe(404)
        await expect(response.json()).resolves.toEqual({ error: 'Preview not found' })
    })

    it('returns 404 when preview asset cannot be resolved', async () => {
        mocks.getMyVisualizerPreviewImageAssetById.mockResolvedValueOnce({
            resultLegacyUrl: 'https://legacy.example/preview.png',
            processedImageUrl: null,
            resultCloudinaryPublicId: null,
            resultCloudinaryVersion: null,
            resultCloudinaryResourceType: null,
            resultCloudinaryDeliveryType: null,
            resultFormat: null,
        })
        mocks.resolveVisualizerAssetDeliveryUrl.mockResolvedValueOnce(null)

        const response = await GET(
            new Request(
                'https://example.test/api/visualizer/previews/preview-1/image?expires=1&signature=ok'
            ),
            {
                params: Promise.resolve({ previewId: 'preview-1' }),
            }
        )

        expect(response.status).toBe(404)
        await expect(response.json()).resolves.toEqual({ error: 'Preview asset unavailable' })
    })

    it('redirects to the resolved preview asset URL', async () => {
        mocks.getMyVisualizerPreviewImageAssetById.mockResolvedValueOnce({
            resultLegacyUrl: null,
            processedImageUrl: 'https://legacy.example/preview.png',
            resultCloudinaryPublicId: 'preview-public-id',
            resultCloudinaryVersion: '123',
            resultCloudinaryResourceType: null,
            resultCloudinaryDeliveryType: null,
            resultFormat: 'png',
        })
        mocks.resolveVisualizerAssetDeliveryUrl.mockResolvedValueOnce(
            'https://cdn.example/preview.png'
        )

        const response = await GET(
            new Request(
                'https://example.test/api/visualizer/previews/preview-1/image?expires=1&signature=ok'
            ),
            {
                params: Promise.resolve({ previewId: 'preview-1' }),
            }
        )

        expect(mocks.getMyVisualizerPreviewImageAssetById).toHaveBeenCalledWith(
            'preview-1',
            'user-1'
        )
        expect(mocks.resolveVisualizerAssetDeliveryUrl).toHaveBeenCalledWith(
            {
                legacyUrl: 'https://legacy.example/preview.png',
                publicId: 'preview-public-id',
                version: '123',
                resourceType: 'image',
                deliveryType: 'authenticated',
                format: 'png',
            },
            'detail'
        )
        expect(response.status).toBe(307)
        expect(response.headers.get('location')).toBe('https://cdn.example/preview.png')
        expect(response.headers.get('Cache-Control')).toBe('private, no-store, max-age=0')
    })

    it('returns 500 when preview image lookup throws unexpectedly', async () => {
        mocks.getMyVisualizerPreviewImageAssetById.mockRejectedValueOnce(
            new Error('db unavailable')
        )

        const response = await GET(
            new Request(
                'https://example.test/api/visualizer/previews/preview-1/image?expires=1&signature=ok'
            ),
            {
                params: Promise.resolve({ previewId: 'preview-1' }),
            }
        )

        expect(response.status).toBe(500)
        await expect(response.json()).resolves.toEqual({ error: 'Preview image lookup failed' })
    })
})
