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

    it('derives preview config from the canonical client env surface', async () => {
        delete process.env.HF_API_KEY
        process.env.HUGGINGFACE_API_TOKEN = 'hf_test_token'
        process.env.HUGGINGFACE_VISUALIZER_PREVIEW_MODEL = 'legacy-preview-model'

        const configModule = await loadConfig()

        expect(configModule.visualizerConfig.huggingFaceToken).toBe('hf_test_token')
        expect(configModule.visualizerConfig.previewModel).toBe('legacy-preview-model')
    })
})
