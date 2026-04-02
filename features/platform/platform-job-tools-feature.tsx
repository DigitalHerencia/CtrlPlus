import { PlatformJobToolsPanel } from '@/components/platform/platform-job-tools-panel'
import { getPlatformJobToolsState } from '@/lib/fetchers/platform.fetchers'

export async function PlatformJobToolsFeature() {
    const tools = await getPlatformJobToolsState()

    return <PlatformJobToolsPanel tools={tools} />
}
