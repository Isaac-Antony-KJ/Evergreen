import "server-only";
import { cache } from "react";
import { getServerSupabase } from "./supabase";
import type { Bill, Calendar } from "./types";

/**
 * Wrapped in React's cache() so that a page, its layout, and any actions
 * that all look up the same token within one request only hit the database
 * once. Deliberately looked up by token rather than by id — the token *is*
 * the credential, so "not found" and "not authorized" are the same case.
 */
export const getCalendarByEditToken = cache(
  async (editToken: string): Promise<Calendar | null> => {
    const supabase = getServerSupabase();
    const { data } = await supabase
      .from("calendars")
      .select("*")
      .eq("edit_token", editToken)
      .maybeSingle();
    return data;
  }
);

export const getCalendarByToken = cache(
  async (secureToken: string): Promise<Calendar | null> => {
    const supabase = getServerSupabase();
    const { data } = await supabase
      .from("calendars")
      .select("*")
      .eq("secure_token", secureToken)
      .maybeSingle();
    return data;
  }
);

export const getBillsForCalendar = cache(
  async (calendarId: string): Promise<Bill[]> => {
    const supabase = getServerSupabase();
    const { data } = await supabase
      .from("bills")
      .select("*")
      .eq("calendar_id", calendarId)
      .order("day_of_month", { ascending: true });
    return data ?? [];
  }
);

export const getBillById = cache(
  async (billId: string): Promise<Bill | null> => {
    const supabase = getServerSupabase();
    const { data } = await supabase
      .from("bills")
      .select("*")
      .eq("id", billId)
      .maybeSingle();
    return data;
  }
);
