import { getSession } from "@/lib/auth/session";
import { getInvoicesForTenant } from "@/lib/billing/fetchers/get-invoices";
import { InvoiceList } from "@/components/billing/invoice-list";

export const metadata = {
  title: "Billing | CTRL+",
  description: "View and pay your invoices",
};

export default async function BillingPage() {
  const { tenantId } = await getSession();
  const invoices = await getInvoicesForTenant(tenantId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="mt-1 text-sm text-gray-500">
          View invoices and manage payments for your account.
        </p>
      </div>
      <InvoiceList invoices={invoices} />
    </div>
  );
}
