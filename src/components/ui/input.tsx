import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-[var(--radius-md)] border border-border bg-background px-4 text-[0.95rem] text-foreground placeholder:text-muted-foreground",
        "outline-none transition-colors focus-visible:border-primary",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
