import { NextResponse } from 'next/server'

import { observability } from '@/lib/integrations/observability'

export async function GET() {
    try {
        return NextResponse.json(
            {
                status: 'healthy',
                message: 'CtrlPlus API is running.',
                updatedAt: new Date().toISOString(),
            },
            { status: 200 }
        )
    } catch (error: unknown) {
        await observability.captureException(error, { route: '/api/health' })

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
