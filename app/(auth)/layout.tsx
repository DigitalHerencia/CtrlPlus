import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | CTRL+",
  description: "Sign in to your CTRL+ account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen w-full flex-col">{children}</main>;
}
