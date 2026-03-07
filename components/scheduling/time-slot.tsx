import { cn } from "@/lib/utils";

interface TimeSlotProps {
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount?: number;
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
  bookedCount = 0,
  isSelected = false,
  onClick,
  disabled = false,
}: TimeSlotProps) {
  const available = capacity - bookedCount;
  const isFull = available <= 0;
  const effectivelyDisabled = disabled || isFull;

  return (
    <button
      type="button"
      disabled={effectivelyDisabled}
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border px-4 py-3 text-left transition-colors",
        isSelected
          ? "border-blue-400 bg-blue-500/10 text-blue-100"
          : "border-neutral-800 bg-neutral-950/60 text-neutral-100",
        !effectivelyDisabled && !isSelected
          ? "cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5"
          : "",
        effectivelyDisabled && "cursor-not-allowed opacity-50",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {formatTime(startTime)} – {formatTime(endTime)}
        </span>
        <span
          className={cn(
            "text-xs",
            isFull ? "text-rose-300" : available <= 2 ? "text-amber-300" : "text-neutral-400",
          )}
        >
          {isFull ? "Full" : `${available} of ${capacity} open`}
        </span>
      </div>
    </button>
  );
}
