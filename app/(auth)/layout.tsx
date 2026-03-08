import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | CTRL+",
  description: "Sign in to your CTRL+ account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen w-full flex-col items-center justify-center">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
