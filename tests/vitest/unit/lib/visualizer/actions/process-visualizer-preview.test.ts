import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
    getVisualizerWrapSelectionById: vi.fn(),
    readPhotoBuffer: vi.fn(),
    readImageBufferFromUrl: vi.fn(),
    buildWrapPreviewPrompt: vi.fn(),
    buildGenerationInputBoard: vi.fn(),
    generateWrapPreview: vi.fn(),
    buildSimpleWrapPreview: vi.fn(),
    getHfModelName: vi.fn(),
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

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('@/lib/fetchers/visualizer.fetchers', () => ({
    getVisualizerWrapSelectionById: mocks.getVisualizerWrapSelectionById,
}))

vi.mock('@/lib/uploads/image-processing', () => ({
    readPhotoBuffer: mocks.readPhotoBuffer,
    readImageBufferFromUrl: mocks.readImageBufferFromUrl,
}))

vi.mock('@/lib/visualizer/prompting/build-wrap-preview-prompt', () => ({
    buildWrapPreviewPrompt: mocks.buildWrapPreviewPrompt,
}))

vi.mock('@/lib/visualizer/preprocessing/build-generation-input-board', () => ({
    buildGenerationInputBoard: mocks.buildGenerationInputBoard,
}))

vi.mock('@/lib/visualizer/huggingface/generate-wrap-preview', () => ({
    generateWrapPreview: mocks.generateWrapPreview,
}))

vi.mock('@/lib/visualizer/fallback/build-simple-wrap-preview', () => ({
    buildSimpleWrapPreview: mocks.buildSimpleWrapPreview,
}))

vi.mock('@/lib/visualizer/huggingface/client', () => ({
    getHfModelName: mocks.getHfModelName,
}))

vi.mock('@/lib/uploads/storage', () => ({
    storePreviewImage: mocks.storePreviewImage,
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
            buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Z3ioAAAAASUVORK5CYII=', 'base64'),
            contentType: 'image/png',
        })
        mocks.readImageBufferFromUrl.mockResolvedValue(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Z3ioAAAAASUVORK5CYII=', 'base64'))
        mocks.buildWrapPreviewPrompt.mockReturnValue({
            prompt: 'Apply Ocean Spectrum wrap',
            negativePrompt: 'No distortion',
            promptVersion: 'prompt-version',
        })
        mocks.buildGenerationInputBoard.mockResolvedValue(Buffer.from('board-bytes'))
        mocks.generateWrapPreview.mockResolvedValue({
            imageBuffer: Buffer.from('generated-preview'),
        })
        mocks.buildSimpleWrapPreview.mockResolvedValue(Buffer.from('fallback-bytes'))
        mocks.getHfModelName.mockReturnValue('hf-test-model')
        mocks.storePreviewImage.mockResolvedValue('https://cloudinary.com/fallback.png')
        mocks.generateWrapPreview.mockResolvedValue({
            imageBuffer: Buffer.from('generated-preview'),
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
        expect(mocks.readImageBufferFromUrl).toHaveBeenCalledWith('https://example.com/texture.png')
        expect(mocks.buildGenerationInputBoard).toHaveBeenCalledWith(
            expect.objectContaining({
                vehicleBuffer: expect.any(Buffer),
                wrapTextureBuffer: expect.any(Buffer),
            })
        )
        expect(mocks.generateWrapPreview).toHaveBeenCalled()
        expect(result).toEqual(
            expect.objectContaining({
                id: 'preview-1',
                status: 'complete',
                processedImageUrl: 'https://cloudinary.com/fallback.png',
            })
        )
    })

    it('throws when preview cannot be found for the current owner', async () => {
        mocks.prisma.visualizerPreview.findFirst.mockResolvedValue(null)

        await expect(processVisualizerPreview({ previewId: 'missing' })).rejects.toThrow(
            'Preview not found.'
        )

        expect(mocks.prisma.visualizerPreview.update).not.toHaveBeenCalled()
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
        expect(mocks.readImageBufferFromUrl).not.toHaveBeenCalled()
        expect(result).toEqual(
            expect.objectContaining({
                status: 'complete',
                processedImageUrl: 'https://cloudinary.com/result.png',
            })
        )
    })

    it('marks the preview as failed when the source photo cannot be read', async () => {
        mocks.readPhotoBuffer.mockRejectedValue(new Error('Preview generation failed.'))
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

    it('marks preview failed when wrap selection is unavailable', async () => {
        mocks.getVisualizerWrapSelectionById.mockResolvedValue(null)

        await expect(processVisualizerPreview({ previewId: 'preview-1' })).rejects.toThrow(
            'Wrap not found or is not visualizer-ready.'
        )

        expect(mocks.prisma.visualizerPreview.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'preview-1' },
                data: { status: 'failed' },
            })
        )
    })
})
