"use client";

import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="bg-neutral-900">
      <Separator className="bg-neutral-700" />
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-neutral-100">© 2026 CTRL+ All rights reserved.</p>
      </div>
    </footer>
  );
}
