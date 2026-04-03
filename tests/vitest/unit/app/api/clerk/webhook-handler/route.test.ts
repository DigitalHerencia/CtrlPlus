import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db/prisma', () => ({
    prisma: {
        clerkWebhookEvent: {
            create: vi.fn(),
            findUnique: vi.fn(),
            updateMany: vi.fn(),
        },
    },
}))

import { prisma } from '@/lib/db/prisma'
import { claimClerkWebhookEvent } from '@/lib/actions/auth-webhook.actions'
import * as webhookActions from '@/lib/actions/auth-webhook.actions'
import * as clerkIntegration from '@/lib/integrations/clerk'
import * as clerkWebhookEnv from '@/lib/integrations/clerk-webhook-env'
import {
    isClerkSubscriptionSyncEnabled,
    shouldSkipWebhookEventInCurrentEnv,
} from '@/lib/integrations/clerk-webhook-env'
import { POST } from '@/app/api/clerk/webhook-handler/route'

describe('clerk webhook env gating', () => {
    beforeEach(() => {
        vi.unstubAllEnvs()
        delete process.env.ENABLE_CLERK_SUBSCRIPTION_SYNC
    })

    it('disables subscription sync in production', () => {
        vi.stubEnv('NODE_ENV', 'production')

        expect(isClerkSubscriptionSyncEnabled()).toBe(false)
        expect(shouldSkipWebhookEventInCurrentEnv('subscription.created')).toBe(true)
    })

    it('allows subscription sync in development unless explicitly disabled', () => {
        vi.stubEnv('NODE_ENV', 'development')
        process.env.ENABLE_CLERK_SUBSCRIPTION_SYNC = 'true'

        expect(isClerkSubscriptionSyncEnabled()).toBe(true)
        expect(shouldSkipWebhookEventInCurrentEnv('subscription.created')).toBe(false)
    })

    it('skips dev-only events when sync disabled', () => {
        vi.stubEnv('NODE_ENV', 'development')
        process.env.ENABLE_CLERK_SUBSCRIPTION_SYNC = 'false'

        expect(shouldSkipWebhookEventInCurrentEnv('paymentAttempt.created')).toBe(true)
        expect(shouldSkipWebhookEventInCurrentEnv('user.created')).toBe(false)
    })
})

describe('clerk webhook idempotency', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('claims unseen events for processing', async () => {
        vi.spyOn(prisma.clerkWebhookEvent, 'create').mockResolvedValue({} as never)

        const state = await claimClerkWebhookEvent('evt_1', 'user.created')

        expect(state).toBe('process')
    })

    it('returns processed for previously processed events', async () => {
        vi.spyOn(prisma.clerkWebhookEvent, 'create').mockRejectedValue({ code: 'P2002' })
        vi.spyOn(prisma.clerkWebhookEvent, 'findUnique').mockResolvedValue({
            status: 'processed',
        } as never)

        const state = await claimClerkWebhookEvent('evt_2', 'user.updated')

        expect(state).toBe('processed')
    })
})

describe('POST /api/clerk/webhook-handler', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns 500 when signing secret is unavailable', async () => {
        vi.spyOn(clerkWebhookEnv, 'ensureClerkWebhookSigningSecret').mockReturnValue('')

        const response = await POST(new Request('https://ctrlplus.test/api/clerk/webhook-handler') as never)

        expect(response.status).toBe(500)
        await expect(response.json()).resolves.toEqual({ error: 'Webhook not configured' })
    })

    it('returns 400 when svix-id header is missing', async () => {
        vi.spyOn(clerkWebhookEnv, 'ensureClerkWebhookSigningSecret').mockReturnValue('whsec_test')

        const request = new Request('https://ctrlplus.test/api/clerk/webhook-handler', {
            method: 'POST',
        })

        const response = await POST(request as never)
        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({ error: 'Missing svix-id header' })
    })

    it('returns 200 for ignored webhook events', async () => {
        vi.spyOn(clerkWebhookEnv, 'ensureClerkWebhookSigningSecret').mockReturnValue('whsec_test')
        vi.spyOn(clerkIntegration, 'verifyAndParseClerkWebhook').mockResolvedValue({
            type: 'session.created',
            data: {},
        } as never)
        vi.spyOn(webhookActions, 'processClerkWebhookEvent').mockResolvedValue({
            kind: 'ignored',
            message: 'ignored for environment',
        })

        const request = new Request('https://ctrlplus.test/api/clerk/webhook-handler', {
            method: 'POST',
            headers: new Headers({ 'svix-id': 'evt_ignored' }),
        })

        const response = await POST(request as never)
        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ message: 'ignored for environment' })
    })

    it('returns 200 for duplicate events', async () => {
        vi.spyOn(clerkWebhookEnv, 'ensureClerkWebhookSigningSecret').mockReturnValue('whsec_test')
        vi.spyOn(clerkIntegration, 'verifyAndParseClerkWebhook').mockResolvedValue({
            type: 'session.created',
            data: {},
        } as never)
        vi.spyOn(webhookActions, 'processClerkWebhookEvent').mockResolvedValue({
            kind: 'duplicate',
            state: 'processed',
        })

        const request = new Request('https://ctrlplus.test/api/clerk/webhook-handler', {
            method: 'POST',
            headers: new Headers({ 'svix-id': 'evt_duplicate' }),
        })

        const response = await POST(request as never)
        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ message: 'Event already processed' })
    })

    it('returns 200 when event is processed', async () => {
        vi.spyOn(clerkWebhookEnv, 'ensureClerkWebhookSigningSecret').mockReturnValue('whsec_test')
        vi.spyOn(clerkIntegration, 'verifyAndParseClerkWebhook').mockResolvedValue({
            type: 'user.created',
            data: {},
        } as never)
        vi.spyOn(webhookActions, 'processClerkWebhookEvent').mockResolvedValue({
            kind: 'processed',
        })

        const request = new Request('https://ctrlplus.test/api/clerk/webhook-handler', {
            method: 'POST',
            headers: new Headers({ 'svix-id': 'evt_processed' }),
        })

        const response = await POST(request as never)
        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ received: true })
    })

    it('returns 400 when verification/processing throws', async () => {
        vi.spyOn(clerkWebhookEnv, 'ensureClerkWebhookSigningSecret').mockReturnValue('whsec_test')
        vi.spyOn(clerkIntegration, 'verifyAndParseClerkWebhook').mockRejectedValue(new Error('Invalid signature'))

        const request = new Request('https://ctrlplus.test/api/clerk/webhook-handler', {
            method: 'POST',
            headers: new Headers({ 'svix-id': 'evt_invalid' }),
        })

        const response = await POST(request as never)
        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({ error: 'Webhook processing failed' })
    })
})
