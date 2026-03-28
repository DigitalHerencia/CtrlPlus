import { NextResponse } from 'next/server'

import { getPreviewById } from '@/lib/fetchers/visualizer.fetchers'

interface PreviewRouteProps {
    params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: PreviewRouteProps) {
    try {
        const { id } = await params
        const preview = await getPreviewById(id)

        if (!preview) {
            return NextResponse.json({ error: 'Preview not found' }, { status: 404 })
        }

        return NextResponse.json(
            { preview },
            {
                status: 200,
                headers: {
                    // short cache for previews; allow stale-while-revalidate
                    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
                },
            }
        )
    } catch (error: unknown) {
        console.error('Preview route error', error)
        return NextResponse.json({ error: 'Preview lookup failed' }, { status: 500 })
    }
}
