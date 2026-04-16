import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import type { VisualizerPageProps } from '@/types/visualizer.types'
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { VisualizerHfPageFeature } from '@/features/visualizer/visualizer-hf-page-feature'

export default async function VisualizerPage({ searchParams }: VisualizerPageProps) {
    const session = await getSession()

    if (!session.isAuthenticated) {
        redirect('/sign-in')
    }

    const resolvedSearchParams = await searchParams
    const requestedWrapId =
        typeof resolvedSearchParams.wrapId === 'string' &&
        resolvedSearchParams.wrapId.trim().length > 0
            ? resolvedSearchParams.wrapId
            : null

    const canViewPrompt = hasCapability(session.authz, 'dashboard.platform')

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 md:px-6 md:py-6">
            <WorkspacePageIntro
                label="WrapVision™"
                title="See Your Ride Transformed"
                description="Upload your vehicle and unleash AI-powered previews. Experiment with designs, tweak details, and visualize your perfect wrap before you commit."
            />

            <VisualizerHfPageFeature
                requestedWrapId={requestedWrapId}
                canViewPrompt={canViewPrompt}
            />
        </div>
    )
}
