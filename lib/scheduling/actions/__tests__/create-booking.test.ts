import { describe, expect, it, vi } from "vitest";

vi.mock("../reserve-slot", () => ({
  reserveSlot: vi.fn(),
}));

import { createBooking } from "../create-booking";
import { reserveSlot } from "../reserve-slot";

describe("createBooking", () => {
  it("delegates to reserveSlot for backward compatibility", async () => {
    const input = {
      wrapId: "wrap-1",
      startTime: new Date("2026-01-01T09:00:00.000Z"),
      endTime: new Date("2026-01-01T11:00:00.000Z"),
    };

    vi.mocked(reserveSlot).mockResolvedValue({
      id: "booking-1",
      wrapId: input.wrapId,
      startTime: input.startTime,
      endTime: input.endTime,
      status: "pending",
      totalPrice: 5000,
      reservationExpiresAt: new Date("2026-01-01T09:15:00.000Z"),
    });

    const result = await createBooking(input);

    expect(reserveSlot).toHaveBeenCalledWith(input);
    expect(result.id).toBe("booking-1");
    expect(result.reservationExpiresAt).toBeInstanceOf(Date);
  });
});
