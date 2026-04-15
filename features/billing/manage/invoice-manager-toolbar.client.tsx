'use client'


import { InvoiceManagerToolbar } from '@/components/billing/manage/invoice-manager-toolbar'

import { InvoiceManagerBulkActionsClient } from './invoice-manager-bulk-actions.client'
import { InvoiceManagerFiltersClient } from './invoice-manager-filters.client'


export function InvoiceManagerToolbarClient() {
    return (
        <InvoiceManagerToolbar>
            <InvoiceManagerFiltersClient />
            <InvoiceManagerBulkActionsClient selectedCount={0} onClearSelection={() => {}} />
        </InvoiceManagerToolbar>
    )
}
