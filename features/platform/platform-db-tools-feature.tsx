import { PlatformDbToolsPanel } from '@/components/platform/platform-db-tools-panel'
import { getPlatformDbToolsState } from '@/lib/fetchers/platform.fetchers'

export async function PlatformDbToolsFeature() {
    const tools = await getPlatformDbToolsState()

    return <PlatformDbToolsPanel tools={tools} />
}
