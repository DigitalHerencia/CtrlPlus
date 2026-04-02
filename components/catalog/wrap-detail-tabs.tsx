import type { ReactNode } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface WrapDetailTabsProps {
    overview: ReactNode
    gallery: ReactNode
}

export function WrapDetailTabs({ overview, gallery }: WrapDetailTabsProps) {
    return (
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
                {overview}
            </TabsContent>
            <TabsContent value="gallery" className="space-y-4">
                {gallery}
            </TabsContent>
        </Tabs>
    )
}
