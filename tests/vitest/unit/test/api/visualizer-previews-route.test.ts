import { describe, it, expect, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getPreviewById: vi.fn(),
}))

vi.mock('@/lib/fetchers/visualizer.fetchers', () => ({
    getPreviewById: mocks.getPreviewById,
}))

import { GET } from '@/app/(tenant)/visualizer/previews/[previewId]/route'
import { getPreviewById } from '@/lib/fetchers/visualizer.fetchers'

describe('visualizer previews route', () => {
    it('returns 404 when preview not found', async () => {
        const mocked = vi.mocked(getPreviewById)
        mocked.mockResolvedValueOnce(null)

        const context: Parameters<typeof GET>[1] = {
            params: Promise.resolve({ previewId: 'missing' }),
        }

        const res = await GET(new Request('https://example.test'), context)

        expect(res.status).toBe(404)
    })
})
