import { PlatformVisualizerToolsPanel } from '@/components/platform/platform-visualizer-tools-panel'
import { getPlatformVisualizerToolsState } from '@/lib/fetchers/platform.fetchers'

export async function PlatformVisualizerToolsFeature() {
    const tools = await getPlatformVisualizerToolsState()

    return <PlatformVisualizerToolsPanel tools={tools} />
}
