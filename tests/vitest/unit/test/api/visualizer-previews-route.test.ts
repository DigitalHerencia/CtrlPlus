import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/visualizer/fetchers/get-preview', () => ({
    getPreviewById: vi.fn(),
}))

import { GET } from '@/app/(tenant)/visualizer/previews/[id]/route'
import { getPreviewById } from '@/lib/visualizer/fetchers/get-preview'

describe('visualizer previews route', () => {
    it('returns 404 when preview not found', async () => {
        const mocked = vi.mocked(getPreviewById)
        mocked.mockResolvedValueOnce(null)

        const res = await GET(new Request('https://example.test'), {
            params: Promise.resolve({ id: 'missing' }),
        } as any)

        expect(res.status).toBe(404)
    })
})
