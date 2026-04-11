/**
 * @introduction Cache — TODO: short one-line summary of visualizer-cache.ts
 *
 * @description TODO: longer description for visualizer-cache.ts. Keep it short — one or two sentences.
 * Domain: cache
 * Public: TODO (yes/no)
 */
const DEFAULT_VISUALIZER_PREVIEW_TTL_MS = 24 * 60 * 60 * 1000

function parsePositiveInteger(value: string | undefined): number | null {
    if (!value) {
        return null
    }

    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null
    }

    return Math.trunc(parsed)
}

/**
 * getVisualizerPreviewTtlMs — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function getVisualizerPreviewTtlMs(): number {
    return (
        parsePositiveInteger(process.env.VISUALIZER_PREVIEW_TTL_MS?.trim()) ??
        DEFAULT_VISUALIZER_PREVIEW_TTL_MS
    )
}

/**
 * getVisualizerPreviewExpiresAt — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function getVisualizerPreviewExpiresAt(referenceDate = new Date()): Date {
    return new Date(referenceDate.getTime() + getVisualizerPreviewTtlMs())
}
