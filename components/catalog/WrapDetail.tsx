import Link from "next/link";
import { type WrapDTO } from "@/lib/catalog/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatInstallationTime } from "@/lib/catalog/formatters";
import { WrapImageManager } from "./WrapImageManager";

interface WrapDetailProps {
  wrap: WrapDTO;
}

export function WrapDetail({ wrap }: WrapDetailProps) {
  const installationTime = formatInstallationTime(wrap.installationMinutes);

  return (
    <div className="max-w-3xl space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/catalog">← Back to Catalog</Link>
      </Button>

      <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-card to-card/70">
        {wrap.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={wrap.images[0].url} alt={wrap.name} className="h-64 w-full object-cover" />
        )}
        <CardHeader className="gap-3">
          <CardTitle className="text-3xl tracking-tight">{wrap.name}</CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-primary tabular-nums">
              {formatPrice(wrap.price)}
            </span>
            {installationTime && (
              <Badge variant="secondary">⏱ {installationTime} installation</Badge>
            )}
            {wrap.categories.map((category) => (
              <Badge key={category.id} variant="outline">
                {category.name}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {wrap.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{wrap.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Wrap Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WrapImageManager wrapId={wrap.id} images={wrap.images} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/scheduling">Book Installation</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/visualizer">Preview on Vehicle</Link>
        </Button>
      </div>
    </div>
  );
}
