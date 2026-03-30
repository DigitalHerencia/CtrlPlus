// Client-only types for the catalog domain
// These types may reference DOM/browser primitives such as File and must live
// in a client-only types file per the canonical placement rules.

export interface WrapImageUploadInputClient {
    wrapId: string
    kind: string
    isActive: boolean
    file: File
}

export interface CatalogClientUploadResult {
    id: string
    url: string
}
