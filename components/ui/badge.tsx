
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
    'inline-flex items-center   border px-2.5 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30',
    {
        variants: {
            variant: {
                default:
                    'border-blue-600/30 bg-blue-600/15 text-blue-200 shadow-[0_0_0_1px_rgba(37,99,235,0.12)] hover:bg-blue-600/20',
                secondary:
                    'border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800',
                destructive:
                    'border-red-500/40 bg-red-500/12 text-red-200 shadow-sm hover:bg-red-500/18',
                outline: 'border-neutral-700 text-neutral-200',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)


export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
