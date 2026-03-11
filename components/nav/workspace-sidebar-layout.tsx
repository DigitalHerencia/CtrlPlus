"use client";

import { UserMenu } from "@/components/auth/user-menu";
import { LogoMark } from "@/components/nav/logo-mark";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { isWorkspaceNavActive, workspaceNavGroups } from "./workspace-nav-config";

const SIDEBAR_STORAGE_KEY = "workspace_sidebar_open";

interface WorkspaceSidebarLayoutProps {
  children: ReactNode;
  canAccessOwnerDashboard: boolean;
  canAccessAdminConsole: boolean;
}

export function WorkspaceSidebarLayout({
  children,
  canAccessOwnerDashboard,
  canAccessAdminConsole,
}: WorkspaceSidebarLayoutProps) {
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

  return (
    <SidebarProvider open={open} onOpenChange={setOpen} className="bg-neutral-900 text-neutral-100">
      <Sidebar
        collapsible="icon"
        className="border-r border-neutral-700 bg-neutral-900 text-neutral-100"
      >
        <SidebarHeader className="border-b border-neutral-700 px-3 py-3">
          <Link href="/catalog" className="flex items-center gap-3">
            <LogoMark />
            <span className="text-xs tracking-[0.18em] text-neutral-100 uppercase group-data-[collapsible=icon]:hidden">
              Store Workspace
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          {workspaceNavGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-[0.65rem] tracking-[0.24em] text-blue-600 uppercase">
                {group.label}
              </SidebarGroupLabel>
              <SidebarMenu>
                {group.items
                  .filter((item) => {
                    if (item.access === "owner_dashboard") {
                      return canAccessOwnerDashboard;
                    }

                    if (item.access === "admin_dashboard") {
                      return canAccessAdminConsole;
                    }

                    return true;
                  })
                  .map((item) => {
                    const active = isWorkspaceNavActive(pathname, item.href);

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.title}
                          className={cn(
                            "h-11 border border-transparent px-3 text-neutral-100 transition-colors hover:bg-neutral-900 hover:text-neutral-100",
                            "data-[active=true]:border-blue-600 data-[active=true]:bg-blue-600/15 data-[active=true]:text-neutral-100",
                            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2",
                          )}
                        >
                          <Link href={item.href}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-neutral-700 px-3 py-3">
          <div className="flex items-center gap-3 border border-neutral-700 bg-neutral-900 px-2 py-2">
            <UserMenu />
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold text-neutral-100">Account</p>
              <p className="truncate text-xs text-neutral-100">Profile and session settings</p>
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="bg-neutral-900 text-neutral-100">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-700 px-4 md:hidden">
          <SidebarTrigger className="text-neutral-100 hover:bg-neutral-900 hover:text-neutral-100" />
          <Link href="/catalog" className="inline-flex items-center">
            <LogoMark className="scale-90" />
          </Link>
          <div className="w-7" />
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
