'use server'

import { ensureInvoiceForBooking } from '@/lib/billing/actions/ensure-invoice-for-booking'
import { reserveSlot, type ReserveSlotInput, type ReservedBookingDTO } from './reserve-slot'

export type CreateBookingInput = ReserveSlotInput

export type CreatedBookingDTO = ReservedBookingDTO & {
    invoiceId: string
}

/**
 * Backward-compatible alias for slot reservation.
 *
 * The booking is created in `pending` status with a 15-minute reservation hold.
 */
export async function createBooking(input: CreateBookingInput): Promise<CreatedBookingDTO> {
    const booking = await reserveSlot(input)
    const { invoiceId } = await ensureInvoiceForBooking({ bookingId: booking.id })

    return {
        ...booking,
        invoiceId,
    }
}
