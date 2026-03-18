import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    confirmPayment: vi.fn(),
}))

vi.mock('@/lib/billing/actions/confirm-payment', () => ({
    confirmPayment: mocks.confirmPayment,
}))

import { POST } from '../route'

function buildRequest(body: string, signature?: string): Request {
    const headers = new Headers()
    if (signature) {
        headers.set('stripe-signature', signature)
    }

    return new Request('https://ctrlplus.test/api/stripe/webhook', {
        method: 'POST',
        headers,
        body,
    })
}

describe('POST /api/stripe/webhook', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns 400 when stripe signature header is missing', async () => {
        const response = await POST(buildRequest('{}') as never)

        expect(response.status).toBe(400)
    })

    it('returns 200 for ignored event types', async () => {
        mocks.confirmPayment.mockRejectedValue(
            new Error('Unhandled Stripe event type: payment_intent.created')
        )

        const response = await POST(buildRequest('{}', 'sig_123') as never)

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ ok: true, ignored: true })
    })

    it('returns 200 when payment is processed', async () => {
        mocks.confirmPayment.mockResolvedValue({
            invoiceId: 'inv_123',
            paymentId: 'pay_123',
            status: 'succeeded',
        })

        const response = await POST(buildRequest('{}', 'sig_123') as never)

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({
            invoiceId: 'inv_123',
            paymentId: 'pay_123',
            status: 'succeeded',
        })
    })
})
