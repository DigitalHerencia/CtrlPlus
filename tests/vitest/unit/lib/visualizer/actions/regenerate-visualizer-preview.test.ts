import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
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
    getVisualizerWrapSelectionById: vi.fn(),
}))

vi.mock('@/lib/fetchers/visualizer.mappers', () => ({
    toVisualizerPreviewDTO: mocks.toVisualizerPreviewDTO,
    toVisualizerUploadSnapshot: vi.fn(),
}))

import { regenerateVisualizerPreview } from '@/lib/actions/visualizer.actions'

function makeSession() {
    return {
        isAuthenticated: true,
        userId: 'user-1',
        authz: {},
        isOwner: false,
        isPlatformAdmin: false,
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
        processedImageUrl: 'https://app.local/api/visualizer/previews/preview-1/image',
        status: 'complete',
        cacheKey: 'cache-key',
        referenceSignature: 'reference-signature',
        generationMode: 'reference_guided_edit',
        generationProvider: 'huggingface',
        generationModel: 'hf-test-model',
        generationPromptVersion: 'prompt-version',
        generationFallbackReason: null,
        expiresAt: new Date('2026-03-20T00:00:00Z'),
        createdAt: now,
        updatedAt: now,
        upload: {
            id: 'upload-1',
        },
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
        generationMode: 'reference_guided_edit',
        generationProvider: 'huggingface',
        generationModel: 'hf-test-model',
        generationPromptVersion: 'prompt-version',
        generationFallbackReason: null,
        expiresAt: new Date('2026-03-20T00:00:00Z').toISOString(),
        createdAt: new Date('2026-03-19T00:00:00Z').toISOString(),
        updatedAt: new Date('2026-03-19T00:00:00Z').toISOString(),
        ...overrides,
    }
}

describe('regenerateVisualizerPreview', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getSession.mockResolvedValue(makeSession())
        mocks.requireCapability.mockReturnValue(undefined)
        mocks.prisma.visualizerPreview.update.mockResolvedValue(undefined)
        mocks.prisma.auditLog.create.mockResolvedValue(undefined)
        mocks.toVisualizerPreviewDTO.mockImplementation((preview) =>
            makePreviewDTO({
                id: preview.id,
                status: preview.status,
                processedImageUrl: preview.processedImageUrl ?? null,
            })
        )
    })

    it('resets a preview to pending and clears prior processed output', async () => {
        mocks.prisma.visualizerPreview.findFirst
            .mockResolvedValueOnce(
                makePreviewRecord({
                    processedImageUrl:
                        'https://app.local/api/visualizer/previews/preview-1/image',
                })
            )
            .mockResolvedValueOnce(
                makePreviewRecord({
                    status: 'pending',
                    processedImageUrl: null,
                })
            )

        const result = await regenerateVisualizerPreview({ previewId: 'preview-1' })

        expect(mocks.prisma.visualizerPreview.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'preview-1' },
                data: expect.objectContaining({
                    status: 'pending',
                    processedImageUrl: null,
                    resultCloudinaryPublicId: null,
                    generationFallbackReason: null,
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

    it('throws when preview cannot be found', async () => {
        mocks.prisma.visualizerPreview.findFirst.mockResolvedValue(null)

        await expect(regenerateVisualizerPreview({ previewId: 'missing' })).rejects.toThrow(
            'Preview not found.'
        )
        expect(mocks.prisma.visualizerPreview.update).not.toHaveBeenCalled()
    })

    it('records regeneration against the existing upload-backed preview', async () => {
        mocks.prisma.visualizerPreview.findFirst
            .mockResolvedValueOnce(makePreviewRecord())
            .mockResolvedValueOnce(
                makePreviewRecord({
                    status: 'pending',
                    processedImageUrl: null,
                })
            )

        await regenerateVisualizerPreview({ previewId: 'preview-1' })

        expect(mocks.prisma.auditLog.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    action: 'visualizerPreview.regenerated',
                    resourceId: 'preview-1',
                }),
            })
        )
    })
})
