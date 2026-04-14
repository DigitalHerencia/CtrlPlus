'use client'
/**
 * Components — TODO: brief module description.
 * Domain: components
 * Public: TODO (yes/no)
 */

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'

import { generateVisualizerHfPreviewAction } from '@/lib/actions/visualizer.actions'
import { createSchedulingBookHref } from '@/lib/utils/search-params'
import type { VisualizerHfCatalogData } from '@/types/visualizer.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'

interface VisualizerHfConfiguratorClientProps {
    catalog: VisualizerHfCatalogData
    canViewPrompt: boolean
}

/**
 * VisualizerHfConfiguratorClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function VisualizerHfConfiguratorClient({
    catalog,
    canViewPrompt,
}: VisualizerHfConfiguratorClientProps) {
    const [isPending, startTransition] = useTransition()
    const [make, setMake] = useState(catalog.initialSelection.make)
    const [model, setModel] = useState(catalog.initialSelection.model)
    const [year, setYear] = useState(catalog.initialSelection.year)
    const [trim, setTrim] = useState(catalog.initialSelection.trim)
    const [wrapId, setWrapId] = useState(catalog.initialSelection.wrapId)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [promptUsed, setPromptUsed] = useState('')
    const [error, setError] = useState<string | null>(null)

    const models = useMemo(
        () => Object.keys(catalog.vehicleIndex[make] ?? {}).sort(),
        [catalog, make]
    )
    const years = useMemo(
        () => Object.keys(catalog.vehicleIndex[make]?.[model] ?? {}).sort(),
        [catalog, make, model]
    )
    const trims = useMemo(
        () => [...(catalog.vehicleIndex[make]?.[model]?.[year] ?? [])].sort(),
        [catalog, make, model, year]
    )
    const selectedWrap = useMemo(
        () => catalog.wraps.find((wrap) => wrap.id === wrapId) ?? null,
        [catalog.wraps, wrapId]
    )

    function onMakeChange(nextMake: string) {
        const nextModels = Object.keys(catalog.vehicleIndex[nextMake] ?? {}).sort()
        const nextModel = nextModels[0] ?? ''
        const nextYears = Object.keys(catalog.vehicleIndex[nextMake]?.[nextModel] ?? {}).sort()
        const nextYear = nextYears[0] ?? ''
        const nextTrims = [
            ...(catalog.vehicleIndex[nextMake]?.[nextModel]?.[nextYear] ?? []),
        ].sort()
        const nextTrim = nextTrims[0] ?? ''
        setMake(nextMake)
        setModel(nextModel)
        setYear(nextYear)
        setTrim(nextTrim)
    }

    function onModelChange(nextModel: string) {
        const nextYears = Object.keys(catalog.vehicleIndex[make]?.[nextModel] ?? {}).sort()
        const nextYear = nextYears[0] ?? ''
        const nextTrims = [...(catalog.vehicleIndex[make]?.[nextModel]?.[nextYear] ?? [])].sort()
        setModel(nextModel)
        setYear(nextYear)
        setTrim(nextTrims[0] ?? '')
    }

    function onYearChange(nextYear: string) {
        const nextTrims = [...(catalog.vehicleIndex[make]?.[model]?.[nextYear] ?? [])].sort()
        setYear(nextYear)
        setTrim(nextTrims[0] ?? '')
    }

    function onGenerateClick() {
        setError(null)
        startTransition(() => {
            void generateVisualizerHfPreviewAction({ make, model, year, trim, wrapId })
                .then((result) => {
                    setImageUrl(result.imageUrl)
                    setPromptUsed(result.promptUsed)
                })
                .catch((nextError) => {
                    setError(
                        nextError instanceof Error
                            ? nextError.message
                            : 'Preview generation failed.'
                    )
                })
        })
    }

    return (
        <div className="space-y-6">
            {/* Wrap Description Section */}
            <WorkspacePageContextCard
                title="Wrap Selection"
                description="Optional concept exploration for a selected wrap and vehicle"
            >
                <div className="w-full space-y-3 lg:w-auto">
                    <p className="text-lg font-semibold text-neutral-100">
                        {selectedWrap?.name ?? 'Select a wrap'}
                    </p>
                    <p className="text-sm leading-relaxed text-neutral-300">
                        {selectedWrap?.description ??
                            'Select a wrap from the configurator below to view details.'}
                    </p>
                </div>
            </WorkspacePageContextCard>

            {/* Wrap Configurator Section */}
            <Card className="border-neutral-700 bg-neutral-950/80">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Wrap Configurator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Vehicle Selection Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <label className="flex flex-col space-y-2">
                            <span className="text-sm font-medium text-neutral-300">Make</span>
                            <select
                                className="h-10 rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 transition-colors hover:border-neutral-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={make}
                                onChange={(event) => onMakeChange(event.target.value)}
                            >
                                {catalog.makes.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col space-y-2">
                            <span className="text-sm font-medium text-neutral-300">Model</span>
                            <select
                                className="h-10 rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 transition-colors hover:border-neutral-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={model}
                                onChange={(event) => onModelChange(event.target.value)}
                            >
                                {models.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col space-y-2">
                            <span className="text-sm font-medium text-neutral-300">Year</span>
                            <select
                                className="h-10 rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 transition-colors hover:border-neutral-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={year}
                                onChange={(event) => onYearChange(event.target.value)}
                            >
                                {years.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col space-y-2">
                            <span className="text-sm font-medium text-neutral-300">Trim</span>
                            <select
                                className="h-10 rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 transition-colors hover:border-neutral-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={trim}
                                onChange={(event) => setTrim(event.target.value)}
                            >
                                {trims.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col space-y-2 sm:col-span-2 lg:col-span-1">
                            <span className="text-sm font-medium text-neutral-300">Wrap</span>
                            <select
                                className="h-10 rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 transition-colors hover:border-neutral-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={wrapId}
                                onChange={(event) => setWrapId(event.target.value)}
                            >
                                {catalog.wraps.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            type="button"
                            className="flex-1"
                            onClick={onGenerateClick}
                            disabled={isPending}
                        >
                            {isPending ? 'Generating…' : 'Generate Preview'}
                        </Button>
                        <Button asChild type="button" variant="outline" className="flex-1">
                            <Link href={createSchedulingBookHref(wrapId)}>
                                Book Consultation or Install
                            </Link>
                        </Button>
                    </div>

                    {/* Error State */}
                    {error ? <p className="text-sm text-red-400">{error}</p> : null}
                </CardContent>
            </Card>

            {/* Generated Concept Section */}
            <Card className="border-neutral-700 bg-neutral-950/80">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Generated Concept</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Generated vehicle wrap concept"
                            width={1280}
                            height={720}
                            className="w-full rounded-lg border border-neutral-700 object-cover"
                        />
                    ) : (
                        <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-neutral-700 text-sm text-neutral-400">
                            Generate a concept preview to compare directions before you book.
                        </div>
                    )}

                    {/* Prompt Used Section - Conditionally Shown */}
                    {canViewPrompt && (
                        <div className="space-y-2 border-t border-neutral-700 pt-4">
                            <p className="text-xs uppercase tracking-wider text-neutral-500">
                                Prompt Used
                            </p>
                            <p className="rounded-md border border-neutral-700 bg-neutral-900 p-3 font-mono text-sm text-neutral-300">
                                {promptUsed || 'Prompt output will appear here after generation.'}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
