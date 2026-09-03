"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase";
import { getCalendarByEditToken, getBillById } from "@/lib/queries";
import { generateToken } from "@/lib/tokens";
import { billFormSchema, type BillFormInput } from "@/lib/validation";
import type { ActionResult, BillFormValues } from "@/lib/types";

const GENERIC_ERROR = "Something went wrong. Please try again.";
const NOT_FOUND_ERROR = "This calendar link isn't valid.";

/** Maps already-validated form input to the exact columns bills accepts. */
function toRow(input: BillFormInput) {
  return {
    name: input.name,
    day_of_month: input.day_of_month,
    enabled: input.enabled,
    reminder_time: input.reminder_enabled ? `${input.reminder_time}:00` : null,
    reminder_offset_days: input.reminder_enabled ? input.reminder_offset_days : null,
  };
}

export async function createBill(
  editToken: string,
  values: BillFormValues
): Promise<ActionResult> {
  const calendar = await getCalendarByEditToken(editToken);
  if (!calendar) return { ok: false, error: NOT_FOUND_ERROR };

  const parsed = billFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? GENERIC_ERROR };
  }

  const supabase = getServerSupabase();
  const { error } = await supabase
    .from("bills")
    .insert({ calendar_id: calendar.id, ...toRow(parsed.data) });

  if (error) return { ok: false, error: GENERIC_ERROR };

  revalidatePath(`/manage/${editToken}`);
  return { ok: true, data: undefined };
}

export async function updateBill(
  editToken: string,
  billId: string,
  values: BillFormValues
): Promise<ActionResult> {
  const calendar = await getCalendarByEditToken(editToken);
  if (!calendar) return { ok: false, error: NOT_FOUND_ERROR };

  const existing = await getBillById(billId);
  if (!existing || existing.calendar_id !== calendar.id) {
    return { ok: false, error: NOT_FOUND_ERROR };
  }

  const parsed = billFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? GENERIC_ERROR };
  }

  const supabase = getServerSupabase();
  const { error } = await supabase.from("bills").update(toRow(parsed.data)).eq("id", billId);

  if (error) return { ok: false, error: GENERIC_ERROR };

  revalidatePath(`/manage/${editToken}`);
  return { ok: true, data: undefined };
}

export async function deleteBill(editToken: string, billId: string): Promise<ActionResult> {
  const calendar = await getCalendarByEditToken(editToken);
  if (!calendar) return { ok: false, error: NOT_FOUND_ERROR };

  const existing = await getBillById(billId);
  if (!existing || existing.calendar_id !== calendar.id) {
    return { ok: false, error: NOT_FOUND_ERROR };
  }

  const supabase = getServerSupabase();
  const { error } = await supabase.from("bills").delete().eq("id", billId);

  if (error) return { ok: false, error: GENERIC_ERROR };

  revalidatePath(`/manage/${editToken}`);
  return { ok: true, data: undefined };
}

export async function toggleBillEnabled(
  editToken: string,
  billId: string,
  enabled: boolean
): Promise<ActionResult> {
  const calendar = await getCalendarByEditToken(editToken);
  if (!calendar) return { ok: false, error: NOT_FOUND_ERROR };

  const existing = await getBillById(billId);
  if (!existing || existing.calendar_id !== calendar.id) {
    return { ok: false, error: NOT_FOUND_ERROR };
  }

  const supabase = getServerSupabase();
  const { error } = await supabase.from("bills").update({ enabled }).eq("id", billId);

  if (error) return { ok: false, error: GENERIC_ERROR };

  revalidatePath(`/manage/${editToken}`);
  return { ok: true, data: undefined };
}

export async function regenerateSecureToken(
  editToken: string
): Promise<ActionResult<{ secureToken: string }>> {
  const calendar = await getCalendarByEditToken(editToken);
  if (!calendar) return { ok: false, error: NOT_FOUND_ERROR };

  const supabase = getServerSupabase();
  const newToken = generateToken();
  const { error } = await supabase
    .from("calendars")
    .update({ secure_token: newToken })
    .eq("id", calendar.id);

  if (error) return { ok: false, error: GENERIC_ERROR };

  revalidatePath(`/manage/${editToken}/share`);
  return { ok: true, data: { secureToken: newToken } };
}
