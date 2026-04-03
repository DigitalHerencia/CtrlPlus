import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="mb-6 space-y-2">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-8 w-48 rounded" />
                <Skeleton className="h-4 w-96 rounded" />
            </div>

            {/* Filters skeleton */}
            <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded" />
                <Skeleton className="h-10 w-24 rounded" />
            </div>

            {/* Grid skeleton */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-56 rounded" />
                ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded" />
                    <Skeleton className="h-10 w-10 rounded" />
                    <Skeleton className="h-10 w-10 rounded" />
                </div>
            </div>
        </div>
    )
}
