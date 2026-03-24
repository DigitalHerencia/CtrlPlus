import { Skeleton } from '@/components/ui/skeleton'

export function BillingPageSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-none border border-neutral-700 bg-neutral-950/80" />
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28 rounded-none border border-neutral-700 bg-neutral-950/80" />
                <Skeleton className="h-28 rounded-none border border-neutral-700 bg-neutral-950/80" />
                <Skeleton className="h-28 rounded-none border border-neutral-700 bg-neutral-950/80" />
            </div>
            <Skeleton className="h-96 w-full rounded-none border border-neutral-700 bg-neutral-950/80" />
        </div>
    )
}
