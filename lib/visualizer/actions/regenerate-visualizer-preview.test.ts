import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
    getVisualizerWrapSelectionById: vi.fn(),
    readPhotoBuffer: vi.fn(),
    readImageBufferFromUrl: vi.fn(),
    buildWrapPreviewPrompt: vi.fn(),
    buildPreviewConditioningBoard: vi.fn(),
    generateDeterministicCompositePreview: vi.fn(),
    createWrapPreviewGeneratorAdapter: vi.fn(),
    storePreviewImage: vi.fn(),
    prisma: {
        visualizerPreview: {
            findFirst: vi.fn(),
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
    readPhotoBuffer: mocks.readPhotoBuffer,
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

import { regenerateVisualizerPreview } from './regenerate-visualizer-preview'

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
        processedImageUrl: null,
        status: 'pending',
        cacheKey: 'cache-key',
        sourceWrapImageId: 'texture-1',
        sourceWrapImageVersion: 4,
        expiresAt: new Date('2026-03-20T00:00:00Z'),
        createdAt: now,
        updatedAt: now,
    }
}

describe('regenerateVisualizerPreview', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getSession.mockResolvedValue(makeSession())
        mocks.requireCapability.mockReturnValue(undefined)
        mocks.getVisualizerWrapSelectionById.mockResolvedValue(makeWrap())
        mocks.readPhotoBuffer.mockResolvedValue({
            buffer: Buffer.from('vehicle-bytes'),
            contentType: 'image/png',
        })
        mocks.readImageBufferFromUrl.mockResolvedValue(Buffer.from('texture-bytes'))
        mocks.buildWrapPreviewPrompt.mockReturnValue({
            prompt: 'Apply Ocean Spectrum wrap',
            negativePrompt: 'No distortion',
            promptVersion: 'prompt-version',
        })
        mocks.buildPreviewConditioningBoard.mockResolvedValue(Buffer.from('board-bytes'))
        mocks.generateDeterministicCompositePreview.mockResolvedValue('https://cloudinary.com/fallback.png')
        mocks.storePreviewImage.mockResolvedValue('https://cloudinary.com/generated.png')
        mocks.prisma.visualizerPreview.findFirst.mockResolvedValue(makePreviewRecord())
        mocks.prisma.visualizerPreview.update.mockResolvedValue({
            ...makePreviewRecord(),
            processedImageUrl: 'https://cloudinary.com/fallback.png',
            status: 'complete',
        })
    })

    it('falls back to deterministic compositing when Hugging Face is unavailable', async () => {
        mocks.createWrapPreviewGeneratorAdapter.mockImplementation(() => {
            throw new Error('Hugging Face preview generation is not configured.')
        })

        const result = await regenerateVisualizerPreview({ previewId: 'preview-1' })

        expect(mocks.readPhotoBuffer).toHaveBeenCalledWith('https://cloudinary.com/vehicle.png')
        expect(mocks.generateDeterministicCompositePreview).toHaveBeenCalledWith(
            expect.objectContaining({
                previewId: 'preview-1',
                photoBuffer: Buffer.from('vehicle-bytes'),
                textureBuffer: Buffer.from('texture-bytes'),
            })
        )
        expect(mocks.storePreviewImage).not.toHaveBeenCalled()
        expect(result).toEqual(
            expect.objectContaining({
                id: 'preview-1',
                status: 'complete',
                processedImageUrl: 'https://cloudinary.com/fallback.png',
                sourceWrapImageId: 'texture-1',
                sourceWrapImageVersion: 4,
            })
        )
    })
})
