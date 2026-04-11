'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const

/**
 * BookingStatusFiltersClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingStatusFiltersClient() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentStatus = searchParams.get('status') ?? 'all'

    function applyStatus(status: (typeof FILTERS)[number]) {
        const next = new URLSearchParams(searchParams.toString())

        if (status === 'all') {
            next.delete('status')
        } else {
            next.set('status', status)
        }

        next.delete('page')

        const query = next.toString()
        router.push(query ? `${pathname}?${query}` : pathname)
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((status) => (
                <Button
                    key={status}
                    type="button"
                    size="sm"
                    variant={status === currentStatus ? 'default' : 'outline'}
                    onClick={() => applyStatus(status)}
                >
                    {status[0]!.toUpperCase() + status.slice(1)}
                </Button>
            ))}
        </div>
    )
}
