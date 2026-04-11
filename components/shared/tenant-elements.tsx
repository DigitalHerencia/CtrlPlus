/**
 * @introduction Components — TODO: short one-line summary of tenant-elements.tsx
 *
 * @description TODO: longer description for tenant-elements.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

interface WorkspacePageIntroProps {
    label: string
    title: string
    description: string
    className?: string
}

/**
 * WorkspacePageIntro — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WorkspacePageIntro({
    label,
    title,
    description,
    className,
}: WorkspacePageIntroProps) {
    return (
        <section className={cn('border border-neutral-700 bg-neutral-950/80 px-6 py-7', className)}>
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
                    {label}
                </p>
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-neutral-100 sm:text-4xl">
                        {title}
                    </h1>
                    <p className="max-w-3xl text-sm text-neutral-100 sm:text-base">{description}</p>
                </div>
            </div>
        </section>
    )
}

interface WorkspacePageContextCardProps {
    title?: string
    description?: string
    className?: string
    children: ReactNode
}

/**
 * WorkspacePageContextCard — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WorkspacePageContextCard({
    title,
    description,
    className,
    children,
}: WorkspacePageContextCardProps) {
    return (
        <section className={cn('border border-neutral-700 bg-neutral-950/80 px-6 py-6', className)}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {title || description ? (
                    <div className="space-y-1">
                        {title ? (
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-100">
                                {title}
                            </p>
                        ) : null}
                        {description ? (
                            <p className="text-sm text-neutral-100">{description}</p>
                        ) : null}
                    </div>
                ) : null}
                <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
                    {children}
                </div>
            </div>
        </section>
    )
}

interface WorkspaceMetricCardProps {
    label: string
    value: ReactNode
    description?: ReactNode
    icon?: LucideIcon
    badge?: string
    className?: string
}

/**
 * WorkspaceMetricCard — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WorkspaceMetricCard({
    label,
    value,
    description,
    icon: Icon,
    badge,
    className,
}: WorkspaceMetricCardProps) {
    return (
        <Card className={cn('border-neutral-700 bg-neutral-950/80 text-neutral-100', className)}>
            <CardHeader className="gap-3 pb-2">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                        <CardDescription className="text-xs uppercase tracking-[0.18em] text-neutral-100">
                            {label}
                        </CardDescription>
                        <CardTitle className="text-3xl font-black tracking-tight text-neutral-100">
                            {value}
                        </CardTitle>
                    </div>
                    {Icon ? (
                        <span className="flex h-11 w-11 items-center justify-center border border-blue-600 bg-neutral-900 text-blue-600">
                            <Icon className="h-5 w-5" />
                        </span>
                    ) : null}
                </div>
            </CardHeader>
            {(description || badge) && (
                <CardContent className="flex items-center justify-between gap-3 pt-0">
                    <p className="text-sm text-neutral-100">{description}</p>
                    {badge ? (
                        <Badge variant="outline" className="border-neutral-700 text-neutral-100">
                            {badge}
                        </Badge>
                    ) : null}
                </CardContent>
            )}
        </Card>
    )
}

interface WorkspaceEmptyStateProps {
    title: string
    description: string
    action?: ReactNode
    className?: string
}

/**
 * WorkspaceEmptyState — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WorkspaceEmptyState({
    title,
    description,
    action,
    className,
}: WorkspaceEmptyStateProps) {
    return (
        <Card
            className={cn(
                'border border-dashed border-neutral-700 bg-neutral-950/80 text-center',
                className
            )}
        >
            <CardContent className="flex flex-col items-center gap-4 py-14">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
                        No Results
                    </p>
                    <h2 className="text-xl font-bold text-neutral-100">{title}</h2>
                    <p className="max-w-md text-sm text-neutral-100">{description}</p>
                </div>
                {action}
            </CardContent>
        </Card>
    )
}
