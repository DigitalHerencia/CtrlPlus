/**
 * @introduction Components — TODO: short one-line summary of visualizer-skeletons.tsx
 *
 * @description TODO: longer description for visualizer-skeletons.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Skeleton } from '@/components/ui/skeleton'

/**
 * VisualizerWorkspaceSkeleton — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function VisualizerWorkspaceSkeleton() {
    return (
        <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
            <div className="space-y-4">
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-128 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
            </div>
        </div>
    )
}
