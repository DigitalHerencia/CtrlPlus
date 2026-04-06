import { afterEach, describe, expect, it, vi } from 'vitest'

const originalEnv = { ...process.env }

async function loadConfig() {
    vi.resetModules()
    return import('@/lib/integrations/huggingface')
}

describe('visualizer allowed host configuration', () => {
    afterEach(() => {
        process.env = { ...originalEnv }
        vi.restoreAllMocks()
    })

    it('includes Cloudinary when Cloudinary storage is configured', async () => {
        process.env.CLOUDINARY_URL = 'cloudinary://api-key:api-secret@ctrlplus-demo'
        process.env.VISUALIZER_ALLOWED_IMAGE_HOSTS = ''

        const configModule = await loadConfig()

        expect(configModule.visualizerConfig.allowedRemotePhotoHosts).toContain(
            'res.cloudinary.com'
        )
        expect(configModule.isAllowedRemotePhotoHost('res.cloudinary.com')).toBe(true)
    }, 15000)

    it('rejects unknown hosts when they are not explicitly allowed', async () => {
        process.env.VISUALIZER_ALLOWED_IMAGE_HOSTS = ''
        delete process.env.CLOUDINARY_CLOUD_NAME
        delete process.env.CLOUDINARY_URL
        delete process.env.CLOUD_NAME

        const configModule = await loadConfig()

        expect(configModule.isAllowedRemotePhotoHost('malicious.example')).toBe(false)
    })
})
