import { PlatformPageHeader } from '@/components/platform/platform-page-header'

import { PlatformDbToolsFeature } from './platform-db-tools-feature'

export async function PlatformDbPageFeature() {
    return (
        <div className="space-y-6">
            <PlatformPageHeader
                title="Platform database tools"
                description="Maintain healthy data operations so customer bookings, invoices, and previews stay dependable and fast."
            />
            <PlatformDbToolsFeature />
        </div>
    )
}
