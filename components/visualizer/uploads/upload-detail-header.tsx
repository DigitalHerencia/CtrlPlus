import type { VisualizerUploadSnapshot } from '@/lib/fetchers/visualizer.fetchers'

export function UploadDetailHeader({ upload }: { upload: VisualizerUploadSnapshot }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-neutral-100">Upload {upload.id.slice(0, 8)}</h2>
            <p className="text-sm text-neutral-400">Wrap ID: {upload.wrapId}</p>
        </div>
    )
}
