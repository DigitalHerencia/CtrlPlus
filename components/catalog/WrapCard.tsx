import { WrapDTO, WrapCategory } from "@/lib/catalog/types";

interface WrapCardProps {
  wrap: WrapDTO;
}

const categoryLabels: Record<WrapCategory, string> = {
  [WrapCategory.FULL]: "Full Wrap",
  [WrapCategory.PARTIAL]: "Partial Wrap",
  [WrapCategory.ACCENT]: "Accent",
  [WrapCategory.COLOR_CHANGE]: "Color Change",
  [WrapCategory.COMMERCIAL]: "Commercial",
  [WrapCategory.PROTECTIVE]: "Protective",
};

export function WrapCard({ wrap }: WrapCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(wrap.price);

  return (
    <article
      className="flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
      aria-label={wrap.name}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl bg-zinc-100 dark:bg-zinc-800">
        {wrap.imageUrls.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={wrap.imageUrls[0]}
            alt={wrap.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-600"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {/* Category badge */}
        <span className="absolute right-3 top-3 rounded-full bg-indigo-600/90 px-2 py-0.5 text-xs font-medium text-white">
          {categoryLabels[wrap.category]}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
          {wrap.name}
        </h3>
        {wrap.description && (
          <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {wrap.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-indigo-600">
            {formattedPrice}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            ~{wrap.estimatedHours}h install
          </span>
        </div>
      </div>
    </article>
  );
}
