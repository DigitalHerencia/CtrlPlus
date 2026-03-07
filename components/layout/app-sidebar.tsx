"use client"

import { UserButton } from "@clerk/nextjs"
import { Calendar, CreditCard, Grid3x3, Image, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Catalog",
    url: "/catalog",
    icon: Grid3x3
  },
  {
    title: "Visualizer",
    url: "/visualizer",
    icon: Image
  },
  {
    title: "Scheduling",
    url: "/scheduling",
    icon: Calendar
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Settings
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return <SidebarWrapper {...props} />
}

function SidebarWrapper({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar" {...props}>
        <SidebarHeader className="h-16 border-b border-sidebar-border p-2 flex items-center">
          <SidebarMenu className="w-full flex items-center">
            <SidebarMenuItem className="w-full">
              <SidebarMenuButton
                asChild
                tooltip="Home"
                className="h-16 w-full rounded-lg text-sidebar-foreground hover:bg-sidebar-accent p-2"
              >
                <Link href="/" className="w-full h-full flex items-center justify-center gap-2">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight border-2 border-white px-3 py-1 leading-none group-data-[collapsible=icon]:hidden">
                    CTRL+
                  </span>
                  <span className="hidden size-8 items-center justify-center border border-white text-lg font-black leading-none rounded-sm group-data-[collapsible=icon]:flex">
                    +
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupContent className="mt-2">
              <SidebarMenu className="gap-1">
                {navItems.map((item) => {
                  const isActive = pathname?.startsWith(item.url)
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={
                          isActive
                            ? "h-11 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 font-semibold rounded-lg border border-sidebar-border focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2"
                            : "h-11 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2"
                        }
                      >
                        <Link href={item.url} className="flex items-center gap-3">
                          <item.icon className="size-5 shrink-0" />
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="default"
                tooltip="Account"
                className="h-11 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-lg focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2"
              >
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "size-5 rounded-full ring-2 ring-sidebar-ring/30 hover:ring-sidebar-ring/60 transition-all",
                      userButtonPopoverCard: "bg-sidebar border border-sidebar-border shadow-2xl",
                      userButtonPopoverActionButton:
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                    }
                  }}
                />
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="text-sm font-semibold text-sidebar-foreground">Account</span>
                  <span className="text-xs text-sidebar-foreground/60">Manage profile</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
