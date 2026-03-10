import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WorkspacePageIntroProps {
  label: string;
  title: string;
  description: string;
  actions?: ReactNode;
  detail?: ReactNode;
  className?: string;
}

export function WorkspacePageIntro({
  label,
  title,
  description,
  actions,
  detail,
  className,
}: WorkspacePageIntroProps) {
  return (
    <section className={cn("app-hero-panel px-6 py-7 sm:px-8 sm:py-8", className)}>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.3),transparent_68%)]" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="app-kicker">{label}</p>
          <div className="space-y-3">
            <h1 className="app-heading">{title}</h1>
            <p className="app-subheading">{description}</p>
          </div>
        </div>
        {(actions || detail) && (
          <div className="flex w-full flex-col gap-4 lg:w-auto lg:min-w-72 lg:items-end">
            {detail ? <div className="w-full lg:w-auto">{detail}</div> : null}
            {actions ? <div className="flex flex-wrap gap-3 lg:justify-end">{actions}</div> : null}
          </div>
        )}
      </div>
    </section>
  );
}

interface WorkspaceMetricCardProps {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  badge?: string;
  className?: string;
}

export function WorkspaceMetricCard({
  label,
  value,
  description,
  icon: Icon,
  badge,
  className,
}: WorkspaceMetricCardProps) {
  return (
    <Card className={cn("app-panel border-neutral-800/90 bg-neutral-900/80", className)}>
      <CardHeader className="gap-3 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardDescription className="text-xs tracking-[0.18em] uppercase">
              {label}
            </CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-neutral-100">
              {value}
            </CardTitle>
          </div>
          {Icon ? (
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-600/30 bg-blue-600/12 text-blue-300">
              <Icon className="h-5 w-5" />
            </span>
          ) : null}
        </div>
      </CardHeader>
      {(description || badge) && (
        <CardContent className="flex items-center justify-between gap-3 pt-0">
          <p className="text-sm text-neutral-400">{description}</p>
          {badge ? <Badge variant="outline">{badge}</Badge> : null}
        </CardContent>
      )}
    </Card>
  );
}

interface WorkspaceEmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function WorkspaceEmptyState({
  title,
  description,
  action,
  className,
}: WorkspaceEmptyStateProps) {
  return (
    <Card className={cn("app-panel border-dashed text-center", className)}>
      <CardContent className="flex flex-col items-center gap-4 py-14">
        <div className="space-y-2">
          <p className="app-kicker">No Results</p>
          <h2 className="text-xl font-bold text-neutral-100">{title}</h2>
          <p className="max-w-md text-sm text-neutral-400">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
