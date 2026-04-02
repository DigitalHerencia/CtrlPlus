import { getSession } from '@/lib/auth/session'
import { hasCapability, requireCapability } from '@/lib/authz/policy'
import { VisualizerWorkspacePageFeature } from '@/features/visualizer/visualizer-workspace-page-feature'
import { parseVisualizerSearchParams } from '@/lib/utils/search-params'
import type { VisualizerPageProps } from '@/types/visualizer.types'
import { redirect } from 'next/navigation'

export default async function VisualizerPage({ searchParams }: VisualizerPageProps) {
    const session = await getSession()
    if (!session.isAuthenticated) {
        redirect('/sign-in')
    }

    requireCapability(session.authz, 'visualizer.use')

    const canManageCatalog = hasCapability(session.authz, 'catalog.manage')
    const includeHidden = session.isOwner || session.isPlatformAdmin
    const { requestedWrapId } = parseVisualizerSearchParams(await searchParams)

    return (
        <VisualizerWorkspacePageFeature
            requestedWrapId={requestedWrapId}
            canManageCatalog={canManageCatalog}
            includeHidden={includeHidden}
        />
    )
}
