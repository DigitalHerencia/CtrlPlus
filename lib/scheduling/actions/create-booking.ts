'use server'

import { ensureInvoiceForBooking } from '@/lib/billing/actions/ensure-invoice-for-booking'
import { type ReserveSlotInput, type ReservedBookingDTO } from '@/types/scheduling'
import { revalidateBillingBookingRoute, revalidateSchedulingPages } from '../revalidation'
import { reserveSlot } from './reserve-slot'

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
    revalidateSchedulingPages()
    revalidateBillingBookingRoute(invoiceId)

    return {
        ...booking,
        invoiceId,
    }
}
