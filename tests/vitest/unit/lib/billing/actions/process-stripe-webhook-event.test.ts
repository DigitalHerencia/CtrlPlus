import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    prisma: {
        stripeWebhookEvent: {
            create: vi.fn(),
            findUnique: vi.fn(),
            updateMany: vi.fn(),
            update: vi.fn(),
        },
        payment: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
        invoice: {
            findFirst: vi.fn(),
            update: vi.fn(),
        },
        booking: {
            update: vi.fn(),
        },
        auditLog: {
            create: vi.fn(),
        },
        $transaction: vi.fn(),
    },
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

import { processStripeWebhookEvent } from '@/lib/actions/billing.actions'

describe('processStripeWebhookEvent', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.prisma.$transaction.mockImplementation(async (operations: unknown[]) =>
            Promise.all(operations as Promise<unknown>[])
        )
    })

    it('processes a new checkout session and stores replayable payload metadata', async () => {
        mocks.prisma.stripeWebhookEvent.create.mockResolvedValue({})
        mocks.prisma.invoice.findFirst.mockResolvedValue({
            id: 'inv_123',
            bookingId: 'booking_123',
            totalAmount: 1200,
        })
        mocks.prisma.payment.findUnique.mockResolvedValueOnce(null)
        mocks.prisma.payment.create.mockResolvedValue({ id: 'pay_123' })
        mocks.prisma.invoice.update.mockResolvedValue({})
        mocks.prisma.booking.update.mockResolvedValue({})
        mocks.prisma.auditLog.create.mockResolvedValue({})
        mocks.prisma.stripeWebhookEvent.update.mockResolvedValue({})

        const event = {
            id: 'evt_123',
            type: 'checkout.session.completed',
            data: {
                object: {
                    client_reference_id: 'inv_123',
                    payment_intent: 'pi_123',
                    amount_total: 1200,
                },
            },
        }

        const result = await processStripeWebhookEvent({
            event: event as never,
            payload: event,
        })

        expect(mocks.prisma.stripeWebhookEvent.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    id: 'evt_123',
                    payload: event,
                    lastAttemptedAt: expect.any(Date),
                }),
            })
        )
        expect(result).toEqual({
            kind: 'processed',
            result: {
                invoiceId: 'inv_123',
                paymentId: 'pay_123',
                status: 'succeeded',
            },
        })
    })

    it('marks unsupported events as ignored and finalizes them as processed', async () => {
        mocks.prisma.stripeWebhookEvent.create.mockResolvedValue({})
        mocks.prisma.stripeWebhookEvent.update.mockResolvedValue({})

        const event = {
            id: 'evt_ignored',
            type: 'payment_intent.created',
            data: { object: {} },
        }

        const result = await processStripeWebhookEvent({
            event: event as never,
            payload: event,
        })

        expect(result).toEqual({
            kind: 'ignored',
            eventId: 'evt_ignored',
            eventType: 'payment_intent.created',
        })
        expect(mocks.prisma.stripeWebhookEvent.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ status: 'processed', error: null }),
            })
        )
    })

    it('returns existing payment state for already processed events', async () => {
        mocks.prisma.stripeWebhookEvent.create.mockRejectedValue({ code: 'P2002' })
        mocks.prisma.stripeWebhookEvent.findUnique.mockResolvedValueOnce({ status: 'processed' })
        mocks.prisma.payment.findUnique.mockResolvedValue({
            id: 'pay_existing',
            invoiceId: 'inv_123',
            status: 'succeeded',
        })

        const event = {
            id: 'evt_existing',
            type: 'checkout.session.completed',
            data: {
                object: {
                    client_reference_id: 'inv_123',
                    payment_intent: 'pi_existing',
                },
            },
        }

        const result = await processStripeWebhookEvent({
            event: event as never,
            payload: event,
        })

        expect(result).toEqual({
            kind: 'processed',
            result: {
                invoiceId: 'inv_123',
                paymentId: 'pay_existing',
                status: 'succeeded',
            },
        })
    })

    it('finalizes the webhook row as failed when processing raises a domain error', async () => {
        mocks.prisma.stripeWebhookEvent.create.mockResolvedValue({})
        mocks.prisma.invoice.findFirst.mockResolvedValue(null)
        mocks.prisma.stripeWebhookEvent.update.mockResolvedValue({})

        const event = {
            id: 'evt_missing_invoice',
            type: 'checkout.session.completed',
            data: {
                object: {
                    client_reference_id: 'inv_missing',
                    payment_intent: 'pi_missing',
                },
            },
        }

        await expect(
            processStripeWebhookEvent({
                event: event as never,
                payload: event,
            })
        ).rejects.toThrow('Invoice not found: inv_missing')

        expect(mocks.prisma.stripeWebhookEvent.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    status: 'failed',
                    error: 'Invoice not found: inv_missing',
                }),
            })
        )
    })
})
