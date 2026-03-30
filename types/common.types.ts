export type SearchParamValue = string | string[] | undefined

export type SearchParamRecord = Record<string, SearchParamValue>

export type Timestamp = string

export interface PaginatedParams {
    page: number
    pageSize: number
}

export interface PaginatedResult<TItem> extends PaginatedParams {
    items: TItem[]
    total: number
    totalPages: number
}
