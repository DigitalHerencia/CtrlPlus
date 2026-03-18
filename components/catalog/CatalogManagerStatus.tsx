interface CatalogManagerStatusProps {
    error?: string
    status?: string
}

export function CatalogManagerStatus({ error, status }: CatalogManagerStatusProps) {
    return (
        <>
            {error && (
                <div className="flex items-center gap-2">
                    <span className="rounded bg-red-600 px-2 py-1 text-xs text-white">Error</span>
                    <p className="text-sm text-red-300">{error}</p>
                </div>
            )}
            {status && (
                <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">Status</span>
                    <p className="text-sm text-blue-300">{status}</p>
                </div>
            )}
        </>
    )
}
