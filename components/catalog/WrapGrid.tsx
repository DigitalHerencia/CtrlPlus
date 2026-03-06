import { type WrapDTO } from "@/lib/catalog/types";
import { WrapCard } from "./WrapCard";

interface WrapGridProps {
  wraps: WrapDTO[];
}

export function WrapGrid({ wraps }: WrapGridProps) {
  if (wraps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold mb-2">No wraps found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try adjusting your search or filter criteria to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {wraps.map((wrap) => (
        <WrapCard key={wrap.id} wrap={wrap} />
      ))}
    </div>
  );
}
