import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    prisma: {
        invoice: {
            findFirst: vi.fn(),
            update: vi.fn(),
        },
        payment: {
            create: vi.fn(),
        },
        auditLog: {
            create: vi.fn(),
        },
        $transaction: vi.fn(),
    },
    requireOwnerOrPlatformAdmin: vi.fn(),
    getStripeClient: vi.fn(),
    stripeRefundsCreate: vi.fn(),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

vi.mock('@/lib/integrations/stripe', () => ({
    getAppBaseUrl: vi.fn(),
    getStripeClient: mocks.getStripeClient,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('@/lib/authz/guards', () => ({
    requireOwnerOrPlatformAdmin: mocks.requireOwnerOrPlatformAdmin,
    getBillingAccessContext: vi.fn(),
    requireInvoiceWriteAccess: vi.fn(),
}))

import { applyCredit, refundInvoice, voidInvoice } from '@/lib/actions/billing.actions'

describe('billing status transitions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.requireOwnerOrPlatformAdmin.mockResolvedValue({ userId: 'owner-1' })
        mocks.getStripeClient.mockReturnValue({
            refunds: {
                create: mocks.stripeRefundsCreate,
            },
        })
        mocks.prisma.$transaction.mockImplementation(async (ops: unknown[]) =>
            Promise.all(ops as Promise<unknown>[])
        )
        mocks.prisma.invoice.update.mockResolvedValue({})
        mocks.prisma.payment.create.mockResolvedValue({ id: 'payment-1' })
        mocks.prisma.auditLog.create.mockResolvedValue({})
        mocks.stripeRefundsCreate.mockResolvedValue({
            id: 're_123',
            status: 'succeeded',
        })
    })

    it('applyCredit rejects paid/refunded/void invoices', async () => {
        mocks.prisma.invoice.findFirst.mockResolvedValueOnce({
            id: 'inv-paid',
            status: 'paid',
            totalAmount: 500,
        })

        await expect(applyCredit({ invoiceId: 'inv-paid', amount: 100 })).rejects.toThrow(
            'Cannot apply credit to invoice in paid status'
        )
        expect(mocks.prisma.$transaction).not.toHaveBeenCalled()
    })

    it('applyCredit clamps total at zero and creates credit line item', async () => {
        mocks.prisma.invoice.findFirst.mockResolvedValueOnce({
            id: 'inv-credit',
            status: 'issued',
            totalAmount: 75,
        })

        await expect(
            applyCredit({ invoiceId: 'inv-credit', amount: 150, notes: 'manual adjustment' })
        ).resolves.toEqual({
            invoiceId: 'inv-credit',
            status: 'issued',
        })

        expect(mocks.prisma.invoice.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    totalAmount: 0,
                    lineItems: expect.objectContaining({
                        create: expect.objectContaining({
                            unitPrice: -150,
                            totalPrice: -150,
                        }),
                    }),
                }),
            })
        )
    })

    it('voidInvoice rejects paid/refunded invoices', async () => {
        mocks.prisma.invoice.findFirst.mockResolvedValueOnce({
            id: 'inv-refunded',
            status: 'refunded',
        })

        await expect(voidInvoice({ invoiceId: 'inv-refunded' })).rejects.toThrow(
            'Cannot void invoice in refunded status'
        )
    })

    it('voidInvoice marks invoice as void', async () => {
        mocks.prisma.invoice.findFirst.mockResolvedValueOnce({
            id: 'inv-void',
            status: 'issued',
        })

        await expect(voidInvoice({ invoiceId: 'inv-void' })).resolves.toEqual({
            invoiceId: 'inv-void',
            status: 'void',
        })
        expect(mocks.prisma.invoice.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'inv-void' },
                data: { status: 'void' },
            })
        )
    })

    it('refundInvoice only allows paid invoices', async () => {
        mocks.prisma.invoice.findFirst.mockResolvedValueOnce({
            id: 'inv-draft',
            status: 'draft',
            totalAmount: 300,
        })

        await expect(refundInvoice({ invoiceId: 'inv-draft' })).rejects.toThrow(
            'Cannot refund invoice in draft status'
        )
    })

    it('refundInvoice clamps refund amount to invoice total', async () => {
        mocks.prisma.invoice.findFirst.mockResolvedValueOnce({
            id: 'inv-paid',
            status: 'paid',
            totalAmount: 300,
            payments: [
                {
                    id: 'pay-source',
                    stripePaymentIntentId: 'pi_123',
                    status: 'succeeded',
                    amount: 300,
                },
            ],
        })

        await expect(refundInvoice({ invoiceId: 'inv-paid', amount: 900 })).resolves.toEqual({
            invoiceId: 'inv-paid',
            status: 'refunded',
        })

        expect(mocks.stripeRefundsCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                payment_intent: 'pi_123',
                amount: 300,
            }),
            expect.objectContaining({
                idempotencyKey: 'billing:refund:inv-paid:pay-source:300',
            })
        )
        expect(mocks.prisma.payment.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    invoiceId: 'inv-paid',
                    stripePaymentIntentId: 're_123',
                    amount: -300,
                }),
            })
        )
        expect(mocks.prisma.invoice.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'inv-paid' },
                data: { status: 'refunded' },
            })
        )
    })
})
