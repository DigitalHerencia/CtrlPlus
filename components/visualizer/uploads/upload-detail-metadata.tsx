import type { VisualizerUploadSnapshot } from '@/types/visualizer.types'

export function UploadDetailMetadata({ upload }: { upload: VisualizerUploadSnapshot }) {
    return (
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/90 p-4 text-sm text-neutral-300">
            <div>Created: {new Date(upload.createdAt).toLocaleString()}</div>
            <div>Updated: {new Date(upload.updatedAt).toLocaleString()}</div>
            <div>MIME Type: {upload.mimeType ?? 'unknown'}</div>
            <div>
                Dimensions:{' '}
                {upload.width && upload.height ? `${upload.width} x ${upload.height}` : 'unknown'}
            </div>
        </div>
    )
}
