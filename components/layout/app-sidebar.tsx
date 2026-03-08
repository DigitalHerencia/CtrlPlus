"use client";

import { UserMenu } from "@/components/auth/user-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  isTenantNavChildActive,
  isTenantNavItemActive,
  tenantNavigation,
} from "@/components/layout/tenant-navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Command } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TenantSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r-0 bg-transparent">
      <SidebarHeader className="border-b border-neutral-800/80 px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="h-14 rounded-2xl border border-neutral-800/80 bg-neutral-900/90 px-3 shadow-[0_18px_40px_-28px_rgba(37,99,235,0.75)] transition-colors hover:bg-neutral-900"
            >
              <Link href="/catalog">
                <div className="flex size-10 items-center justify-center rounded-xl border border-blue-600/40 bg-blue-600/15 text-blue-600">
                  <Command className="size-5" />
                </div>
                <div className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-black tracking-[0.32em] text-neutral-100 uppercase">
                    CTRL+
                  </span>
                  <span className="truncate text-xs text-neutral-400">Tenant workspace</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-4 px-2 py-4">
        {tenantNavigation.map((group) => (
          <SidebarGroup key={group.label} className="px-1">
            <SidebarGroupLabel className="px-3 text-[0.65rem] font-semibold tracking-[0.28em] text-blue-600 uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const itemActive = isTenantNavItemActive(pathname, item);

                  return (
                    <Collapsible
                      key={item.href}
                      asChild
                      defaultOpen={itemActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={itemActive}
                          className={cn(
                            "h-11 rounded-xl px-3 text-neutral-400 transition-all duration-200 hover:bg-neutral-900/90 hover:text-neutral-100",
                            itemActive &&
                              "bg-blue-600/10 text-blue-600 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.3)]",
                          )}
                        >
                          <Link href={item.href}>
                            <item.icon className="size-4" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>

                        {item.children?.length ? (
                          <>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuAction className="right-2 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-100">
                                <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                <span className="sr-only">Toggle {item.title}</span>
                              </SidebarMenuAction>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub className="mx-4 mt-1 border-l border-neutral-800/80 pl-3">
                                {item.children.map((child) => {
                                  const isChildActive = isTenantNavChildActive(pathname, child);

                                  return (
                                    <SidebarMenuSubItem key={child.href}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={isChildActive}
                                        className={cn(
                                          "rounded-lg px-2 py-1.5 text-neutral-400 transition-colors hover:bg-neutral-900/80 hover:text-neutral-100",
                                          isChildActive && "bg-neutral-900 text-neutral-100",
                                        )}
                                      >
                                        <Link href={child.href}>
                                          <span>{child.title}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </>
                        ) : null}
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-800/80 p-3">
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/85 p-2 shadow-[0_18px_50px_-36px_rgba(37,99,235,0.75)]">
          <div className="flex items-center gap-3">
            <UserMenu />
            <div className="min-w-0 flex-1 transition-opacity duration-200 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold text-neutral-100">Account</p>
              <p className="truncate text-xs text-neutral-400">Profile, session, and sign-out</p>
            </div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail className="after:bg-neutral-800/60 hover:after:bg-blue-600/45" />
    </Sidebar>
  );
}
