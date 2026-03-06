import { TenantSidebar } from "@/components/layout/tenant-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function TenantLayout({ children }: { children: React.ReactNode }) {
  // Require authentication for tenant routes
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect("/sign-in");
  }

  // TODO: If no tenant, redirect to tenant creation/selection flow

  return (
    <SidebarProvider>
      <TenantSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-neutral-800 bg-neutral-950 px-4">
          <SidebarTrigger />
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
