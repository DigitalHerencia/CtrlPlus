import { PlatformPageHeader } from '@/components/platform/platform-page-header'

import { PlatformVisualizerToolsFeature } from './platform-visualizer-tools-feature'

export async function PlatformVisualizerPageFeature() {
    return (
        <div className="space-y-6">
            <PlatformPageHeader
                title="Platform visualizer tools"
                description="Keep AI preview operations stable so customers can explore wrap concepts without friction."
            />
            <PlatformVisualizerToolsFeature />
        </div>
    )
}
