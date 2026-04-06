import crypto from 'crypto'
import type { PreviewCacheKeyInput } from '@/types/visualizer.types'

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
