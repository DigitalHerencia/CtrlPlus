/**
 * @introduction Cache — TODO: short one-line summary of cache-keys.ts
 *
 * @description TODO: longer description for cache-keys.ts. Keep it short — one or two sentences.
 * Domain: cache
 * Public: TODO (yes/no)
 */
import crypto from 'crypto'
import type { PreviewCacheKeyInput } from '@/types/visualizer.types'

/**
 * buildVisualizerCacheKey — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function buildVisualizerCacheKey(input: PreviewCacheKeyInput): string {
    const normalized = {
        wrapId: input.wrapId,
        ownerUserId: input.ownerUserId,
        customerPhotoHash: input.customerPhotoHash,
        uploadId: input.uploadId,
        referenceSignature: input.referenceSignature,
        generationMode: input.generationMode,
        generationModel: input.generationModel,
        promptVersion: input.promptVersion,
    }

    return crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex')
}
