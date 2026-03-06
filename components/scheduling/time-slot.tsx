import { cn } from "@/lib/utils";

interface TimeSlotProps {
  startTime: string; // "HH:mm" 24-hour
  endTime: string; // "HH:mm" 24-hour
  capacity: number;
  booked?: number;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

function formatTime(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr ?? "00";
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
}

export function TimeSlot({
  startTime,
  endTime,
  capacity,
  booked = 0,
  isSelected = false,
  onClick,
  disabled = false,
}: TimeSlotProps) {
  const available = capacity - booked;
  const isFull = available <= 0;
  const effectivelyDisabled = disabled || isFull;

  return (
    <button
      type="button"
      disabled={effectivelyDisabled}
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 rounded-lg border transition-colors",
        isSelected
          ? "border-primary bg-primary/10 text-primary"
          : "border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-700",
        !effectivelyDisabled && !isSelected
          ? "hover:border-primary/50 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
          : "",
        effectivelyDisabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">
          {formatTime(startTime)} – {formatTime(endTime)}
        </span>
        <span
          className={cn(
            "text-xs",
            isFull ? "text-red-500" : available <= 2 ? "text-yellow-600" : "text-neutral-500",
          )}
        >
          {isFull ? "Full" : `${available} of ${capacity} open`}
        </span>
      </div>
    </button>
  );
}
