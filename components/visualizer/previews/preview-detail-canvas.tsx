import type { VisualizerPreviewDTO } from '@/types/visualizer.types'
import { PreviewCanvas } from '@/components/visualizer/PreviewCanvas'

export function PreviewDetailCanvas({ preview }: { preview: VisualizerPreviewDTO }) {
    return <PreviewCanvas preview={preview} />
}
