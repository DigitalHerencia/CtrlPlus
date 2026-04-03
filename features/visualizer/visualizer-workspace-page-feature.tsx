import Link from 'next/link'
import { Suspense } from 'react'

import { VisualizerWorkspaceSkeleton } from '@/components/visualizer/visualizer-skeletons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { VisualizerPageFeatureProps } from '@/types/visualizer.types'
import { VisualizerWorkspaceShellClient } from './visualizer-workspace-shell.client'
import { getVisualizerWorkspaceData } from './visualizer-workspace-parts'

function VisualizerWorkspaceErrorState({ canManageCatalog }: { canManageCatalog: boolean }) {
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

export function VisualizerWorkspacePageFeature({
    requestedWrapId,
    canManageCatalog,
    includeHidden,
}: VisualizerPageFeatureProps) {
    return (
        <Suspense fallback={<VisualizerWorkspaceSkeleton />}>
            <VisualizerWorkspaceBoundary
                requestedWrapId={requestedWrapId}
                canManageCatalog={canManageCatalog}
                includeHidden={includeHidden}
            />
        </Suspense>
    )
}

async function loadVisualizerWorkspaceBoundaryData(props: VisualizerPageFeatureProps) {
    try {
        return {
            state: 'ready' as const,
            ...(await getVisualizerWorkspaceData(props)),
        }
    } catch {
        return {
            state: 'error' as const,
        }
    }
}

async function VisualizerWorkspaceBoundary(props: VisualizerPageFeatureProps) {
    const result = await loadVisualizerWorkspaceBoundaryData(props)

    if (result.state === 'error') {
        return <VisualizerWorkspaceErrorState canManageCatalog={props.canManageCatalog} />
    }

    return (
        <VisualizerWorkspaceShellClient
            wraps={result.wraps}
            initialWrapId={result.initialWrapId}
            canManageCatalog={props.canManageCatalog}
        />
    )
}
