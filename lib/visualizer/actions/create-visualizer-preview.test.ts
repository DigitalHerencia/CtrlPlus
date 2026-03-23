import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
    getVisualizerWrapSelectionById: vi.fn(),
    normalizeVehicleUpload: vi.fn(),
    readImageBufferFromUrl: vi.fn(),
    buildWrapPreviewPrompt: vi.fn(),
    buildPreviewConditioningBoard: vi.fn(),
    generateDeterministicCompositePreview: vi.fn(),
    createWrapPreviewGeneratorAdapter: vi.fn(),
    storePreviewImage: vi.fn(),
    buildVisualizerCacheKey: vi.fn(),
    prisma: {
        visualizerPreview: {
            findFirst: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
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

vi.mock('@/lib/visualizer/fetchers/get-wrap-selections', () => ({
    getVisualizerWrapSelectionById: mocks.getVisualizerWrapSelectionById,
}))

vi.mock('@/lib/visualizer/preview-pipeline', () => ({
    normalizeVehicleUpload: mocks.normalizeVehicleUpload,
    readImageBufferFromUrl: mocks.readImageBufferFromUrl,
    buildWrapPreviewPrompt: mocks.buildWrapPreviewPrompt,
    buildPreviewConditioningBoard: mocks.buildPreviewConditioningBoard,
    generateDeterministicCompositePreview: mocks.generateDeterministicCompositePreview,
}))

vi.mock('@/lib/visualizer/huggingface', () => ({
    createWrapPreviewGeneratorAdapter: mocks.createWrapPreviewGeneratorAdapter,
    HuggingFacePreviewUnavailableError: class HuggingFacePreviewUnavailableError extends Error {},
}))

vi.mock('@/lib/visualizer/storage', () => ({
    storePreviewImage: mocks.storePreviewImage,
}))

vi.mock('@/lib/visualizer/cache-key', () => ({
    buildVisualizerCacheKey: mocks.buildVisualizerCacheKey,
}))

import { createVisualizerPreview } from './create-visualizer-preview'

function makeSession() {
    return {
        isAuthenticated: true,
        userId: 'user-1',
        authz: {},
        isOwner: false,
        isPlatformAdmin: false,
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

function makePreviewRecord() {
    const now = new Date('2026-03-19T00:00:00Z')

    return {
        id: 'preview-1',
        wrapId: 'wrap-1',
        customerPhotoUrl: 'https://cloudinary.com/vehicle.png',
        processedImageUrl: 'https://cloudinary.com/result.png',
        status: 'complete',
        cacheKey: 'cache-key',
        sourceWrapImageId: 'texture-1',
        sourceWrapImageVersion: 4,
        expiresAt: new Date('2026-03-20T00:00:00Z'),
        createdAt: now,
        updatedAt: now,
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
        mocks.readImageBufferFromUrl.mockResolvedValue(Buffer.from('texture-bytes'))
        mocks.buildWrapPreviewPrompt.mockReturnValue({
            prompt: 'Apply Ocean Spectrum wrap',
            negativePrompt: 'No distortion',
            promptVersion: 'prompt-version',
        })
        mocks.buildPreviewConditioningBoard.mockResolvedValue(Buffer.from('board-bytes'))
        mocks.generateDeterministicCompositePreview.mockResolvedValue(
            'https://cloudinary.com/fallback.png'
        )
        mocks.createWrapPreviewGeneratorAdapter.mockReturnValue({
            generate: vi.fn().mockResolvedValue(Buffer.from('generated-bytes')),
        })
        mocks.storePreviewImage.mockResolvedValue('https://cloudinary.com/generated.png')
        mocks.buildVisualizerCacheKey.mockReturnValue('cache-key')
        mocks.prisma.visualizerPreview.findFirst.mockResolvedValue(makePreviewRecord())
    })

    it('reuses an existing preview for the same normalized File input', async () => {
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
        expect(mocks.createWrapPreviewGeneratorAdapter).not.toHaveBeenCalled()
        expect(mocks.storePreviewImage).not.toHaveBeenCalled()
        expect(result).toEqual(
            expect.objectContaining({
                id: 'preview-1',
                wrapId: 'wrap-1',
                processedImageUrl: 'https://cloudinary.com/result.png',
                sourceWrapImageId: 'texture-1',
                sourceWrapImageVersion: 4,
                cacheKey: 'cache-key',
            })
        )
    })
})
