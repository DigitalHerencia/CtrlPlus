export default function CatalogLoading() {
  return (
    <section aria-labelledby="catalog-heading" aria-busy="true">
      <h1
        id="catalog-heading"
        className="mb-6 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
      >
        Wrap Catalog
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            aria-hidden="true"
          >
            <div className="mb-4 h-48 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="mb-2 h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mb-4 h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-9 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </section>
  );
}
