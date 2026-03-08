import { describe, expect, it, vi } from "vitest";

vi.mock("../reserve-slot", () => ({
  reserveSlot: vi.fn(),
}));

vi.mock("@/lib/billing/actions/ensure-invoice-for-booking", () => ({
  ensureInvoiceForBooking: vi.fn(),
}));

import { createBooking } from "../create-booking";
import { ensureInvoiceForBooking } from "@/lib/billing/actions/ensure-invoice-for-booking";
import { reserveSlot } from "../reserve-slot";

describe("createBooking", () => {
  it("reserves a slot and returns the linked invoice id", async () => {
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
    vi.mocked(ensureInvoiceForBooking).mockResolvedValue({
      invoiceId: "invoice-1",
      created: true,
    });

    const result = await createBooking(input);

    expect(reserveSlot).toHaveBeenCalledWith(input);
    expect(ensureInvoiceForBooking).toHaveBeenCalledWith({ bookingId: "booking-1" });
    expect(result.id).toBe("booking-1");
    expect(result.invoiceId).toBe("invoice-1");
    expect(result.reservationExpiresAt).toBeInstanceOf(Date);
  });
});
