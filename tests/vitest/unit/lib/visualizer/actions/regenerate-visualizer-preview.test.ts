import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
    getVisualizerWrapSelectionById: vi.fn(),
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
        processedImageUrl: 'https://cloudinary.com/old-result.png',
        status: 'complete',
        cacheKey: 'cache-key',
        sourceWrapImageId: 'texture-1',
        sourceWrapImageVersion: 4,
        expiresAt: new Date('2026-03-20T00:00:00Z'),
        createdAt: now,
        updatedAt: now,
        ...overrides,
    }
}

describe('regenerateVisualizerPreview', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getSession.mockResolvedValue(makeSession())
        mocks.requireCapability.mockReturnValue(undefined)
        mocks.getVisualizerWrapSelectionById.mockResolvedValue(makeWrap())
        mocks.prisma.visualizerPreview.findFirst.mockResolvedValue(makePreviewRecord())
        mocks.prisma.visualizerPreview.update.mockResolvedValue(
            makePreviewRecord({
                status: 'pending',
                processedImageUrl: null,
            })
        )
        mocks.prisma.auditLog.create.mockResolvedValue(undefined)
    })

    it('resets a preview to pending and clears prior processed output', async () => {
        const result = await regenerateVisualizerPreview({ previewId: 'preview-1' })

        expect(mocks.prisma.visualizerPreview.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'preview-1' },
                data: expect.objectContaining({
                    status: 'pending',
                    processedImageUrl: null,
                    sourceWrapImageId: 'texture-1',
                    sourceWrapImageVersion: 4,
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

    it('throws when wrap is not visualizer-ready during regeneration', async () => {
        mocks.getVisualizerWrapSelectionById.mockResolvedValue(null)

        await expect(regenerateVisualizerPreview({ previewId: 'preview-1' })).rejects.toThrow(
            'Wrap not found or is not visualizer-ready.'
        )
        expect(mocks.prisma.visualizerPreview.update).not.toHaveBeenCalled()
    })
})
