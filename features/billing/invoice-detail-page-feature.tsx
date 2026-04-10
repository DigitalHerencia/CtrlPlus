import { InvoiceDetailHeader } from '@/components/billing/invoice-detail-header'
import { InvoiceDetailSummary } from '@/components/billing/invoice-detail-summary'
import { InvoiceLineItemsTable } from '@/components/billing/invoice-line-items-table'
import { InvoicePaymentPanel } from '@/components/billing/invoice-payment-panel'
import { InvoiceStatusBadge } from '@/components/billing/InvoiceStatusBadge'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { InvoiceDetailTabsClient } from './invoice-detail-tabs.client'

interface InvoiceDetailPageFeatureProps {
    invoiceId: string
}

export async function InvoiceDetailPageFeature({ invoiceId }: InvoiceDetailPageFeatureProps) {
    const [invoice, session] = await Promise.all([getInvoice(invoiceId), getSession()])

    if (!invoice) {
        notFound()
    }

    const canManageInvoice = hasCapability(session.authz, 'billing.write.all')

    return (
        <div className="space-y-6">
            <InvoiceDetailHeader invoice={invoice} />
            <WorkspacePageContextCard
                title="Invoice Controls"
                description="Current status and quick navigation"
            >
                <InvoiceStatusBadge status={invoice.status} />
                <Button asChild variant="outline">
                    <Link href="/billing">Back to Billing</Link>
                </Button>
            </WorkspacePageContextCard>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                    <InvoiceLineItemsTable lineItems={invoice.lineItems} />
                </div>
                <InvoicePaymentPanel invoice={invoice} canManageInvoice={canManageInvoice} />
            </div>

            <InvoiceDetailTabsClient
                summary={<InvoiceDetailSummary invoice={invoice} />}
                paymentHistory={
                    <Card className="border-neutral-800 bg-neutral-900">
                        <CardHeader>
                            <CardTitle className="text-neutral-100">Payment History</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {invoice.paymentHistory.length === 0 ? (
                                <p className="text-sm text-neutral-400">No payment events yet.</p>
                            ) : (
                                invoice.paymentHistory.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center justify-between rounded-md border border-neutral-800 p-3"
                                    >
                                        <span className="text-sm text-neutral-300">
                                            {event.type}
                                        </span>
                                        <span className="text-sm text-neutral-100">
                                            {event.amount / 100}
                                        </span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                }
            />
        </div>
    )
}
