import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPreviewById } from '@/lib/fetchers/visualizer.fetchers'
import { notFound } from 'next/navigation'

interface EditPreviewPageFeatureProps {
    previewId: string
}

export async function EditPreviewPageFeature({ previewId }: EditPreviewPageFeatureProps) {
    const preview = await getPreviewById(previewId)

    if (!preview) {
        notFound()
    }

    return (
        <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
            <CardHeader>
                <CardTitle>Edit Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-neutral-400">Preview ID: {preview.id}</p>
                <p className="text-sm text-neutral-400">
                    Settings editing scaffold is in place for this route.
                </p>
                <Link
                    href={`/visualizer/previews/${preview.id}`}
                    className="text-sm text-blue-400 hover:underline"
                >
                    Back to preview detail
                </Link>
            </CardContent>
        </Card>
    )
}
