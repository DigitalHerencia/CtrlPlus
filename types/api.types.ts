export interface ApiSuccessResponse<TData> {
    ok: true
    data: TData
}

export interface ApiErrorResponse {
    ok: false
    error: string
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse

export interface ClerkWebhookEvent {
    data: unknown
    object: string
    type: string
}
