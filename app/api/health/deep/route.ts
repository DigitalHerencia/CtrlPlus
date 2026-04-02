import { NextResponse } from 'next/server'

import { getDependencyHealth, getPlatformHealthOverview } from '@/lib/fetchers/platform.fetchers'
import { observability } from '@/lib/integrations/observability'

export async function GET() {
    try {
        const [health, dependencies] = await Promise.all([
            getPlatformHealthOverview(),
            getDependencyHealth(),
        ])

        const statusCode = health.status === 'down' ? 503 : 200

        return NextResponse.json(
            {
                status: health.status,
                services: health.services,
                dependencies,
                updatedAt: health.updatedAt,
            },
            { status: statusCode }
        )
    } catch (error: unknown) {
        await observability.captureException(error, { route: '/api/health/deep' })

        return NextResponse.json(
            {
                status: 'down',
                error: 'Failed to process request',
                code: 'INTERNAL_ERROR',
            },
            { status: 500 }
        )
    }
}
