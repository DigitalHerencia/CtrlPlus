import { getVisualizerHfCatalogData } from '@/lib/fetchers/visualizer.fetchers'
import { VisualizerHfConfiguratorClient } from '@/components/visualizer/visualizer-hf-configurator.client'

interface VisualizerHfPageFeatureProps {
    requestedWrapId: string | null
}

export async function VisualizerHfPageFeature({ requestedWrapId }: VisualizerHfPageFeatureProps) {
    const catalog = await getVisualizerHfCatalogData(requestedWrapId)

    return <VisualizerHfConfiguratorClient catalog={catalog} />
}
