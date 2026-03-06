import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type WrapDTO } from "@/lib/catalog/types";
import { formatPrice, formatInstallationTime } from "@/lib/catalog/formatters";

interface WrapDetailProps {
  wrap: WrapDTO;
}

export function WrapDetail({ wrap }: WrapDetailProps) {
  const installationTime = formatInstallationTime(wrap.installationMinutes);

  return (
    <div className="max-w-2xl">
      {/* Back link */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/catalog">← Back to Catalog</Link>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{wrap.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-primary">{formatPrice(wrap.price)}</span>
          {installationTime && (
            <Badge variant="secondary">⏱ {installationTime} installation</Badge>
          )}
        </div>
      </div>

      {/* Description */}
      {wrap.description && (
        <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Description
          </h2>
          <p className="text-sm leading-relaxed">{wrap.description}</p>
        </div>
      )}

      {/* Details */}
      <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Details
        </h2>
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
      </div>

      {/* Actions */}
      <div className="flex gap-3">
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
