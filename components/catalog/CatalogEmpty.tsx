export function CatalogEmpty() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-zinc-400 dark:text-zinc-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          No wraps available
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          This tenant has not added any wrap packages yet. Check back soon.
        </p>
      </div>
    </div>
  );
}
