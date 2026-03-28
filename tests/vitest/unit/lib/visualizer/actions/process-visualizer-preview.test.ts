import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
    getVisualizerWrapSelectionById: vi.fn(),
    readPhotoBuffer: vi.fn(),
    resolveVisualizerGenerationAssets: vi.fn(),
    executeVisualizerPreviewGeneration: vi.fn(),
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

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('@/lib/fetchers/visualizer.fetchers', () => ({
    getVisualizerWrapSelectionById: mocks.getVisualizerWrapSelectionById,
}))

vi.mock('@/lib/visualizer/preview-pipeline', () => ({
    readPhotoBuffer: mocks.readPhotoBuffer,
}))

vi.mock('@/lib/visualizer/preview-execution', () => ({
    resolveVisualizerGenerationAssets: mocks.resolveVisualizerGenerationAssets,
    executeVisualizerPreviewGeneration: mocks.executeVisualizerPreviewGeneration,
}))

import { processVisualizerPreview } from '@/lib/actions/visualizer.actions'

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

function makePreviewRecord(overrides: Record<string, unknown> = {}) {
    const now = new Date('2026-03-19T00:00:00Z')

    return {
        id: 'preview-1',
        wrapId: 'wrap-1',
        customerPhotoUrl: 'data:image/png;base64,ZmFrZQ==',
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

describe('processVisualizerPreview', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getSession.mockResolvedValue(makeSession())
        mocks.requireCapability.mockReturnValue(undefined)
        mocks.getVisualizerWrapSelectionById.mockResolvedValue(makeWrap())
        mocks.readPhotoBuffer.mockResolvedValue({
            buffer: Buffer.from('vehicle-bytes'),
            contentType: 'image/png',
        })
        mocks.resolveVisualizerGenerationAssets.mockResolvedValue({
            textureBuffer: Buffer.from('texture-bytes'),
            prompt: {
                prompt: 'Apply Ocean Spectrum wrap',
                negativePrompt: 'No distortion',
                promptVersion: 'prompt-version',
            },
        })
        mocks.executeVisualizerPreviewGeneration.mockResolvedValue({
            processedImageUrl: 'https://cloudinary.com/fallback.png',
            promptVersion: 'prompt-version',
            generationFallbackReason: 'Hugging Face unavailable.',
        })
        mocks.prisma.visualizerPreview.findFirst.mockResolvedValue(makePreviewRecord())
        mocks.prisma.visualizerPreview.update
            .mockResolvedValueOnce(makePreviewRecord({ status: 'processing' }))
            .mockResolvedValueOnce(
                makePreviewRecord({
                    status: 'complete',
                    processedImageUrl: 'https://cloudinary.com/fallback.png',
                })
            )
        mocks.prisma.auditLog.create.mockResolvedValue(undefined)
    })

    it('processes a pending preview and records a terminal complete state', async () => {
        const result = await processVisualizerPreview({ previewId: 'preview-1' })

        expect(mocks.readPhotoBuffer).toHaveBeenCalledWith('data:image/png;base64,ZmFrZQ==')
        expect(mocks.executeVisualizerPreviewGeneration).toHaveBeenCalledWith(
            expect.objectContaining({
                previewId: 'preview-1',
                vehicleBuffer: Buffer.from('vehicle-bytes'),
                textureBuffer: Buffer.from('texture-bytes'),
            })
        )
        expect(result).toEqual(
            expect.objectContaining({
                id: 'preview-1',
                status: 'complete',
                processedImageUrl: 'https://cloudinary.com/fallback.png',
            })
        )
    })

    it('returns an existing completed preview without reprocessing', async () => {
        mocks.prisma.visualizerPreview.findFirst.mockResolvedValue(
            makePreviewRecord({
                status: 'complete',
                processedImageUrl: 'https://cloudinary.com/result.png',
            })
        )

        const result = await processVisualizerPreview({ previewId: 'preview-1' })

        expect(mocks.readPhotoBuffer).not.toHaveBeenCalled()
        expect(mocks.executeVisualizerPreviewGeneration).not.toHaveBeenCalled()
        expect(result).toEqual(
            expect.objectContaining({
                status: 'complete',
                processedImageUrl: 'https://cloudinary.com/result.png',
            })
        )
    })

    it('marks the preview as failed when processing throws', async () => {
        mocks.executeVisualizerPreviewGeneration.mockRejectedValue(
            new Error('Preview generation failed.')
        )
        mocks.prisma.visualizerPreview.update
            .mockResolvedValueOnce(makePreviewRecord({ status: 'processing' }))
            .mockResolvedValueOnce(makePreviewRecord({ status: 'failed' }))

        await expect(processVisualizerPreview({ previewId: 'preview-1' })).rejects.toThrow(
            'Preview generation failed.'
        )

        expect(mocks.prisma.visualizerPreview.update).toHaveBeenLastCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    status: 'failed',
                }),
            })
        )
    })
})
