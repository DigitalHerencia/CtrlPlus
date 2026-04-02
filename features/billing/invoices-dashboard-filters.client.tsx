'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Input } from '@/components/ui/input'

export function InvoicesDashboardFiltersClient() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const query = useMemo(() => searchParams.get('query') ?? '', [searchParams])

    function onQueryChange(value: string) {
        const next = new URLSearchParams(searchParams.toString())
        if (!value.trim()) {
            next.delete('query')
        } else {
            next.set('query', value.trim())
        }
        router.replace(`/billing?${next.toString()}`)
    }

    return (
        <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search invoices by id"
            className="max-w-sm"
        />
    )
}
