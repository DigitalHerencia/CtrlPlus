'use client'

import { Input } from '@/components/ui/input'

interface InvoiceManagerFiltersClientProps {
    query: string
    onQueryChange: (value: string) => void
}

export function InvoiceManagerFiltersClient({
    query,
    onQueryChange,
}: InvoiceManagerFiltersClientProps) {
    return (
        <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Filter by invoice id"
            className="max-w-sm"
        />
    )
}
