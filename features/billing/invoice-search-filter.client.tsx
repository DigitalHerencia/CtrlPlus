'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Input } from '@/components/ui/input'

export function InvoiceSearchFilterClient() {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const query = useMemo(() => searchParams.get('query') ?? '', [searchParams])

    function onQueryChange(value: string) {
        const next = new URLSearchParams(searchParams.toString())
        const normalizedValue = value.trim()

        if (!normalizedValue) {
            next.delete('query')
        } else {
            next.set('query', normalizedValue)
        }

        next.delete('page')

        const queryString = next.toString()
        router.replace(queryString ? `${pathname}?${queryString}` : pathname)
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
