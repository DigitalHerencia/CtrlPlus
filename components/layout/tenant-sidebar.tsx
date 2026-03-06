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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  CreditCard,
  Grid3x3,
  Image,
  Settings,
} from "lucide-react";
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
        <Link href="/catalog" className="flex items-center gap-2">
          <div className="text-2xl font-black text-blue-600 uppercase">CTRL+</div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-neutral-400 font-semibold uppercase text-xs">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname?.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={isActive ? "bg-blue-600/10 text-blue-600 border-l-4 border-blue-600 font-semibold hover:bg-blue-600/20" : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"}
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
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-100 truncate">Account</p>
            <p className="text-xs text-neutral-400 truncate">
              Manage your profile
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
