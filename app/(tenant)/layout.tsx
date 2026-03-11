import { WorkspaceSidebarLayout } from "@/components/nav/workspace-sidebar-layout";
import { getSession } from "@/lib/auth/session";
import { hasCapability } from "@/lib/authz/policy";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function TenantLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect("/sign-in");
  }

  const canAccessOwnerDashboard = hasCapability(session.authz, "dashboard.owner");
  const canAccessAdminConsole = hasCapability(session.authz, "dashboard.platform");

  return (
    <WorkspaceSidebarLayout
      canAccessOwnerDashboard={canAccessOwnerDashboard}
      canAccessAdminConsole={canAccessAdminConsole}
    >
      {children}
    </WorkspaceSidebarLayout>
  );
}
