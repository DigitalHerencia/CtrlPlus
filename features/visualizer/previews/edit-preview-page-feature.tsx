import Link from 'next/link'

import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
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
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Visualizer"
                title="Edit Preview"
                description="Fine-tune this concept setup so the final render better matches your customer’s vision and wrap goals."
            />
            <WorkspacePageContextCard
                title="Preview Navigation"
                description="Return to detail view while editor options are being expanded"
            >
                <Link
                    href={`/visualizer/previews/${preview.id}`}
                    className="text-sm text-blue-400 hover:underline"
                >
                    Back to preview detail
                </Link>
            </WorkspacePageContextCard>
            <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
                <CardHeader>
                    <CardTitle>Edit Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-neutral-400">Preview ID: {preview.id}</p>
                    <p className="text-sm text-neutral-400">
                        Settings editing scaffold is in place for this route.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
