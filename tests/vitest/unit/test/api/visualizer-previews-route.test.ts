import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/visualizer/fetchers/visualizer.fetchers', () => ({
    getPreviewById: vi.fn(),
}))

import { GET } from '@/app/(tenant)/visualizer/previews/[id]/route'
import { getPreviewById } from '@/lib/fetchers/visualizer.fetchers'

describe('visualizer previews route', () => {
    it('returns 404 when preview not found', async () => {
        const mocked = vi.mocked(getPreviewById)
        mocked.mockResolvedValueOnce(null)

        const context: Parameters<typeof GET>[1] = {
            params: Promise.resolve({ id: 'missing' }),
        }

        const res = await GET(new Request('https://example.test'), context)

        expect(res.status).toBe(404)
    })
})
