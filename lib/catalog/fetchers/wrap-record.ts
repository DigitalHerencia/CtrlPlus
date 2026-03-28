import { Prisma } from '@prisma/client'

import { WrapImageKind } from '@/types/catalog/constants'
import type { SearchWrapsInput } from '@/types/catalog/inputs'
import type { WrapDTO, WrapImageDTO } from '@/types/catalog/domain'

export interface WrapVisibilityScope {
    includeHidden?: boolean
    requireVisualizerReady?: boolean
}

export const wrapDTOFields = {
    id: true,
    name: true,
    description: true,
    price: true,
    isHidden: true,
    installationMinutes: true,
    aiPromptTemplate: true,
    aiNegativePrompt: true,
    createdAt: true,
    updatedAt: true,
    images: {
        where: { deletedAt: null },
        select: {
            id: true,
            url: true,
            kind: true,
            isActive: true,
            version: true,
            contentHash: true,
            displayOrder: true,
        },
        orderBy: { displayOrder: 'asc' },
    },
    categoryMappings: {
        select: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    deletedAt: true,
                },
            },
        },
    },
} as const

export type WrapRecord = Prisma.WrapGetPayload<{
    select: typeof wrapDTOFields
}>

export function normalizePriceInCents(value: number): number {
    return Number.isInteger(value) ? value : Math.round(value)
}

export function getVisibilityFilter(scope: WrapVisibilityScope) {
    return scope.includeHidden ? {} : { isHidden: false }
}

export function getWrapWhere(
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
        kind: (image.kind as WrapImageKind) ?? (index === 0 ? WrapImageKind.HERO : WrapImageKind.GALLERY),
    }
}

export function toWrapDTO(prismaWrap: WrapRecord): WrapDTO {
    return {
        id: prismaWrap.id,
        name: prismaWrap.name,
        description: prismaWrap.description,
        price: normalizePriceInCents(prismaWrap.price),
        isHidden: prismaWrap.isHidden,
        installationMinutes: prismaWrap.installationMinutes,
        aiPromptTemplate: prismaWrap.aiPromptTemplate,
        aiNegativePrompt: prismaWrap.aiNegativePrompt,
        images: prismaWrap.images.map(mapWrapImage),
        categories: prismaWrap.categoryMappings
            .map((mapping) => mapping.category)
            .filter((category) => category.deletedAt === null)
            .map(({ ...category }) => category),
        createdAt: prismaWrap.createdAt,
        updatedAt: prismaWrap.updatedAt,
    }
}
