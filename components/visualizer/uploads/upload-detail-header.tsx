import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import type { VisualizerUploadSnapshot } from '@/types/visualizer.types'

export function UploadDetailHeader({ upload }: { upload: VisualizerUploadSnapshot }) {
    return (
        <WorkspacePageIntro
            label="Visualizer"
            title={`Upload ${upload.id.slice(0, 8)}`}
            description="Review the source vehicle image and reuse it when generating additional previews."
        />
    )
}
