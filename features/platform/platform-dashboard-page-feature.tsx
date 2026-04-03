import { PlatformPageHeader } from '@/components/platform/platform-page-header'
import { PlatformUserToolsPanel } from '@/components/platform/platform-user-tools-panel'

import { PlatformDbToolsFeature } from './platform-db-tools-feature'
import { PlatformHealthOverviewFeature } from './platform-health-overview-feature'
import { PlatformJobToolsFeature } from './platform-job-tools-feature'
import { PlatformVisualizerToolsFeature } from './platform-visualizer-tools-feature'
import { PlatformWebhookMonitorFeature } from './platform-webhook-monitor-feature'

export async function PlatformDashboardPageFeature() {
    return (
        <div className="space-y-8" aria-label="Platform dashboard">
            <PlatformHealthOverviewFeature />
            <PlatformWebhookMonitorFeature />
            <PlatformJobToolsFeature />
            <PlatformDbToolsFeature />
            <PlatformVisualizerToolsFeature />
            <PlatformUserToolsPanel />
        </div>
    )
}
