import { visualizerSearchParamsSchema } from '@/schema/visualizer/search-schemas'
import type { VisualizerSearchParamsResult } from '@/types/visualizer/route-types'

export function parseVisualizerSearchParams(
    searchParams: Record<string, string | string[] | undefined>
): VisualizerSearchParamsResult {
    const parsed = visualizerSearchParamsSchema.safeParse({
        wrapId: typeof searchParams.wrapId === 'string' ? searchParams.wrapId : undefined,
    })

    return {
        requestedWrapId: parsed.success ? parsed.data.wrapId ?? null : null,
    }
}
