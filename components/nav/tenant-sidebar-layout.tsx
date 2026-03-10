"use client";

import { UserMenu } from "@/components/auth/user-menu";
import { cn } from "@/lib/utils";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

import { isTenantNavActive, tenantNavGroups } from "./tenant-nav-config";

const SIDEBAR_STORAGE_KEY = "tenant_sidebar_collapsed";

interface TenantSidebarLayoutProps {
  children: ReactNode;
}

export function TenantSidebarLayout({ children }: TenantSidebarLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  });
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(null);
  const mobileOpen = mobileOpenPath === pathname;

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  const layoutStyle = useMemo(
    () =>
      ({
        "--tenant-sidebar-width": collapsed ? "5.5rem" : "17.5rem",
      }) as CSSProperties,
    [collapsed],
  );

  return (
    <div
      className="relative min-h-screen md:grid md:grid-cols-[var(--tenant-sidebar-width)_minmax(0,1fr)]"
      style={layoutStyle}
    >
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-neutral-800/80 bg-neutral-950/95 transition-transform duration-300 md:relative md:z-auto md:w-[var(--tenant-sidebar-width)] md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-neutral-800/80 px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <Link href="/catalog" className="inline-flex min-w-0 flex-1 items-center">
                <span className="border-2 border-white px-3 py-1.5 text-lg leading-none font-black tracking-tight text-neutral-100 sm:text-xl">
                  CTRL+
                </span>
                <span className={cn("ml-3 text-xs text-neutral-400", collapsed && "md:hidden")}>
                  Tenant workspace
                </span>
              </Link>
              <button
                type="button"
                className="hidden h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-neutral-100 md:inline-flex"
                onClick={() => setCollapsed((value) => !value)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <PanelLeftOpen className="size-4" />
                ) : (
                  <PanelLeftClose className="size-4" />
                )}
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-neutral-100 md:hidden"
                onClick={() => setMobileOpenPath(null)}
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
            {tenantNavGroups.map((group) => (
              <section key={group.label} className="space-y-2">
                <p
                  className={cn(
                    "px-2 text-[0.65rem] font-semibold tracking-[0.24em] text-blue-600 uppercase",
                    collapsed && "md:hidden",
                  )}
                >
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active = isTenantNavActive(pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={collapsed ? item.title : undefined}
                        onClick={() => setMobileOpenPath(null)}
                        className={cn(
                          "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200",
                          collapsed && "md:justify-center md:px-2",
                          active
                            ? "bg-blue-600/14 text-blue-400 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.35)]"
                            : "text-neutral-400 hover:bg-neutral-900/90 hover:text-neutral-100",
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span className={cn("truncate", collapsed && "md:hidden")}>
                          {item.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </nav>

          <div className="border-t border-neutral-800/80 p-3">
            <div className="flex items-center gap-3 rounded-2xl border border-neutral-800/90 bg-neutral-900/85 p-2">
              <UserMenu />
              <div className={cn("min-w-0", collapsed && "md:hidden")}>
                <p className="truncate text-sm font-semibold text-neutral-100">Account</p>
                <p className="truncate text-xs text-neutral-400">Profile and session settings</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <button
        type="button"
        aria-hidden={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpenPath(null)}
      />

      <div className="flex min-w-0 flex-col">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-800/80 bg-neutral-950/92 px-4 py-3 backdrop-blur md:hidden">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/85 text-neutral-200"
            onClick={() => setMobileOpenPath(pathname)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <p className="text-xs font-semibold tracking-[0.2em] text-neutral-300 uppercase">CTRL+</p>
          <div className="h-10 w-10" />
        </div>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
