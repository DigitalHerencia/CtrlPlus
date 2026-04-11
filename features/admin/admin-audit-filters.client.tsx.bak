'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function AdminAuditFiltersClient() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function onSubmit(formData: FormData) {
        const params = new URLSearchParams(searchParams.toString())

        const eventType = String(formData.get('eventType') ?? '')
        const resourceType = String(formData.get('resourceType') ?? '')

        if (eventType) params.set('eventType', eventType)
        else params.delete('eventType')

        if (resourceType) params.set('resourceType', resourceType)
        else params.delete('resourceType')

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <form action={onSubmit} className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-xs text-neutral-400">
                Event type
                <input
                    type="text"
                    name="eventType"
                    defaultValue={searchParams.get('eventType') ?? ''}
                    className="rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
                />
            </label>
            <label className="grid gap-1 text-xs text-neutral-400">
                Resource type
                <input
                    type="text"
                    name="resourceType"
                    defaultValue={searchParams.get('resourceType') ?? ''}
                    className="rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
                />
            </label>
            <div className="flex items-end">
                <button
                    type="submit"
                    className="rounded border border-neutral-700 px-3 py-2 text-sm text-neutral-100"
                >
                    Filter
                </button>
            </div>
        </form>
    )
}
