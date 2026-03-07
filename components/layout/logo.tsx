import Link from "next/link";

interface LogoProps {
  variant?: "full" | "icon";
  href?: string;
  className?: string;
}

export function Logo({ variant = "full", href = "/catalog", className = "" }: LogoProps) {
  const content = (
    <Link href={href} className={`inline-flex items-center ${className}`}>
      <span
        className={`border-2 border-white text-lg leading-none font-black tracking-tight text-neutral-100 sm:text-xl ${
          variant === "icon" ? "px-2 py-1" : "px-3 py-1.5"
        }`}
      >
        {variant === "icon" ? "C+" : "CTRL+"}
      </span>
    </Link>
  );
  return content;
}
