import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "border-amber-300/70 bg-amber-500/10 text-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "border-sky-300/70 bg-sky-500/10 text-sky-200",
  },
  completed: {
    label: "Completed",
    className: "border-emerald-300/70 bg-emerald-500/10 text-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-rose-300/70 bg-rose-500/10 text-rose-200",
  },
};

interface BookingStatusBadgeProps {
  status: string;
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "border-neutral-400/70 bg-neutral-700/20 text-neutral-200",
  };

  return (
    <Badge variant="outline" className={cn("font-medium", config.className, className)}>
      {config.label}
    </Badge>
  );
}
