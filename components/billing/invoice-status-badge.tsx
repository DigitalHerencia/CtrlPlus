"use client";

import { type InvoiceDTO } from "@/lib/billing/types";

interface InvoiceStatusBadgeProps {
  status: InvoiceDTO["status"];
}

const STATUS_STYLES: Record<
  InvoiceDTO["status"],
  { bg: string; text: string; label: string }
> = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
  PAID: { bg: "bg-green-100", text: "text-green-800", label: "Paid" },
  FAILED: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
  CANCELLED: { bg: "bg-gray-100", text: "text-gray-600", label: "Cancelled" },
};

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const { bg, text, label } = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
}
