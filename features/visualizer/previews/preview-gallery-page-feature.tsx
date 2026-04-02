import Link from 'next/link'

import { PreviewGalleryTable } from '@/components/visualizer/previews/preview-gallery-table'
import { PreviewGalleryHeader } from '@/components/visualizer/previews/preview-gallery-header'
import { listMyVisualizerPreviews } from '@/lib/fetchers/visualizer.fetchers'

export async function PreviewGalleryPageFeature() {
    const previews = await listMyVisualizerPreviews()

    return (
        <div className="space-y-6">
            <PreviewGalleryHeader />
            <PreviewGalleryTable previews={previews} />
            <div>
                <Link
                    href="/visualizer/previews/new"
                    className="text-sm text-blue-400 hover:underline"
                >
                    Start a new preview
                </Link>
            </div>
        </div>
    )
}
