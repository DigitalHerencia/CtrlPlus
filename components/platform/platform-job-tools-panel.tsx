
import { PlatformActionPanel } from '@/components/platform/platform-action-panel'

import type { PlatformToolCardDTO } from '@/types/platform.types'

interface PlatformJobToolsPanelProps {
    tools: PlatformToolCardDTO[]
}


export function PlatformJobToolsPanel({ tools }: PlatformJobToolsPanelProps) {
    return (
        <PlatformActionPanel
            title="Job controls"
            description="Bounded operational jobs for safe recovery and maintenance."
        >
            <div className="grid gap-3 md:grid-cols-2">
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
