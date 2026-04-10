import 'server-only'

import { VEHICLE_CATALOG } from '@/lib/constants/visualizer/vehicle-catalog'
import { WRAP_CATALOG } from '@/lib/constants/visualizer/wrap-catalog'
import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
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

function mapWrapOptions(): VisualizerHfWrapOption[] {
    const wraps = WRAP_CATALOG.wraps ?? []

    return wraps
        .map((wrap) => {
            const { id, name, description, style_prompt, prompt_template, category } = wrap
            const trimmedId = id.trim()
            const trimmedName = name.trim()
            const trimmedDescription = description.trim()
            const stylePrompt = style_prompt.trim()
            const promptTemplate = prompt_template.trim()
            const categoryValue = category.trim()

            if (
                !trimmedId ||
                !trimmedName ||
                !trimmedDescription ||
                !stylePrompt ||
                !promptTemplate
            ) {
                return null
            }

            return {
                id: trimmedId,
                name: trimmedName,
                description: trimmedDescription,
                stylePrompt,
                promptTemplate,
                category: categoryValue || null,
            } satisfies VisualizerHfWrapOption
        })
        .filter((wrap): wrap is VisualizerHfWrapOption => wrap != null)
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
    const makes = sortedUnique(Object.keys(vehicleIndex))
    const make = makes[0] ?? ''

    const models = sortedUnique(Object.keys(vehicleIndex[make] ?? {}))
    const model = models[0] ?? ''

    const years = sortedUnique(Object.keys(vehicleIndex[make]?.[model] ?? {}))
    const year = years[0] ?? ''

    const trims = sortedUnique(vehicleIndex[make]?.[model]?.[year] ?? [])
    const trim = trims[0] ?? ''

    const wrapName = wraps[0]?.name ?? ''

    return {
        make,
        model,
        year,
        trim,
        wrapName,
    }
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

    const first = getFirstSelection(vehicleIndex, wraps)
    if (!first.make || !first.model || !first.year || !first.trim || !first.wrapName) {
        throw new Error('Visualizer catalogs are incomplete and cannot seed selections.')
    }
}

export async function getVisualizerHfCatalogData(): Promise<VisualizerHfCatalogData> {
    const session = await getSession()
    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    requireCapability(session.authz, 'visualizer.use')

    const vehicleIndex = getVehicleIndex()
    const wraps = mapWrapOptions()

    assertCatalogUsable(vehicleIndex, wraps)

    return {
        makes: sortedUnique(Object.keys(vehicleIndex)),
        vehicleIndex,
        wraps,
        initialSelection: getFirstSelection(vehicleIndex, wraps),
    }
}
