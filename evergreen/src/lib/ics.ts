import { APP_NAME, ICS_UID_DOMAIN } from "./constants";
import type { Bill, Calendar } from "./types";

const CRLF = "\r\n";

/**
 * All bills anchor their RRULE to January of this fixed, arbitrary year.
 * January always has 31 days, so DTSTART's day-of-month is guaranteed valid
 * for every possible day_of_month (1–31) without any per-bill date math.
 * The anchor is never shown to anyone — RRULE:FREQ=MONTHLY carries the
 * recurrence forward indefinitely from here.
 */
const ANCHOR_YEAR = 2020;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** RFC 5545 §3.3.11 TEXT escaping. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Folds a content line at 75 octets as RFC 5545 §3.1 requires, continuing
 * with CRLF + a single space. Long SUMMARY/DESCRIPTION values need this or
 * some strict parsers will reject the feed outright. Folds by character
 * count, which is exact for the ASCII-range bill names and boilerplate text
 * this app generates; a name with heavy multi-byte Unicode right at the
 * boundary could in principle fold a few octets late, which real-world
 * calendar clients tolerate fine.
 */
function foldLine(line: string): string {
  const maxLen = 75;
  if (line.length <= maxLen) return line;

  let out = "";
  let rest = line;
  let first = true;
  while (rest.length > 0) {
    const take = first ? maxLen : maxLen - 1;
    out += (first ? "" : CRLF + " ") + rest.slice(0, take);
    rest = rest.slice(take);
    first = false;
  }
  return out;
}

/**
 * Formats a signed minute offset as an RFC 5545 §3.3.6 DURATION value, e.g.
 * -90 -> "-PT1H30M", 1440 -> "P1D". Used for VALARM TRIGGER values.
 */
function formatDuration(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? "-" : "";
  let minutes = Math.abs(Math.round(totalMinutes));

  const days = Math.floor(minutes / 1440);
  minutes -= days * 1440;
  const hours = Math.floor(minutes / 60);
  minutes -= hours * 60;

  if (days === 0 && hours === 0 && minutes === 0) return "PT0M";

  let out = `${sign}P`;
  if (days > 0) out += `${days}D`;
  if (hours > 0 || minutes > 0) {
    out += "T";
    if (hours > 0) out += `${hours}H`;
    if (minutes > 0) out += `${minutes}M`;
  }
  return out;
}

function dtstamp(now: Date): string {
  return (
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
    `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`
  );
}

function buildEvent(bill: Bill, now: Date, appUrl: string): string[] {
  const day = bill.day_of_month;
  const dtstart = `${ANCHOR_YEAR}${pad(1)}${pad(day)}`;
  // All-day events use an exclusive DTEND (the next calendar day).
  const endDate = new Date(Date.UTC(ANCHOR_YEAR, 0, day + 1));
  const dtend = `${endDate.getUTCFullYear()}${pad(endDate.getUTCMonth() + 1)}${pad(endDate.getUTCDate())}`;

  const lines: string[] = [];
  lines.push("BEGIN:VEVENT");
  lines.push(`UID:${bill.id}@${ICS_UID_DOMAIN}`);
  lines.push(`DTSTAMP:${dtstamp(now)}`);
  lines.push(`DTSTART;VALUE=DATE:${dtstart}`);
  lines.push(`DTEND;VALUE=DATE:${dtend}`);
  // A day that doesn't exist in a given month (e.g. BYMONTHDAY=31 in April)
  // is simply skipped that month — standard RRULE behavior, not a bug.
  lines.push(`RRULE:FREQ=MONTHLY;BYMONTHDAY=${day}`);
  lines.push(foldLine(`SUMMARY:${escapeText(bill.name)} due`));
  lines.push(
    foldLine(
      `DESCRIPTION:${escapeText(`Bill reminder from ${APP_NAME}. Manage this bill at ${appUrl}.`)}`
    )
  );
  lines.push("SEQUENCE:0");
  lines.push("STATUS:CONFIRMED");
  // A bill due date isn't a time commitment, so don't block free/busy time.
  lines.push("TRANSP:TRANSPARENT");

  if (bill.reminder_time && bill.reminder_offset_days !== null) {
    const [hh = 0, mm = 0] = bill.reminder_time.split(":").map(Number);
    // Trigger relative to DTSTART (midnight of the due date): go back
    // `offset` days, then forward to the requested time of day. Same-day
    // reminders land after midnight, which produces a positive (post-start)
    // trigger — correct and standard for all-day-event alarms.
    const offsetMinutes = -(bill.reminder_offset_days * 1440) + (hh * 60 + mm);
    lines.push("BEGIN:VALARM");
    lines.push("ACTION:DISPLAY");
    lines.push(foldLine(`DESCRIPTION:${escapeText(`${bill.name} is due soon`)}`));
    lines.push(`TRIGGER;RELATED=START:${formatDuration(offsetMinutes)}`);
    lines.push("END:VALARM");
  }

  lines.push("END:VEVENT");
  return lines;
}

/**
 * Builds a full VCALENDAR feed for one calendar's enabled bills. One VEVENT
 * per bill with a monthly RRULE — never one VEVENT per future occurrence.
 */
export function generateICS(calendar: Calendar, bills: Bill[], appUrl: string): string {
  const now = new Date();
  const lines: string[] = [];

  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push(`PRODID:-//${APP_NAME}//Bill Calendar//EN`);
  lines.push("CALSCALE:GREGORIAN");
  lines.push("METHOD:PUBLISH");
  lines.push(foldLine(`X-WR-CALNAME:${escapeText(calendar.name || "My Bills")}`));

  for (const bill of bills.filter((b) => b.enabled)) {
    lines.push(...buildEvent(bill, now, appUrl));
  }

  lines.push("END:VCALENDAR");
  return lines.join(CRLF) + CRLF;
}
