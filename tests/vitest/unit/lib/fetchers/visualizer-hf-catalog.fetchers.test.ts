import { describe, expect, it, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('@/lib/authz/policy', () => ({
    requireCapability: mocks.requireCapability,
}))

import { getVisualizerHfCatalogData } from '@/lib/fetchers/visualizer.fetchers'

describe('getVisualizerHfCatalogData', () => {
    beforeEach(() => {
        vi.clearAllMocks()
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
            authz: { cap: true },
        })

        const result = await getVisualizerHfCatalogData()

        expect(mocks.requireCapability).toHaveBeenCalledWith({ cap: true }, 'visualizer.use')
        expect(result.makes.length).toBeGreaterThan(0)
        expect(result.wraps.length).toBeGreaterThan(0)
        expect(result.initialSelection.make.length).toBeGreaterThan(0)
        expect(result.initialSelection.wrapName.length).toBeGreaterThan(0)
    })
})
