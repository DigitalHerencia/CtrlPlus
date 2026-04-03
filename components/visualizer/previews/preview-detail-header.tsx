import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import type { VisualizerPreviewDTO } from '@/types/visualizer.types'

export function PreviewDetailHeader({ preview }: { preview: VisualizerPreviewDTO }) {
    return (
        <WorkspacePageIntro
            label="Visualizer"
            title={`Preview ${preview.id.slice(0, 8)}`}
            description={`Track generation progress and validate this concept render before sharing it with your customer. Status: ${preview.status}.`}
        />
    )
}
