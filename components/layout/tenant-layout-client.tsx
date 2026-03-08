"use client";
import { useSidebar } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

export function TenantLayoutClient({ children }: { children: ReactNode }) {
  const { state } = useSidebar();
  // Adjust margin or width based on sidebar state
  return (
    <div
      className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
        state === "collapsed" ? "ml-18" : "ml-74"
      }`}
      style={{
        transitionProperty: "margin, width, padding",
      }}
    >
      {children}
    </div>
  );
}
