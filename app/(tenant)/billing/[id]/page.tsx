import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { InvoiceStatusBadge } from "@/components/billing/InvoiceStatusBadge";
import { WorkspaceMetricCard, WorkspacePageIntro } from "@/components/shared/tenant-elements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSession } from "@/lib/auth/session";
import { hasCapability } from "@/lib/authz/policy";
import { getInvoiceById } from "@/lib/billing/fetchers/get-invoice-by-id";
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

  const { userId, authz } = await getSession();
  if (!userId) {
    redirect("/sign-in");
  }

  const canViewAllInvoices = hasCapability(authz, "billing.read.all");
  const invoice = await getInvoiceById(id, canViewAllInvoices ? {} : { customerId: userId });

  if (!invoice) {
    notFound();
  }

  const canPay = invoice.status === "sent" || invoice.status === "draft";

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

      {payment === "success" && (
        <Card className="border-blue-600 bg-neutral-900">
          <CardContent className="py-4 text-center text-sm font-medium text-neutral-100">
            ✓ Payment received — thank you!
          </CardContent>
        </Card>
      )}

      {payment === "cancelled" && (
        <Card className="border-neutral-700 bg-neutral-900">
          <CardContent className="py-4 text-center text-sm font-medium text-neutral-100">
            Payment was cancelled. You can try again whenever you&apos;re ready.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <WorkspaceMetricCard
          label="Invoice"
          value={<span className="font-mono text-xl">{invoice.id.slice(0, 12)}…</span>}
          description="Internal invoice reference."
        />
        <WorkspaceMetricCard
          label="Created"
          value={invoice.createdAt.toLocaleDateString()}
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
            <span className="font-mono text-xs text-neutral-100">{invoice.bookingId}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Created</span>
            <span>{invoice.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Last updated</span>
            <span>{invoice.updatedAt.toLocaleDateString()}</span>
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
            <CardTitle className="text-2xl font-bold text-neutral-100">Line Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-neutral-900/80">
                <TableRow className="border-neutral-800 hover:bg-neutral-900/80">
                  <TableHead className="px-6 text-[11px] tracking-[0.18em] uppercase">
                    Description
                  </TableHead>
                  <TableHead className="text-right text-[11px] tracking-[0.18em] uppercase">
                    Qty
                  </TableHead>
                  <TableHead className="text-right text-[11px] tracking-[0.18em] uppercase">
                    Unit Price
                  </TableHead>
                  <TableHead className="text-right text-[11px] tracking-[0.18em] uppercase">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lineItems.map((item) => (
                  <TableRow key={item.id} className="border-neutral-800 hover:bg-neutral-900/60">
                    <TableCell className="px-6 py-4 text-neutral-100">{item.description}</TableCell>
                    <TableCell className="py-4 text-right text-neutral-300 tabular-nums">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="py-4 text-right text-neutral-300 tabular-nums">
                      {currencyFormatter.format(item.unitPrice / 100)}
                    </TableCell>
                    <TableCell className="py-4 text-right font-semibold text-neutral-100 tabular-nums">
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
            <CardTitle className="text-2xl font-bold text-neutral-100">Payment History</CardTitle>
            <CardDescription>
              {invoice.payments.length} payment attempt{invoice.payments.length !== 1 ? "s" : ""}
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
                    {paymentItem.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-100">
                    {currencyFormatter.format(paymentItem.amount / 100)}
                  </p>
                  <span className="text-xs font-medium text-neutral-400 capitalize">
                    {paymentItem.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {canPay && (
        <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-neutral-100">Pay Invoice</CardTitle>
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
