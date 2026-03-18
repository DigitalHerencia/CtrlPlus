'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import type { WrapDTO } from '@/lib/catalog/types'
import { cn } from '@/lib/utils'

interface WrapSelectorProps {
    wraps: WrapDTO[]
    selectedWrapId: string | null
    onSelect: (wrapId: string) => void
    canManageCatalog?: boolean
    className?: string
    permissionDenied?: boolean
}

export function WrapSelector({
    wraps,
    selectedWrapId,
    onSelect,
    canManageCatalog = false,
    className,
    permissionDenied,
}: WrapSelectorProps) {
    if (permissionDenied) {
        return (
            <div
                className={cn(
                    'space-y-3 border border-dashed border-red-700 bg-red-900 p-8 text-center text-sm text-red-100',
                    className
                )}
            >
                <p>You do not have permission to view wraps.</p>
            </div>
        )
    }
    if (wraps.length === 0) {
        return (
            <div
                className={cn(
                    'space-y-3 border border-dashed border-neutral-700 bg-neutral-900 p-8 text-center text-sm text-neutral-100',
                    className
                )}
            >
                <p>No wraps available. Add wraps in the Catalog to get started.</p>
                {canManageCatalog ? (
                    <Button asChild size="sm">
                        <Link href="/catalog/manage">Open Catalog Manager</Link>
                    </Button>
                ) : null}
            </div>
        )
    }

    return (
        <div className={cn('flex flex-col gap-3', className)}>
            {wraps.map((wrap) => {
                const isSelected = wrap.id === selectedWrapId
                return (
                    <button
                        key={wrap.id}
                        type="button"
                        onClick={() => onSelect(wrap.id)}
                        className={cn(
                            'flex flex-row items-center gap-4 rounded-lg border p-3 text-left shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
                            isSelected
                                ? 'scale-[1.03] border-blue-600 bg-neutral-900 text-neutral-100'
                                : 'border-neutral-700 bg-neutral-900 text-neutral-100 hover:border-blue-600/50 hover:bg-neutral-900'
                        )}
                        aria-pressed={isSelected}
                        style={{ transition: 'transform 0.2s cubic-bezier(.4,0,.2,1)' }}
                    >
                        {wrap.images[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={wrap.images[0].url}
                                alt={wrap.name}
                                className="h-16 w-24 rounded-md object-cover"
                            />
                        )}
                        <div className="flex flex-1 flex-col">
                            <span className="text-sm font-semibold leading-tight">{wrap.name}</span>
                            {wrap.description && (
                                <span
                                    className={cn(
                                        'mt-1 line-clamp-2 text-xs',
                                        isSelected ? 'text-neutral-200' : 'text-neutral-400'
                                    )}
                                >
                                    {wrap.description}
                                </span>
                            )}
                            {wrap.installationMinutes !== null &&
                                wrap.installationMinutes !== undefined && (
                                    <span
                                        className={cn(
                                            'mt-1 text-xs font-medium',
                                            isSelected ? 'text-blue-200' : 'text-neutral-300'
                                        )}
                                    >
                                        {`${Math.floor(wrap.installationMinutes / 60)}h ${wrap.installationMinutes % 60}m install`}
                                    </span>
                                )}
                        </div>
                        {isSelected && (
                            <span className="ml-2 rounded bg-blue-600 px-2 py-1 text-xs text-neutral-100">
                                Selected
                            </span>
                        )}
                    </button>
                )
            })}
            {canManageCatalog && (
                <Button asChild size="sm" variant="outline" className="mt-2">
                    <Link href="/catalog/manage">+ Add New Wrap</Link>
                </Button>
            )}
        </div>
    )
}
