export default function BillingLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
        </div>
        <ul>
          {[...Array(4)].map((_, i) => (
            <li
              key={i}
              className="flex items-center justify-between border-b border-gray-100 px-6 py-4 last:border-0"
            >
              <div className="space-y-2">
                <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
