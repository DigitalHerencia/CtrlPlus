/**
 * @introduction Components — TODO: short one-line summary of invoice-manager-row-actions.tsx
 *
 * @description TODO: longer description for invoice-manager-row-actions.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface InvoiceManagerRowActionsProps {
    invoiceId: string
}

/**
 * InvoiceManagerRowActions — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceManagerRowActions({ invoiceId }: InvoiceManagerRowActionsProps) {
    return (
        <div className="flex justify-end">
            <Button asChild size="sm" variant="outline">
                <Link href={`/billing/manage/${invoiceId}`}>Open</Link>
            </Button>
        </div>
    )
}
