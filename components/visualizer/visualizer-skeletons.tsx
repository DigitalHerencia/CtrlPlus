import { Skeleton } from '@/components/ui/skeleton'

export function VisualizerWorkspaceSkeleton() {
    return (
        <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
            <div className="space-y-4">
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-[32rem] rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
            </div>
        </div>
    )
}
