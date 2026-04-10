'use client'

import { useMemo, useState, useTransition } from 'react'
import Image from 'next/image'

import { generateVisualizerHfPreviewAction } from '@/lib/actions/visualizer.actions'
import type { VisualizerHfCatalogData } from '@/types/visualizer.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface VisualizerHfConfiguratorClientProps {
    catalog: VisualizerHfCatalogData
}

export function VisualizerHfConfiguratorClient({ catalog }: VisualizerHfConfiguratorClientProps) {
    const [isPending, startTransition] = useTransition()
    const [make, setMake] = useState(catalog.initialSelection.make)
    const [model, setModel] = useState(catalog.initialSelection.model)
    const [year, setYear] = useState(catalog.initialSelection.year)
    const [trim, setTrim] = useState(catalog.initialSelection.trim)
    const [wrapName, setWrapName] = useState(catalog.initialSelection.wrapName)
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
        () => catalog.wraps.find((wrap) => wrap.name === wrapName) ?? null,
        [catalog.wraps, wrapName]
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
        const nextTrim = nextTrims[0] ?? ''

        setModel(nextModel)
        setYear(nextYear)
        setTrim(nextTrim)
    }

    function onYearChange(nextYear: string) {
        const nextTrims = [...(catalog.vehicleIndex[make]?.[model]?.[nextYear] ?? [])].sort()
        const nextTrim = nextTrims[0] ?? ''

        setYear(nextYear)
        setTrim(nextTrim)
    }

    function onGenerateClick() {
        setError(null)
        startTransition(() => {
            void generateVisualizerHfPreviewAction({ make, model, year, trim, wrapName })
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
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
                <CardHeader>
                    <CardTitle className="text-xl">HF Configurator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <label className="block space-y-2 text-sm">
                        <span className="text-neutral-300">Make</span>
                        <select
                            className="h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3"
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

                    <label className="block space-y-2 text-sm">
                        <span className="text-neutral-300">Model</span>
                        <select
                            className="h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3"
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

                    <div className="grid grid-cols-2 gap-3">
                        <label className="block space-y-2 text-sm">
                            <span className="text-neutral-300">Year</span>
                            <select
                                className="h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3"
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

                        <label className="block space-y-2 text-sm">
                            <span className="text-neutral-300">Trim</span>
                            <select
                                className="h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3"
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
                    </div>

                    <label className="block space-y-2 text-sm">
                        <span className="text-neutral-300">Wrap</span>
                        <select
                            className="h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3"
                            value={wrapName}
                            onChange={(event) => setWrapName(event.target.value)}
                        >
                            {catalog.wraps.map((option) => (
                                <option key={option.id} value={option.name}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <Button
                        type="button"
                        className="w-full"
                        onClick={onGenerateClick}
                        disabled={isPending}
                    >
                        {isPending ? 'Generating…' : 'Generate Preview'}
                    </Button>

                    {error ? <p className="text-sm text-red-400">{error}</p> : null}
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-xl">Wrap Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-6 text-neutral-300">
                            {selectedWrap?.description ?? 'Select a wrap to view details.'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-xl">Generated Concept</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt="Generated vehicle wrap concept"
                                width={1280}
                                height={720}
                                className="w-full rounded-lg border border-neutral-800 object-cover"
                            />
                        ) : (
                            <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-neutral-800 text-sm text-neutral-400">
                                Generate a preview to see results.
                            </div>
                        )}

                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-wider text-neutral-500">
                                Prompt Used
                            </p>
                            <p className="rounded-md border border-neutral-800 bg-neutral-900 p-3 text-sm text-neutral-300">
                                {promptUsed || 'Prompt output will appear here after generation.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
