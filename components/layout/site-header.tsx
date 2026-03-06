"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
        <div className="flex flex-row items-center">
          <Link href="/" className="inline-flex items-center">
            <span className="text-lg sm:text-xl font-black tracking-tight text-neutral-100 border-2 border-white px-3 py-1.5 leading-none">
              CTRL+
            </span>
          </Link>
          <p className="ml-4 text-lg sm:text-xl text-neutral-100 uppercase tracking-widest font-semibold">
            Tint | Wraps | Signage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button className="bg-blue-600 hover:bg-transparent hover:border-2 hover:border-blue-600 hover:text-blue-600 text-neutral-100 font-semibold shadow-xl hover:shadow-2xl transition-all">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-blue-600 hover:bg-transparent hover:border-2 hover:border-blue-600 hover:text-blue-600 text-neutral-100 font-semibold shadow-xl hover:shadow-2xl transition-all">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
