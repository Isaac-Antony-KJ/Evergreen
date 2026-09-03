import "server-only";
import { headers } from "next/headers";

/**
 * The absolute origin of the current request (e.g. "https://evergreen.app"
 * in production, "http://localhost:3000" in dev). Read from headers rather
 * than a hardcoded env var so subscription links are correct on every
 * environment — preview deploys included — without extra configuration.
 */
export async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocol = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}
