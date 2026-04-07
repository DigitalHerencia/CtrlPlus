import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
    getVisualizerWrapSelectionById: vi.fn(),
    getMyVisualizerUploadRecordById: vi.fn(),
    getReusableVisualizerPreviewByCacheKey: vi.fn(),
    getVisualizerPreviewDTOForOwner: vi.fn(),
    buildWrapPreviewPrompt: vi.fn(),
    getHfModelName: vi.fn(),
    getHfPreviewStrategy: vi.fn(),
    getHfRetryCount: vi.fn(),
    getHfTimeoutMs: vi.fn(),
    getOptionalHfApiKey: vi.fn(),
    buildVisualizerCacheKey: vi.fn(),
    toVisualizerPreviewDTO: vi.fn(),
    prisma: {
        visualizerUpload: {
            findFirst: vi.fn(),
        },
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

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('@/lib/fetchers/visualizer.fetchers', () => ({
    getVisualizerWrapSelectionById: mocks.getVisualizerWrapSelectionById,
    getMyVisualizerUploadRecordById: mocks.getMyVisualizerUploadRecordById,
    getReusableVisualizerPreviewByCacheKey: mocks.getReusableVisualizerPreviewByCacheKey,
    getVisualizerPreviewDTOForOwner: mocks.getVisualizerPreviewDTOForOwner,
}))

vi.mock('@/lib/visualizer/prompting/build-wrap-preview-prompt', () => ({
    buildWrapPreviewPrompt: mocks.buildWrapPreviewPrompt,
}))

vi.mock('@/lib/visualizer/huggingface/client', () => ({
    getHfModelName: mocks.getHfModelName,
    getHfPreviewStrategy: mocks.getHfPreviewStrategy,
    getHfRetryCount: mocks.getHfRetryCount,
    getHfTimeoutMs: mocks.getHfTimeoutMs,
    getOptionalHfApiKey: mocks.getOptionalHfApiKey,
}))

vi.mock('@/lib/cache/cache-keys', () => ({
    buildVisualizerCacheKey: mocks.buildVisualizerCacheKey,
}))

vi.mock('@/lib/fetchers/visualizer.mappers', () => ({
    toVisualizerPreviewDTO: mocks.toVisualizerPreviewDTO,
    toVisualizerUploadSnapshot: vi.fn(),
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

function makeUploadRecord(overrides: Record<string, unknown> = {}) {
    const now = new Date('2026-03-19T00:00:00Z')

    return {
        id: 'upload-1',
        ownerClerkUserId: 'user-1',
        legacyUrl: 'https://cloudinary.com/vehicle.png',
        cloudinaryPublicId: 'ctrlplus/visualizer/uploads/user-1/upload-1',
        cloudinaryVersion: 1,
        cloudinaryResourceType: 'image',
        cloudinaryDeliveryType: 'authenticated',
        format: 'png',
        contentHash: 'vehicle-hash',
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        ...overrides,
    }
}

function makePreviewRecord(overrides: Record<string, unknown> = {}) {
    const now = new Date('2026-03-19T00:00:00Z')

    return {
        id: 'preview-1',
        wrapId: 'wrap-1',
        uploadId: 'upload-1',
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
        expiresAt: new Date('2026-03-20T00:00:00Z'),
        createdAt: now,
        updatedAt: now,
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

describe('createVisualizerPreview', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getSession.mockResolvedValue(makeSession())
        mocks.requireCapability.mockReturnValue(undefined)
        mocks.getVisualizerWrapSelectionById.mockResolvedValue(makeWrap())
        mocks.getMyVisualizerUploadRecordById.mockResolvedValue(makeUploadRecord())
        mocks.getReusableVisualizerPreviewByCacheKey.mockResolvedValue(null)
        mocks.getVisualizerPreviewDTOForOwner.mockImplementation((previewId: string) =>
            Promise.resolve(
                makePreviewDTO({
                    id: previewId,
                    status: 'pending',
                    processedImageUrl: null,
                })
            )
        )
        mocks.getHfModelName.mockReturnValue('hf-test-model')
        mocks.buildWrapPreviewPrompt.mockReturnValue({
            prompt: 'Apply Ocean Spectrum wrap',
            negativePrompt: 'No distortion',
            promptVersion: 'prompt-version',
        })
        mocks.buildVisualizerCacheKey.mockReturnValue('cache-key')
        mocks.prisma.visualizerPreview.create.mockResolvedValue({ id: 'preview-1' })
        mocks.prisma.auditLog.create.mockResolvedValue(undefined)
        mocks.toVisualizerPreviewDTO.mockImplementation((preview) =>
            makePreviewDTO({
                id: preview.id,
                status: preview.status,
                processedImageUrl: preview.processedImageUrl ?? null,
            })
        )
    })

    it('reuses an existing complete preview for the same upload and reference set', async () => {
        mocks.getReusableVisualizerPreviewByCacheKey.mockResolvedValue(
            makePreviewRecord({
                id: 'preview-existing',
                status: 'complete',
                processedImageUrl:
                    'https://app.local/api/visualizer/previews/preview-existing/image',
            })
        )
        mocks.getVisualizerPreviewDTOForOwner.mockResolvedValue(
            makePreviewDTO({
                id: 'preview-existing',
                status: 'complete',
                processedImageUrl:
                    'https://app.local/api/visualizer/previews/preview-existing/image',
            })
        )

        const result = await createVisualizerPreview({
            wrapId: 'wrap-1',
            uploadId: 'upload-1',
        })

        expect(mocks.buildVisualizerCacheKey).toHaveBeenCalledWith(
            expect.objectContaining({
                wrapId: 'wrap-1',
                ownerUserId: 'user-1',
                customerPhotoHash: 'vehicle-hash',
                uploadId: 'upload-1',
                referenceSignature: expect.any(String),
                generationMode: 'mask_guided_inpaint',
                generationModel: 'hf-test-model',
                promptVersion: 'prompt-version',
            })
        )
        expect(mocks.prisma.visualizerPreview.create).not.toHaveBeenCalled()
        expect(result).toEqual(
            expect.objectContaining({
                id: 'preview-existing',
                status: 'complete',
                processedImageUrl:
                    'https://app.local/api/visualizer/previews/preview-existing/image',
            })
        )
    })

    it('creates a pending preview against an owned upload', async () => {
        const result = await createVisualizerPreview({
            wrapId: 'wrap-1',
            uploadId: 'upload-1',
        })

        expect(mocks.getVisualizerWrapSelectionById).toHaveBeenCalledWith('wrap-1', {
            includeHidden: false,
        })
        expect(mocks.getMyVisualizerUploadRecordById).toHaveBeenCalledWith('upload-1', 'user-1')
        expect(mocks.getReusableVisualizerPreviewByCacheKey).toHaveBeenCalledWith(
            'cache-key',
            'user-1'
        )
        expect(mocks.prisma.visualizerPreview.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    wrapId: 'wrap-1',
                    uploadId: 'upload-1',
                    ownerClerkUserId: 'user-1',
                    customerPhotoUrl: 'https://cloudinary.com/vehicle.png',
                    status: 'pending',
                    generationMode: 'mask_guided_inpaint',
                    generationProvider: 'huggingface-space',
                    generationModel: 'hf-test-model',
                    sourceWrapImageId: 'hero-1',
                    sourceWrapImageVersion: 4,
                }),
            })
        )
        expect(result).toEqual(
            expect.objectContaining({
                id: 'preview-1',
                status: 'pending',
                uploadId: 'upload-1',
                processedImageUrl: null,
            })
        )
    })

    it('allows owners to resolve hidden wraps server-side', async () => {
        mocks.getSession.mockResolvedValue(
            makeSession({
                isOwner: true,
            })
        )

        await createVisualizerPreview({
            wrapId: 'wrap-1',
            uploadId: 'upload-1',
        })

        expect(mocks.getVisualizerWrapSelectionById).toHaveBeenCalledWith('wrap-1', {
            includeHidden: true,
        })
    })

    it('rejects preview creation when the upload is not owned by the current user', async () => {
        mocks.getMyVisualizerUploadRecordById.mockResolvedValue(null)

        await expect(
            createVisualizerPreview({
                wrapId: 'wrap-1',
                uploadId: 'upload-missing',
            })
        ).rejects.toThrow('Upload not found.')

        expect(mocks.prisma.visualizerPreview.create).not.toHaveBeenCalled()
    })
})
