import { vi, describe, it, expect } from 'vitest'

vi.mock('@clerk/nextjs/webhooks', () => ({
    verifyWebhook: vi.fn(async () => ({ type: 'user.created', data: { id: 'clerk|123' } })),
}))

import { verifyAndParseClerkWebhook } from '@/lib/auth/clerk-webhook'
import { NextRequest } from 'next/server'

describe('verifyAndParseClerkWebhook', () => {
    it('returns parsed event when verifyWebhook succeeds', async () => {
        // Create a minimal NextRequest-like object for the helper
        const req = new Request('http://localhost') as unknown as NextRequest

        const evt = await verifyAndParseClerkWebhook(req)

        expect(evt).toHaveProperty('type', 'user.created')
        expect(evt).toHaveProperty('data')
    })
})
