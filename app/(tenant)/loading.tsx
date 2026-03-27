export default function TenantLoading() {
  return (
    <div className="min-h-screen flex bg-neutral-900 text-neutral-100">
      {/* Sidebar skeleton */}
      <aside className="hidden md:block w-48 p-4">
        <div className="h-8 w-full rounded bg-neutral-800 animate-pulse mb-4" />
        <div className="space-y-3">
          <div className="h-10 rounded bg-neutral-800 animate-pulse" />
          <div className="h-10 rounded bg-neutral-800 animate-pulse" />
          <div className="h-10 rounded bg-neutral-800 animate-pulse" />
          <div className="h-10 rounded bg-neutral-800 animate-pulse" />
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="flex-1 p-6">
        <div className="h-8 w-1/3 rounded bg-neutral-800 animate-pulse mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-48 rounded bg-neutral-800 animate-pulse" />
          <div className="h-48 rounded bg-neutral-800 animate-pulse" />
          <div className="h-48 rounded bg-neutral-800 animate-pulse" />
          <div className="h-48 rounded bg-neutral-800 animate-pulse" />
          <div className="h-48 rounded bg-neutral-800 animate-pulse" />
          <div className="h-48 rounded bg-neutral-800 animate-pulse" />
        </div>
      </main>
    </div>
  )
}
