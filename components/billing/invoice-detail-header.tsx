import Link from 'next/link'

import { InvoiceStatusBadge } from '@/components/billing/InvoiceStatusBadge'
import { Button } from '@/components/ui/button'
import { type InvoiceDetailDTO } from '@/types/billing.types'

interface InvoiceDetailHeaderProps {
    invoice: InvoiceDetailDTO
}

export function InvoiceDetailHeader({ invoice }: InvoiceDetailHeaderProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-neutral-100">Invoice {invoice.id}</h1>
                <p className="text-sm text-neutral-400">
                    Review totals, payment status, and history.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <InvoiceStatusBadge status={invoice.status} />
                <Button asChild variant="outline">
                    <Link href="/billing">Back</Link>
                </Button>
            </div>
        </div>
    )
}
