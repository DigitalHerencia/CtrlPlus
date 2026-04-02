import { UploadGalleryHeader } from '@/components/visualizer/uploads/upload-gallery-header'
import { UploadGalleryTable } from '@/components/visualizer/uploads/upload-gallery-table'
import { listMyVisualizerUploads } from '@/lib/fetchers/visualizer.fetchers'

export async function UploadGalleryPageFeature() {
    const uploads = await listMyVisualizerUploads()

    return (
        <div className="space-y-6">
            <UploadGalleryHeader />
            <UploadGalleryTable uploads={uploads} />
        </div>
    )
}
