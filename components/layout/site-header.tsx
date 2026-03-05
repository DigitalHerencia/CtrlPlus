"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center">
          <span className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-100 border-4 border-white rounded-md px-3 py-1 leading-none">
            CTRL+
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-500 bg-transparent hover:bg-blue-600/10 hover:text-blue-400"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
