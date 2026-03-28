import { prisma } from '@/lib/db/prisma'
import { getCatalogAssetReadiness } from '@/lib/catalog/asset-resolution'
import {
    resolveCatalogGalleryImages,
    resolveDisplayImages,
    resolveHeroAsset,
    resolvePrimaryDisplayAsset,
    resolveVisualizerMaskHintAsset,
    resolveVisualizerTextureAsset,
} from '@/lib/catalog/asset-resolution'
import { searchWrapsSchema } from '@/schema/catalog/search-schemas'
import type {
    CatalogBrowseCardDTO,
    CatalogBrowseResultDTO,
    CatalogDetailDTO,
    CatalogManagerItemDTO,
    CatalogManagerResultDTO,
    VisualizerWrapSelectionDTO,
    WrapDTO,
    WrapListDTO,
} from '@/types/catalog/domain'
import type { SearchWrapsInput } from '@/types/catalog/inputs'

import {
    getExampleCatalogWrapById,
    getExampleCatalogWraps,
    getExampleWrapCategories,
    isExampleCatalogWrapId,
} from './demo-wraps'
import {
    getVisibilityFilter,
    getWrapWhere,
    toWrapDTO,
    wrapDTOFields,
    type WrapRecord,
    type WrapVisibilityScope,
} from './wrap-record'

export { isExampleCatalogWrapId } from './demo-wraps'

function getWrapReadiness(wrap: WrapDTO) {
    return getCatalogAssetReadiness({
        name: wrap.name,
        price: wrap.price,
        images: wrap.images,
    })
}

function toCatalogBrowseCard(wrap: WrapDTO): CatalogBrowseCardDTO {
    const readiness = getWrapReadiness(wrap)
    const heroImage = resolveHeroAsset(wrap.images)

    return {
        id: wrap.id,
        name: wrap.name,
        description: wrap.description,
        price: wrap.price,
        isHidden: wrap.isHidden,
        installationMinutes: wrap.installationMinutes,
        categories: wrap.categories,
        heroImage,
        displayImage: heroImage,
        previewHref: isExampleCatalogWrapId(wrap.id)
            ? `/catalog/${wrap.id}`
            : `/visualizer?wrapId=${wrap.id}`,
        readiness,
    }
}

function toCatalogDetail(wrap: WrapDTO): CatalogDetailDTO {
    const heroImage = resolveHeroAsset(wrap.images)
    const displayImage = resolvePrimaryDisplayAsset(wrap.images)
    const galleryImages = resolveCatalogGalleryImages(wrap.images)
    const displayImages = resolveDisplayImages(wrap.images)
    const visualizerTextureImage = resolveVisualizerTextureAsset(wrap.images)
    const visualizerMaskHintImage = resolveVisualizerMaskHintAsset(wrap.images)
    const readiness = getWrapReadiness(wrap)

    return {
        ...wrap,
        heroImage,
        displayImage,
        displayImages,
        galleryImages,
        visualizerTextureImage,
        visualizerMaskHintImage,
        readiness,
    }
}

function toCatalogManagerItem(wrap: WrapDTO): CatalogManagerItemDTO {
    const detail = toCatalogDetail(wrap)

    return {
        ...detail,
        imageCount: wrap.images.length,
        activeImageCount: wrap.images.filter((image) => image.isActive).length,
    }
}

function toVisualizerWrapSelection(wrap: WrapDTO): VisualizerWrapSelectionDTO | null {
    const detail = toCatalogDetail(wrap)

    if (
        !detail.heroImage ||
        !detail.visualizerTextureImage ||
        !detail.readiness.isVisualizerReady
    ) {
        return null
    }

    return {
        id: detail.id,
        name: detail.name,
        description: detail.description,
        price: detail.price,
        installationMinutes: detail.installationMinutes,
        categories: detail.categories,
        heroImage: detail.heroImage,
        visualizerTextureImage: detail.visualizerTextureImage,
        aiPromptTemplate: detail.aiPromptTemplate,
        aiNegativePrompt: detail.aiNegativePrompt,
        readiness: detail.readiness,
    }
}

function toWrapListResult<TItem>(
    wraps: WrapRecord[],
    total: number,
    filters: SearchWrapsInput,
    mapper: (wrap: WrapDTO) => TItem
) {
    return {
        wraps: wraps.map((wrap) => mapper(toWrapDTO(wrap))),
        total,
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 20,
        totalPages: Math.max(1, Math.ceil(total / (filters.pageSize ?? 20))),
    }
}

async function searchWrapRecords(
    filters: SearchWrapsInput,
    scope: WrapVisibilityScope
): Promise<{
    wraps: WrapRecord[]
    total: number
}> {
    const parsedFilters = searchWrapsSchema.parse(filters)
    const skip = (parsedFilters.page - 1) * parsedFilters.pageSize
    const where = getWrapWhere(parsedFilters, scope)

    const [wraps, total] = await Promise.all([
        prisma.wrap.findMany({
            where,
            orderBy: { [parsedFilters.sortBy ?? 'createdAt']: parsedFilters.sortOrder ?? 'desc' },
            select: wrapDTOFields,
            skip,
            take: parsedFilters.pageSize,
        }),
        prisma.wrap.count({ where }),
    ])

    return { wraps, total }
}

export async function getWraps(scope: WrapVisibilityScope = {}): Promise<WrapDTO[]> {
    const wraps = await prisma.wrap.findMany({
        where: {
            deletedAt: null,
            ...getVisibilityFilter(scope),
        },
        orderBy: { createdAt: 'desc' },
        select: wrapDTOFields,
    })

    return [...wraps.map((wrap) => toWrapDTO(wrap)), ...getExampleCatalogWraps()]
}

export async function getCatalogManagerWraps(
    filters: SearchWrapsInput = { page: 1, pageSize: 20 },
    scope: WrapVisibilityScope = { includeHidden: true }
): Promise<CatalogManagerResultDTO> {
    const parsedFilters = searchWrapsSchema.parse(filters)
    const { wraps, total } = await searchWrapRecords(parsedFilters, scope)

    return toWrapListResult(wraps, total, parsedFilters, toCatalogManagerItem)
}

export async function getWrapById(
    wrapId: string,
    scope: WrapVisibilityScope = {}
): Promise<WrapDTO | null> {
    const exampleWrap = getExampleCatalogWrapById(wrapId)

    if (exampleWrap && (scope.includeHidden || !exampleWrap.isHidden)) {
        return exampleWrap
    }

    const wrap = await prisma.wrap.findFirst({
        where: {
            id: wrapId,
            deletedAt: null,
            ...getVisibilityFilter(scope),
        },
        select: wrapDTOFields,
    })

    return wrap ? toWrapDTO(wrap) : null
}

export async function getCatalogWrapById(
    wrapId: string,
    scope: WrapVisibilityScope = {}
): Promise<CatalogDetailDTO | null> {
    const wrap = await getWrapById(wrapId, scope)
    if (!wrap) {
        return null
    }

    const detail = toCatalogDetail(wrap)
    if (scope.requireVisualizerReady && !detail.readiness.isVisualizerReady) {
        return null
    }

    return detail
}

export async function searchWraps(
    filters: SearchWrapsInput = { page: 1, pageSize: 20 },
    scope: WrapVisibilityScope = {}
): Promise<WrapListDTO> {
    const parsedFilters = searchWrapsSchema.parse(filters)
    const { wraps, total } = await searchWrapRecords(parsedFilters, scope)

    return toWrapListResult(wraps, total, parsedFilters, (wrap) => wrap)
}

export async function searchCatalogWraps(
    filters: SearchWrapsInput = { page: 1, pageSize: 20 },
    scope: WrapVisibilityScope = {}
): Promise<CatalogBrowseResultDTO> {
    const parsedFilters = searchWrapsSchema.parse(filters)
    const effectiveScope = {
        ...scope,
        requireVisualizerReady: scope.requireVisualizerReady ?? true,
    }
    const wraps = await getWraps({
        includeHidden: effectiveScope.includeHidden,
    })
    const filteredCatalogWraps = wraps
        .filter((wrap) => {
            if (!effectiveScope.requireVisualizerReady) {
                return true
            }

            return getWrapReadiness(wrap).isVisualizerReady
        })
        .filter((wrap) => {
            if (parsedFilters.query) {
                const query = parsedFilters.query.toLowerCase()
                const haystacks = [
                    wrap.name,
                    wrap.description ?? '',
                    ...wrap.categories.map((category) => category.name),
                ]

                if (!haystacks.some((value) => value.toLowerCase().includes(query))) {
                    return false
                }
            }

            if (parsedFilters.maxPrice !== undefined && wrap.price > parsedFilters.maxPrice) {
                return false
            }

            if (
                parsedFilters.categoryId &&
                !wrap.categories.some((category) => category.id === parsedFilters.categoryId)
            ) {
                return false
            }

            return true
        })

    const sortedCatalogWraps = [...filteredCatalogWraps].sort((left, right) => {
        const sortBy = parsedFilters.sortBy ?? 'createdAt'
        const sortOrder = parsedFilters.sortOrder ?? 'desc'
        const direction = sortOrder === 'asc' ? 1 : -1

        if (sortBy === 'name') {
            return left.name.localeCompare(right.name) * direction
        }

        if (sortBy === 'price') {
            return (left.price - right.price) * direction
        }

        return (left.createdAt.getTime() - right.createdAt.getTime()) * direction
    })

    const total = sortedCatalogWraps.length
    const pageSize = parsedFilters.pageSize ?? 20
    const page = parsedFilters.page ?? 1
    const pageWraps = sortedCatalogWraps.slice((page - 1) * pageSize, page * pageSize)

    return {
        wraps: pageWraps.map((wrap) => toCatalogBrowseCard(wrap)),
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
    }
}

export async function getVisualizerSelectableWrapById(
    wrapId: string,
    scope: WrapVisibilityScope = {}
): Promise<VisualizerWrapSelectionDTO | null> {
    if (isExampleCatalogWrapId(wrapId)) {
        return null
    }

    const wrap = await getWrapById(wrapId, scope)

    if (!wrap) {
        return null
    }

    return toVisualizerWrapSelection(wrap)
}

export async function listVisualizerSelectableWraps(
    scope: WrapVisibilityScope = {}
): Promise<VisualizerWrapSelectionDTO[]> {
    const wraps = await getWraps({
        includeHidden: scope.includeHidden,
    })

    return wraps
        .filter((wrap) => !isExampleCatalogWrapId(wrap.id))
        .map(toVisualizerWrapSelection)
        .filter((wrap): wrap is VisualizerWrapSelectionDTO => wrap !== null)
}

export async function getWrapCategories(): Promise<
    {
        id: string
        name: string
        slug: string
    }[]
> {
    const categories = await prisma.wrapCategory.findMany({
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, slug: true },
    })

    const mergedCategories = [...categories, ...getExampleWrapCategories()]

    return mergedCategories
        .filter(
            (category, index, items) => items.findIndex((item) => item.id === category.id) === index
        )
        .sort((left, right) => left.name.localeCompare(right.name))
}

export type { WrapVisibilityScope } from './wrap-record'
