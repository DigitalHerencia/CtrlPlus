import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | CTRL+",
  description: "Sign in to your CTRL+ account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
