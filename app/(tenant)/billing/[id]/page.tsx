import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { InvoiceStatusBadge } from "@/components/billing/InvoiceStatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getInvoiceById } from "@/lib/billing/fetchers/get-invoice-by-id";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function InvoiceDetailPage({ params, searchParams }: InvoiceDetailPageProps) {
  const { id } = await params;
  const { payment } = await searchParams;

  const { tenantId, userId } = await getSession();
  if (!userId) {
    redirect("/sign-in");
  }

  await assertTenantMembership(tenantId, userId);

  const invoice = await getInvoiceById(tenantId, id);

  if (!invoice) {
    notFound();
  }

  const canPay = invoice.status === "sent" || invoice.status === "draft";

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/billing"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to Billing
      </Link>

      <div className="rounded-xl border border-border/80 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoice</h1>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{invoice.id}</p>
          </div>
          <InvoiceStatusBadge status={invoice.status} />
        </div>
      </div>

      {payment === "success" && (
        <Card className="border-emerald-500/30 bg-emerald-500/10">
          <CardContent className="py-4 text-center text-sm font-medium text-emerald-300">
            ✓ Payment received — thank you!
          </CardContent>
        </Card>
      )}

      {payment === "cancelled" && (
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="py-4 text-center text-sm font-medium text-amber-300">
            Payment was cancelled. You can try again whenever you&apos;re ready.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Booking</span>
            <span className="font-mono text-xs">{invoice.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span>{invoice.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last updated</span>
            <span>{invoice.updatedAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between border-t border-border/60 pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{currencyFormatter.format(invoice.totalAmount / 100)}</span>
          </div>
        </CardContent>
      </Card>

      {invoice.lineItems.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Qty</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {invoice.lineItems.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-3">{item.description}</td>
                    <td className="px-6 py-3 text-right tabular-nums">{item.quantity}</td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      {currencyFormatter.format(item.unitPrice / 100)}
                    </td>
                    <td className="px-6 py-3 text-right font-medium tabular-nums">
                      {currencyFormatter.format(item.totalPrice / 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {invoice.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              {invoice.payments.length} payment attempt{invoice.payments.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoice.payments.map((paymentItem) => (
              <div
                key={paymentItem.id}
                className="flex items-center justify-between rounded-md border border-border/70 bg-muted/30 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {paymentItem.stripePaymentIntentId}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {paymentItem.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {currencyFormatter.format(paymentItem.amount / 100)}
                  </p>
                  <span className="text-xs font-medium text-muted-foreground capitalize">
                    {paymentItem.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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
    </div>
  );
}
