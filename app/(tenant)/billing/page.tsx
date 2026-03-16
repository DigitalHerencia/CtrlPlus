import { InvoiceStatusBadge } from "@/components/billing/InvoiceStatusBadge";
import {
  WorkspaceEmptyState,
  WorkspaceMetricCard,
  WorkspacePageIntro,
} from "@/components/shared/tenant-elements";
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
import { hasCapability } from "@/lib/authz/policy";
import { getInvoices } from "@/lib/billing/fetchers/get-invoices";
import Link from "next/link";
import { redirect } from "next/navigation";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function BillingPage() {
  const { userId, authz } = await getSession();
  if (!userId) {
    redirect("/sign-in");
  }

  const canViewAllInvoices = hasCapability(authz, "billing.read.all");
  const { invoices, total } = await getInvoices(
    undefined,
    canViewAllInvoices ? {} : { customerId: userId },
  );
  const outstanding = invoices
    .filter((invoice) => invoice.status === "sent" || invoice.status === "draft")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  return (
    <div className="space-y-6">
      <WorkspacePageIntro
        label="Revenue"
        title="Billing"
        description="Monitor invoices, track payment status, and move directly into detail or collection actions from one financial workspace."
        actions={
          <Button asChild variant="outline">
            <Link href="/scheduling/bookings">View Bookings</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <WorkspaceMetricCard
          label="Total Invoices"
          value={total}
          description="Every invoice currently tracked by the store."
        />
        <WorkspaceMetricCard
          label="Outstanding"
          value={currencyFormatter.format(outstanding / 100)}
          description="Draft and sent invoices that still need attention."
        />
        <WorkspaceMetricCard
          label="Paid"
          value={invoices.filter((invoice) => invoice.status === "paid").length}
          description="Invoices that have cleared successfully."
        />
      </div>

      {invoices.length === 0 ? (
        <WorkspaceEmptyState
          title="No invoices found"
          description="Once appointments create invoices, they will appear here with payment status and detail links."
        />
      ) : (
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
                  <TableHead className="text-[11px] uppercase tracking-[0.18em]">Status</TableHead>
                  <TableHead className="text-right text-[11px] uppercase tracking-[0.18em]">
                    Amount
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-[0.18em]">Created</TableHead>
                  <TableHead className="text-right text-[11px] uppercase tracking-[0.18em]">
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
                    <TableCell className="py-4 text-right font-semibold tabular-nums text-neutral-100">
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
