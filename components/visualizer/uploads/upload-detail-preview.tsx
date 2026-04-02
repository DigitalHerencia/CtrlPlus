import type { VisualizerUploadSnapshot } from '@/types/visualizer.types'

export function UploadDetailPreview({ upload }: { upload: VisualizerUploadSnapshot }) {
    return (
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/90 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={upload.customerPhotoUrl}
                alt="Uploaded vehicle"
                className="max-h-140 w-full rounded object-contain"
            />
        </div>
    )
}
