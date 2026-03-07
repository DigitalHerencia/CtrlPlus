"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatInstallationTime } from "@/lib/catalog/formatters";

export interface WrapCardData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  installationMinutes: number | null;
  images: Array<{ id: string; url: string; displayOrder: number }>;
}

interface WrapCardProps {
  wrap: WrapCardData;
}

export function WrapCard({ wrap }: WrapCardProps) {
  const installationTime = formatInstallationTime(wrap.installationMinutes);
  const image = wrap.images[0];

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/70 bg-card/85 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.url} alt={wrap.name} className="h-40 w-full object-cover" />
      )}

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-base leading-tight">{wrap.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        {wrap.description && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{wrap.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {installationTime && (
            <Badge variant="secondary" className="text-xs">
              ⏱ {installationTime}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border/70 pt-3">
        <span className="text-lg font-bold tabular-nums">{formatPrice(wrap.price)}</span>
        <Button asChild size="sm" className="transition-transform group-hover:translate-x-0.5">
          <Link href={`/catalog/${wrap.id}`}>View details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
