import { describe, expect, it } from 'vitest'

import { readPhotoBuffer } from '@/lib/uploads/image-processing'

describe('readPhotoBuffer', () => {
    it('supports legacy data URLs for stored customer photos', async () => {
        const source = Buffer.from('legacy-preview-bytes')
        const result = await readPhotoBuffer(`data:image/png;base64,${source.toString('base64')}`)

        expect(result.contentType).toBe('image/png')
        expect(result.buffer.equals(source)).toBe(true)
    })
})
