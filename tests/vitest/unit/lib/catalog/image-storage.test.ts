import { access, mkdir, rm, unlink, writeFile } from 'fs/promises'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
    MAX_WRAP_IMAGE_BYTES,
    deletePersistedWrapImage,
    persistWrapImage,
    validateWrapImageFile,
} from '@/lib/catalog/image-storage'

const originalEnv = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_WRAP_UPLOAD_PRESET: process.env.CLOUDINARY_WRAP_UPLOAD_PRESET,
    CLOUDINARY_WRAP_FOLDER: process.env.CLOUDINARY_WRAP_FOLDER,
}

const createdLocalFiles: string[] = []

function resetEnv(): void {
    const keys = Object.keys(originalEnv) as Array<keyof typeof originalEnv>
    for (const key of keys) {
        const value = originalEnv[key]
        if (value === undefined) {
            delete process.env[key]
        } else {
            process.env[key] = value
        }
    }
}

beforeEach(() => {
    resetEnv()
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
})

afterEach(async () => {
    resetEnv()
    vi.unstubAllGlobals()

    while (createdLocalFiles.length > 0) {
        const filePath = createdLocalFiles.pop()
        if (!filePath) {
            continue
        }

        try {
            await unlink(filePath)
        } catch {
            // Ignore cleanup errors.
        }
    }

    await rm(path.join(process.cwd(), 'public', 'uploads'), {
        recursive: true,
        force: true,
    }).catch(() => undefined)
})

describe('validateWrapImageFile', () => {
    it('accepts supported image files and rejects invalid payloads', () => {
        expect(() =>
            validateWrapImageFile(new File(['ok'], 'wrap.png', { type: 'image/png' }))
        ).not.toThrow()

        expect(() =>
            validateWrapImageFile(new File(['ok'], 'wrap.gif', { type: 'image/gif' }))
        ).toThrow('Unsupported image format. Allowed: JPEG, PNG, WEBP.')

        expect(() =>
            validateWrapImageFile(
                new File([new Uint8Array(MAX_WRAP_IMAGE_BYTES + 1)], 'wrap.png', {
                    type: 'image/png',
                })
            )
        ).toThrow('Image exceeds size limit of 5MB.')
    })
})

describe('persistWrapImage', () => {
    it('uploads through Cloudinary when configured', async () => {
        process.env.CLOUDINARY_CLOUD_NAME = 'demo'
        process.env.CLOUDINARY_API_KEY = 'api-key'
        process.env.CLOUDINARY_API_SECRET = 'api-secret'
        process.env.CLOUDINARY_WRAP_UPLOAD_PRESET = 'wraps-preset'
        process.env.CLOUDINARY_WRAP_FOLDER = 'ctrlplus/wraps'

        const fetchMock = vi.mocked(fetch)
        fetchMock.mockResolvedValue(
            new Response(
                JSON.stringify({
                    secure_url:
                        'https://res.cloudinary.com/demo/image/upload/v1/ctrlplus/wraps/wrap-1',
                }),
                {
                    status: 200,
                    headers: { 'content-type': 'application/json' },
                }
            )
        )

        const file = new File(['asset'], 'wrap.png', { type: 'image/png' })
        const result = await persistWrapImage({ wrapId: 'wrap-1', file })

        expect(result).toEqual({
            url: 'https://res.cloudinary.com/demo/image/upload/v1/ctrlplus/wraps/wrap-1',
            contentHash: expect.any(String),
        })
        expect(result.contentHash).toHaveLength(64)
        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.cloudinary.com/v1_1/demo/image/upload',
            expect.objectContaining({ method: 'POST' })
        )
    })

    it('falls back to local storage when Cloudinary credentials are incomplete', async () => {
        process.env.CLOUDINARY_CLOUD_NAME = 'demo'
        delete process.env.CLOUDINARY_API_KEY
        delete process.env.CLOUDINARY_API_SECRET
        process.env.CLOUDINARY_WRAP_UPLOAD_PRESET = 'wraps-preset'

        const file = new File(['asset'], 'wrap.png', { type: 'image/png' })
        const result = await persistWrapImage({ wrapId: 'wrap-credentials', file })

        expect(result.url).toMatch(/^\/uploads\/wraps\/wrap-credentials-.*\.png$/)
        expect(vi.mocked(fetch)).not.toHaveBeenCalled()
    })

    it('falls back to local storage when Cloudinary is unavailable', async () => {
        delete process.env.CLOUDINARY_CLOUD_NAME

        const file = new File(['asset'], 'wrap.png', { type: 'image/png' })
        const result = await persistWrapImage({ wrapId: 'wrap-2', file })

        expect(result.contentHash).toHaveLength(64)
        expect(result.url).toMatch(/^\/uploads\/wraps\/wrap-2-.*\.png$/)

        const fileName = result.url.split('/').at(-1)
        expect(fileName).toBeTruthy()

        const absolutePath = path.join(process.cwd(), 'public', 'uploads', 'wraps', fileName!)
        createdLocalFiles.push(absolutePath)

        await expect(access(absolutePath)).resolves.toBeUndefined()
    })
})

describe('deletePersistedWrapImage', () => {
    it('destroys Cloudinary assets when credentials and a Cloudinary URL are present', async () => {
        process.env.CLOUDINARY_CLOUD_NAME = 'demo'
        process.env.CLOUDINARY_API_KEY = 'api-key'
        process.env.CLOUDINARY_API_SECRET = 'api-secret'

        const fetchMock = vi.mocked(fetch)
        fetchMock.mockResolvedValue(new Response('', { status: 200 }))

        await deletePersistedWrapImage(
            'https://res.cloudinary.com/demo/image/upload/v1700000000/ctrlplus/wraps/wrap-3.png'
        )

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock.mock.calls[0]?.[0]).toBe(
            'https://api.cloudinary.com/v1_1/demo/image/destroy'
        )
        const body = fetchMock.mock.calls[0]?.[1]?.body as URLSearchParams
        expect(body.toString()).toContain('public_id=ctrlplus%2Fwraps%2Fwrap-3')
    })

    it('removes local assets when the URL uses the local uploads path', async () => {
        const absolutePath = path.join(process.cwd(), 'public', 'uploads', 'wraps', 'wrap-4.png')
        await unlink(absolutePath).catch(() => undefined)
        createdLocalFiles.push(absolutePath)
        await mkdir(path.dirname(absolutePath), { recursive: true })
        await writeFile(absolutePath, Buffer.from('asset'))

        await deletePersistedWrapImage('/uploads/wraps/wrap-4.png')

        await expect(access(absolutePath)).rejects.toThrow()
    })
})
