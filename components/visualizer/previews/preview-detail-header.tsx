import type { VisualizerPreviewDTO } from '@/types/visualizer.types'

export function PreviewDetailHeader({ preview }: { preview: VisualizerPreviewDTO }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-neutral-100">
                Preview {preview.id.slice(0, 8)}
            </h2>
            <p className="text-sm text-neutral-400">Status: {preview.status}</p>
        </div>
    )
}
