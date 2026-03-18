import 'server-only'

import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import {
    getCatalogAssetReadiness,
    resolveCatalogGalleryImages,
    resolvePrimaryDisplayAsset,
    resolveVisualizerTextureAsset,
} from '../assets'
import {
    searchWrapsSchema,
    wrapDTOFields,
    type CatalogBrowseCardDTO,
    type CatalogBrowseResultDTO,
    type CatalogDetailDTO,
    type CatalogManagerItemDTO,
    type CatalogManagerResultDTO,
    type SearchWrapsInput,
    type WrapDTO,
    type WrapImageDTO,
    type WrapImageKind,
    type WrapListDTO,
} from '../types'

export interface WrapVisibilityScope {
    includeHidden?: boolean
}

type WrapRecord = Prisma.WrapGetPayload<{
    select: typeof wrapDTOFields
}>

function normalizePriceInCents(value: number): number {
    return Number.isInteger(value) ? value : Math.round(value)
}

function getVisibilityFilter(scope: WrapVisibilityScope) {
    return scope.includeHidden ? {} : { isHidden: false }
}

function getWrapWhere(
    filters: SearchWrapsInput,
    scope: WrapVisibilityScope
): Prisma.WrapWhereInput {
    return {
        deletedAt: null,
        ...getVisibilityFilter(scope),
        ...(filters.query
            ? {
                  OR: [
                      { name: { contains: filters.query, mode: 'insensitive' } },
                      { description: { contains: filters.query, mode: 'insensitive' } },
                  ],
              }
            : {}),
        ...(filters.maxPrice !== undefined ? { price: { lte: filters.maxPrice } } : {}),
        ...(filters.categoryId
            ? {
                  categoryMappings: {
                      some: {
                          categoryId: filters.categoryId,
                          category: {
                              deletedAt: null,
                          },
                      },
                  },
              }
            : {}),
    }
}

function mapWrapImage(image: WrapRecord['images'][number], index: number): WrapImageDTO {
    return {
        ...image,
        kind: (image.kind as WrapImageKind) ?? (index === 0 ? 'hero' : 'gallery'),
    }
}

function toWrapDTO(prismaWrap: WrapRecord): WrapDTO {
    return {
        id: prismaWrap.id,
        name: prismaWrap.name,
        description: prismaWrap.description,
        price: normalizePriceInCents(prismaWrap.price),
        isHidden: prismaWrap.isHidden,
        installationMinutes: prismaWrap.installationMinutes,
        images: prismaWrap.images.map(mapWrapImage),
        categories: prismaWrap.categoryMappings
            .map((mapping) => mapping.category)
            .filter((category) => category.deletedAt === null)
            .map(({ ...category }) => category),
        createdAt: prismaWrap.createdAt,
        updatedAt: prismaWrap.updatedAt,
    }
}

function toCatalogBrowseCard(wrap: WrapDTO): CatalogBrowseCardDTO {
    return {
        id: wrap.id,
        name: wrap.name,
        description: wrap.description,
        price: wrap.price,
        isHidden: wrap.isHidden,
        installationMinutes: wrap.installationMinutes,
        categories: wrap.categories,
        displayImage: resolvePrimaryDisplayAsset(wrap.images),
        readiness: getCatalogAssetReadiness(wrap.images),
    }
}

function toCatalogDetail(wrap: WrapDTO): CatalogDetailDTO {
    return {
        ...wrap,
        displayImage: resolvePrimaryDisplayAsset(wrap.images),
        galleryImages: resolveCatalogGalleryImages(wrap.images),
        visualizerTextureImage: resolveVisualizerTextureAsset(wrap.images),
        readiness: getCatalogAssetReadiness(wrap.images),
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

function toWrapListResult<TItem>(
    wraps: WrapRecord[],
    total: number,
    filters: SearchWrapsInput,
    mapper: (wrap: WrapDTO) => TItem
): {
    wraps: TItem[]
    total: number
    page: number
    pageSize: number
    totalPages: number
} {
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

    return wraps.map((wrap) => toWrapDTO(wrap))
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
    return wrap ? toCatalogDetail(wrap) : null
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
    const { wraps, total } = await searchWrapRecords(parsedFilters, scope)
    return toWrapListResult(wraps, total, parsedFilters, toCatalogBrowseCard)
}
