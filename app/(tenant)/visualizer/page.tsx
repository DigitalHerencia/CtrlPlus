import { VisualizerClient } from '@/components/visualizer/VisualizerClient'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import {
    getVisualizerWrapSelectionById,
    listVisualizerWrapSelections,
} from '@/lib/visualizer/fetchers/get-wrap-selections'
import { redirect } from 'next/navigation'

interface VisualizerPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function VisualizerPage({ searchParams }: VisualizerPageProps) {
    const session = await getSession()
    if (!session.isAuthenticated) {
        redirect('/sign-in')
    }

    const canManageCatalog = hasCapability(session.authz, 'catalog.manage')
    const includeHidden = session.isOwner || session.isPlatformAdmin
    const parsedSearchParams = await searchParams
    const requestedWrapId =
        typeof parsedSearchParams.wrapId === 'string' ? parsedSearchParams.wrapId : null

    let wraps: Awaited<ReturnType<typeof listVisualizerWrapSelections>> = []
    let selectedWrapId: string | null = null
    let error: string | null = null

    try {
        wraps = await listVisualizerWrapSelections({ includeHidden })
        if (requestedWrapId) {
            const requestedWrap = await getVisualizerWrapSelectionById(requestedWrapId, {
                includeHidden,
            })
            selectedWrapId = requestedWrap?.id ?? null
        }
    } catch {
        error = 'Failed to load wraps.'
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="text-red-600">{error}</div>
            </div>
        )
    }

    if (!wraps || wraps.length === 0) {
        return (
            <div className="space-y-6">
                <div className="text-neutral-400">No wraps found.</div>
            </div>
        )
    }

    return (
        <VisualizerClient
            wraps={wraps}
            initialWrapId={selectedWrapId}
            canManageCatalog={canManageCatalog}
        />
    )
}
