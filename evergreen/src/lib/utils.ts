import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 11 -> "11th", 21 -> "21st" ... */
export function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export function formatDueDay(dayOfMonth: number): string {
  return `Monthly on the ${ordinal(dayOfMonth)}`;
}

/** "09:00" -> "9:00 AM" */
export function formatTime(time: string): string {
  const [hStr = "0", mStr = "00"] = time.split(":");
  const h = Number(hStr);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mStr} ${period}`;
}

export function formatReminderSummary(
  reminderTime: string | null,
  offsetDays: number | null
): string | null {
  if (!reminderTime || offsetDays === null) return null;
  const time = formatTime(reminderTime);
  if (offsetDays === 0) return `Reminder same day at ${time}`;
  if (offsetDays === 1) return `Reminder 1 day before at ${time}`;
  return `Reminder ${offsetDays} days before at ${time}`;
}
