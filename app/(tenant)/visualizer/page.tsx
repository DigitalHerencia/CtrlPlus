import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import type { VisualizerPageProps } from '@/types/visualizer.types'
import { VisualizerHfPageFeature } from '@/features/visualizer/visualizer-hf-page-feature'
import { redirect } from 'next/navigation'

export default async function VisualizerPage({ searchParams }: VisualizerPageProps) {
    const session = await getSession()
    if (!session.isAuthenticated) {
        redirect('/sign-in')
    }

    requireCapability(session.authz, 'visualizer.use')

    const resolvedSearchParams = await searchParams
    const requestedWrapId =
        typeof resolvedSearchParams.wrapId === 'string' && resolvedSearchParams.wrapId.trim().length > 0
            ? resolvedSearchParams.wrapId
            : null

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:px-6 md:py-6">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/90 p-4 shadow-sm md:p-5">
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">
                    Visualizer
                </h1>
                <p className="mt-1 text-sm text-neutral-400">
                    Preview the wrap you selected, tune the vehicle details, and carry the result straight into booking.
                </p>
            </div>

            <VisualizerHfPageFeature requestedWrapId={requestedWrapId} />
        </div>
    )
}
