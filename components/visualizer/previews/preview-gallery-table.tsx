import type { VisualizerPreviewDTO } from '@/types/visualizer.types'
import { PreviewGalleryGrid } from './preview-gallery-grid'
import { PreviewCard } from './preview-card'

export function PreviewGalleryTable({ previews }: { previews: VisualizerPreviewDTO[] }) {
    if (previews.length === 0) {
        return <p className="text-sm text-neutral-400">No previews yet.</p>
    }

    return (
        <PreviewGalleryGrid>
            {previews.map((preview) => (
                <PreviewCard key={preview.id} preview={preview} />
            ))}
        </PreviewGalleryGrid>
    )
}
