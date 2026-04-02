import { notFound } from 'next/navigation'

import { UploadDetailHeader } from '@/components/visualizer/uploads/upload-detail-header'
import { UploadDetailMetadata } from '@/components/visualizer/uploads/upload-detail-metadata'
import { UploadDetailPreview } from '@/components/visualizer/uploads/upload-detail-preview'
import { getMyVisualizerUploadById } from '@/lib/fetchers/visualizer.fetchers'

interface UploadDetailPageFeatureProps {
    uploadId: string
}

export async function UploadDetailPageFeature({ uploadId }: UploadDetailPageFeatureProps) {
    const upload = await getMyVisualizerUploadById(uploadId)

    if (!upload) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <UploadDetailHeader upload={upload} />
            <UploadDetailPreview upload={upload} />
            <UploadDetailMetadata upload={upload} />
        </div>
    )
}
