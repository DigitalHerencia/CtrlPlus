/**
 * @introduction Components — TODO: short one-line summary of invoice-manager-table.tsx
 *
 * @description TODO: longer description for invoice-manager-table.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { InvoiceStatusBadge } from '@/components/billing/InvoiceStatusBadge'
import { Card, CardContent } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { type InvoiceDTO } from '@/types/billing.types'

import { InvoiceManagerRowActions } from './invoice-manager-row-actions'

interface InvoiceManagerTableProps {
    invoices: InvoiceDTO[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

/**
 * InvoiceManagerTable — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceManagerTable({ invoices }: InvoiceManagerTableProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-700">
                            <TableHead>Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id} className="border-neutral-700">
                                <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
                                <TableCell>
                                    <InvoiceStatusBadge status={invoice.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    {currencyFormatter.format(invoice.totalAmount / 100)}
                                </TableCell>
                                <TableCell>{invoice.createdAt}</TableCell>
                                <TableCell>
                                    <InvoiceManagerRowActions invoiceId={invoice.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
