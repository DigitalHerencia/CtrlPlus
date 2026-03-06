"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatInstallationTime } from "@/lib/catalog/formatters";

/** Minimal serializable subset of WrapDTO needed by this component. */
export interface WrapCardData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  installationMinutes: number | null;
}

interface WrapCardProps {
  wrap: WrapCardData;
}

export function WrapCard({ wrap }: WrapCardProps) {
  const installationTime = formatInstallationTime(wrap.installationMinutes);

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-base leading-tight">{wrap.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {wrap.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{wrap.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {installationTime && (
            <Badge variant="secondary" className="text-xs">
              ⏱ {installationTime}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <span className="text-lg font-bold">{formatPrice(wrap.price)}</span>
        <Button asChild size="sm">
          <Link href={`/catalog/${wrap.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
