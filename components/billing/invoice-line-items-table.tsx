
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { type InvoiceLineItemDTO } from '@/types/billing.types'

interface InvoiceLineItemsTableProps {
    lineItems: InvoiceLineItemDTO[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})


export function InvoiceLineItemsTable({ lineItems }: InvoiceLineItemsTableProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80">
            <CardHeader>
                <CardTitle className="text-neutral-100">Line Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-700">
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Unit</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lineItems.map((item) => (
                            <TableRow key={item.id} className="border-neutral-700">
                                <TableCell>{item.description}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right">
                                    {currencyFormatter.format(item.unitPrice / 100)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {currencyFormatter.format(item.totalPrice / 100)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
