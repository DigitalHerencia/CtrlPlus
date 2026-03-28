import type { WrapImageKind } from './constants'

export interface CreateWrapInput {
    name: string
    description?: string
    price: number
    installationMinutes?: number
    aiPromptTemplate?: string
    aiNegativePrompt?: string
}

export interface UpdateWrapInput {
    name?: string
    description?: string
    price?: number
    installationMinutes?: number
    aiPromptTemplate?: string
    aiNegativePrompt?: string
    isHidden?: boolean
}

export interface CreateWrapCategoryInput {
    name: string
    slug: string
}

export interface UpdateWrapCategoryInput {
    name?: string
    slug?: string
}

export interface SetWrapCategoryMappingsInput {
    wrapId: string
    categoryIds: string[]
}

export interface WrapImageUploadInput {
    wrapId: string
    kind: WrapImageKind
    isActive: boolean
    file: File
}

export interface UpdateWrapImageMetadataInput {
    wrapId: string
    imageId: string
    kind?: WrapImageKind
    isActive?: boolean
}

export const WRAP_SORT_BY_VALUES = {
    name: 'name',
    price: 'price',
    createdAt: 'createdAt',
} as const

export type WrapSortBy = (typeof WRAP_SORT_BY_VALUES)[keyof typeof WRAP_SORT_BY_VALUES]

export interface SearchWrapsInput {
    query?: string
    maxPrice?: number
    sortBy?: WrapSortBy
    sortOrder?: 'asc' | 'desc'
    page: number
    pageSize: number
    categoryId?: string
}

export interface WrapFilterFormValues {
    query: string
    categoryId: string
    maxPrice: string
    sortBy: 'createdAt' | 'name' | 'price'
    sortOrder: 'desc' | 'asc'
    pageSize: '12' | '20' | '32'
}
