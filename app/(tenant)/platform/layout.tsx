import { getSession } from "@/lib/auth/session";
import { requirePlatformAdmin } from "@/lib/authz/policy";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

interface PlatformLayoutProps {
  children: ReactNode;
}

export default async function PlatformLayout({ children }: PlatformLayoutProps) {
  const session = await getSession();

  if (!session.isAuthenticated || !session.userId) {
    redirect("/sign-in");
  }

  try {
    requirePlatformAdmin(session.authz);
  } catch {
    redirect("/catalog");
  }

  return children;
}
