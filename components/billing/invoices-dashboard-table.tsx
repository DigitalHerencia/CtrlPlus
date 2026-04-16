import Link from 'next/link'

import { Button } from '@/components/ui/button'
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
import type { ReactNode } from 'react'

interface InvoicesDashboardTableProps {
    invoices: InvoiceDTO[]
    renderStatusBadge: (status: InvoiceDTO['status']) => ReactNode
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
})

export function InvoicesDashboardTable({
    invoices,
    renderStatusBadge,
}: InvoicesDashboardTableProps) {
    // Empty state
    if (invoices.length === 0) {
        return (
            <Card className="overflow-hidden border border-neutral-700 bg-neutral-950/80 shadow-sm">
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
        <Card className="overflow-hidden border border-neutral-700 bg-neutral-950/80 shadow-sm">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-neutral-800 bg-neutral-950/80">
                            <TableHead className="w-[32%] px-6 py-4 text-xs uppercase tracking-[0.22em] text-neutral-500">
                                Invoice #
                            </TableHead>
                            <TableHead className="w-[18%] px-6 py-4 text-center text-xs uppercase tracking-[0.22em] text-neutral-500">
                                Status
                            </TableHead>
                            <TableHead className="w-[18%] px-6 py-4 text-right text-xs uppercase tracking-[0.22em] text-neutral-500">
                                Amount
                            </TableHead>
                            <TableHead className="w-[22%] px-6 py-4 text-xs uppercase tracking-[0.22em] text-neutral-500">
                                Date Created
                            </TableHead>
                            <TableHead className="w-[10%] px-6 py-4 text-right text-xs uppercase tracking-[0.22em] text-neutral-500">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow
                                key={invoice.id}
                                className="border-b border-neutral-800 bg-neutral-900 transition-colors hover:bg-neutral-800"
                            >
                                <TableCell className="max-w-[18rem] truncate px-6 py-5 font-mono text-sm text-neutral-100">
                                    {invoice.id}
                                </TableCell>
                                <TableCell className="px-6 py-5 text-center">
                                    {renderStatusBadge(invoice.status)}
                                </TableCell>
                                <TableCell className="px-6 py-5 text-right font-semibold text-neutral-100">
                                    {currencyFormatter.format(invoice.totalAmount / 100)}
                                </TableCell>
                                <TableCell className="px-6 py-5 text-sm text-neutral-300">
                                    {dateFormatter.format(new Date(invoice.createdAt))}
                                </TableCell>
                                <TableCell className="px-6 py-5 text-right">
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="outline"
                                        className="h-9 px-4"
                                    >
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
