import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface InvoiceManagerRowActionsProps {
    invoiceId: string
}

export function InvoiceManagerRowActions({ invoiceId }: InvoiceManagerRowActionsProps) {
    return (
        <div className="flex justify-end gap-2">
            <Button asChild size="sm" variant="outline">
                <Link href={`/billing/manage/${invoiceId}`}>Open</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
                <Link href={`/billing/manage/${invoiceId}/edit`}>Edit</Link>
            </Button>
        </div>
    )
}
