import { VisualizerWorkspacePageFeature } from '@/features/visualizer/visualizer-workspace-page-feature'

export async function NewPreviewPageFeature() {
    return (
        <VisualizerWorkspacePageFeature
            requestedWrapId={null}
            canManageCatalog={false}
            includeHidden={false}
        />
    )
}
