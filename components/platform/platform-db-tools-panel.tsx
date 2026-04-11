/**
 * @introduction Components — TODO: short one-line summary of platform-db-tools-panel.tsx
 *
 * @description TODO: longer description for platform-db-tools-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { PlatformActionPanel } from '@/components/platform/platform-action-panel'

import type { PlatformToolCardDTO } from '@/types/platform.types'

interface PlatformDbToolsPanelProps {
    tools: PlatformToolCardDTO[]
}

/**
 * PlatformDbToolsPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function PlatformDbToolsPanel({ tools }: PlatformDbToolsPanelProps) {
    return (
        <PlatformActionPanel
            title="Database support tools"
            description="Operational DB diagnostics and maintenance support controls."
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
