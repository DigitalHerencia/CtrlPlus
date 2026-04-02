import type { VisualizerUploadSnapshot } from '@/types/visualizer.types'

import { UploadCard } from './upload-card'
import { UploadGalleryGrid } from './upload-gallery-grid'

export function UploadGalleryTable({ uploads }: { uploads: VisualizerUploadSnapshot[] }) {
    if (uploads.length === 0) {
        return <p className="text-sm text-neutral-400">No uploads yet.</p>
    }

    return (
        <UploadGalleryGrid>
            {uploads.map((upload) => (
                <UploadCard key={upload.id} upload={upload} />
            ))}
        </UploadGalleryGrid>
    )
}
