import type { VisualizerPreviewDTO } from '@/types/visualizer.types'

export function PreviewDetailMetadata({ preview }: { preview: VisualizerPreviewDTO }) {
    return (
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/90 p-4 text-sm text-neutral-300">
            <div>Wrap ID: {preview.wrapId}</div>
            <div>Cache Key: {preview.cacheKey}</div>
            <div>Source Texture: {preview.sourceWrapImageId}</div>
        </div>
    )
}
