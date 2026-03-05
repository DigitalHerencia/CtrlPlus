export default function InvoiceDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
        <div className="space-y-4 px-6 py-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
