import { NextResponse } from 'next/server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { getMyVisualizerPreviewImageAssetById } from '@/lib/fetchers/visualizer.fetchers'
import { resolveVisualizerAssetDeliveryUrl } from '@/lib/visualizer/asset-delivery'
import { verifySignedVisualizerAssetRequest } from '@/lib/visualizer/signed-asset-urls'

interface VisualizerPreviewImageRouteProps {
    params: Promise<{ previewId: string }>
}

export async function GET(request: Request, { params }: VisualizerPreviewImageRouteProps) {
    try {
        const session = await getSession()
        const userId = session.userId
        if (!session.isAuthenticated || !userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        requireCapability(session.authz, 'visualizer.use')

        const { previewId } = await params
        const url = new URL(request.url)
        const pathname = `/api/visualizer/previews/${previewId}/image`
        const isValidSignature = verifySignedVisualizerAssetRequest(
            pathname,
            url.searchParams.get('expires'),
            url.searchParams.get('signature')
        )

        if (!isValidSignature) {
            return NextResponse.json({ error: 'Invalid asset URL' }, { status: 403 })
        }

        const preview = await getMyVisualizerPreviewImageAssetById(previewId, userId)

        if (!preview) {
            return NextResponse.json({ error: 'Preview not found' }, { status: 404 })
        }

        const target = await resolveVisualizerAssetDeliveryUrl(
            {
                legacyUrl: preview.resultLegacyUrl ?? preview.processedImageUrl,
                publicId: preview.resultCloudinaryPublicId,
                version: preview.resultCloudinaryVersion,
                resourceType: preview.resultCloudinaryResourceType ?? 'image',
                deliveryType: preview.resultCloudinaryDeliveryType ?? 'authenticated',
                format: preview.resultFormat,
            },
            'detail'
        )

        if (!target) {
            return NextResponse.json({ error: 'Preview asset unavailable' }, { status: 404 })
        }

        return NextResponse.redirect(target, {
            status: 307,
            headers: {
                'Cache-Control': 'private, no-store, max-age=0',
            },
        })
    } catch (error) {
        console.error('Visualizer preview image route error', error)
        return NextResponse.json({ error: 'Preview image lookup failed' }, { status: 500 })
    }
}
