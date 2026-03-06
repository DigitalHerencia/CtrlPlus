import { InvoiceStatusBadge } from "@/components/billing/InvoiceStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getInvoicesForTenant } from "@/lib/billing/fetchers/get-invoices";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const { tenantId, userId } = await getSession();
  if (!userId) {
    redirect("/sign-in");
  }

  await assertTenantMembership(tenantId, userId);

  const { invoices, total } = await getInvoicesForTenant(tenantId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">Billing</h1>
        <p className="text-neutral-400 mt-2">
          Manage your invoices and payments
        </p>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-neutral-400">
            No invoices found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-neutral-400">
            {total} invoice{total !== 1 ? "s" : ""}
          </p>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-800 bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-neutral-300">
                    Invoice
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-neutral-300">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-300">
                    Date
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-neutral-800 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-neutral-400">
                      {invoice.id.slice(0, 12)}…
                    </td>
                    <td className="px-4 py-3">
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-neutral-100">
                      ${(invoice.totalAmount / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {invoice.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/billing/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-500 text-xs font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
