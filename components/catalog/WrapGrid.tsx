import { type WrapDTO } from "@/lib/catalog/types";
import { TenantEmptyState } from "@/components/tenant/page-shell";
import { WrapCard } from "./WrapCard";

interface WrapGridProps {
  wraps: WrapDTO[];
}

export function WrapGrid({ wraps }: WrapGridProps) {
  if (wraps.length === 0) {
    return (
      <TenantEmptyState
        title="No wraps found"
        description="Try adjusting your search or filter criteria to find the wrap package you need."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {wraps.map((wrap) => (
        <WrapCard
          key={wrap.id}
          wrap={{
            id: wrap.id,
            name: wrap.name,
            description: wrap.description,
            price: wrap.price,
            installationMinutes: wrap.installationMinutes,
            images: wrap.images,
          }}
        />
      ))}
    </div>
  );
}
