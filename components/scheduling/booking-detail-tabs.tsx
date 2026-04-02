import type { ReactNode } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface BookingDetailTabsProps {
    summary: ReactNode
    timeline: ReactNode
}

export function BookingDetailTabs({ summary, timeline }: BookingDetailTabsProps) {
    return (
        <Tabs defaultValue="summary" className="space-y-4">
            <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">{summary}</TabsContent>
            <TabsContent value="timeline">{timeline}</TabsContent>
        </Tabs>
    )
}
