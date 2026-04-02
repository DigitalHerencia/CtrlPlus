import { PlatformPageHeader } from '@/components/platform/platform-page-header'

import { PlatformDbToolsFeature } from './platform-db-tools-feature'

export async function PlatformDbPageFeature() {
    return (
        <div className="space-y-6">
            <PlatformPageHeader
                title="Platform database tools"
                description="Database diagnostics and support tools for platform operators."
            />
            <PlatformDbToolsFeature />
        </div>
    )
}
