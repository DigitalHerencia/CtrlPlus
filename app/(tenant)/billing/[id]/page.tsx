import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getInvoiceById } from "@/lib/billing/fetchers/get-invoice-by-id";
import { InvoiceStatusBadge } from "@/components/billing/InvoiceStatusBadge";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = await params;
  const { tenantId } = await getSession();

  const invoice = await getInvoiceById(tenantId, id);

  if (!invoice) {
    notFound();
  }

  const canPay = invoice.status === "sent" || invoice.status === "draft";
  const latestPayment = invoice.payments[0] ?? null;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back link */}
      <Link
        href="/billing"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
      >
        ← Back to Billing
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1 font-mono text-sm">
            {invoice.id}
          </p>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      {/* Summary card */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">Booking</span>
            <span className="font-mono">{invoice.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">Created</span>
            <span>{invoice.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">Last updated</span>
            <span>{invoice.updatedAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t">
            <span>Total</span>
            <span>${(invoice.totalAmount / 100).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Line items */}
      {invoice.lineItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-neutral-600 dark:text-neutral-300">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-neutral-600 dark:text-neutral-300">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-neutral-600 dark:text-neutral-300">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-neutral-600 dark:text-neutral-300">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.lineItems.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                    <td className="px-6 py-3">{item.description}</td>
                    <td className="px-6 py-3 text-right tabular-nums">{item.quantity}</td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      ${(item.unitPrice / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums font-medium">
                      ${(item.totalPrice / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Payment history */}
      {invoice.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              {invoice.payments.length} payment attempt
              {invoice.payments.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoice.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between text-sm border rounded-md px-4 py-3"
              >
                <div>
                  <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {payment.stripePaymentIntentId}
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
                    {payment.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(payment.amount / 100).toFixed(2)}</p>
                  <span
                    className={`text-xs font-medium ${
                      payment.status === "succeeded"
                        ? "text-green-600 dark:text-green-400"
                        : payment.status === "failed"
                          ? "text-red-600 dark:text-red-400"
                          : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Checkout action */}
      {canPay && (
        <Card>
          <CardHeader>
            <CardTitle>Pay Invoice</CardTitle>
            <CardDescription>
              You will be redirected to Stripe&apos;s secure checkout page to complete payment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CheckoutButton invoiceId={invoice.id} />
          </CardContent>
        </Card>
      )}

      {latestPayment?.status === "succeeded" && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
          <CardContent className="py-4 text-sm text-green-700 dark:text-green-300 text-center font-medium">
            ✓ Payment received — thank you!
          </CardContent>
        </Card>
      )}
    </div>
  );
}
