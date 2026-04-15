
import { Skeleton } from '@/components/ui/skeleton'




export function CatalogGridSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                </div>
            ))}
        </div>
    )
}


export function CatalogHeaderSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-5 max-w-2xl rounded-lg" />
        </div>
    )
}


export function CatalogResultsSummarySkeleton() {
    return (
        <div className="space-y-2 text-right">
            <Skeleton className="w-18 ml-auto h-3 rounded" />
            <Skeleton className="ml-auto h-8 w-16 rounded-lg" />
        </div>
    )
}


export function CatalogFiltersSkeleton() {
    return (
        <div className="border border-neutral-700 bg-neutral-950/80 px-6 py-7">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_repeat(2,minmax(0,0.9fr))]">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-3 w-20 rounded" />
                        <Skeleton className="h-11 w-full rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}


export function CatalogPaginationSkeleton() {
    return (
        <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded" />
            <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded" />
                ))}
            </div>
        </div>
    )
}
