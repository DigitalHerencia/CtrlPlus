import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

import { PlatformDbToolsFeature } from './platform-db-tools-feature'

export async function PlatformDbPageFeature() {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Platform"
                title="Platform database tools"
                description="Maintain healthy data operations so customer bookings, invoices, and previews stay dependable and fast."
            />
            <PlatformDbToolsFeature />
        </div>
    )
}
