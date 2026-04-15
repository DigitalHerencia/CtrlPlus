/**
 * A value from a URL search parameter.
 * - string: single value
 * - string[]: repeated parameter with multiple values
 * - undefined: parameter not present
 */
/**
 * SearchParamValue — TODO: brief description of this type.
 */
/**
 * SearchParamValue — TODO: brief description of this type.
 */
/**
 * SearchParamValue — TODO: brief description of this type.
 */
export type SearchParamValue = string | string[] | undefined

/**
 * Record of search parameters keyed by name.
 * Values follow the semantics of SearchParamValue.
 */
/**
 * SearchParamRecord — TODO: brief description of this type.
 */
/**
 * SearchParamRecord — TODO: brief description of this type.
 */
/**
 * SearchParamRecord — TODO: brief description of this type.
 */
export type SearchParamRecord = Record<string, SearchParamValue>

/**
 * Canonical timestamp string used throughout the application (ISO 8601).
 */
/**
 * Timestamp — TODO: brief description of this type.
 */
/**
 * Timestamp — TODO: brief description of this type.
 */
/**
 * Timestamp — TODO: brief description of this type.
 */
export type Timestamp = string

/**
 * Basic pagination request parameters.
 * - page: 1-based page index
 * - pageSize: items per page
 */
/**
 * PaginatedParams — TODO: brief description of this type.
 */
/**
 * PaginatedParams — TODO: brief description of this type.
 */
/**
 * PaginatedParams — TODO: brief description of this type.
 */
export interface PaginatedParams {
    page: number
    pageSize: number
}

/**
 * Standard paginated response wrapper used by fetchers.
 * Extends PaginatedParams to reflect the request used to produce the page.
 */
/**
 * PaginatedResult — TODO: brief description of this type.
 */
/**
 * PaginatedResult — TODO: brief description of this type.
 */
export interface PaginatedResult<TItem> extends PaginatedParams {
    items: TItem[]
    total: number
    totalPages: number
}
