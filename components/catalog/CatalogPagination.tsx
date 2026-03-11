import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CatalogPaginationProps {
  page: number;
  totalPages: number;
  createPageHref: (page: number) => string;
}

export function CatalogPagination({ page, totalPages, createPageHref }: CatalogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 border border-neutral-700 bg-neutral-950/80 px-4 py-3 text-neutral-100">
      <p className="text-sm text-neutral-100">
        Page <span className="font-semibold text-neutral-100">{page}</span> of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        {page <= 1 ? (
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href={createPageHref(page - 1)}>Previous</Link>
          </Button>
        )}

        {page >= totalPages ? (
          <Button size="sm" disabled>
            Next
          </Button>
        ) : (
          <Button asChild size="sm">
            <Link href={createPageHref(page + 1)}>Next</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
