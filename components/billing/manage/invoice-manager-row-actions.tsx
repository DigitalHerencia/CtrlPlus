
import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface InvoiceManagerRowActionsProps {
    invoiceId: string
}


export function InvoiceManagerRowActions({ invoiceId }: InvoiceManagerRowActionsProps) {
    return (
        <div className="flex justify-end">
            <Button asChild size="sm" variant="outline">
                <Link href={`/billing/manage/${invoiceId}`}>Open</Link>
            </Button>
        </div>
    )
}
