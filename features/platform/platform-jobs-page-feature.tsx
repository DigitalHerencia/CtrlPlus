import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

import { PlatformJobToolsFeature } from './platform-job-tools-feature'

export async function PlatformJobsPageFeature() {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Platform"
                title="Platform jobs"
                description="Control background operations with clear safeguards so customer-facing experiences remain smooth and predictable."
            />
            <PlatformJobToolsFeature />
        </div>
    )
}
