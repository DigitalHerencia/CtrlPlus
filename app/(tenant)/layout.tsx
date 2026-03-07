import { TenantSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import React from "react";

export default async function TenantLayout({ children }: { children: React.ReactNode }) {
  // Require authentication for tenant routes
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <TenantSidebar />
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
