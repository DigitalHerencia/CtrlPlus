import { type AvailabilityDTO, type TimeSlot } from "../types";

/**
 * Returns available time slots for the given tenant within the requested date
 * range. Only slots that have remaining capacity are marked as available.
 *
 * @param tenantId - Tenant scope (server-side verified)
 * @param startDate - ISO date string "YYYY-MM-DD"
 * @param endDate   - ISO date string "YYYY-MM-DD"
 */
export async function getAvailability(
  tenantId: string,
  startDate: string,
  endDate: string
): Promise<AvailabilityDTO[]> {
  // TODO: Replace with real Prisma queries once the DB is wired up.
  // const slots = await prisma.timeSlot.findMany({
  //   where: {
  //     tenantId,
  //     date: { gte: startDate, lte: endDate },
  //     deletedAt: null,
  //   },
  //   orderBy: [{ date: "asc" }, { startTime: "asc" }],
  //   select: {
  //     id: true, date: true, startTime: true, endTime: true,
  //     capacity: true, bookings: { where: { status: { not: "CANCELLED" } }, select: { id: true } },
  //   },
  // });

  // Stub: generate placeholder slots for the requested range
  const results: AvailabilityDTO[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const dayOfWeek = d.getDay();
    // Skip Sundays (0)
    if (dayOfWeek === 0) continue;

    const slots: TimeSlot[] = [
      {
        id: `${dateStr}-0800`,
        date: dateStr,
        startTime: "08:00",
        endTime: "10:00",
        available: true,
        remainingCapacity: 2,
      },
      {
        id: `${dateStr}-1000`,
        date: dateStr,
        startTime: "10:00",
        endTime: "12:00",
        available: true,
        remainingCapacity: 1,
      },
      {
        id: `${dateStr}-1300`,
        date: dateStr,
        startTime: "13:00",
        endTime: "15:00",
        available: true,
        remainingCapacity: 2,
      },
      {
        id: `${dateStr}-1500`,
        date: dateStr,
        startTime: "15:00",
        endTime: "17:00",
        available: dayOfWeek !== 6,
        remainingCapacity: dayOfWeek !== 6 ? 1 : 0,
      },
    ];

    results.push({ date: dateStr, slots });
  }

  void tenantId;
  return results;
}
