import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInstallationTime, formatPrice } from "@/lib/catalog/formatters";
import { type WrapDTO } from "@/lib/catalog/types";

import { WrapImageManager } from "./WrapImageManager";

interface WrapDetailProps {
  wrap: WrapDTO;
}

export function WrapDetail({ wrap }: WrapDetailProps) {
  const installationTime = formatInstallationTime(wrap.installationMinutes);

  return (
    <div className="max-w-4xl space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/catalog">Back to Catalog</Link>
      </Button>

      <Card className="overflow-hidden border-neutral-700 bg-neutral-900 text-neutral-100">
        {wrap.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={wrap.images[0].url} alt={wrap.name} className="h-72 w-full object-cover" />
        )}
        <CardHeader className="gap-3">
          <p className="text-xs font-semibold tracking-[0.24em] text-blue-600 uppercase">
            Wrap Detail
          </p>
          <CardTitle className="text-4xl font-black tracking-tight text-neutral-100">
            {wrap.name}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-black text-blue-300 tabular-nums">
              {formatPrice(wrap.price)}
            </span>
            {installationTime ? (
              <Badge variant="secondary">{installationTime} installation</Badge>
            ) : null}
            {wrap.categories.map((category) => (
              <Badge key={category.id} variant="outline">
                {category.name}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {wrap.description ? (
        <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
          <CardHeader>
            <CardTitle className="text-sm font-semibold tracking-wide text-neutral-100 uppercase">
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-neutral-300">{wrap.description}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wide text-neutral-100 uppercase">
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
