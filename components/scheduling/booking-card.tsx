import type { BookingDTO } from "@/lib/scheduling/types";

interface BookingCardProps {
  booking: BookingDTO;
}

const STATUS_STYLES: Record<
  BookingDTO["status"],
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  RESERVED: {
    label: "Reserved",
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
};

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * BookingCard displays a summary of a single booking.
 * It is a pure Server Component (no interactivity).
 */
export function BookingCard({ booking }: BookingCardProps) {
  const statusStyle = STATUS_STYLES[booking.status];

  return (
    <article
      aria-label={`Booking for ${booking.wrapName}`}
      className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {booking.wrapName || "Wrap booking"}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            #{booking.id.slice(-8).toUpperCase()}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle.className}`}
        >
          {statusStyle.label}
        </span>
      </div>

      {/* Customer */}
      <dl className="space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-zinc-500 dark:text-zinc-400">
            Customer
          </dt>
          <dd className="text-zinc-800 dark:text-zinc-200">
            {booking.customerName}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-zinc-500 dark:text-zinc-400">
            Email
          </dt>
          <dd className="text-zinc-800 dark:text-zinc-200">
            {booking.customerEmail}
          </dd>
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-zinc-100 dark:border-zinc-800" />

        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-zinc-500 dark:text-zinc-400">
            Drop-off
          </dt>
          <dd className="text-zinc-800 dark:text-zinc-200">
            {formatDate(booking.dropOffDate)}{" "}
            <span className="text-zinc-500">{booking.dropOffTime}</span>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-zinc-500 dark:text-zinc-400">
            Pick-up
          </dt>
          <dd className="text-zinc-800 dark:text-zinc-200">
            {formatDate(booking.pickUpDate)}{" "}
            <span className="text-zinc-500">{booking.pickUpTime}</span>
          </dd>
        </div>

        {booking.notes && (
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-zinc-500 dark:text-zinc-400">
              Notes
            </dt>
            <dd className="text-zinc-800 dark:text-zinc-200">
              {booking.notes}
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}
