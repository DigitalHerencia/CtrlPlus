import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    constructWebhookEvent: vi.fn(),
    processStripeWebhookEvent: vi.fn(),
}))

vi.mock('@/lib/billing/stripe', () => ({
    constructWebhookEvent: mocks.constructWebhookEvent,
}))

vi.mock('@/lib/billing/actions/process-stripe-webhook-event', () => ({
    processStripeWebhookEvent: mocks.processStripeWebhookEvent,
}))

import { POST } from '@/app/api/stripe/webhook/route'

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

    it('returns 400 when signature verification fails', async () => {
        mocks.constructWebhookEvent.mockImplementation(() => {
            throw new Error('Invalid Stripe webhook signature')
        })

        const response = await POST(buildRequest('{"id":"evt_1"}', 'sig_123') as never)

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({
            error: 'Invalid Stripe webhook signature',
        })
    })

    it('returns 200 for ignored event types', async () => {
        mocks.constructWebhookEvent.mockReturnValue({ id: 'evt_1', type: 'payment_intent.created' })
        mocks.processStripeWebhookEvent.mockResolvedValue({
            kind: 'ignored',
            eventId: 'evt_1',
            eventType: 'payment_intent.created',
        })

        const response = await POST(
            buildRequest('{"id":"evt_1","type":"payment_intent.created"}', 'sig_123') as never
        )

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ ok: true, ignored: true })
    })

    it('returns 200 when payment is processed', async () => {
        const event = { id: 'evt_1', type: 'checkout.session.completed' }
        mocks.constructWebhookEvent.mockReturnValue(event)
        mocks.processStripeWebhookEvent.mockResolvedValue({
            kind: 'processed',
            result: {
                invoiceId: 'inv_123',
                paymentId: 'pay_123',
                status: 'succeeded',
            },
        })

        const response = await POST(
            buildRequest('{"id":"evt_1","type":"checkout.session.completed"}', 'sig_123') as never
        )

        expect(mocks.processStripeWebhookEvent).toHaveBeenCalledWith({
            event,
            payload: {
                id: 'evt_1',
                type: 'checkout.session.completed',
            },
        })
        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({
            invoiceId: 'inv_123',
            paymentId: 'pay_123',
            status: 'succeeded',
        })
    })

    it('returns 500 when the processor throws', async () => {
        mocks.constructWebhookEvent.mockReturnValue({
            id: 'evt_1',
            type: 'checkout.session.completed',
        })
        mocks.processStripeWebhookEvent.mockRejectedValue(new Error('boom'))

        const response = await POST(
            buildRequest('{"id":"evt_1","type":"checkout.session.completed"}', 'sig_123') as never
        )

        expect(response.status).toBe(500)
        await expect(response.json()).resolves.toEqual({ error: 'Webhook processing failed' })
    })
})
