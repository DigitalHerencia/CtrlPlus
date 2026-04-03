import { Skeleton } from '@/components/ui/skeleton'

export default function TenantLoading() {
    return (
        <div className="flex min-h-screen bg-neutral-900 text-neutral-100">
            {/* Sidebar skeleton */}
            <aside className="hidden w-48 border-r border-neutral-800 p-4 md:block">
                <Skeleton className="mb-4 h-8 w-full rounded" />
                <div className="space-y-3">
                    <Skeleton className="h-10 rounded" />
                    <Skeleton className="h-10 rounded" />
                    <Skeleton className="h-10 rounded" />
                    <Skeleton className="h-10 rounded" />
                </div>
            </aside>

            {/* Main content skeleton */}
            <main className="flex-1 p-6">
                <Skeleton className="mb-6 h-8 w-1/3 rounded" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded" />
                    ))}
                </div>
            </main>
        </div>
    )
}
