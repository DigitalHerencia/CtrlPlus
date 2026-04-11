/**
 * @introduction Components — TODO: short one-line summary of billing-invoice-detail-skeleton.tsx
 *
 * @description TODO: longer description for billing-invoice-detail-skeleton.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Skeleton } from '@/components/ui/skeleton'

/**
 * BillingInvoiceDetailSkeleton — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BillingInvoiceDetailSkeleton() {
    return (
        <div className="max-w-4xl space-y-6">
            <Skeleton className="h-40 w-full rounded-none border border-neutral-700 bg-neutral-950/80" />
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28 rounded-none border border-neutral-700 bg-neutral-950/80" />
                <Skeleton className="h-28 rounded-none border border-neutral-700 bg-neutral-950/80" />
                <Skeleton className="h-28 rounded-none border border-neutral-700 bg-neutral-950/80" />
            </div>
            <Skeleton className="h-52 w-full rounded-none border border-neutral-700 bg-neutral-950/80" />
            <Skeleton className="h-72 w-full rounded-none border border-neutral-700 bg-neutral-950/80" />
        </div>
    )
}
