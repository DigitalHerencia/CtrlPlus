import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function VisualizerNotFound() {
    return (
        <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
            <CardHeader>
                <CardTitle>Visualizer item not found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-neutral-400">
                    The requested preview or upload could not be found.
                </p>
            </CardContent>
        </Card>
    )
}
