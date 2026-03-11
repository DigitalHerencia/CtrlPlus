import { cn } from "@/lib/utils";

interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className }: LogoIconProps) {
  return (
    <span
      className={cn(
        "inline-flex border-2 border-white px-3 py-3 text-lg leading-none font-black tracking-tight text-neutral-100 sm:text-xl",
        className,
      )}
    >
      +
    </span>
  );
}
