import { NextResponse } from 'next/server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'
import { resolveVisualizerAssetDeliveryUrl } from '@/lib/visualizer/asset-delivery'
import { verifySignedVisualizerAssetRequest } from '@/lib/visualizer/signed-asset-urls'

interface VisualizerUploadImageRouteProps {
    params: Promise<{ uploadId: string }>
}

export async function GET(request: Request, { params }: VisualizerUploadImageRouteProps) {
    try {
        const session = await getSession()
        const userId = session.userId
        if (!session.isAuthenticated || !userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        requireCapability(session.authz, 'visualizer.use')

        const { uploadId } = await params
        const url = new URL(request.url)
        const pathname = `/api/visualizer/uploads/${uploadId}/image`
        const isValidSignature = verifySignedVisualizerAssetRequest(
            pathname,
            url.searchParams.get('expires'),
            url.searchParams.get('signature')
        )

        if (!isValidSignature) {
            return NextResponse.json({ error: 'Invalid asset URL' }, { status: 403 })
        }

        const upload = await prisma.visualizerUpload.findFirst({
            where: {
                id: uploadId,
                ownerClerkUserId: userId,
                deletedAt: null,
            },
            select: {
                legacyUrl: true,
                cloudinaryPublicId: true,
                cloudinaryVersion: true,
                cloudinaryResourceType: true,
                cloudinaryDeliveryType: true,
                format: true,
            },
        })

        if (!upload) {
            return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
        }

        const target = await resolveVisualizerAssetDeliveryUrl(
            {
                legacyUrl: upload.legacyUrl,
                publicId: upload.cloudinaryPublicId,
                version: upload.cloudinaryVersion,
                resourceType: upload.cloudinaryResourceType ?? 'image',
                deliveryType: upload.cloudinaryDeliveryType ?? 'authenticated',
                format: upload.format,
            },
            'detail'
        )

        if (!target) {
            return NextResponse.json({ error: 'Upload asset unavailable' }, { status: 404 })
        }

        return NextResponse.redirect(target, {
            status: 307,
            headers: {
                'Cache-Control': 'private, no-store, max-age=0',
            },
        })
    } catch (error) {
        console.error('Visualizer upload image route error', error)
        return NextResponse.json({ error: 'Upload image lookup failed' }, { status: 500 })
    }
}
