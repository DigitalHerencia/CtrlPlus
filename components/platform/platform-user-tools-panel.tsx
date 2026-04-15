
import { PlatformActionPanel } from '@/components/platform/platform-action-panel'

interface PlatformUserToolsPanelProps {
    notes?: string
}


export function PlatformUserToolsPanel({ notes }: PlatformUserToolsPanelProps) {
    return (
        <PlatformActionPanel
            title="User and tooling support"
            description="Operational guidance for platform-safe support workflows."
        >
            <p className="text-sm text-neutral-300">
                {notes ??
                    'Use this surface to coordinate support actions with strict ownership, authz, and audit trails enforced server-side.'}
            </p>
        </PlatformActionPanel>
    )
}
