import {
    getVisualizerSelectableWrapById,
    listVisualizerSelectableWraps,
} from '@/lib/catalog/fetchers/wraps'

export type { WrapVisibilityScope } from '@/lib/catalog/fetchers/wrap-record'

export async function getVisualizerWrapSelectionById(
    wrapId: string,
    scope: import('@/lib/catalog/fetchers/wrap-record').WrapVisibilityScope = {}
) {
    return getVisualizerSelectableWrapById(wrapId, scope)
}

export async function listVisualizerWrapSelections(
    scope: import('@/lib/catalog/fetchers/wrap-record').WrapVisibilityScope = {}
) {
    return listVisualizerSelectableWraps(scope)
}
