export function VisualizerEmptyState({ message }: { message: string }) {
    return (
        <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900 p-8 text-center text-sm text-neutral-400">
            {message}
        </div>
    )
}
