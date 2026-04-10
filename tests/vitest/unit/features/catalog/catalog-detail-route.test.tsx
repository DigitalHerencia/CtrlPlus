import { describe, expect, it, vi } from 'vitest'

const pageMocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    hasCapability: vi.fn(),
    redirect: vi.fn(),
}))

const metadataMocks = vi.hoisted(() => ({
    getCatalogWrapById: vi.fn(),
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: pageMocks.getSession,
}))

vi.mock('@/lib/authz/policy', () => ({
    hasCapability: pageMocks.hasCapability,
}))

vi.mock('next/navigation', async () => {
    return {
        redirect: pageMocks.redirect,
        notFound: vi.fn(),
    }
})

vi.mock('@/lib/fetchers/catalog.fetchers', () => ({
    getCatalogWrapById: metadataMocks.getCatalogWrapById,
}))

describe('catalog detail route contracts', () => {
    it('uses wrapId when generating catalog metadata', async () => {
        metadataMocks.getCatalogWrapById.mockResolvedValue({
            id: 'wrap-1',
            name: 'Ocean Spectrum',
            description: 'Electric gradient wrap',
            heroImage: {
                detailUrl: 'https://cdn.example/detail.png',
                url: 'https://cdn.example/fallback.png',
            },
        })

        const { generateCatalogWrapMetadata } =
            await import('@/features/catalog/catalog-detail-page-feature')

        await generateCatalogWrapMetadata(Promise.resolve({ wrapId: 'wrap-1' }))

        expect(metadataMocks.getCatalogWrapById).toHaveBeenCalledWith('wrap-1', {
            includeHidden: false,
        })
    })

    it('passes wrapId through the catalog detail page route', async () => {
        pageMocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            authz: {},
        })
        pageMocks.hasCapability.mockReturnValue(true)

        const routeModule = await import('@/app/(tenant)/catalog/[wrapId]/page')
        const element = await routeModule.default({
            params: Promise.resolve({ wrapId: 'wrap-1' }),
        })

        expect(element.props.wrapId).toBe('wrap-1')
        expect(element.props.canManageCatalog).toBe(true)
    })
})
