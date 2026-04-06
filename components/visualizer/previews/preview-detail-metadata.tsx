import type { VisualizerPreviewDTO } from '@/types/visualizer.types'

export function PreviewDetailMetadata({ preview }: { preview: VisualizerPreviewDTO }) {
    return (
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/90 p-4 text-sm text-neutral-300">
            <div>Wrap ID: {preview.wrapId}</div>
            <div>Upload ID: {preview.uploadId}</div>
            <div>Cache Key: {preview.cacheKey}</div>
            <div>Reference Signature: {preview.referenceSignature}</div>
            <div>Generation Mode: {preview.generationMode}</div>
            <div>Generation Model: {preview.generationModel ?? 'n/a'}</div>
        </div>
    )
}
