import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PreviewStatusBadge } from './preview-status-badge'
import type { VisualizerPreviewDTO } from '@/types/visualizer.types'

export function PreviewCard({ preview }: { preview: VisualizerPreviewDTO }) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
            <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm">{preview.id.slice(0, 8)}</CardTitle>
                <PreviewStatusBadge status={preview.status} />
            </CardHeader>
            <CardContent className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={preview.processedImageUrl ?? preview.customerPhotoUrl}
                    alt="Preview thumbnail"
                    className="h-40 w-full rounded object-cover"
                />
                <Link
                    href={`/visualizer/previews/${preview.id}`}
                    className="text-sm text-blue-400 hover:underline"
                >
                    View preview
                </Link>
            </CardContent>
        </Card>
    )
}
