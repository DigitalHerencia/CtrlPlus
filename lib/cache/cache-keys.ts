import crypto from 'crypto'
import type { PreviewCacheKeyInput } from '@/types/visualizer.types'

export function buildVisualizerCacheKey(input: PreviewCacheKeyInput): string {
    const normalized = {
        wrapId: input.wrapId,
        ownerUserId: input.ownerUserId,
        customerPhotoHash: input.customerPhotoHash,
        sourceWrapImageId: input.sourceWrapImageId,
        sourceAssetVersion: input.sourceAssetVersion,
        generationMode: input.generationMode,
        generationModel: input.generationModel,
        promptVersion: input.promptVersion,
        blendMode: input.blendMode ?? 'multiply',
        opacity: Number((input.opacity ?? 0.6).toFixed(2)),
    }

    return crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex')
}
