import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SchedulingManageLoading() {
    return (
        <div className="space-y-4">
            <div className="h-10 w-64 rounded bg-neutral-900" />
            <Card className="border-neutral-800 bg-neutral-950/80">
                <CardHeader>
                    <CardTitle className="h-6 w-48 rounded bg-neutral-900" />
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="h-10 rounded bg-neutral-900" />
                    <div className="h-10 rounded bg-neutral-900" />
                    <div className="h-10 rounded bg-neutral-900" />
                </CardContent>
            </Card>
        </div>
    )
}
