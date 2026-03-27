import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    getVisualizerWrapSelectionById,
    listVisualizerWrapSelections,
} from '@/lib/visualizer/fetchers/get-wrap-selections'
import { type VisualizerPageFeatureProps } from '@/types/visualizer'
import { VisualizerWorkspaceClient } from './visualizer-workspace-client'

export async function VisualizerPageFeature({
    requestedWrapId,
    canManageCatalog,
    includeHidden,
}: VisualizerPageFeatureProps) {
    try {
        const [wraps, requestedWrap] = await Promise.all([
            listVisualizerWrapSelections({ includeHidden }),
            requestedWrapId
                ? getVisualizerWrapSelectionById(requestedWrapId, { includeHidden })
                : Promise.resolve(null),
        ])

        const initialWrapId = requestedWrap?.id ?? wraps[0]?.id ?? null

        return (
            <VisualizerWorkspaceClient
                wraps={wraps}
                initialWrapId={initialWrapId}
                canManageCatalog={canManageCatalog}
            />
        )
    } catch {
        return (
            <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
                <CardContent className="space-y-4 py-12 text-center">
                    <p className="text-sm text-neutral-400">Failed to load visualizer wraps.</p>
                    {canManageCatalog ? (
                        <Button asChild variant="outline">
                            <Link href="/catalog/manage">Open Catalog Manager</Link>
                        </Button>
                    ) : null}
                </CardContent>
            </Card>
        )
    }
}
