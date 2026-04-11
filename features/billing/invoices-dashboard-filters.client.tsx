'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { InvoiceSearchFilterClient } from './invoice-search-filter.client'

/**
 * InvoicesDashboardFiltersClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoicesDashboardFiltersClient() {
    // Wraps InvoiceSearchFilterClient with card styling applied directly
    return (
        <div className="border border-neutral-700 bg-neutral-950/80 px-6 py-7">
            <InvoiceSearchFilterClient />
        </div>
    )
}
