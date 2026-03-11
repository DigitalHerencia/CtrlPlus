"use client";

import { UserMenu } from "@/components/auth/user-menu";
import { LogoIcon } from "@/components/nav/logo-icon";
import { LogoMark } from "@/components/nav/logo-mark";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, type ReactNode, useEffect, useMemo, useState } from "react";

import { isTenantNavActive, tenantNavItems } from "./tenant-nav-config";

const SIDEBAR_STORAGE_KEY = "tenant_sidebar_open";

interface TenantSidebarProps {
  canAccessOwnerDashboard: boolean;
  canAccessAdminConsole: boolean;
  children: ReactNode;
}

function TenantSidebarTrigger() {
  const { open } = useSidebar();

  return (
    <SidebarTrigger
      className={cn(
        "fixed top-3 left-3 z-50 h-8 w-8 rounded-md border border-neutral-700/60 bg-neutral-950/90 text-neutral-100 shadow-sm backdrop-blur transition-[left,transform,background-color,border-color] duration-300 ease-out hover:border-blue-500/60 hover:bg-neutral-900",
        "focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-0 md:top-4",
        open
          ? "md:left-[calc(var(--sidebar-width)-0.9rem)]"
          : "md:left-[calc(var(--sidebar-width-icon)-0.9rem)]",
      )}
    />
  );
}

export function TenantSidebar({
  canAccessOwnerDashboard,
  canAccessAdminConsole,
  children,
}: TenantSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) !== "false";
  });

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open));
  }, [open]);

  const visibleNavItems = useMemo(
    () =>
      tenantNavItems.filter((item) => {
        if (item.access === "owner_dashboard") {
          return canAccessOwnerDashboard;
        }

        if (item.access === "admin_dashboard") {
          return canAccessAdminConsole;
        }

        return true;
      }),
    [canAccessAdminConsole, canAccessOwnerDashboard],
  );

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      className="bg-neutral-900 text-neutral-100"
      style={
        {
          "--sidebar-width": "17rem",
          "--sidebar-width-icon": "4.5rem",
        } as CSSProperties
      }
    >
      <Sidebar
        collapsible="icon"
        className="border-r border-neutral-700 bg-neutral-950/90 text-neutral-100 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/80"
      >
        <SidebarHeader className="border-b border-neutral-700 px-3 py-4">
          <Link href="/catalog" className="mx-auto flex items-center">
            <LogoMark className="my-4 scale-150 transition-all duration-200 group-data-[collapsible=icon]:hidden" />
            <LogoIcon className="my-1 hidden scale-75 transition-all duration-200 group-data-[collapsible=icon]:inline-flex" />
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          <SidebarMenu>
            {visibleNavItems.map((item) => {
              const active = isTenantNavActive(pathname, item.href);

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className={cn(
                      "h-11 border border-transparent px-3 text-neutral-200 transition-all duration-200 ease-out hover:border-neutral-700 hover:bg-neutral-900 hover:text-neutral-100",
                      "data-[active=true]:border-blue-600 data-[active=true]:bg-blue-600/15 data-[active=true]:text-neutral-100",
                      "group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-neutral-700 px-3 py-3">
          <div className="mx-auto flex items-center gap-3 py-2">
            <UserMenu />
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold text-blue-600">Account</p>
              <p className="truncate text-sm font-semibold text-blue-600">Preferences</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <TenantSidebarTrigger />

      <SidebarInset className="bg-neutral-100 text-neutral-100 transition-[width,margin] duration-300 ease-out motion-reduce:transition-none">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
