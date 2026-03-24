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
import { type InvoiceDTO } from '@/lib/billing/types'

import { InvoiceStatusBadge } from './InvoiceStatusBadge'

interface InvoiceListCardProps {
    invoices: InvoiceDTO[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

export function InvoiceListCard({ invoices }: InvoiceListCardProps) {
    return (
        <Card className="overflow-hidden border-neutral-700 bg-neutral-900 text-neutral-100">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-neutral-100">Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-neutral-900/80">
                        <TableRow className="border-neutral-800 hover:bg-neutral-900/80">
                            <TableHead className="px-4 text-[11px] uppercase tracking-[0.18em]">
                                Invoice
                            </TableHead>
                            <TableHead className="text-[11px] uppercase tracking-[0.18em]">
                                Status
                            </TableHead>
                            <TableHead className="text-right text-[11px] uppercase tracking-[0.18em]">
                                Amount
                            </TableHead>
                            <TableHead className="text-[11px] uppercase tracking-[0.18em]">
                                Created
                            </TableHead>
                            <TableHead className="text-right text-[11px] uppercase tracking-[0.18em]">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow
                                key={invoice.id}
                                className="border-neutral-800 hover:bg-neutral-900/60"
                            >
                                <TableCell className="px-4 py-4 font-mono text-xs text-neutral-400">
                                    {invoice.id.slice(0, 12)}…
                                </TableCell>
                                <TableCell className="py-4">
                                    <InvoiceStatusBadge status={invoice.status} />
                                </TableCell>
                                <TableCell className="py-4 text-right font-semibold tabular-nums text-neutral-100">
                                    {currencyFormatter.format(invoice.totalAmount / 100)}
                                </TableCell>
                                <TableCell className="py-4 text-neutral-400">
                                    {invoice.createdAt.toLocaleDateString()}
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-300"
                                    >
                                        <Link href={`/billing/${invoice.id}`}>View details</Link>
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
