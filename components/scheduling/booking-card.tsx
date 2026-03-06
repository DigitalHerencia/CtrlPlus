import Link from "next/link";
import { BookingStatusBadge } from "./booking-status-badge";
import { Card, CardContent } from "@/components/ui/card";

export interface BookingCardItem {
  id: string;
  wrapId: string;
  wrapName?: string;
  startTime: Date;
  endTime: Date;
  status: string;
  totalPrice: number;
}

interface BookingCardProps {
  booking: BookingCardItem;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function BookingCard({ booking }: BookingCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm truncate">
                {booking.wrapName ?? `Wrap ${booking.wrapId.slice(0, 8)}…`}
              </span>
              <BookingStatusBadge status={booking.status} />
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatDate(booking.startTime)}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
              {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-semibold text-sm">{formatPrice(booking.totalPrice)}</p>
            <Link
              href={`/scheduling/bookings/${booking.id}`}
              className="text-xs text-primary hover:underline mt-1 block"
            >
              View details
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
