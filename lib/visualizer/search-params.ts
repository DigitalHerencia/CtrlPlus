import { z } from 'zod'

const visualizerSearchParamsSchema = z.object({
    wrapId: z.string().min(1).optional(),
})

export interface VisualizerSearchParamsResult {
    requestedWrapId: string | null
}

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
