'use client'


import { InvoiceSearchFilterClient } from './invoice-search-filter.client'


export function InvoicesDashboardFiltersClient() {
    // Wraps InvoiceSearchFilterClient with card styling applied directly
    return (
        <div className="border border-neutral-700 bg-neutral-950/80 px-6 py-7">
            <InvoiceSearchFilterClient />
        </div>
    )
}
