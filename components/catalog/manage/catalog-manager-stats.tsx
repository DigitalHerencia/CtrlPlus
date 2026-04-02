import { Card, CardContent } from '@/components/ui/card'

interface CatalogManagerStatsProps {
    visible: number
    hidden: number
}

export function CatalogManagerStats({ visible, hidden }: CatalogManagerStatsProps) {
    return (
        <div className="grid gap-3 md:grid-cols-2">
            <Card className="border-neutral-800 bg-neutral-950/80">
                <CardContent className="pt-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                        Visible wraps
                    </p>
                    <p className="text-2xl font-black text-neutral-100">{visible}</p>
                </CardContent>
            </Card>
            <Card className="border-neutral-800 bg-neutral-950/80">
                <CardContent className="pt-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                        Hidden wraps
                    </p>
                    <p className="text-2xl font-black text-neutral-100">{hidden}</p>
                </CardContent>
            </Card>
        </div>
    )
}
