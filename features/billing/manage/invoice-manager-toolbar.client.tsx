'use client'

import { useState } from 'react'

import { InvoiceManagerToolbar } from '@/components/billing/manage/invoice-manager-toolbar'

import { InvoiceManagerBulkActionsClient } from './invoice-manager-bulk-actions.client'
import { InvoiceManagerFiltersClient } from './invoice-manager-filters.client'

export function InvoiceManagerToolbarClient() {
    const [query, setQuery] = useState('')

    return (
        <InvoiceManagerToolbar>
            <InvoiceManagerFiltersClient query={query} onQueryChange={setQuery} />
            <InvoiceManagerBulkActionsClient
                selectedCount={0}
                onClearSelection={() => setQuery('')}
            />
        </InvoiceManagerToolbar>
    )
}
