import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type ReactNode } from 'react'

interface InvoiceDetailTabsProps {
    summary: ReactNode
    paymentHistory: ReactNode
}

export function InvoiceDetailTabs({ summary, paymentHistory }: InvoiceDetailTabsProps) {
    return (
        <Tabs defaultValue="summary" className="w-full">
            <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="mt-4">
                {summary}
            </TabsContent>
            <TabsContent value="payments" className="mt-4">
                {paymentHistory}
            </TabsContent>
        </Tabs>
    )
}
