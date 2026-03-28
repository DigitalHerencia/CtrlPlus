'use client'

import { UserMenu } from '@/components/auth/user-menu'
import { LogoIcon } from '@/components/shared/logo-icon'
import { LogoMark } from '@/components/shared/logo-mark'
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
    SidebarRail,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type CSSProperties, type ReactNode, useEffect, useMemo, useState } from 'react'

import { isTenantNavActive, tenantNavItems } from './tenant-nav-config'

const SIDEBAR_STORAGE_KEY = 'tenant_sidebar_open'

interface TenantSidebarProps {
    canAccessOwnerDashboard: boolean
    canAccessAdminConsole: boolean
    children: ReactNode
}
export function TenantSidebar({
    canAccessOwnerDashboard,
    canAccessAdminConsole,
    children,
}: TenantSidebarProps) {
    const pathname = usePathname()
    const [open, setOpen] = useState(() => {
        if (typeof window === 'undefined') {
            return true
        }

        return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) !== 'false'
    })

    useEffect(() => {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open))
    }, [open])

    const visibleNavItems = useMemo(
        () =>
            tenantNavItems.filter((item) => {
                if (item.access === 'owner_dashboard') {
                    return canAccessOwnerDashboard
                }

                if (item.access === 'admin_dashboard') {
                    return canAccessAdminConsole
                }

                return true
            }),
        [canAccessAdminConsole, canAccessOwnerDashboard]
    )

    return (
        <SidebarProvider
            open={open}
            onOpenChange={setOpen}
            className="bg-neutral-900 text-neutral-100"
            style={
                {
                    '--sidebar-width': '17rem',
                    '--sidebar-width-icon': '4.5rem',
                } as CSSProperties
            }
        >
            <Sidebar
                collapsible="icon"
                className="supports-backdrop-filter:bg-neutral-950/80 border-r border-neutral-700 bg-neutral-950/90 text-neutral-100 backdrop-blur"
            >
                <SidebarRail />
                <SidebarHeader className="border-b border-neutral-700 px-3 py-4">
                    <Link href="/catalog" className="mx-auto flex items-center">
                        <LogoMark className="duration-250 my-4 scale-150 transition-all group-data-[collapsible=icon]:hidden" />
                        <LogoIcon className="duration-250 hidden scale-75 transition-all group-data-[collapsible=icon]:inline-flex" />
                    </Link>
                </SidebarHeader>

                <SidebarContent className="mx-auto px-2 py-4">
                    <SidebarMenu>
                        {visibleNavItems.map((item) => {
                            const active = isTenantNavActive(pathname, item.href)

                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={active}
                                        className={cn(
                                            'duration-250 h-11 border border-transparent px-3 text-neutral-200 transition-all ease-out hover:border-neutral-700 hover:bg-neutral-900 hover:text-neutral-100',
                                            'data-[active=true]:border-blue-600 data-[active=true]:bg-blue-600/15 data-[active=true]:text-neutral-100',
                                            'group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0'
                                        )}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="size-4 shrink-0" />
                                            <span className="group-data-[collapsible=icon]:hidden">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarContent>

                <SidebarFooter className="border-t border-neutral-700 px-3 py-3">
                    <div className="mx-auto flex items-center gap-3 py-2">
                        <UserMenu />
                        <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                            <p className="truncate text-sm font-semibold leading-tight text-blue-600">
                                User Menu
                            </p>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset
                className={cn(
                    'overflow-x-hidden bg-neutral-900 text-neutral-100 transition-[width,margin,max-width] duration-100 ease-out motion-reduce:transition-none',
                    open
                        ? 'ml-48 max-w-[calc(100vw-var(--sidebar-width-icon))] pr-2'
                        : 'ml-16 max-w-[calc(100vw-var(--sidebar-width-icon))]'
                )}
            >
                <main className="mx-auto min-h-screen w-full px-6 py-6 transition-[max-width,padding] duration-100 ease-out motion-reduce:transition-none">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
