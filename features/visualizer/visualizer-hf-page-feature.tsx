import { getVisualizerHfCatalogData } from '@/lib/fetchers/visualizer.fetchers'
import { VisualizerHfConfiguratorClient } from '@/components/visualizer/visualizer-hf-configurator.client'

export async function VisualizerHfPageFeature() {
    const catalog = await getVisualizerHfCatalogData()

    return <VisualizerHfConfiguratorClient catalog={catalog} />
}
