'use client'

import { useState } from 'react'

import { CatalogCommandPanel } from '@/components/catalog/manage/catalog-command-panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CatalogDetailDTO } from '@/types/catalog.types'
import { WrapMetadataEditor } from './wrap-metadata-editor.client'
import { WrapAssetManager } from './wrap-asset-manager.client'
import { WrapPublishPanel } from './wrap-publish-panel.client'

export interface WrapManagerDetailPageClientProps {
    wrap: CatalogDetailDTO
}

export function WrapManagerDetailPageClient({ wrap }: WrapManagerDetailPageClientProps) {
    const [activeTab, setActiveTab] = useState('metadata')

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="metadata">Metadata</TabsTrigger>
                        <TabsTrigger value="assets">Assets</TabsTrigger>
                    </TabsList>

                    <TabsContent value="metadata" className="space-y-4">
                        <WrapMetadataEditor wrap={wrap} />
                    </TabsContent>

                    <TabsContent value="assets" className="space-y-4">
                        <WrapAssetManager wrap={wrap} />
                    </TabsContent>
                </Tabs>
            </div>

            <div className="col-span-1">
                <CatalogCommandPanel title="Selected Wrap Workspace">
                    <WrapPublishPanel wrap={wrap} />
                </CatalogCommandPanel>
            </div>
        </div>
    )
}
