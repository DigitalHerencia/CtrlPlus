export function getOffset(page: number, pageSize: number): number {
    return Math.max(0, (page - 1) * pageSize)
}

export function getTotalPages(total: number, pageSize: number): number {
    return Math.max(1, Math.ceil(total / pageSize))
}
