'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { getVisualizerHfCatalogData } from '@/lib/fetchers/visualizer.fetchers'
import { generateVisualizerHfPreviewSchema } from '@/schemas/visualizer.schemas'
import { generateVehicleWrapPreviewViaHfSpace } from '@/lib/visualizer/huggingface/space-client'
import type {
    GenerateVisualizerHfPreviewInput,
    GenerateVisualizerHfPreviewResult,
} from '@/types/visualizer.types'

function assertSelectionIsValid(
    input: GenerateVisualizerHfPreviewInput,
    catalog: Awaited<ReturnType<typeof getVisualizerHfCatalogData>>
): void {
    const makeNode = catalog.vehicleIndex[input.make]
    if (!makeNode) {
        throw new Error('Invalid make selection.')
    }

    const modelNode = makeNode[input.model]
    if (!modelNode) {
        throw new Error('Invalid model selection for make.')
    }

    const yearNode = modelNode[input.year]
    if (!yearNode) {
        throw new Error('Invalid year selection for model.')
    }

    if (!yearNode.includes(input.trim)) {
        throw new Error('Invalid trim selection for year.')
    }

    const wrap = catalog.wraps.find((option) => option.name === input.wrapName)
    if (!wrap) {
        throw new Error('Invalid wrap selection.')
    }
}

export async function generateVisualizerHfPreviewAction(
    input: GenerateVisualizerHfPreviewInput
): Promise<GenerateVisualizerHfPreviewResult> {
    const session = await getSession()
    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    requireCapability(session.authz, 'visualizer.use')

    const parsed = generateVisualizerHfPreviewSchema.parse(input)
    const catalog = await getVisualizerHfCatalogData()

    assertSelectionIsValid(parsed, catalog)

    try {
        return await generateVehicleWrapPreviewViaHfSpace({
            make: parsed.make,
            model: parsed.model,
            year: parsed.year,
            trim: parsed.trim,
            wrapName: parsed.wrapName,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)

        if (message.includes('space_catalog_mismatch:')) {
            throw new Error(
                'Visualizer preview service catalog is out of sync. Please redeploy the HF Space and retry.'
            )
        }

        throw new Error('Preview generation failed. Please try again.')
    }
}
