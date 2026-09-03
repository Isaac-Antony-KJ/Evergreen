import {
  Zap,
  Droplet,
  Wifi,
  Home,
  CreditCard,
  Phone,
  Flame,
  Car,
  Tv,
  ShieldCheck,
  Dumbbell,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_RULES: Array<[RegExp, LucideIcon]> = [
  [/electric|power|energy/i, Zap],
  [/water|sewer/i, Droplet],
  [/internet|wifi|broadband/i, Wifi],
  [/rent|mortgage|hoa/i, Home],
  [/credit card|visa|mastercard|amex/i, CreditCard],
  [/phone|mobile|cell/i, Phone],
  [/gas|propane/i, Flame],
  [/car|auto|loan/i, Car],
  [/cable|streaming|tv/i, Tv],
  [/insurance/i, ShieldCheck],
  [/gym|fitness|membership/i, Dumbbell],
];

export function getBillIcon(name: string): LucideIcon {
  const match = ICON_RULES.find(([pattern]) => pattern.test(name));
  return match ? match[1] : Receipt;
}

export function BillIcon({ name, className }: { name: string; className?: string }) {
  const Icon = getBillIcon(name);
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent text-accent-foreground",
        className
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </span>
  );
}
