import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
interface InvoiceStatusBadgeProps {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    className?: string
}
export function InvoiceStatusBadge({ label, variant, className }: InvoiceStatusBadgeProps) {
    return (
        <Badge variant={variant} className={cn(className)}>
            {label}
        </Badge>
    )
}
