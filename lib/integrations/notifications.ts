/**
 * @introduction Integrations — TODO: short one-line summary of notifications.ts
 *
 * @description TODO: longer description for notifications.ts. Keep it short — one or two sentences.
 * Domain: integrations
 * Public: TODO (yes/no)
 */
import 'server-only'

import { prisma } from '@/lib/db/prisma'

const RESEND_API_URL = 'https://api.resend.com/emails'
const DEFAULT_TENANT_ID = 'default-tenant'

/**
 * SendNotificationEmailInput — TODO: brief description of this type.
 */
/**
 * SendNotificationEmailInput — TODO: brief description of this type.
 */
export interface SendNotificationEmailInput {
    to: string
    subject: string
    text: string
}

/**
 * SendNotificationEmailResult — TODO: brief description of this type.
 */
/**
 * SendNotificationEmailResult — TODO: brief description of this type.
 */
export interface SendNotificationEmailResult {
    delivered: boolean
    skipped: boolean
    providerMessageId: string | null
    reason: string | null
}

function getNotificationEnv() {
    const apiKey = process.env.RESEND_API_KEY?.trim() ?? ''
    const from = process.env.NOTIFICATION_FROM_EMAIL?.trim() ?? ''

    return {
        apiKey,
        from,
    }
}

export async function getTenantNotificationEmail(): Promise<string | null> {
    const latestSnapshot = await prisma.auditLog.findFirst({
        where: {
            action: 'TENANT_SETTINGS_UPDATED',
            resourceType: 'TenantSettings',
            resourceId: DEFAULT_TENANT_ID,
            deletedAt: null,
        },
        orderBy: { timestamp: 'desc' },
        select: {
            details: true,
        },
    })

    if (!latestSnapshot?.details) {
        return null
    }

    try {
        const parsed = JSON.parse(latestSnapshot.details) as Record<string, unknown>
        return typeof parsed.notificationEmail === 'string' ? parsed.notificationEmail : null
    } catch {
        return null
    }
}

export async function sendNotificationEmail(
    input: SendNotificationEmailInput
): Promise<SendNotificationEmailResult> {
    const env = getNotificationEnv()

    if (!env.apiKey || !env.from) {
        return {
            delivered: false,
            skipped: true,
            providerMessageId: null,
            reason: 'Notification email provider is not configured.',
        }
    }

    const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: env.from,
            to: [input.to],
            subject: input.subject,
            text: input.text,
        }),
    })

    if (!response.ok) {
        const body = await response.text()
        return {
            delivered: false,
            skipped: false,
            providerMessageId: null,
            reason: body || `Notification send failed with status ${response.status}.`,
        }
    }

    const payload = (await response.json()) as { id?: string }

    return {
        delivered: true,
        skipped: false,
        providerMessageId: payload.id ?? null,
        reason: null,
    }
}
