import { Skeleton } from '@/components/ui/skeleton'

export function VisualizerWorkspaceSkeleton() {
    return (
        <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
            <div className="space-y-4">
                <Skeleton className="h-12" />
                <Skeleton className="h-64" />
                <Skeleton className="h-12" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-128" />
                <Skeleton className="h-24" />
            </div>
        </div>
    )
}
