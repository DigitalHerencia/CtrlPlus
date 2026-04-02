import type { VisualizerUploadSnapshot } from '@/lib/fetchers/visualizer.fetchers'

export function UploadDetailMetadata({ upload }: { upload: VisualizerUploadSnapshot }) {
    return (
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/90 p-4 text-sm text-neutral-300">
            <div>Created: {new Date(upload.createdAt).toLocaleString()}</div>
            <div>Updated: {new Date(upload.updatedAt).toLocaleString()}</div>
            <div>Wrap ID: {upload.wrapId}</div>
        </div>
    )
}
