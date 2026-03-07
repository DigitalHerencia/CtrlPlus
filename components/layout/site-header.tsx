"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 sm:px-8 lg:px-12">
        <div className="flex flex-row items-center">
          <Link href="/" className="inline-flex items-center">
            <span className="border-2 border-white px-3 py-1.5 text-lg leading-none font-black tracking-tight text-neutral-100 sm:text-xl">
              CTRL+
            </span>
          </Link>
          <p className="ml-4 text-lg font-semibold tracking-widest text-neutral-100 uppercase sm:text-xl">
            Tint | Wraps | Signage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button className="bg-blue-600 font-semibold text-neutral-100 shadow-xl transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600 hover:shadow-2xl">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-blue-600 font-semibold text-neutral-100 shadow-xl transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600 hover:shadow-2xl">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
