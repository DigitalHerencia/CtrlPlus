import { TenantSidebar } from "@/components/layout/app-sidebar";
import { TenantHeader } from "@/components/layout/tenant-header";
import { TenantLayoutClient } from "@/components/layout/tenant-layout-client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

const sidebarStyle = {
  "--sidebar-width": "18.5rem",
  "--sidebar-width-icon": "4.5rem",
} as CSSProperties;

export default async function TenantLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    redirect("/sign-in");
  }
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen} style={sidebarStyle}>
      <TenantSidebar />
      <TenantLayoutClient>
        <TenantHeader />
        <main className="flex-1">{children}</main>
      </TenantLayoutClient>
    </SidebarProvider>
  );
}
