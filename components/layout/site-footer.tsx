"use client";

import { Separator } from "@/components/ui/separator";
export function SiteFooter() {
  return (
    <footer className="bg-neutral-950/95">
      <Separator className="bg-neutral-800" />
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-8 sm:px-8 lg:px-12">
        <p className="text-center text-sm text-neutral-500">© 2026 CTRL+ All rights reserved.</p>
      </div>
    </footer>
  );
}
