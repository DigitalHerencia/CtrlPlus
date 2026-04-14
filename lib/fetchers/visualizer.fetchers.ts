import 'server-only'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { VEHICLE_CATALOG } from '@/lib/constants/visualizer/vehicle-catalog'
import { prisma } from '@/lib/db/prisma'
import { listVisualizerSelectableWraps } from '@/lib/fetchers/catalog.fetchers'
import type {
    VisualizerHfCatalogData,
    VisualizerHfSelection,
    VisualizerHfWrapOption,
    VisualizerVehicleCatalogIndex,
} from '@/types/visualizer.types'

function sortedUnique(values: string[]) {
    return Array.from(new Set(values.filter((value) => value.trim().length > 0))).sort((a, b) =>
        a.localeCompare(b)
    )
}

function mapWrapOptions(
    wraps: Awaited<ReturnType<typeof listVisualizerSelectableWraps>>
): VisualizerHfWrapOption[] {
    return wraps.map((wrap) => ({
        id: wrap.id,
        name: wrap.name,
        description: wrap.description ?? '',
        stylePrompt: wrap.aiNegativePrompt ?? '',
        promptTemplate: wrap.aiPromptTemplate ?? '',
        category: wrap.categories[0]?.name ?? null,
    }))
}

function getVehicleIndex(): VisualizerVehicleCatalogIndex {
    const vehicles = VEHICLE_CATALOG.vehicles
    const vehicleIndex: VisualizerVehicleCatalogIndex = {}

    for (const [make, models] of Object.entries(vehicles)) {
        vehicleIndex[make] = {}
        for (const [model, years] of Object.entries(models)) {
            vehicleIndex[make][model] = {}
            for (const [year, trims] of Object.entries(years)) {
                vehicleIndex[make][model][year] = [...trims]
            }
        }
    }

    return vehicleIndex
}

function getFirstSelection(
    vehicleIndex: VisualizerVehicleCatalogIndex,
    wraps: VisualizerHfWrapOption[]
): VisualizerHfSelection {
    const make = sortedUnique(Object.keys(vehicleIndex))[0] ?? ''
    const model = sortedUnique(Object.keys(vehicleIndex[make] ?? {}))[0] ?? ''
    const year = sortedUnique(Object.keys(vehicleIndex[make]?.[model] ?? {}))[0] ?? ''
    const trim = sortedUnique(vehicleIndex[make]?.[model]?.[year] ?? [])[0] ?? ''

    return {
        make,
        model,
        year,
        trim,
        wrapId: wraps[0]?.id ?? '',
    }
}

function clampSelection(
    requested: Partial<VisualizerHfSelection>,
    vehicleIndex: VisualizerVehicleCatalogIndex,
    wraps: VisualizerHfWrapOption[]
): VisualizerHfSelection {
    const fallback = getFirstSelection(vehicleIndex, wraps)
    const make = requested.make && vehicleIndex[requested.make] ? requested.make : fallback.make
    const modelOptions = sortedUnique(Object.keys(vehicleIndex[make] ?? {}))
    const model =
        requested.model && modelOptions.includes(requested.model)
            ? requested.model
            : (modelOptions[0] ?? '')
    const yearOptions = sortedUnique(Object.keys(vehicleIndex[make]?.[model] ?? {}))
    const year =
        requested.year && yearOptions.includes(requested.year)
            ? requested.year
            : (yearOptions[0] ?? '')
    const trimOptions = sortedUnique(vehicleIndex[make]?.[model]?.[year] ?? [])
    const trim =
        requested.trim && trimOptions.includes(requested.trim)
            ? requested.trim
            : (trimOptions[0] ?? '')
    const wrapId =
        requested.wrapId && wraps.some((wrap) => wrap.id === requested.wrapId)
            ? requested.wrapId
            : fallback.wrapId

    return { make, model, year, trim, wrapId }
}

function assertCatalogUsable(
    vehicleIndex: VisualizerVehicleCatalogIndex,
    wraps: VisualizerHfWrapOption[]
): void {
    if (Object.keys(vehicleIndex).length === 0) {
        throw new Error('Visualizer vehicle catalog is not available.')
    }

    if (wraps.length === 0) {
        throw new Error('Visualizer wrap catalog is not available.')
    }
}

/**
 * Fetch catalog data and compute UI-friendly structures for the HF visualizer.
 *
 * - Validates session and capability
 * - Loads wraps and user website settings in parallel
 * - Builds a vehicle index and a normalized list of wrap options
 * - Returns a stable initial selection and available makes/vehicleIndex
 *
 * @param requestedWrapId optional wrap id to prefer when selecting initial wrap
 * @returns VisualizerHfCatalogData used by the visualizer UI to render options
 */
export async function getVisualizerHfCatalogData(
    requestedWrapId: string | null = null
): Promise<VisualizerHfCatalogData> {
    const session = await getSession()
    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    requireCapability(session.authz, 'visualizer.use')

    const [wraps, settings] = await Promise.all([
        listVisualizerSelectableWraps({
            includeHidden: session.isOwner || session.isPlatformAdmin,
        }),
        prisma.websiteSettings.findUnique({
            where: { clerkUserId: session.userId },
            select: {
                vehicleMake: true,
                vehicleModel: true,
                vehicleYear: true,
                vehicleTrim: true,
            },
        }),
    ])

    const vehicleIndex = getVehicleIndex()
    const wrapOptions = mapWrapOptions(wraps)

    assertCatalogUsable(vehicleIndex, wrapOptions)

    const selectedWrapId = requestedWrapId ?? wrapOptions[0]?.id ?? null

    const initialSelection = clampSelection(
        {
            make: settings?.vehicleMake ?? undefined,
            model: settings?.vehicleModel ?? undefined,
            year: settings?.vehicleYear ?? undefined,
            trim: settings?.vehicleTrim ?? undefined,
            wrapId: selectedWrapId ?? undefined,
        },
        vehicleIndex,
        wrapOptions
    )

    return {
        makes: sortedUnique(Object.keys(vehicleIndex)),
        vehicleIndex,
        wraps: wrapOptions,
        initialSelection,
        selectedWrapId,
    }
}
