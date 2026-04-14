import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
    listVisualizerSelectableWraps: vi.fn(),
    prisma: {
        websiteSettings: { findUnique: vi.fn() },
    },
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('@/lib/authz/policy', () => ({
    requireCapability: mocks.requireCapability,
}))

vi.mock('@/lib/fetchers/catalog.fetchers', () => ({
    listVisualizerSelectableWraps: mocks.listVisualizerSelectableWraps,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

import { getVisualizerHfCatalogData } from '@/lib/fetchers/visualizer.fetchers'

describe('getVisualizerHfCatalogData', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.listVisualizerSelectableWraps.mockResolvedValue([
            {
                id: 'wrap-1',
                name: 'Arctic Gloss Satin Wrap',
                description: 'desc',
                aiNegativePrompt: 'style',
                aiPromptTemplate: 'template',
                categories: [{ name: 'Stealth' }],
            },
        ])
        mocks.prisma.websiteSettings.findUnique.mockResolvedValue(null)
    })

    it('requires authentication', async () => {
        mocks.getSession.mockResolvedValueOnce({
            isAuthenticated: false,
            userId: null,
            authz: {},
        })

        await expect(getVisualizerHfCatalogData()).rejects.toThrow(
            'Unauthorized: not authenticated'
        )
    })

    it('returns seeded selection and catalog options', async () => {
        mocks.getSession.mockResolvedValueOnce({
            isAuthenticated: true,
            userId: 'user-1',
            isOwner: false,
            isPlatformAdmin: false,
            authz: { cap: true },
        })

        const result = await getVisualizerHfCatalogData()

        expect(mocks.requireCapability).toHaveBeenCalledWith({ cap: true }, 'visualizer.use')
        expect(result.makes.length).toBeGreaterThan(0)
        expect(result.wraps).toEqual([
            expect.objectContaining({
                id: 'wrap-1',
                name: 'Arctic Gloss Satin Wrap',
            }),
        ])
        expect(result.selectedWrapId).toBe('wrap-1')
        expect(result.initialSelection.make.length).toBeGreaterThan(0)
        expect(result.initialSelection.wrapId).toBe('wrap-1')
    })

    it('prefers the requested wrap id over the default wrap selection', async () => {
        mocks.getSession.mockResolvedValueOnce({
            isAuthenticated: true,
            userId: 'user-1',
            isOwner: false,
            isPlatformAdmin: false,
            authz: { cap: true },
        })
        mocks.listVisualizerSelectableWraps.mockResolvedValue([
            {
                id: 'wrap-legacy',
                name: 'Legacy Wrap',
                description: '',
                aiNegativePrompt: '',
                aiPromptTemplate: '',
                categories: [],
            },
            {
                id: 'wrap-2',
                name: 'New Wrap',
                description: '',
                aiNegativePrompt: '',
                aiPromptTemplate: '',
                categories: [],
            },
        ])

        const result = await getVisualizerHfCatalogData('wrap-2')

        expect(result.selectedWrapId).toBe('wrap-2')
        expect(result.initialSelection.wrapId).toBe('wrap-2')
    })
})
