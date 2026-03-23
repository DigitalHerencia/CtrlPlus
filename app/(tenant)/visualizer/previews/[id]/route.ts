import { NextResponse } from 'next/server'

import { getPreviewById } from '@/lib/visualizer/fetchers/get-preview'

interface PreviewRouteProps {
    params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: PreviewRouteProps) {
    try {
        const { id } = await params
        const preview = await getPreviewById(id)

        return NextResponse.json({
            preview,
        })
    } catch {
        return NextResponse.json({
            preview: null,
        })
    }
}
