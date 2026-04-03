import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth/session', () => ({
    getSession: vi.fn().mockResolvedValue({
        isAuthenticated: false,
        userId: null,
        authz: {},
        isOwner: false,
        isPlatformAdmin: false,
    }),
}))

vi.mock('@/lib/fetchers/visualizer.fetchers', () => ({
    getVisualizerWrapSelectionById: vi.fn(),
}))

import { uploadAndGeneratePreview } from '@/lib/actions/visualizer.actions'

describe('uploadAndGeneratePreview', () => {
    it('surfaces authorization failures from preview creation flow', async () => {
        await expect(
            uploadAndGeneratePreview({
                wrapId: 'wrap-1',
                file: new File(['vehicle'], 'vehicle.png', { type: 'image/png' }),
            })
        ).rejects.toThrow('Unauthorized: not authenticated')
    })
})
