import { PlatformPageHeader } from '@/components/platform/platform-page-header'

import { PlatformJobToolsFeature } from './platform-job-tools-feature'

export async function PlatformJobsPageFeature() {
    return (
        <div className="space-y-6">
            <PlatformPageHeader
                title="Platform jobs"
                description="Operational job controls for safe, auditable maintenance actions."
            />
            <PlatformJobToolsFeature />
        </div>
    )
}
