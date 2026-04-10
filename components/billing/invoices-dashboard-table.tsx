import Link from 'next/link'

import { InvoiceStatusBadge } from '@/components/billing/InvoiceStatusBadge'
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

interface InvoicesDashboardTableProps {
    invoices: InvoiceDTO[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

export function InvoicesDashboardTable({ invoices }: InvoicesDashboardTableProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-800">
                            <TableHead>Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id} className="border-neutral-800">
                                <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
                                <TableCell>
                                    <InvoiceStatusBadge status={invoice.status} />
                                </TableCell>
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
