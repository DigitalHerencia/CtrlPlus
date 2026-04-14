import { getVisualizerHfCatalogData } from '@/lib/fetchers/visualizer.fetchers'
import { VisualizerHfConfiguratorClient } from '@/components/visualizer/visualizer-hf-configurator.client'
import { generateVisualizerHfPreviewAction } from '@/lib/actions/visualizer.actions'

interface VisualizerHfPageFeatureProps {
    requestedWrapId: string | null
    canViewPrompt: boolean
}

export async function VisualizerHfPageFeature({
    requestedWrapId,
    canViewPrompt,
}: VisualizerHfPageFeatureProps) {
    const catalog = await getVisualizerHfCatalogData(requestedWrapId)

    return (
        <VisualizerHfConfiguratorClient
            catalog={catalog}
            canViewPrompt={canViewPrompt}
            onGeneratePreview={generateVisualizerHfPreviewAction}
        />
    )
}
