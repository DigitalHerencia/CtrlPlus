"use server";

import { reserveSlot, type ReserveSlotInput, type ReservedBookingDTO } from "./reserve-slot";

export type CreateBookingInput = ReserveSlotInput;

export type CreatedBookingDTO = ReservedBookingDTO;

/**
 * Backward-compatible alias for slot reservation.
 *
 * The booking is created in `pending` status with a 15-minute reservation hold.
 */
export async function createBooking(input: CreateBookingInput): Promise<CreatedBookingDTO> {
  return reserveSlot(input);
}
