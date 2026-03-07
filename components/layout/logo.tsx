import Link from "next/link"

interface LogoProps {
  variant?: "full" | "icon"
  href?: string
  className?: string
}

export function Logo({ variant = "full", href = "/catalog", className = "" }: LogoProps) {
  const content = (
    <Link href={href} className={`inline-flex items-center ${className}`}>
      <span className="text-lg sm:text-xl font-black tracking-tight text-neutral-100 border-2 border-white px-3 py-1.5 leading-none">
        CTRL+
      </span>
    </Link>
  )
  return content
}
