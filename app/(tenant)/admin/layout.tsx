import { getSession } from "@/lib/auth/session";
import { requireOwnerOrAdmin } from "@/lib/authz/policy";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSession();

  if (!session.isAuthenticated || !session.userId) {
    redirect("/sign-in");
  }

  try {
    requireOwnerOrAdmin(session.authz);
  } catch {
    redirect("/catalog");
  }

  return children;
}
