import { UploadDetailPageFeature } from '@/features/visualizer/uploads/upload-detail-page-feature'

interface UploadDetailPageProps {
    params: Promise<{ uploadId: string }>
}

export default async function VisualizerUploadDetailPage({ params }: UploadDetailPageProps) {
    const { uploadId } = await params

    return <UploadDetailPageFeature uploadId={uploadId} />
}
