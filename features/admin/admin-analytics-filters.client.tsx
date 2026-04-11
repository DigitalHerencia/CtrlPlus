'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

/**
 * AdminAnalyticsFiltersClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function AdminAnalyticsFiltersClient() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const startDate = searchParams.get('startDate') ?? ''
    const endDate = searchParams.get('endDate') ?? ''

    const canApply = useMemo(() => Boolean(startDate || endDate), [startDate, endDate])

    function onSubmit(formData: FormData) {
        const params = new URLSearchParams(searchParams.toString())
        const start = String(formData.get('startDate') ?? '')
        const end = String(formData.get('endDate') ?? '')

        if (start) params.set('startDate', start)
        else params.delete('startDate')

        if (end) params.set('endDate', end)
        else params.delete('endDate')

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <form action={onSubmit} className="flex flex-wrap items-end gap-3">
            <label className="grid gap-1 text-xs text-neutral-400">
                Start date
                <input
                    type="date"
                    name="startDate"
                    defaultValue={startDate}
                    className="rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
                />
            </label>
            <label className="grid gap-1 text-xs text-neutral-400">
                End date
                <input
                    type="date"
                    name="endDate"
                    defaultValue={endDate}
                    className="rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
                />
            </label>
            <button
                type="submit"
                disabled={!canApply}
                className="rounded border border-neutral-700 px-3 py-2 text-sm text-neutral-100 disabled:opacity-50"
            >
                Apply
            </button>
        </form>
    )
}
