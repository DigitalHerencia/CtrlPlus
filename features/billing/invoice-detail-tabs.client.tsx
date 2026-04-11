'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { InvoiceDetailTabs } from '@/components/billing/invoice-detail-tabs'
import { type ReactNode } from 'react'

interface InvoiceDetailTabsClientProps {
    summary: ReactNode
    paymentHistory: ReactNode
}

/**
 * InvoiceDetailTabsClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceDetailTabsClient({ summary, paymentHistory }: InvoiceDetailTabsClientProps) {
    return <InvoiceDetailTabs summary={summary} paymentHistory={paymentHistory} />
}
