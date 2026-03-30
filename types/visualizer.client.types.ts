import type { VisualizerWrapSelectionDTO } from '@/types/catalog.types'

export interface CreateVisualizerPreviewClientInput {
    wrapId: string
    file: File
}

export interface VisualizerWorkspaceClientProps {
    wraps: VisualizerWrapSelectionDTO[]
    initialWrapId: string | null
    canManageCatalog: boolean
}
