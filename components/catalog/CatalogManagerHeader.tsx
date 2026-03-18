interface CatalogManagerHeaderProps {
    title: string
}

export function CatalogManagerHeader({ title }: CatalogManagerHeaderProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-black tracking-tight text-neutral-100">{title}</h1>
            {/* Back button can be added here if needed */}
        </div>
    )
}
