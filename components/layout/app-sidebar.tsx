/**
 * Tenant Sidebar Component
 *
 * Sidebar navigation for tenant routes with Clerk user menu integration.
 * Follows RSC-first pattern with client components only for interactivity.
 */

"use client";

import { UserMenu } from "@/components/auth/user-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Calendar, CreditCard, Grid3x3, Image, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    title: "Catalog",
    url: "/catalog",
    icon: Grid3x3,
  },
  {
    title: "Visualizer",
    url: "/visualizer",
    icon: Image,
  },
  {
    title: "Scheduling",
    url: "/scheduling",
    icon: Calendar,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Settings,
  },
];

export function TenantSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-neutral-800 px-6 py-4">
        <Link href="/catalog" className="inline-flex translate-x-5 scale-120 items-center">
          <span className="border-2 border-white px-3 py-1.5 text-lg leading-none font-black tracking-tight text-neutral-100 sm:text-xl">
            CTRL+
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-6">
              {navigationItems.map((item) => {
                const isActive = pathname?.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={
                        isActive
                          ? "border-l-4 border-blue-600 bg-blue-600/10 font-semibold text-blue-600 hover:bg-blue-600/20"
                          : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
                      }
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-800 bg-neutral-900 p-4">
        <div className="flex items-center gap-3">
          <UserMenu />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-neutral-100">Account</p>
            <p className="truncate text-xs text-neutral-400">Manage your profile</p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarTrigger className="absolute top-1/8 -right-10 -translate-y-1/2 rounded-full border-2 border-neutral-800 bg-neutral-900 p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none" />
    </Sidebar>
  );
}
