"use client";

import { Separator } from "@/components/ui/separator";
export function SiteFooter() {
  return (
    <footer className="bg-neutral-950/95">
      <Separator className="bg-neutral-800" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 flex items-center justify-center">
        <p className="text-sm text-neutral-500 text-center">© 2026 CTRL+ All rights reserved.</p>
      </div>
    </footer>
  );
}
