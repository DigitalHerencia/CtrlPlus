import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
    getMyVisualizerUploadImageAssetById: vi.fn(),
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
    getMyVisualizerUploadImageAssetById: mocks.getMyVisualizerUploadImageAssetById,
}))

vi.mock('@/lib/visualizer/signed-asset-urls', () => ({
    verifySignedVisualizerAssetRequest: mocks.verifySignedVisualizerAssetRequest,
}))

vi.mock('@/lib/visualizer/asset-delivery', () => ({
    resolveVisualizerAssetDeliveryUrl: mocks.resolveVisualizerAssetDeliveryUrl,
}))

import { GET } from '@/app/api/visualizer/uploads/[uploadId]/image/route'

function makeSession(overrides: Partial<Awaited<ReturnType<typeof mocks.getSession>>> = {}) {
    return {
        isAuthenticated: true,
        userId: 'user-1',
        authz: { role: 'customer' },
        ...overrides,
    }
}

describe('visualizer upload image route', () => {
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
            new Request('https://example.test/api/visualizer/uploads/upload-1/image'),
            {
                params: Promise.resolve({ uploadId: 'upload-1' }),
            }
        )

        expect(response.status).toBe(401)
        expect(mocks.getMyVisualizerUploadImageAssetById).not.toHaveBeenCalled()
    })

    it('returns 403 when signature is invalid', async () => {
        mocks.verifySignedVisualizerAssetRequest.mockReturnValueOnce(false)

        const response = await GET(
            new Request(
                'https://example.test/api/visualizer/uploads/upload-1/image?expires=1&signature=bad'
            ),
            {
                params: Promise.resolve({ uploadId: 'upload-1' }),
            }
        )

        expect(response.status).toBe(403)
        expect(mocks.getMyVisualizerUploadImageAssetById).not.toHaveBeenCalled()
    })

    it('returns 404 when upload not found', async () => {
        mocks.getMyVisualizerUploadImageAssetById.mockResolvedValueOnce(null)

        const response = await GET(
            new Request(
                'https://example.test/api/visualizer/uploads/upload-1/image?expires=1&signature=ok'
            ),
            {
                params: Promise.resolve({ uploadId: 'upload-1' }),
            }
        )

        expect(response.status).toBe(404)
        await expect(response.json()).resolves.toEqual({ error: 'Upload not found' })
    })

    it('returns 404 when upload asset cannot be resolved', async () => {
        mocks.getMyVisualizerUploadImageAssetById.mockResolvedValueOnce({
            legacyUrl: 'https://legacy.example/upload.png',
            cloudinaryPublicId: null,
            cloudinaryVersion: null,
            cloudinaryResourceType: null,
            cloudinaryDeliveryType: null,
            format: null,
        })
        mocks.resolveVisualizerAssetDeliveryUrl.mockResolvedValueOnce(null)

        const response = await GET(
            new Request(
                'https://example.test/api/visualizer/uploads/upload-1/image?expires=1&signature=ok'
            ),
            {
                params: Promise.resolve({ uploadId: 'upload-1' }),
            }
        )

        expect(response.status).toBe(404)
        await expect(response.json()).resolves.toEqual({ error: 'Upload asset unavailable' })
    })

    it('redirects to the resolved upload asset URL', async () => {
        mocks.getMyVisualizerUploadImageAssetById.mockResolvedValueOnce({
            legacyUrl: 'https://legacy.example/upload.png',
            cloudinaryPublicId: 'upload-public-id',
            cloudinaryVersion: '456',
            cloudinaryResourceType: null,
            cloudinaryDeliveryType: null,
            format: 'png',
        })
        mocks.resolveVisualizerAssetDeliveryUrl.mockResolvedValueOnce(
            'https://cdn.example/upload.png'
        )

        const response = await GET(
            new Request(
                'https://example.test/api/visualizer/uploads/upload-1/image?expires=1&signature=ok'
            ),
            {
                params: Promise.resolve({ uploadId: 'upload-1' }),
            }
        )

        expect(mocks.getMyVisualizerUploadImageAssetById).toHaveBeenCalledWith('upload-1', 'user-1')
        expect(mocks.resolveVisualizerAssetDeliveryUrl).toHaveBeenCalledWith(
            {
                legacyUrl: 'https://legacy.example/upload.png',
                publicId: 'upload-public-id',
                version: '456',
                resourceType: 'image',
                deliveryType: 'authenticated',
                format: 'png',
            },
            'detail'
        )
        expect(response.status).toBe(307)
        expect(response.headers.get('location')).toBe('https://cdn.example/upload.png')
        expect(response.headers.get('Cache-Control')).toBe('private, no-store, max-age=0')
    })

    it('returns 500 when upload image lookup throws unexpectedly', async () => {
        mocks.getMyVisualizerUploadImageAssetById.mockRejectedValueOnce(new Error('db unavailable'))

        const response = await GET(
            new Request(
                'https://example.test/api/visualizer/uploads/upload-1/image?expires=1&signature=ok'
            ),
            {
                params: Promise.resolve({ uploadId: 'upload-1' }),
            }
        )

        expect(response.status).toBe(500)
        await expect(response.json()).resolves.toEqual({ error: 'Upload image lookup failed' })
    })
})
