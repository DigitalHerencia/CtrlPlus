import { TenantSidebarLayout } from "@/components/nav/tenant-sidebar-layout";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function TenantLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect("/sign-in");
  }

  return <TenantSidebarLayout>{children}</TenantSidebarLayout>;
}
