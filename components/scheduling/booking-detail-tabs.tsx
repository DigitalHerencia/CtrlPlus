/**
 * @introduction Components — TODO: short one-line summary of booking-detail-tabs.tsx
 *
 * @description TODO: longer description for booking-detail-tabs.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface BookingDetailTabsProps {
    summary: ReactNode
    timeline: ReactNode
}

/**
 * BookingDetailTabs — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
