import Link from 'next/link'

import { CheckoutButton } from '@/components/billing/CheckoutButton'
import { InvoiceStatusBadge } from '@/components/billing/InvoiceStatusBadge'
import { BillingPaymentBanner } from '@/components/billing/billing-payment-banner'
import { WorkspaceMetricCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { type InvoiceDetailDTO } from '@/types/billing.types'

interface BillingInvoiceDetailProps {
    invoice: InvoiceDetailDTO
    canPay: boolean
    paymentState?: 'success' | 'cancelled' | null
    checkoutActionLabel: string
    onCheckout?: () => Promise<{ url: string }>
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

export function BillingInvoiceDetail({
    invoice,
    canPay,
    paymentState,
    checkoutActionLabel,
    onCheckout,
}: BillingInvoiceDetailProps) {
    return (
        <div className="max-w-4xl space-y-6">
            <WorkspacePageIntro
                label="Collections"
                title="Invoice Detail"
                description="Inspect line items, review payment attempts, and move into checkout from the billing workspace."
                detail={<InvoiceStatusBadge status={invoice.status} />}
                actions={
                    <Button asChild variant="outline">
                        <Link href="/billing">Back to Billing</Link>
                    </Button>
                }
            />

            {paymentState ? <BillingPaymentBanner variant={paymentState} /> : null}

            <div className="grid gap-4 md:grid-cols-3">
                <WorkspaceMetricCard
                    label="Invoice"
                    value={<span className="font-mono text-xl">{invoice.id.slice(0, 12)}…</span>}
                    description="Internal invoice reference."
                />
                <WorkspaceMetricCard
                    label="Created"
                    value={invoice.createdAt}
                    description="Issue date for this invoice."
                />
                <WorkspaceMetricCard
                    label="Total"
                    value={currencyFormatter.format(invoice.totalAmount / 100)}
                    description="Current amount due on the invoice."
                />
            </div>

            <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-neutral-100">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                        <span className="text-neutral-400">Booking</span>
                        <span className="font-mono text-xs text-neutral-100">
                            {invoice.bookingId}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-neutral-400">Created</span>
                        <span>{invoice.createdAt}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-neutral-400">Last updated</span>
                        <span>{invoice.updatedAt}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-neutral-800 pt-3 text-base font-semibold">
                        <span>Total</span>
                        <span>{currencyFormatter.format(invoice.totalAmount / 100)}</span>
                    </div>
                </CardContent>
            </Card>

            {invoice.lineItems.length > 0 && (
                <Card className="overflow-hidden border-neutral-700 bg-neutral-900 text-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-neutral-100">
                            Line Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-neutral-900/80">
                                <TableRow className="border-neutral-800 hover:bg-neutral-900/80">
                                    <TableHead className="px-6 text-[11px] uppercase tracking-[0.18em]">
                                        Description
                                    </TableHead>
                                    <TableHead className="text-right text-[11px] uppercase tracking-[0.18em]">
                                        Qty
                                    </TableHead>
                                    <TableHead className="text-right text-[11px] uppercase tracking-[0.18em]">
                                        Unit Price
                                    </TableHead>
                                    <TableHead className="text-right text-[11px] uppercase tracking-[0.18em]">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.lineItems.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="border-neutral-800 hover:bg-neutral-900/60"
                                    >
                                        <TableCell className="px-6 py-4 text-neutral-100">
                                            {item.description}
                                        </TableCell>
                                        <TableCell className="py-4 text-right tabular-nums text-neutral-300">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="py-4 text-right tabular-nums text-neutral-300">
                                            {currencyFormatter.format(item.unitPrice / 100)}
                                        </TableCell>
                                        <TableCell className="py-4 text-right font-semibold tabular-nums text-neutral-100">
                                            {currencyFormatter.format(item.totalPrice / 100)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {invoice.payments.length > 0 && (
                <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-neutral-100">
                            Payment History
                        </CardTitle>
                        <CardDescription>
                            {invoice.payments.length} payment attempt
                            {invoice.payments.length !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {invoice.payments.map((paymentItem) => (
                            <div
                                key={paymentItem.id}
                                className="flex items-center justify-between border border-neutral-800 bg-neutral-950/70 px-4 py-3 text-sm"
                            >
                                <div>
                                    <p className="font-mono text-xs text-neutral-400">
                                        {paymentItem.stripePaymentIntentId}
                                    </p>
                                    <p className="mt-0.5 text-xs text-neutral-500">
                                        {paymentItem.createdAt}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-neutral-100">
                                        {currencyFormatter.format(paymentItem.amount / 100)}
                                    </p>
                                    <span className="text-xs font-medium capitalize text-neutral-400">
                                        {paymentItem.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {canPay && onCheckout ? (
                <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-neutral-100">
                            Pay Invoice
                        </CardTitle>
                        <CardDescription>
                            You will be redirected to Stripe&apos;s secure checkout page to complete
                            payment.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CheckoutButton
                            onCheckout={onCheckout}
                            actionLabel={checkoutActionLabel}
                            pendingLabel="Redirecting…"
                        />
                    </CardContent>
                </Card>
            ) : null}
        </div>
    )
}
