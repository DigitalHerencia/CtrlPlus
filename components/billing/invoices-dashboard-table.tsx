import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { type InvoiceDTO } from '@/types/billing.types'
import type { ReactNode } from 'react'

interface InvoicesDashboardTableProps {
    invoices: InvoiceDTO[]
    renderStatusBadge: (status: InvoiceDTO['status']) => ReactNode
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

export function InvoicesDashboardTable({
    invoices,
    renderStatusBadge,
}: InvoicesDashboardTableProps) {
    // Empty state
    if (invoices.length === 0) {
        return (
            <Card className="border-neutral-700 bg-neutral-950/80">
                <CardContent className="flex items-center justify-center py-12 text-center">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-neutral-300">No invoices found.</p>
                        <p className="text-xs text-neutral-500">
                            Adjust your filters or create a new invoice to get started.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-neutral-700 bg-neutral-950/80">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-300">
                    Invoices
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-700">
                            <TableHead>Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow
                                key={invoice.id}
                                className="border-neutral-700 bg-neutral-900"
                            >
                                <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
                                <TableCell>{renderStatusBadge(invoice.status)}</TableCell>
                                <TableCell className="text-right">
                                    {currencyFormatter.format(invoice.totalAmount / 100)}
                                </TableCell>
                                <TableCell>{invoice.createdAt}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={`/billing/${invoice.id}`}>View</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
