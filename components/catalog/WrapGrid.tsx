import { Card, CardContent } from "@/components/ui/card";
import { type WrapDTO } from "@/lib/catalog/types";
import { WrapCard } from "./WrapCard";

interface WrapGridProps {
  wraps: WrapDTO[];
}

export function WrapGrid({ wraps }: WrapGridProps) {
  if (wraps.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 text-5xl">🔍</div>
          <h3 className="mb-2 text-lg font-semibold">No wraps found</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try adjusting your search or filter criteria to find what you&apos;re looking for.
          </p>
        </CardContent>
      </Card>
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
          }}
        />
      ))}
    </div>
  );
}
