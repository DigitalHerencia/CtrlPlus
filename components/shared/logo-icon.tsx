import { cn } from "@/lib/utils";

interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className }: LogoIconProps) {
  return (
    <span
      className={cn(
        "border-2 border-white px-2 pt-1 pb-2 text-2xl leading-none font-black tracking-tight text-neutral-100",
        className,
      )}
    >
      +
    </span>
  );
}
