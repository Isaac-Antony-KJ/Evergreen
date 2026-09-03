import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="26" height="26" rx="8" className="fill-sage-600 dark:fill-sage-400" />
      <path
        d="M16 9c5 3 5 9 0 14-5-5-5-11 0-14Z"
        className="fill-ivory-50 dark:fill-sage-900"
      />
      <line
        x1="16"
        y1="11.5"
        x2="16"
        y2="21"
        strokeWidth="1"
        className="stroke-sage-600 dark:stroke-sage-400"
        opacity="0.5"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-lg tracking-tight text-foreground">{APP_NAME}</span>
    </span>
  );
}
