'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { updateBookingDraftFromVisualizer } from '@/lib/actions/scheduling.actions'
import { WRAP_CATALOG } from '@/lib/constants/visualizer/wrap-catalog'
import { getVisualizerSelectableWrapById } from '@/lib/fetchers/catalog.fetchers'
import { getVisualizerHfCatalogData } from '@/lib/fetchers/visualizer.fetchers'
import { generateVisualizerHfPreviewSchema } from '@/schemas/visualizer.schemas'
import { generateVehicleWrapPreviewViaHfSpace } from '@/lib/visualizer/huggingface/space-client'
import { PreviewStatus } from '@/lib/constants/statuses'
import type { VisualizerWrapSelectionDTO } from '@/types/catalog.types'
import type {
    GenerateVisualizerHfPreviewInput,
    GenerateVisualizerHfPreviewResult,
} from '@/types/visualizer.types'

function normalizeVisualizerCatalogValue(value: string | null | undefined): string {
    return (value ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
}

function getWrapNameTokens(value: string | null | undefined): string[] {
    const ignoredTokens = new Set(['wrap', 'vehicle', 'finish', 'finishes'])

    return normalizeVisualizerCatalogValue(value)
        .split(' ')
        .map((token) => token.trim())
        .filter((token) => token.length > 0 && !ignoredTokens.has(token))
}

function resolveHfSpaceWrapName(
    wrap: Pick<VisualizerWrapSelectionDTO, 'name' | 'aiPromptTemplate' | 'aiNegativePrompt'>
): string {
    const normalizedName = normalizeVisualizerCatalogValue(wrap.name)
    const normalizedPromptTemplate = normalizeVisualizerCatalogValue(wrap.aiPromptTemplate)
    const normalizedNegativePrompt = normalizeVisualizerCatalogValue(wrap.aiNegativePrompt)

    for (const option of WRAP_CATALOG.wraps) {
        if (normalizeVisualizerCatalogValue(option.name) === normalizedName) {
            return option.name
        }

        if (
            normalizedPromptTemplate &&
            normalizeVisualizerCatalogValue(option.prompt_template) === normalizedPromptTemplate
        ) {
            return option.name
        }

        if (
            normalizedNegativePrompt &&
            normalizeVisualizerCatalogValue(option.style_prompt) === normalizedNegativePrompt
        ) {
            return option.name
        }
    }

    const wrapTokens = getWrapNameTokens(wrap.name)
    let bestMatch: { name: string; score: number } | null = null

    for (const option of WRAP_CATALOG.wraps) {
        const optionTokens = getWrapNameTokens(option.name)
        if (wrapTokens.length === 0 || optionTokens.length === 0) {
            continue
        }

        const overlap = wrapTokens.filter((token) => optionTokens.includes(token)).length
        const score = overlap / Math.max(wrapTokens.length, optionTokens.length)

        if (overlap < 2 || score < 0.66) {
            continue
        }

        if (!bestMatch || score > bestMatch.score) {
            bestMatch = { name: option.name, score }
        }
    }

    if (bestMatch) {
        return bestMatch.name
    }

    return wrap.name
}

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

    if (!catalog.wraps.some((wrap) => wrap.id === input.wrapId)) {
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
    const [catalog, wrap] = await Promise.all([
        getVisualizerHfCatalogData(parsed.wrapId),
        getVisualizerSelectableWrapById(parsed.wrapId, {
            includeHidden: session.isOwner || session.isPlatformAdmin,
        }),
    ])

    assertSelectionIsValid(parsed, catalog)

    if (!wrap) {
        throw new Error('Invalid wrap selection.')
    }

    const hfSpaceWrapName = resolveHfSpaceWrapName(wrap)

    try {
        const result = await generateVehicleWrapPreviewViaHfSpace({
            make: parsed.make,
            model: parsed.model,
            year: parsed.year,
            trim: parsed.trim,
            wrapName: hfSpaceWrapName,
        })

        await updateBookingDraftFromVisualizer({
            wrapId: wrap.id,
            vehicleMake: parsed.make,
            vehicleModel: parsed.model,
            vehicleYear: parsed.year,
            vehicleTrim: parsed.trim,
            previewImageUrl: result.imageUrl,
            previewPromptUsed: result.promptUsed,
            previewStatus: PreviewStatus.COMPLETE,
        })

        return {
            wrapId: wrap.id,
            wrapName: wrap.name,
            imageUrl: result.imageUrl,
            promptUsed: result.promptUsed,
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)

        console.error('generateVisualizerHfPreviewAction failed', {
            wrapId: wrap.id,
            make: parsed.make,
            model: parsed.model,
            year: parsed.year,
            trim: parsed.trim,
            reason: message,
        })

        await updateBookingDraftFromVisualizer({
            wrapId: wrap.id,
            vehicleMake: parsed.make,
            vehicleModel: parsed.model,
            vehicleYear: parsed.year,
            vehicleTrim: parsed.trim,
            previewStatus: PreviewStatus.FAILED,
        })

        if (message.includes('space_catalog_mismatch:')) {
            throw new Error(
                'Visualizer preview service catalog is out of sync. Please redeploy the HF Space and retry.'
            )
        }

        if (message.includes('space_queue_timeout:')) {
            throw new Error('Preview generation timed out. Please retry in a moment.')
        }

        if (message.includes('space_endpoint_not_found:')) {
            throw new Error(
                'Preview service endpoint is misconfigured. Check the HF Space API configuration and redeploy the Space.'
            )
        }

        if (message.includes('space_response_invalid:')) {
            throw new Error(
                'Preview service returned an unexpected response. Please retry, or contact support if it continues.'
            )
        }

        if (message.includes('provider_unavailable:')) {
            throw new Error('Preview service is temporarily unavailable. Please try again shortly.')
        }

        throw new Error('Preview generation failed. Please try again.')
    }
}
