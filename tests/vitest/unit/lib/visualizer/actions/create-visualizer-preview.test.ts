import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
    getVisualizerWrapSelectionById: vi.fn(),
    normalizeVehicleUpload: vi.fn(),
    buildVisualizerPromptForWrap: vi.fn(),
    storePreviewImage: vi.fn(),
    buildVisualizerCacheKey: vi.fn(),
    prisma: {
        visualizerPreview: {
            findFirst: vi.fn(),
            create: vi.fn(),
        },
        auditLog: {
            create: vi.fn(),
        },
    },
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('@/lib/authz/policy', () => ({
    requireCapability: mocks.requireCapability,
}))

vi.mock('@/lib/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('@/lib/fetchers/visualizer.fetchers', () => ({
    getVisualizerWrapSelectionById: mocks.getVisualizerWrapSelectionById,
}))

vi.mock('@/lib/visualizer/preview-pipeline', () => ({
    normalizeVehicleUpload: mocks.normalizeVehicleUpload,
}))

vi.mock('@/lib/visualizer/preview-execution', () => ({
    buildVisualizerPromptForWrap: mocks.buildVisualizerPromptForWrap,
}))

vi.mock('@/lib/visualizer/storage', () => ({
    storePreviewImage: mocks.storePreviewImage,
}))

vi.mock('@/lib/visualizer/cache-key', () => ({
    buildVisualizerCacheKey: mocks.buildVisualizerCacheKey,
}))

import { createVisualizerPreview } from '@/lib/actions/visualizer.actions'

function makeSession(overrides: Partial<Awaited<ReturnType<typeof mocks.getSession>>> = {}) {
    return {
        isAuthenticated: true,
        userId: 'user-1',
        authz: {},
        isOwner: false,
        isPlatformAdmin: false,
        ...overrides,
    }
}

function makeWrap() {
    return {
        id: 'wrap-1',
        name: 'Ocean Spectrum',
        description: 'Electric gradient wrap',
        price: 250000,
        installationMinutes: 180,
        categories: [],
        heroImage: null,
        visualizerTextureImage: {
            id: 'texture-1',
            url: 'https://example.com/texture.png',
            kind: 'visualizer_texture',
            isActive: true,
            version: 4,
            contentHash: 'texture-hash',
            displayOrder: 0,
            thumbnailUrl: 'https://example.com/texture-thumb.png',
            cardUrl: 'https://example.com/texture-card.png',
            detailUrl: 'https://example.com/texture-detail.png',
        },
        aiPromptTemplate: null,
        aiNegativePrompt: null,
        readiness: {
            canPublish: true,
            isVisualizerReady: true,
            missingRequiredAssetRoles: [],
            requiredAssetRoles: ['hero', 'visualizer_texture'],
            activeAssetKinds: ['visualizer_texture'],
            hasDisplayAsset: true,
            activeHeroCount: 0,
            activeGalleryCount: 0,
            activeVisualizerTextureCount: 1,
            activeVisualizerMaskHintCount: 0,
            issues: [],
        },
    }
}

function makePreviewRecord(overrides: Record<string, unknown> = {}) {
    const now = new Date('2026-03-19T00:00:00Z')

    return {
        id: 'preview-1',
        wrapId: 'wrap-1',
        customerPhotoUrl: 'https://cloudinary.com/vehicle.png',
        processedImageUrl: null,
        status: 'pending',
        cacheKey: 'cache-key',
        sourceWrapImageId: 'texture-1',
        sourceWrapImageVersion: 4,
        expiresAt: new Date('2026-03-20T00:00:00Z'),
        createdAt: now,
        updatedAt: now,
        ...overrides,
    }
}

describe('createVisualizerPreview', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getSession.mockResolvedValue(makeSession())
        mocks.requireCapability.mockReturnValue(undefined)
        mocks.getVisualizerWrapSelectionById.mockResolvedValue(makeWrap())
        mocks.normalizeVehicleUpload.mockResolvedValue({
            buffer: Buffer.from('vehicle-bytes'),
            contentType: 'image/png',
            width: 1024,
            height: 768,
            hash: 'vehicle-hash',
        })
        mocks.buildVisualizerPromptForWrap.mockReturnValue({
            prompt: 'Apply Ocean Spectrum wrap',
            negativePrompt: 'No distortion',
            promptVersion: 'prompt-version',
        })
        mocks.storePreviewImage.mockResolvedValue('https://cloudinary.com/generated.png')
        mocks.buildVisualizerCacheKey.mockReturnValue('cache-key')
        mocks.prisma.visualizerPreview.findFirst.mockResolvedValue(null)
        mocks.prisma.visualizerPreview.create.mockResolvedValue(makePreviewRecord())
        mocks.prisma.auditLog.create.mockResolvedValue(undefined)
    })

    it('reuses an existing preview for the same normalized File input', async () => {
        mocks.prisma.visualizerPreview.findFirst.mockResolvedValue(
            makePreviewRecord({
                processedImageUrl: 'https://cloudinary.com/result.png',
                status: 'complete',
            })
        )

        const result = await createVisualizerPreview({
            wrapId: 'wrap-1',
            file: new File(['vehicle'], 'vehicle.png', { type: 'image/png' }),
        })

        expect(mocks.normalizeVehicleUpload).toHaveBeenCalledWith(expect.any(File))
        expect(mocks.buildVisualizerCacheKey).toHaveBeenCalledWith(
            expect.objectContaining({
                wrapId: 'wrap-1',
                ownerUserId: 'user-1',
                customerPhotoHash: 'vehicle-hash',
                sourceWrapImageId: 'texture-1',
                sourceAssetVersion: 4,
                generationMode: 'hf-primary-with-deterministic-fallback',
                generationModel: 'deterministic-fallback',
                promptVersion: 'prompt-version',
            })
        )
        expect(mocks.storePreviewImage).not.toHaveBeenCalled()
        expect(mocks.prisma.visualizerPreview.create).not.toHaveBeenCalled()
        expect(result).toEqual(
            expect.objectContaining({
                id: 'preview-1',
                status: 'complete',
                processedImageUrl: 'https://cloudinary.com/result.png',
                cacheKey: 'cache-key',
            })
        )
    })

    it('creates a pending preview after storing the vehicle photo durably', async () => {
        const result = await createVisualizerPreview({
            wrapId: 'wrap-1',
            file: new File(['vehicle'], 'vehicle.png', { type: 'image/png' }),
        })

        expect(mocks.getVisualizerWrapSelectionById).toHaveBeenCalledWith('wrap-1', {
            includeHidden: false,
        })
        expect(mocks.storePreviewImage).toHaveBeenCalledWith(
            expect.objectContaining({
                previewId: 'vehicle-cache-key',
                buffer: Buffer.from('vehicle-bytes'),
                contentType: 'image/png',
            })
        )
        expect(mocks.prisma.visualizerPreview.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    status: 'pending',
                    processedImageUrl: null,
                    customerPhotoUrl: 'https://cloudinary.com/generated.png',
                }),
            })
        )
        expect(result).toEqual(
            expect.objectContaining({
                id: 'preview-1',
                status: 'pending',
                processedImageUrl: null,
            })
        )
    })

    it('fails closed when durable storage cannot persist the upload', async () => {
        mocks.storePreviewImage.mockRejectedValue(new Error('Preview image storage failed.'))

        await expect(
            createVisualizerPreview({
                wrapId: 'wrap-1',
                file: new File(['vehicle'], 'vehicle.png', { type: 'image/png' }),
            })
        ).rejects.toThrow('Preview image storage failed.')

        expect(mocks.prisma.visualizerPreview.create).not.toHaveBeenCalled()
    })

    it('allows owners to resolve hidden wraps server-side', async () => {
        mocks.getSession.mockResolvedValue(
            makeSession({
                isOwner: true,
            })
        )

        await createVisualizerPreview({
            wrapId: 'wrap-1',
            file: new File(['vehicle'], 'vehicle.png', { type: 'image/png' }),
        })

        expect(mocks.getVisualizerWrapSelectionById).toHaveBeenCalledWith('wrap-1', {
            includeHidden: true,
        })
    })
})
