"use client";

import { useState, useTransition } from "react";
import { type InvoiceDTO } from "@/lib/billing/types";
import { createCheckoutSession } from "@/lib/billing/actions/create-checkout-session";
import { formatId, formatCurrency, formatDate } from "@/lib/billing/utils";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoiceDetailProps {
  invoice: InvoiceDTO;
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCheckout() {
    setError(null);
    startTransition(async () => {
      const origin = window.location.origin;
      const result = await createCheckoutSession({
        invoiceId: invoice.id,
        successUrl: `${origin}/billing/${invoice.id}?payment=success`,
        cancelUrl: `${origin}/billing/${invoice.id}?payment=cancelled`,
      });

      if (result.success) {
        window.location.href = result.data.checkoutUrl;
      } else {
        setError(result.error);
      }
    });
  }

  const rows: { label: string; value: string }[] = [
    { label: "Invoice ID", value: formatId(invoice.id) },
    { label: "Booking ID", value: formatId(invoice.bookingId) },
    { label: "Amount", value: formatCurrency(invoice.amount) },
    { label: "Created", value: formatDate(invoice.createdAt) },
    { label: "Last updated", value: formatDate(invoice.updatedAt) },
    ...(invoice.stripeCheckoutSessionId
      ? [
          {
            label: "Stripe session",
            value: invoice.stripeCheckoutSessionId,
          },
        ]
      : []),
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Invoice #{formatId(invoice.id)}
        </h1>
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      {/* Details */}
      <dl className="divide-y divide-gray-100">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between px-6 py-3 text-sm">
            <dt className="font-medium text-gray-500">{label}</dt>
            <dd className="truncate text-right font-mono text-gray-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Actions */}
      <div className="border-t border-gray-200 px-6 py-4">
        {error && (
          <p className="mb-3 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {invoice.status === "PENDING" || invoice.status === "FAILED" ? (
          <button
            onClick={handleCheckout}
            disabled={isPending}
            className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Redirecting to checkout…" : "Pay now with Stripe"}
          </button>
        ) : invoice.status === "PAID" ? (
          <p className="text-center text-sm font-medium text-green-700">
            ✓ This invoice has been paid. Thank you!
          </p>
        ) : (
          <p className="text-center text-sm text-gray-500">
            This invoice cannot be paid ({invoice.status.toLowerCase()}).
          </p>
        )}
      </div>
    </div>
  );
}
