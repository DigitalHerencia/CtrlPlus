import 'server-only'

import {
    getVisualizerSelectableWrapById,
    listVisualizerSelectableWraps,
    type WrapVisibilityScope,
} from '@/lib/catalog/fetchers/get-wraps'

export async function getVisualizerWrapSelectionById(
    wrapId: string,
    scope: WrapVisibilityScope = {}
) {
    return getVisualizerSelectableWrapById(wrapId, scope)
}

export async function listVisualizerWrapSelections(scope: WrapVisibilityScope = {}) {
    return listVisualizerSelectableWraps(scope)
}
