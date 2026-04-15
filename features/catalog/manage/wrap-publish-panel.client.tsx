'use client'


import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { CatalogCommandPanel } from '@/components/catalog/manage/catalog-command-panel'
import { WrapAssetReadinessPanel } from '@/components/catalog/manage/wrap-asset-readiness-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { publishWrap, unpublishWrap } from '@/lib/actions/catalog.actions'
import type { CatalogDetailDTO } from '@/types/catalog.types'
import { CheckCircle2, Clock } from 'lucide-react'


export interface WrapPublishPanelProps {
    wrap: CatalogDetailDTO
}


export function WrapPublishPanel({ wrap }: WrapPublishPanelProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [serverMessage, setServerMessage] = useState<string | null>(null)
    const { canPublish, isVisualizerReady, issues } = wrap.readiness
    const publishDisabled = isPending || (wrap.isHidden && !canPublish)

    const handleTogglePublish = () => {
        setServerMessage(null)
        startTransition(async () => {
            try {
                if (wrap.isHidden) {
                    await publishWrap(wrap.id)
                    setServerMessage('Wrap published successfully.')
                } else {
                    await unpublishWrap(wrap.id)
                    setServerMessage('Wrap hidden successfully.')
                }
                router.refresh()
            } catch (error) {
                setServerMessage(
                    error instanceof Error ? error.message : 'Failed to update publish state.'
                )
            }
        })
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Publish Status</CardTitle>
                    <CardDescription>Control visibility and readiness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        {wrap.isHidden ? (
                            <>
                                <Clock className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm font-medium">Hidden</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span className="text-sm font-medium">Published</span>
                            </>
                        )}
                    </div>

                    <Button
                        onClick={handleTogglePublish}
                        disabled={publishDisabled}
                        variant={wrap.isHidden ? 'default' : 'destructive'}
                        className="w-full"
                    >
                        {isPending ? 'Updating...' : wrap.isHidden ? 'Publish Wrap' : 'Hide Wrap'}
                    </Button>

                    {serverMessage ? (
                        <p className="text-sm text-neutral-300">{serverMessage}</p>
                    ) : null}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Readiness</CardTitle>
                    <CardDescription>Publication requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <WrapAssetReadinessPanel readiness={wrap.readiness} />

                    {issues.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-neutral-400">Issues:</p>
                            {issues.map((issue, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-2 text-xs text-neutral-400"
                                >
                                    <span className="mt-0.5 text-red-500">•</span>
                                    <span>{issue.message}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Asset Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-neutral-400">Hero Images:</span>
                            <Badge variant="outline">{wrap.readiness.activeHeroCount}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-400">Gallery Images:</span>
                            <Badge variant="outline">{wrap.readiness.activeGalleryCount}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-400">Visualizer References:</span>
                            <Badge variant="outline">
                                {wrap.readiness.activeHeroCount + wrap.readiness.activeGalleryCount}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <CatalogCommandPanel title="Actions Required">
                <ul className="space-y-2 text-sm text-neutral-300">
                    {canPublish ? (
                        <li>Wrap is publishable and ready for customer visibility.</li>
                    ) : (
                        <li>Resolve readiness issues before publishing this wrap.</li>
                    )}
                    {!isVisualizerReady ? <li>Attach one active hero asset.</li> : null}
                </ul>
            </CatalogCommandPanel>
        </div>
    )
}
