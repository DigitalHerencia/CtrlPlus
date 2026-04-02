import { NextResponse } from 'next/server'

import { getPreviewById } from '@/lib/fetchers/visualizer.fetchers'

interface PreviewRouteProps {
    params: Promise<{ previewId: string }>
}

export async function GET(_: Request, { params }: PreviewRouteProps) {
    try {
        const { previewId } = await params
        const preview = await getPreviewById(previewId)

        if (!preview) {
            return NextResponse.json({ error: 'Preview not found' }, { status: 404 })
        }

        return NextResponse.json(
            { preview },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
                },
            }
        )
    } catch (error: unknown) {
        console.error('Preview route error', error)
        return NextResponse.json({ error: 'Preview lookup failed' }, { status: 500 })
    }
}
