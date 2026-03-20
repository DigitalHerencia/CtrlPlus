'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import type { VisualizerWrapSelectionDTO } from '@/lib/catalog/types'
import { cn } from '@/lib/utils'

interface WrapSelectorProps {
    wraps: VisualizerWrapSelectionDTO[]
    selectedWrapId: string | null
    onSelect: (wrapId: string) => void
    canManageCatalog?: boolean
    className?: string
}

export function WrapSelector({
    wraps,
    selectedWrapId,
    onSelect,
    canManageCatalog = false,
    className,
}: WrapSelectorProps) {
    if (wraps.length === 0) {
        return (
            <div
                className={cn(
                    'space-y-3 rounded-xl border border-dashed border-neutral-700 bg-neutral-900 p-8 text-center text-sm text-neutral-100',
                    className
                )}
            >
                <p>No visualizer-ready wraps are available yet.</p>
                {canManageCatalog ? (
                    <Button asChild size="sm">
                        <Link href="/catalog/manage">Open Catalog Manager</Link>
                    </Button>
                ) : null}
            </div>
        )
    }

    return (
        <div className={cn('grid gap-4 lg:grid-cols-2', className)}>
            {wraps.map((wrap) => {
                const isSelected = wrap.id === selectedWrapId

                return (
                    <button
                        key={wrap.id}
                        type="button"
                        onClick={() => onSelect(wrap.id)}
                        className={cn(
                            'overflow-hidden rounded-xl border bg-neutral-950 text-left transition hover:border-blue-500/70',
                            isSelected ? 'border-blue-500 shadow-[0_0_0_1px_rgba(37,99,235,0.35)]' : 'border-neutral-800'
                        )}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={wrap.heroImage?.cardUrl}
                            alt={wrap.name}
                            className="h-52 w-full object-cover"
                        />
                        <div className="space-y-3 p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-black text-neutral-100">{wrap.name}</h3>
                                    <p className="mt-2 line-clamp-2 text-sm text-neutral-400">
                                        {wrap.description ?? 'Preview-ready wrap package.'}
                                    </p>
                                </div>
                                <p className="text-3xl font-black text-neutral-100">
                                    ${(wrap.price / 100).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <span className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">
                                    {isSelected ? 'Selected' : 'Choose Wrap'}
                                </span>
                                <span className="rounded-md border border-neutral-800 px-3 py-2 text-sm text-neutral-300">
                                    {wrap.visualizerTextureImage ? 'Texture ready' : 'Texture missing'}
                                </span>
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}
