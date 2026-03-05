import { WrapDTO } from "@/lib/catalog/types";
import { WrapCard } from "./WrapCard";

interface WrapGridProps {
  wraps: WrapDTO[];
}

export function WrapGrid({ wraps }: WrapGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {wraps.map((wrap) => (
        <WrapCard key={wrap.id} wrap={wrap} />
      ))}
    </div>
  );
}
