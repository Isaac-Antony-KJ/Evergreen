"use server";

import { getServerSupabase } from "@/lib/supabase";
import { generateToken } from "@/lib/tokens";
import type { ActionResult } from "@/lib/types";

export async function createCalendar(): Promise<ActionResult<{ editToken: string }>> {
  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from("calendars")
    .insert({
      name: "My Bills",
      secure_token: generateToken(),
      edit_token: generateToken(),
    })
    .select("edit_token")
    .single();

  if (error || !data) {
    return { ok: false, error: "Couldn't create your calendar. Please try again." };
  }

  return { ok: true, data: { editToken: data.edit_token } };
}
