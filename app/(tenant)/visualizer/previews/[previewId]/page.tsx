import { PreviewDetailPageFeature } from '@/features/visualizer/previews/preview-detail-page-feature'

interface PreviewDetailPageProps {
    params: Promise<{ previewId: string }>
}

export default async function VisualizerPreviewDetailPage({ params }: PreviewDetailPageProps) {
    const { previewId } = await params

    return <PreviewDetailPageFeature previewId={previewId} />
}
