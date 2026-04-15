
import { PlatformActionPanel } from '@/components/platform/platform-action-panel'

import type { PlatformToolCardDTO } from '@/types/platform.types'

interface PlatformVisualizerToolsPanelProps {
    tools: PlatformToolCardDTO[]
}


export function PlatformVisualizerToolsPanel({ tools }: PlatformVisualizerToolsPanelProps) {
    return (
        <PlatformActionPanel
            title="Visualizer maintenance"
            description="Preview lifecycle support and asset cleanup controls."
        >
            <div className="space-y-3">
                {tools.map((tool) => (
                    <div key={tool.id} className="border border-neutral-800 bg-neutral-900/60 p-3">
                        <p className="text-sm font-medium text-neutral-100">{tool.title}</p>
                        <p className="mt-1 text-xs text-neutral-400">{tool.description}</p>
                    </div>
                ))}
            </div>
        </PlatformActionPanel>
    )
}
