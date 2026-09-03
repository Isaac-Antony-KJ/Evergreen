import { BillIcon } from "@/components/bill-icon";
import { formatDueDay } from "@/lib/utils";

const EXAMPLE_BILLS = [
  { name: "Rent", day: 1 },
  { name: "Electricity", day: 10 },
  { name: "Internet", day: 20 },
];

export function LedgerIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-sm select-none">
      <div className="absolute -inset-4 -z-10 rounded-[var(--radius-xl)] bg-sage-200/40 dark:bg-sage-800/30" />
      <div className="paper-grain rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-paper-lg)] -rotate-2">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-lg text-foreground">This month</p>
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
            3 bills
          </span>
        </div>
        <ul className="divide-y divide-border">
          {EXAMPLE_BILLS.map((bill) => (
            <li key={bill.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <BillIcon name={bill.name} className="h-9 w-9" />
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{bill.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {formatDueDay(bill.day)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
