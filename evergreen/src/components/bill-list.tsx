"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Bell } from "lucide-react";
import { BillIcon } from "@/components/bill-icon";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/toast";
import { toggleBillEnabled } from "@/app/manage/[editToken]/actions";
import { formatDueDay, formatReminderSummary } from "@/lib/utils";
import type { Bill } from "@/lib/types";

export function BillList({ bills, editToken }: { bills: Bill[]; editToken: string }) {
  return (
    <ul className="divide-y divide-border">
      {bills.map((bill) => (
        <BillRow key={bill.id} bill={bill} editToken={editToken} />
      ))}
    </ul>
  );
}

function BillRow({ bill, editToken }: { bill: Bill; editToken: string }) {
  const [enabled, setEnabled] = useState(bill.enabled);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleToggle(next: boolean) {
    setEnabled(next);
    startTransition(async () => {
      const result = await toggleBillEnabled(editToken, bill.id, next);
      if (!result.ok) {
        setEnabled(!next);
        toast(result.error);
      }
    });
  }

  const reminder = formatReminderSummary(bill.reminder_time, bill.reminder_offset_days);

  return (
    <li className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
      <Link
        href={`/manage/${editToken}/bills/${bill.id}/edit`}
        className="flex min-w-0 flex-1 items-center gap-3.5 rounded-[var(--radius-sm)] -m-1 p-1 hover:bg-accent/50"
      >
        <BillIcon name={bill.name} />
        <span className="min-w-0">
          <span className={`block truncate font-medium text-foreground ${enabled ? "" : "opacity-50"}`}>
            {bill.name}
          </span>
          <span className="block truncate text-sm text-muted-foreground">
            {formatDueDay(bill.day_of_month)}
          </span>
          {reminder && (
            <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <Bell className="h-3 w-3 shrink-0" strokeWidth={1.75} />
              {reminder}
            </span>
          )}
        </span>
      </Link>
      <Switch
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={isPending}
        aria-label={`${enabled ? "Disable" : "Enable"} ${bill.name}`}
      />
    </li>
  );
}
