export interface TimeRange {
  readonly startIso: string;
  readonly endIso: string;
}

export interface ComputeSlotsInput {
  readonly workingWindow: TimeRange;
  readonly busyWindows: readonly TimeRange[];
  readonly slotMinutes: number;
}

export interface ComputedSlot {
  readonly startIso: string;
  readonly endIso: string;
}

function toEpochMilliseconds(isoDate: string): number {
  const epochMilliseconds = Date.parse(isoDate);
  if (Number.isNaN(epochMilliseconds)) {
    throw new Error(`Invalid ISO date supplied: ${isoDate}`);
  }

  return epochMilliseconds;
}

function overlaps(start: number, end: number, busyStart: number, busyEnd: number): boolean {
  return start < busyEnd && end > busyStart;
}

export function computeSlots(input: ComputeSlotsInput): readonly ComputedSlot[] {
  if (input.slotMinutes <= 0) {
    throw new Error('slotMinutes must be a positive integer');
  }

  const slotMilliseconds = input.slotMinutes * 60 * 1000;
  const windowStart = toEpochMilliseconds(input.workingWindow.startIso);
  const windowEnd = toEpochMilliseconds(input.workingWindow.endIso);

  if (windowEnd <= windowStart) {
    throw new Error('workingWindow.endIso must be greater than workingWindow.startIso');
  }

  const busyEpochWindows = input.busyWindows.map((busyWindow) => ({
    start: toEpochMilliseconds(busyWindow.startIso),
    end: toEpochMilliseconds(busyWindow.endIso)
  }));

  const slots: ComputedSlot[] = [];

  for (let cursor = windowStart; cursor + slotMilliseconds <= windowEnd; cursor += slotMilliseconds) {
    const slotStart = cursor;
    const slotEnd = cursor + slotMilliseconds;

    const hasConflict = busyEpochWindows.some((busyWindow) =>
      overlaps(slotStart, slotEnd, busyWindow.start, busyWindow.end)
    );

    if (!hasConflict) {
      slots.push({
        startIso: new Date(slotStart).toISOString(),
        endIso: new Date(slotEnd).toISOString()
      });
    }
  }

  return slots;
}

