import type { NextRequest } from "next/server";
import { getCalendarByToken, getBillsForCalendar } from "@/lib/queries";
import { generateICS } from "@/lib/ics";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token: rawToken } = await params;
  const token = rawToken.endsWith(".ics") ? rawToken.slice(0, -4) : rawToken;

  if (!token) {
    return new Response("Not found.", { status: 404 });
  }

  const calendar = await getCalendarByToken(token);
  if (!calendar) {
    return new Response("This calendar link is no longer valid.", { status: 404 });
  }

  const bills = await getBillsForCalendar(calendar.id);
  const ics = generateICS(calendar, bills, request.nextUrl.origin);
  const safeFilename = (calendar.name || "bills").replace(/[^a-z0-9-_ ]/gi, "").trim() || "bills";

  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${safeFilename}.ics"`,
      // Calendar apps already poll on their own coarse schedule (often
      // hours apart); this just keeps repeated fetches from hammering the
      // database while still refreshing well within that window.
      "Cache-Control": "public, max-age=1800",
    },
  });
}
