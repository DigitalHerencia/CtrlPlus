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
    persistVisualizerPreviewAsset: vi.fn(),
    toVisualizerPreviewDTO: vi.fn(),
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
    normalizeVehicleUpload: vi.fn(),
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
    persistVisualizerUploadAsset: vi.fn(),
    persistVisualizerPreviewAsset: mocks.persistVisualizerPreviewAsset,
}))

vi.mock('@/lib/fetchers/visualizer.mappers', () => ({
    toVisualizerPreviewDTO: mocks.toVisualizerPreviewDTO,
    toVisualizerUploadSnapshot: vi.fn(),
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
        heroImage: {
            id: 'hero-1',
            url: 'https://example.com/hero.png',
            kind: 'hero',
            isActive: true,
            version: 4,
            contentHash: 'hero-hash',
            displayOrder: 0,
            thumbnailUrl: 'https://example.com/hero-thumb.png',
            cardUrl: 'https://example.com/hero-card.png',
            detailUrl: 'https://example.com/hero-detail.png',
        },
        galleryImages: [
            {
                id: 'gallery-1',
                url: 'https://example.com/gallery.png',
                kind: 'gallery',
                isActive: true,
                version: 2,
                contentHash: 'gallery-hash',
                displayOrder: 1,
                thumbnailUrl: 'https://example.com/gallery-thumb.png',
                cardUrl: 'https://example.com/gallery-card.png',
                detailUrl: 'https://example.com/gallery-detail.png',
            },
        ],
        aiPromptTemplate: null,
        aiNegativePrompt: null,
        readiness: {
            canPublish: true,
            isVisualizerReady: true,
            missingRequiredAssetRoles: [],
            requiredAssetRoles: ['hero'],
            activeAssetKinds: ['hero', 'gallery'],
            hasDisplayAsset: true,
            activeHeroCount: 1,
            activeGalleryCount: 1,
            issues: [],
        },
    }
}

function makeUpload() {
    return {
        id: 'upload-1',
        legacyUrl: 'https://cloudinary.com/vehicle.png',
        cloudinaryPublicId: null,
        cloudinaryVersion: null,
        cloudinaryResourceType: null,
        cloudinaryDeliveryType: null,
        format: 'png',
    }
}

function makePreviewRecord(overrides: Record<string, unknown> = {}) {
    const now = new Date('2026-03-19T00:00:00Z')

    return {
        id: 'preview-1',
        wrapId: 'wrap-1',
        uploadId: 'upload-1',
        ownerClerkUserId: 'user-1',
        customerPhotoUrl: 'https://cloudinary.com/vehicle.png',
        processedImageUrl: null,
        status: 'pending',
        cacheKey: 'cache-key',
        referenceSignature: 'reference-signature',
        generationMode: 'mask_guided_inpaint',
        generationProvider: 'huggingface-space',
        generationModel: 'hf-test-model',
        generationPromptVersion: 'prompt-version',
        generationFallbackReason: null,
        resultLegacyUrl: null,
        resultCloudinaryPublicId: null,
        sourceWrapImageId: 'hero-1',
        sourceWrapImageVersion: 4,
        expiresAt: new Date('2026-03-20T00:00:00Z'),
        createdAt: now,
        updatedAt: now,
        upload: makeUpload(),
        ...overrides,
    }
}

function makePreviewDTO(overrides: Record<string, unknown> = {}) {
    return {
        id: 'preview-1',
        wrapId: 'wrap-1',
        uploadId: 'upload-1',
        customerPhotoUrl: 'https://app.local/api/visualizer/uploads/upload-1/image',
        processedImageUrl: null,
        status: 'pending',
        cacheKey: 'cache-key',
        referenceSignature: 'reference-signature',
        generationMode: 'mask_guided_inpaint',
        generationProvider: 'huggingface-space',
        generationModel: 'hf-test-model',
        generationPromptVersion: 'prompt-version',
        generationFallbackReason: null,
        expiresAt: new Date('2026-03-20T00:00:00Z').toISOString(),
        createdAt: new Date('2026-03-19T00:00:00Z').toISOString(),
        updatedAt: new Date('2026-03-19T00:00:00Z').toISOString(),
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
        mocks.readImageBufferFromUrl.mockResolvedValue(Buffer.from('reference-bytes'))
        mocks.buildWrapPreviewPrompt.mockReturnValue({
            prompt: 'Apply Ocean Spectrum wrap',
            negativePrompt: 'No distortion',
            promptVersion: 'prompt-version',
        })
        mocks.buildGenerationInputBoard.mockResolvedValue({
            boardBuffer: Buffer.from('board-bytes'),
            boardMaskBuffer: Buffer.from('board-mask-bytes'),
            maskStrategy: 'hf_segmentation',
            notes: ['mask_source=hf_segmentation'],
        })
        mocks.generateWrapPreview.mockResolvedValue({
            imageBuffer: Buffer.from('generated-preview'),
            status: 'ok',
            finalImageUrl: null,
            maskUrl: null,
            referenceUrls: ['https://example.com/hero-detail.png'],
            model: 'hf-generated-model',
            prompt: 'Apply Ocean Spectrum wrap',
            notes: ['provider=huggingface-space:test/space'],
        })
        mocks.buildSimpleWrapPreview.mockResolvedValue(Buffer.from('fallback-preview'))
        mocks.getHfModelName.mockReturnValue('hf-test-model')
        mocks.persistVisualizerPreviewAsset.mockResolvedValue({
            assetId: 'asset-1',
            publicId: 'ctrlplus/visualizer/previews/user-1/preview-1',
            version: 7,
            resourceType: 'image',
            deliveryType: 'authenticated',
            assetFolder: 'ctrlplus/visualizer/previews/user-1',
            secureUrl: 'https://res.cloudinary.com/demo/image/authenticated/v7/preview-1.png',
            format: 'png',
            bytes: 1024,
            width: 1400,
            height: 900,
            mimeType: 'image/png',
            originalFileName: null,
            contentHash: 'preview-hash',
            legacyUrl: null,
        })
        mocks.toVisualizerPreviewDTO.mockImplementation((preview) =>
            makePreviewDTO({
                id: preview.id,
                status: preview.status,
                processedImageUrl: preview.processedImageUrl ?? null,
                generationMode: preview.generationMode ?? 'mask_guided_inpaint',
                generationProvider: preview.generationProvider ?? 'huggingface-space',
                generationModel: preview.generationModel ?? 'hf-generated-model',
                generationFallbackReason: preview.generationFallbackReason ?? null,
            })
        )
        mocks.prisma.visualizerPreview.update.mockResolvedValue(undefined)
        mocks.prisma.auditLog.create.mockResolvedValue(undefined)
    })

    it('processes a pending preview and records a terminal complete state', async () => {
        mocks.prisma.visualizerPreview.findFirst
            .mockResolvedValueOnce(makePreviewRecord())
            .mockResolvedValueOnce(
                makePreviewRecord({
                    status: 'complete',
                    processedImageUrl: 'https://app.local/api/visualizer/previews/preview-1/image',
                    generationModel: 'hf-generated-model',
                })
            )

        const result = await processVisualizerPreview({ previewId: 'preview-1' })

        expect(mocks.readPhotoBuffer).toHaveBeenCalledWith('https://cloudinary.com/vehicle.png')
        expect(mocks.readImageBufferFromUrl).toHaveBeenCalledTimes(2)
        expect(mocks.buildGenerationInputBoard).toHaveBeenCalledWith(
            expect.objectContaining({
                vehicleBuffer: expect.any(Buffer),
                referenceBuffers: expect.arrayContaining([expect.any(Buffer)]),
                wrapName: 'Ocean Spectrum',
            })
        )
        expect(mocks.generateWrapPreview).toHaveBeenCalledWith(
            expect.objectContaining({
                boardBuffer: expect.any(Buffer),
                boardMaskBuffer: expect.any(Buffer),
                referenceUrls: expect.any(Array),
            })
        )
        expect(mocks.persistVisualizerPreviewAsset).toHaveBeenCalled()
        expect(result).toEqual(
            expect.objectContaining({
                id: 'preview-1',
                status: 'complete',
                processedImageUrl: 'https://app.local/api/visualizer/previews/preview-1/image',
                generationModel: 'hf-generated-model',
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
        mocks.prisma.visualizerPreview.findFirst
            .mockResolvedValueOnce(
                makePreviewRecord({
                    status: 'complete',
                    processedImageUrl: 'https://app.local/api/visualizer/previews/preview-1/image',
                    resultCloudinaryPublicId: 'ctrlplus/visualizer/previews/user-1/preview-1',
                })
            )
            .mockResolvedValueOnce(
                makePreviewRecord({
                    status: 'complete',
                    processedImageUrl: 'https://app.local/api/visualizer/previews/preview-1/image',
                    resultCloudinaryPublicId: 'ctrlplus/visualizer/previews/user-1/preview-1',
                })
            )

        const result = await processVisualizerPreview({ previewId: 'preview-1' })

        expect(mocks.readPhotoBuffer).not.toHaveBeenCalled()
        expect(mocks.readImageBufferFromUrl).not.toHaveBeenCalled()
        expect(result).toEqual(
            expect.objectContaining({
                status: 'complete',
                processedImageUrl: 'https://app.local/api/visualizer/previews/preview-1/image',
            })
        )
    })

    it('marks the preview as failed when the source photo cannot be read', async () => {
        mocks.prisma.visualizerPreview.findFirst.mockResolvedValueOnce(makePreviewRecord())
        mocks.readPhotoBuffer.mockRejectedValue(new Error('Preview generation failed.'))

        await expect(processVisualizerPreview({ previewId: 'preview-1' })).rejects.toThrow(
            'Preview generation failed.'
        )

        expect(mocks.prisma.visualizerPreview.update).toHaveBeenLastCalledWith(
            expect.objectContaining({
                where: { id: 'preview-1' },
                data: expect.objectContaining({
                    status: 'failed',
                    generationFallbackReason: 'Preview generation failed.',
                }),
            })
        )
    })

    it('marks preview failed when wrap selection is unavailable', async () => {
        mocks.prisma.visualizerPreview.findFirst.mockResolvedValueOnce(makePreviewRecord())
        mocks.getVisualizerWrapSelectionById.mockResolvedValue(null)

        await expect(processVisualizerPreview({ previewId: 'preview-1' })).rejects.toThrow(
            'Wrap not found or is not visualizer-ready.'
        )

        expect(mocks.prisma.visualizerPreview.update).toHaveBeenCalledWith({
            where: { id: 'preview-1' },
            data: {
                status: 'failed',
                generationFallbackReason: 'Wrap not found or is not visualizer-ready.',
            },
        })
    })

    it('continues processing when one reference image is invalid but another is usable', async () => {
        mocks.prisma.visualizerPreview.findFirst
            .mockResolvedValueOnce(makePreviewRecord())
            .mockResolvedValueOnce(
                makePreviewRecord({
                    status: 'complete',
                    processedImageUrl: 'https://app.local/api/visualizer/previews/preview-1/image',
                    generationModel: 'hf-generated-model',
                })
            )

        mocks.readImageBufferFromUrl
            .mockRejectedValueOnce(new Error('Invalid URL'))
            .mockResolvedValueOnce(Buffer.from('reference-bytes-2'))

        const result = await processVisualizerPreview({ previewId: 'preview-1' })

        expect(mocks.readImageBufferFromUrl).toHaveBeenCalledTimes(2)
        expect(mocks.buildGenerationInputBoard).toHaveBeenCalledWith(
            expect.objectContaining({
                referenceBuffers: [expect.any(Buffer)],
            })
        )
        expect(result).toEqual(
            expect.objectContaining({
                id: 'preview-1',
                status: 'complete',
                processedImageUrl: 'https://app.local/api/visualizer/previews/preview-1/image',
            })
        )
    })
})
