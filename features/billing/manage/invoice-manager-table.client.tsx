'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { InvoiceManagerTable } from '@/components/billing/manage/invoice-manager-table'
import { type InvoiceDTO } from '@/types/billing.types'

interface InvoiceManagerTableClientProps {
    invoices: InvoiceDTO[]
}

/**
 * InvoiceManagerTableClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceManagerTableClient({ invoices }: InvoiceManagerTableClientProps) {
    return <InvoiceManagerTable invoices={invoices} />
}
