"use client";

import { type InvoiceDTO } from "@/lib/billing/types";
import { formatId, formatCurrency, formatDate } from "@/lib/billing/utils";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoiceListProps {
  invoices: InvoiceDTO[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white py-16 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
        <h3 className="mt-4 text-sm font-semibold text-gray-900">
          No invoices yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Invoices will appear here once bookings are confirmed.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Invoices ({invoices.length})
        </h2>
      </div>
      <ul>
        {invoices.map((invoice) => (
          <li
            key={invoice.id}
            className="flex items-center justify-between border-b border-gray-100 px-6 py-4 transition-colors last:border-0 hover:bg-gray-50"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                Invoice #{formatId(invoice.id)}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Booking {formatId(invoice.bookingId)} ·{" "}
                {formatDate(invoice.createdAt)}
              </p>
            </div>
            <div className="ml-4 flex shrink-0 items-center gap-4">
              <InvoiceStatusBadge status={invoice.status} />
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(invoice.amount)}
              </span>
              <a
                href={`/billing/${invoice.id}`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View →
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
