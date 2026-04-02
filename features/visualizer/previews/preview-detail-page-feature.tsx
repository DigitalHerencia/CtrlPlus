import { notFound } from 'next/navigation'

import { PreviewDetailCanvas } from '@/components/visualizer/previews/preview-detail-canvas'
import { PreviewDetailHeader } from '@/components/visualizer/previews/preview-detail-header'
import { PreviewDetailMetadata } from '@/components/visualizer/previews/preview-detail-metadata'
import { getPreviewById } from '@/lib/fetchers/visualizer.fetchers'

interface PreviewDetailPageFeatureProps {
    previewId: string
}

export async function PreviewDetailPageFeature({ previewId }: PreviewDetailPageFeatureProps) {
    const preview = await getPreviewById(previewId)

    if (!preview) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <PreviewDetailHeader preview={preview} />
            <PreviewDetailCanvas preview={preview} />
            <PreviewDetailMetadata preview={preview} />
        </div>
    )
}
