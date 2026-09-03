/**
 * These mirror supabase/schema.sql column-for-column. If you change one,
 * change the other.
 */

export interface Calendar {
  id: string;
  name: string;
  secure_token: string;
  edit_token: string;
  created_at: string;
  updated_at: string;
}

export interface Bill {
  id: string;
  calendar_id: string;
  name: string;
  day_of_month: number;
  /** "HH:MM:SS", or null when the bill has no reminder. */
  reminder_time: string | null;
  /** 0 = same day, 1 = a day before, etc. Null when there is no reminder. */
  reminder_offset_days: number | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

/** Shape the bill form (and its server actions) pass around. */
export interface BillFormValues {
  name: string;
  day_of_month: number;
  enabled: boolean;
  reminder_enabled: boolean;
  reminder_time: string;
  reminder_offset_days: number;
}

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };
