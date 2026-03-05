export default function VisualizerLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-zinc-200" />
        <div className="mt-2 h-4 w-80 rounded-lg bg-zinc-200" />
      </div>

      {/* Upload zone skeleton */}
      <div className="mb-12 animate-pulse">
        <div className="flex min-h-64 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-100">
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-zinc-200" />
            <div className="h-4 w-40 rounded-lg bg-zinc-200" />
            <div className="h-3 w-28 rounded-lg bg-zinc-200" />
          </div>
        </div>
      </div>

      {/* Sessions section skeleton */}
      <div className="animate-pulse">
        <div className="mb-4 h-6 w-32 rounded-lg bg-zinc-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <div className="aspect-video bg-zinc-100" />
              <div className="p-4">
                <div className="h-4 w-24 rounded-lg bg-zinc-200" />
                <div className="mt-1 h-3 w-16 rounded-lg bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
