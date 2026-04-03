import { describe, it, expect, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getPreviewById: vi.fn(),
}))

vi.mock('@/lib/fetchers/visualizer.fetchers', () => ({
    getPreviewById: mocks.getPreviewById,
}))

import { GET } from '@/app/api/visualizer/previews/[previewId]/route'
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

    it('returns preview payload with cache headers when found', async () => {
        const mocked = vi.mocked(getPreviewById)
        mocked.mockResolvedValueOnce({
            id: 'preview-1',
            status: 'complete',
            processedImageUrl: 'https://cdn.example/preview.png',
        } as never)

        const context: Parameters<typeof GET>[1] = {
            params: Promise.resolve({ previewId: 'preview-1' }),
        }

        const res = await GET(new Request('https://example.test'), context)

        expect(res.status).toBe(200)
        expect(res.headers.get('Cache-Control')).toBe('public, max-age=60, stale-while-revalidate=300')
        await expect(res.json()).resolves.toEqual({
            preview: {
                id: 'preview-1',
                status: 'complete',
                processedImageUrl: 'https://cdn.example/preview.png',
            },
        })
    })

    it('returns 500 when preview lookup throws unexpectedly', async () => {
        const mocked = vi.mocked(getPreviewById)
        mocked.mockRejectedValueOnce(new Error('db unavailable'))

        const context: Parameters<typeof GET>[1] = {
            params: Promise.resolve({ previewId: 'preview-1' }),
        }

        const res = await GET(new Request('https://example.test'), context)

        expect(res.status).toBe(500)
        await expect(res.json()).resolves.toEqual({ error: 'Preview lookup failed' })
    })
})
