import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase client authenticated with the project's SECRET key.
 *
 * The `server-only` import above makes this a build error if any Client
 * Component ever tries to import this file — the secret key bypasses Row
 * Level Security (it carries BYPASSRLS), so it must only ever run on the
 * server. Every call site in this app is a Server Component, Server Action,
 * or Route Handler; see supabase/schema.sql for why that's safe.
 */
export function getServerSupabase() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SECRET_KEY. Copy .env.local.example to .env.local and fill both in."
    );
  }

  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
