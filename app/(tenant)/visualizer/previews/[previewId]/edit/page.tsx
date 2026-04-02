import { EditPreviewPageFeature } from '@/features/visualizer/previews/edit-preview-page-feature'

interface EditPreviewPageProps {
    params: Promise<{ previewId: string }>
}

export default async function VisualizerEditPreviewPage({ params }: EditPreviewPageProps) {
    const { previewId } = await params

    return <EditPreviewPageFeature previewId={previewId} />
}
