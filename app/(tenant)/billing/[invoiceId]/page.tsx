import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getInvoiceById } from "@/lib/billing/fetchers/get-invoices";
import { InvoiceDetail } from "@/components/billing/invoice-detail";

interface InvoicePageProps {
  params: Promise<{ invoiceId: string }>;
}

export async function generateMetadata({ params }: InvoicePageProps) {
  const { invoiceId } = await params;
  return {
    title: `Invoice ${invoiceId} | CTRL+`,
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { invoiceId } = await params;
  const { tenantId } = await getSession();
  const invoice = await getInvoiceById(tenantId, invoiceId);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/billing"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← Billing
        </Link>
      </div>
      <InvoiceDetail invoice={invoice} />
    </div>
  );
}
