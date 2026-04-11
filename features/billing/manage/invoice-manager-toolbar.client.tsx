'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { InvoiceManagerToolbar } from '@/components/billing/manage/invoice-manager-toolbar'

import { InvoiceManagerBulkActionsClient } from './invoice-manager-bulk-actions.client'
import { InvoiceManagerFiltersClient } from './invoice-manager-filters.client'

/**
 * InvoiceManagerToolbarClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceManagerToolbarClient() {
    return (
        <InvoiceManagerToolbar>
            <InvoiceManagerFiltersClient />
            <InvoiceManagerBulkActionsClient selectedCount={0} onClearSelection={() => {}} />
        </InvoiceManagerToolbar>
    )
}
