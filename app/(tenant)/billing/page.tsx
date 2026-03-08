import { InvoiceStatusBadge } from "@/components/billing/InvoiceStatusBadge";
import {
  TenantEmptyState,
  TenantMetricCard,
  TenantPageHeader,
} from "@/components/tenant/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSession } from "@/lib/auth/session";
import { getInvoicesForTenant } from "@/lib/billing/fetchers/get-invoices";
import Link from "next/link";
import { redirect } from "next/navigation";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function BillingPage() {
  const { tenantId, userId } = await getSession();
  if (!userId) {
    redirect("/sign-in");
  }

  // All roles have access; no role check

  const { invoices, total } = await getInvoicesForTenant(tenantId);
  const outstanding = invoices
    .filter((invoice) => invoice.status === "sent" || invoice.status === "draft")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  return (
    <div className="space-y-6">
      <TenantPageHeader
        eyebrow="Revenue"
        title="Billing"
        description="Monitor invoices, track payment status, and move directly into detail or collection actions from one financial workspace."
        actions={
          <Button asChild variant="outline">
            <Link href="/scheduling/bookings">View Bookings</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <TenantMetricCard
          label="Total Invoices"
          value={total}
          description="Every invoice issued for this tenant."
        />
        <TenantMetricCard
          label="Outstanding"
          value={currencyFormatter.format(outstanding / 100)}
          description="Draft and sent invoices that still need attention."
        />
        <TenantMetricCard
          label="Paid"
          value={invoices.filter((invoice) => invoice.status === "paid").length}
          description="Invoices that have cleared successfully."
        />
      </div>

      {invoices.length === 0 ? (
        <TenantEmptyState
          title="No invoices found"
          description="Once appointments create invoices, they will appear here with payment status and detail links."
        />
      ) : (
        <Card className="app-panel overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-neutral-100">Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-neutral-900/80">
                <TableRow className="border-neutral-800 hover:bg-neutral-900/80">
                  <TableHead className="px-4 text-[11px] tracking-[0.18em] uppercase">
                    Invoice
                  </TableHead>
                  <TableHead className="text-[11px] tracking-[0.18em] uppercase">Status</TableHead>
                  <TableHead className="text-right text-[11px] tracking-[0.18em] uppercase">
                    Amount
                  </TableHead>
                  <TableHead className="text-[11px] tracking-[0.18em] uppercase">Created</TableHead>
                  <TableHead className="text-right text-[11px] tracking-[0.18em] uppercase">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-neutral-800 hover:bg-neutral-900/60">
                    <TableCell className="px-4 py-4 font-mono text-xs text-neutral-400">
                      {invoice.id.slice(0, 12)}…
                    </TableCell>
                    <TableCell className="py-4">
                      <InvoiceStatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell className="py-4 text-right font-semibold text-neutral-100 tabular-nums">
                      {currencyFormatter.format(invoice.totalAmount / 100)}
                    </TableCell>
                    <TableCell className="py-4 text-neutral-400">
                      {invoice.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <Button asChild variant="ghost" size="sm" className="text-blue-300">
                        <Link href={`/billing/${invoice.id}`}>View details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
