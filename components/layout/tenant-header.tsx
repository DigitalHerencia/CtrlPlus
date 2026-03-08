"use client";

import { getTenantRouteContext } from "@/components/layout/tenant-navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function TenantHeader() {
  const pathname = usePathname();
  const route = getTenantRouteContext(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-800/80 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_28%),linear-gradient(180deg,rgba(10,10,10,0.95),rgba(10,10,10,0.82))] backdrop-blur supports-backdrop-filter:bg-neutral-950/72">
      <div className="mx-auto flex h-16 w-full max-w-352 items-center gap-3 px-4 transition-[height,max-width,padding] duration-300 ease-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 sm:px-6 lg:px-8 xl:group-has-data-[collapsible=icon]/sidebar-wrapper:max-w-384">
        <SidebarTrigger className="-ml-1 h-10 w-10 rounded-xl border border-neutral-800 bg-neutral-950/80 text-neutral-100 shadow-sm transition-colors hover:bg-neutral-900 hover:text-blue-500" />
        <Separator orientation="vertical" className="hidden h-6 bg-neutral-800 sm:block" />
        <div className="min-w-0 flex-1">
          <Breadcrumb className="hidden md:block">
            <BreadcrumbList className="text-xs tracking-wide text-neutral-500">
              {route.breadcrumbs.map((breadcrumb, index) => {
                const isLast = index === route.breadcrumbs.length - 1;

                return (
                  <Fragment key={`${breadcrumb.label}-${index}`}>
                    <BreadcrumbItem>
                      {breadcrumb.href && !isLast ? (
                        <BreadcrumbLink asChild className="text-neutral-500 hover:text-neutral-100">
                          <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-neutral-300">
                          {breadcrumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {!isLast ? <BreadcrumbSeparator className="text-neutral-700" /> : null}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="app-kicker text-[0.65rem] text-blue-500/90">{route.sectionLabel}</p>
              <h1 className="truncate text-lg font-black tracking-tight text-neutral-100 uppercase sm:text-xl">
                {route.title}
              </h1>
            </div>
            <p className="hidden max-w-2xl text-sm leading-6 text-neutral-400 lg:block">
              {route.description}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
