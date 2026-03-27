export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="h-6 w-48 rounded-full bg-neutral-800" />
            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-40 rounded bg-neutral-950/80" />
                ))}
            </div>
        </div>
    )
}
