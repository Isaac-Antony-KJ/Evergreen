"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn, ordinal } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/toast";
import { createBill, updateBill } from "@/app/manage/[editToken]/actions";
import { REMINDER_OFFSET_OPTIONS, DEFAULT_REMINDER_TIME } from "@/lib/constants";
import type { Bill, BillFormValues } from "@/lib/types";

const NAME_SUGGESTIONS = [
  "Electricity",
  "Water",
  "Internet",
  "Rent",
  "Credit Card",
  "Phone",
  "Insurance",
];

export function BillForm({ editToken, bill }: { editToken: string; bill?: Bill }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(bill?.name ?? "");
  const [dayOfMonth, setDayOfMonth] = useState<number | null>(bill?.day_of_month ?? null);
  const [enabled, setEnabled] = useState(bill?.enabled ?? true);
  const [reminderEnabled, setReminderEnabled] = useState(
    bill ? bill.reminder_time !== null : true
  );
  const [reminderTime, setReminderTime] = useState(
    bill?.reminder_time?.slice(0, 5) ?? DEFAULT_REMINDER_TIME
  );
  const [reminderOffsetDays, setReminderOffsetDays] = useState(bill?.reminder_offset_days ?? 1);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!dayOfMonth) {
      setError("Pick which day of the month this bill is due.");
      return;
    }

    const values: BillFormValues = {
      name,
      day_of_month: dayOfMonth,
      enabled,
      reminder_enabled: reminderEnabled,
      reminder_time: reminderTime,
      reminder_offset_days: reminderOffsetDays,
    };

    startTransition(async () => {
      const result = bill
        ? await updateBill(editToken, bill.id, values)
        : await createBill(editToken, values);

      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast(bill ? "Bill updated" : "Bill added");
      router.push(`/manage/${editToken}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <Label htmlFor="bill-name">Bill name</Label>
        <Input
          id="bill-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Electricity"
          maxLength={80}
          required
        />
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {NAME_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setName(suggestion)}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Due day of the month</Label>
        <DayPicker value={dayOfMonth} onChange={setDayOfMonth} />
        <p className="mt-2 text-xs text-muted-foreground">
          Months without this day (like the 31st in April) simply skip that month — standard
          calendar behavior.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-border px-4 py-3.5">
        <div>
          <p className="font-medium text-foreground">Reminder</p>
          <p className="text-sm text-muted-foreground">Get an alert before it&apos;s due</p>
        </div>
        <Switch
          checked={reminderEnabled}
          onCheckedChange={setReminderEnabled}
          aria-label="Toggle reminder"
        />
      </div>

      {reminderEnabled && (
        <div className="space-y-5 rounded-[var(--radius-md)] bg-surface p-4">
          <div>
            <Label htmlFor="reminder-time">Reminder time</Label>
            <Input
              id="reminder-time"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-40"
            />
          </div>
          <div>
            <Label>Remind me</Label>
            <div className="flex flex-wrap gap-2">
              {REMINDER_OFFSET_OPTIONS.map((option) => (
                <button
                  key={option.days}
                  type="button"
                  onClick={() => setReminderOffsetDays(option.days)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                    reminderOffsetDays === option.days
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-primary"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-border px-4 py-3.5">
        <div>
          <p className="font-medium text-foreground">Show on calendar</p>
          <p className="text-sm text-muted-foreground">
            Turn off to hide this bill without deleting it
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Toggle enabled" />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving…" : bill ? "Save changes" : "Add bill"}
      </Button>
    </form>
  );
}

function DayPicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (day: number) => void;
}) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((day) => (
        <button
          key={day}
          type="button"
          onClick={() => onChange(day)}
          aria-pressed={value === day}
          aria-label={`Due on the ${ordinal(day)}`}
          className={cn(
            "flex h-10 items-center justify-center rounded-[var(--radius-sm)] text-sm transition-colors",
            value === day
              ? "bg-primary font-medium text-primary-foreground"
              : "bg-surface text-foreground hover:bg-accent"
          )}
        >
          {day}
        </button>
      ))}
    </div>
  );
}
