import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import type { VisualizerUploadSnapshot } from '@/types/visualizer.types'

export function UploadCard({ upload }: { upload: VisualizerUploadSnapshot }) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
            <CardContent className="space-y-3 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={upload.customerPhotoUrl}
                    alt="Vehicle upload"
                    className="h-40 w-full rounded object-cover"
                />
                <Link
                    href={`/visualizer/uploads/${upload.id}`}
                    className="text-sm text-blue-400 hover:underline"
                >
                    View upload
                </Link>
            </CardContent>
        </Card>
    )
}
