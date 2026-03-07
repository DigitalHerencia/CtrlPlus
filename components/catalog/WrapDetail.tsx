import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type WrapDTO } from "@/lib/catalog/types";
import { formatPrice, formatInstallationTime } from "@/lib/catalog/formatters";

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

      <Card className="border-border/70 bg-gradient-to-br from-card to-card/70">
        <CardHeader className="gap-3">
          <CardTitle className="text-3xl tracking-tight">{wrap.name}</CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-primary tabular-nums">
              {formatPrice(wrap.price)}
            </span>
            {installationTime && (
              <Badge variant="secondary">⏱ {installationTime} installation</Badge>
            )}
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
            Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Price</dt>
            <dd className="font-medium">{formatPrice(wrap.price)}</dd>
            {installationTime && (
              <>
                <dt className="text-muted-foreground">Installation Time</dt>
                <dd className="font-medium">{installationTime}</dd>
              </>
            )}
            <dt className="text-muted-foreground">Added</dt>
            <dd className="font-medium">
              {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                new Date(wrap.createdAt),
              )}
            </dd>
            <dt className="text-muted-foreground">Last Updated</dt>
            <dd className="font-medium">
              {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                new Date(wrap.updatedAt),
              )}
            </dd>
          </dl>
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
